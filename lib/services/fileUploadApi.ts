import axios from 'axios';
import { uploadClient, handleApiResponse, handleApiError } from '../config/apiClient';

// File upload response interface
export interface FileUploadResponse {
  id: number;
  fileName: string;
  originalFileName: string;
  fileSize: number;
  contentType: string;
  uploadDate: string;
  uploadedBy: string;
  description?: string;
  createdDate: string;
  modifiedDate: string | null;
}

// File validation options
export interface FileValidationOptions {
  maxSize?: number; // in bytes, default 10MB
  allowedTypes?: string[]; // MIME types
  allowEmpty?: boolean; // default false
}

// Default validation options
const DEFAULT_VALIDATION_OPTIONS: FileValidationOptions = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'application/pdf',
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  allowEmpty: false
};

export class FileUploadApiService {
  /**
   * Validate file according to provided options
   */
  static validateFile(file: File, options: FileValidationOptions = {}): { isValid: boolean; error?: string } {
    const opts = { ...DEFAULT_VALIDATION_OPTIONS, ...options };

    // Validate file size
    if (file.size > opts.maxSize!) {
      return {
        isValid: false,
        error: `File size exceeds ${Math.round(opts.maxSize! / (1024 * 1024))}MB limit`
      };
    }

    // Validate file type
    if (opts.allowedTypes && !opts.allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'File type not allowed. Only PDF, JPG, JPEG, PNG, DOC, DOCX files are accepted'
      };
    }

    // Validate file is not empty
    if (!opts.allowEmpty && file.size === 0) {
      return {
        isValid: false,
        error: 'File cannot be empty'
      };
    }

