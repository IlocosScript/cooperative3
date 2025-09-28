// File upload DTOs

// File upload response interface
export interface FileUploadResponse {
  Id: number;
  FileName: string | null;
  OriginalFileName: string | null;
  FilePath: string | null;
  FileSize: number | null;
  ContentType: string | null;
  UploadDate: string;
  UploadedBy: string;
  Description: string | null;
  AttachmentType: string;
  CreatedDate: string;
  ModifiedDate: string | null;
}

// File validation options
export interface FileValidationOptions {
  maxSize?: number; // in bytes, default 10MB
  allowedTypes?: string[]; // MIME types
  allowEmpty?: boolean; // default false
}