    return { isValid: true };
  }

  /**
   * Upload a single file attachment
   */
  static async uploadFileAttachment(
    file: File,
    entityType: number,
    entityId: number,
    uploadedBy: string,
    description?: string,
    validationOptions?: FileValidationOptions
  ): Promise<FileUploadResponse> {
    try {
      // Validate file
      const validation = this.validateFile(file, validationOptions);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const formData = new FormData();
      formData.append('File', file);
      formData.append('EntityType', entityType.toString());
      formData.append('EntityId', entityId.toString());
      formData.append('UploadedBy', uploadedBy);
      
      if (description) {
        formData.append('Description', description);
      }

      const response = await uploadClient.post<{
        success: boolean;
        data: FileUploadResponse;
        message: string;
      }>('/api/attachments/upload', formData, {
        // Let axios automatically set Content-Type with boundary
        onUploadProgress: (progressEvent) => {
          // You can emit progress events here if needed
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
        },
      });

      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Upload multiple file attachments using the new multi-file upload endpoint
   */
  static async uploadMultipleFileAttachments(
    attachments: Array<{
      file?: File;
      description?: string;
      attachmentType: string;
    }>,
    entityType: number,
    entityId: number,
    uploadedBy: string,
    validationOptions?: FileValidationOptions
  ): Promise<FileUploadResponse[]> {
    try {
      // Validate all files first
      for (const attachment of attachments) {
        if (attachment.file) {
          const validation = this.validateFile(attachment.file, validationOptions);
          if (!validation.isValid) {
            throw new Error(`File "${attachment.file.name}": ${validation.error}`);
          }
        }
      }

      // Validate minimum attachments requirement
      if (attachments.length === 0) {
        throw new Error('At least one attachment is required');
      }

      const formData = new FormData();
      
      // Add attachment items
      attachments.forEach((attachment, index) => {
        // Add file if provided
        if (attachment.file) {
          formData.append(`attachments[${index}].file`, attachment.file);
        }
        
        // Add description if provided
        if (attachment.description && attachment.description.trim()) {
          formData.append(`attachments[${index}].description`, attachment.description.trim());
        }
        
        // Add attachment type (required)
        if (attachment.attachmentType && attachment.attachmentType.trim()) {
          formData.append(`attachments[${index}].attachmentType`, attachment.attachmentType.trim());
        }
      });
      
      // Add metadata
      formData.append('entityType', entityType.toString());
      formData.append('entityId', entityId.toString());
      formData.append('uploadedBy', uploadedBy);
      
      
      const response = await uploadClient.post<{
        success: boolean;
        data: FileUploadResponse[];
        message: string;
        errors?: string[];
      }>('/api/attachments/upload-multiple', formData, {
        headers: {
          //'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
        },
      });
      // Handle response - check for partial success
      if (response.data.success) {
        return response.data.data;
      } else {
        // Partial success or complete failure
        const errorMessage = response.data.message || 'Upload failed';
        const errors = response.data.errors || [];
        const uploadedFiles = response.data.data || [];
        
        if (uploadedFiles.length > 0) {
          // Partial success - some files uploaded
          const errorDetails = errors.length > 0 ? ` Errors: ${errors.join(', ')}` : '';
          throw new Error(`${errorMessage}. ${uploadedFiles.length} file(s) uploaded successfully.${errorDetails}`);
        } else {
          // Complete failure
          const errorDetails = errors.length > 0 ? ` Errors: ${errors.join(', ')}` : '';
          throw new Error(`${errorMessage}.${errorDetails}`);
        }
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Upload files with progress tracking using the new multi-file upload endpoint
   */
  static async uploadFilesWithProgress(
    files: File[],
    entityType: number,
    entityId: number,
    uploadedBy: string,
    descriptions?: string[],
    validationOptions?: FileValidationOptions,
    onProgress?: (fileId: string, progress: number) => void
  ): Promise<FileUploadResponse[]> {
    try {
      // Validate all files first
      for (const file of files) {
        const validation = this.validateFile(file, validationOptions);
        if (!validation.isValid) {
          throw new Error(`File "${file.name}": ${validation.error}`);
        }
      }

      // Validate minimum files requirement
      if (files.length === 0) {
        throw new Error('At least one file is required');
      }

      const formData = new FormData();
      
      // Add all files
      files.forEach(file => {
        formData.append('Files', file);
      });
      
      // Add metadata
      formData.append('EntityType', entityType.toString());
      formData.append('EntityId', entityId.toString());
      formData.append('UploadedBy', uploadedBy);
      
      // Add descriptions if provided
      if (descriptions && descriptions.length > 0) {
        descriptions.forEach(description => {
          if (description && description.trim()) {
            formData.append('Descriptions', description.trim());
          }
        });
      }

      // Set initial progress for all files
      if (onProgress) {
        files.forEach((_, index) => {
          const fileId = `${entityId}-${index}`;
          onProgress(fileId, 0);
        });
      }

      const response = await uploadClient.post<{
        success: boolean;
        data: FileUploadResponse[];
        message: string;
        errors?: string[];
      }>('/api/attachments/upload-multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
          
          // Update progress for all files
          if (onProgress) {
            files.forEach((_, index) => {
              const fileId = `${entityId}-${index}`;
              onProgress(fileId, percentCompleted);
            });
          }
        },
      });

      // Set completion progress for all files
      if (onProgress) {
        files.forEach((_, index) => {
          const fileId = `${entityId}-${index}`;
          onProgress(fileId, 100);
        });
      }

      // Handle response - check for partial success
      if (response.data.success) {
        return response.data.data;
      } else {
        // Partial success or complete failure
        const errorMessage = response.data.message || 'Upload failed';
        const errors = response.data.errors || [];
        const uploadedFiles = response.data.data || [];
        
        if (uploadedFiles.length > 0) {
          // Partial success - some files uploaded
          const errorDetails = errors.length > 0 ? ` Errors: ${errors.join(', ')}` : '';
          throw new Error(`${errorMessage}. ${uploadedFiles.length} file(s) uploaded successfully.${errorDetails}`);
        } else {
          // Complete failure
          const errorDetails = errors.length > 0 ? ` Errors: ${errors.join(', ')}` : '';
          throw new Error(`${errorMessage}.${errorDetails}`);
        }
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get file attachment by ID
   */
  static async getFileAttachment(id: number): Promise<FileUploadResponse> {
    try {
      const response = await uploadClient.get<{
        success: boolean;
        data: FileUploadResponse;
        message: string;
      }>(`/api/attachments/${id}`);
      
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get file attachments for an entity
   */
  static async getEntityAttachments(entityType: number, entityId: number): Promise<FileUploadResponse[]> {
    try {
      const response = await uploadClient.get<{
        success: boolean;
        data: FileUploadResponse[];
        message: string;
      }>(`/api/attachments/entity/${entityType}/${entityId}`);
      
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Delete file attachment
   */
  static async deleteFileAttachment(id: number): Promise<void> {
    try {
      await uploadClient.delete(`/api/attachments/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Download file attachment
   */
  static async downloadFileAttachment(id: number): Promise<Blob> {
    try {
      const response = await uploadClient.get(`/api/attachments/${id}/download`, {
        responseType: 'blob'
      });
      
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

// Export default instance
export default FileUploadApiService;
