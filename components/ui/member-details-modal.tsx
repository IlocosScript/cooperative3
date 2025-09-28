'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Phone, MapPin, Calendar, Download, FileText, Image, File, Loader2, AlertCircle } from 'lucide-react';
import { Member, MemberApiResponse, getStatusLabel, getStatusVariant, getMembershipTypeLabel, getGenderLabel, getCivilStatusLabel } from '@/lib/dto/member.dto';
import FileUploadApiService from '@/lib/services/fileUploadApi';
import { FileUploadResponse } from '@/lib/dto/file-upload.dto';
import { toast } from 'sonner';

interface MemberDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: MemberApiResponse | null;
}

export default function MemberDetailsModal({ isOpen, onClose, member }: MemberDetailsModalProps) {
  const [attachments, setAttachments] = useState<FileUploadResponse[]>([]);
  const [loadingAttachments, setLoadingAttachments] = useState(false);
  const [downloading, setDownloading] = useState<{ [key: number | string]: boolean }>({});
  const [attachmentsError, setAttachmentsError] = useState<string>('');
  const [selectedAttachments, setSelectedAttachments] = useState<Set<number>>(new Set());

  // Fetch attachments when modal opens
  useEffect(() => {
    if (isOpen && member?.Id) {
      fetchAttachments();
    }
  }, [isOpen, member?.Id]);

  const fetchAttachments = async () => {
    if (!member?.Id) return;
    
    setLoadingAttachments(true);
    setAttachmentsError('');
    try {
      const fetchedAttachments = await FileUploadApiService.getEntityAttachments(1, member.Id); // 1 for members
      setAttachments(fetchedAttachments);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch attachments';
      setAttachmentsError(errorMessage);
    } finally {
      setLoadingAttachments(false);
    }
  };

  const handleDownload = async (attachment: FileUploadResponse) => {
    setDownloading(prev => ({ ...prev, [attachment.Id]: true }));
    try {
      const filename = attachment.OriginalFileName || `${attachment.AttachmentType}_${attachment.Id}`;
      await FileUploadApiService.downloadFile(attachment.Id, filename);
      toast.success(`Downloaded ${attachment.AttachmentType}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Download failed';
      toast.error(`Failed to download ${attachment.AttachmentType}: ${errorMessage}`);
    } finally {
      setDownloading(prev => ({ ...prev, [attachment.Id]: false }));
    }
  };

  const handleDownloadAll = async () => {
    if (attachments.length === 0 || !member?.Id) return;
    
    setDownloading(prev => ({ ...prev, all: true }));
    try {
      const memberName = member?.FirstName && member?.LastName 
        ? `${member.FirstName}_${member.LastName}`.replace(/[^a-zA-Z0-9_-]/g, '_')
        : `Member_${member.Id}`;
      const dateStr = new Date().toISOString().slice(0,10).replace(/-/g, '');
      const zipFileName = `${memberName}_all_attachments_${dateStr}.zip`;
      
      await FileUploadApiService.downloadEntityFiles('Member', member.Id, {
        zipFileName
      });
      toast.success(`Downloaded all member attachments as zip`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Download failed';
      toast.error(`Failed to download all files: ${errorMessage}`);
    } finally {
      setDownloading(prev => ({ ...prev, all: false }));
    }
  };

  const handleDownloadSelected = async () => {
    if (selectedAttachments.size === 0) return;
    
    setDownloading(prev => ({ ...prev, selected: true }));
    try {
      const selectedAttachmentIds = Array.from(selectedAttachments);
      const memberName = member?.FirstName && member?.LastName 
        ? `${member.FirstName}_${member.LastName}`.replace(/[^a-zA-Z0-9_-]/g, '_')
        : `Member_${member?.Id}`;
      const dateStr = new Date().toISOString().slice(0,10).replace(/-/g, '');
      const zipFileName = `${memberName}_selected_attachments_${dateStr}.zip`;
      
      await FileUploadApiService.downloadSelectedFiles(selectedAttachmentIds, zipFileName);
      toast.success(`Downloaded ${selectedAttachmentIds.length} selected attachments as zip`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Download failed';
      toast.error(`Failed to download selected files: ${errorMessage}`);
    } finally {
      setDownloading(prev => ({ ...prev, selected: false }));
    }
  };

  const handleCheckboxChange = (attachmentId: number, checked: boolean) => {
    setSelectedAttachments(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(attachmentId);
      } else {
        newSet.delete(attachmentId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Only select attachments that have file metadata
      const downloadableAttachments = attachments.filter(att => hasFileMetadata(att));
      setSelectedAttachments(new Set(downloadableAttachments.map(att => att.Id)));
    } else {
      setSelectedAttachments(new Set());
    }
  };

  const hasFileMetadata = (attachment: FileUploadResponse) => {
    return attachment.OriginalFileName && attachment.FileSize && attachment.FileSize > 0;
  };

  const getFileIcon = (contentType: string | undefined | null) => {
    if (!contentType) {
      return <File className="w-4 h-4 text-gray-500" />;
    }
    
    if (contentType.startsWith('image/')) {
      return <Image className="w-4 h-4 text-blue-500" />;
    } else if (contentType === 'application/pdf') {
      return <FileText className="w-4 h-4 text-red-500" />;
    } else {
      return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Member Details & Attachments
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Member Number</Label>
              <p className="text-lg font-medium">{member.MemberNumber}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Status</Label>
              <Badge variant={getStatusVariant(Number(member.Status))}>
                {getStatusLabel(Number(member.Status))}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Full Name</Label>
              <p className="text-lg">{member.FullName}</p>
              {member.MiddleName && (
                <p className="text-sm text-gray-500">Middle Name: {member.MiddleName}</p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Age</Label>
              <p className="text-lg">{member.Age} years old</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Gender</Label>
              <p className="text-lg">{member.GenderType}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Civil Status</Label>
              <p className="text-lg">{member.CivilStatus}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Membership Type</Label>
              <Badge variant="outline">
                {member.MembershipType}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Date of Birth</Label>
              <p className="text-lg">{new Date(member.DateOfBirth).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>{member.PrimaryContactNumber}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{member.PrimaryAddress}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Joined: {new Date(member.CreatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <Label className="text-sm font-medium text-gray-600">Member ID</Label>
            <p className="text-sm text-gray-500">#{member.MemberNumber}</p>
          </div>

          {/* Attachments Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Attachments</h3>
              {attachments.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {attachments.length} attachment{attachments.length !== 1 ? 's' : ''} ({attachments.filter(att => hasFileMetadata(att)).length} downloadable)
                  </Badge>
                  {selectedAttachments.size > 0 && (
                    <Button 
                      onClick={handleDownloadSelected}
                      disabled={downloading.selected}
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {downloading.selected ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      Download Selected as ZIP ({selectedAttachments.size})
                    </Button>
                  )}
                  {attachments.filter(att => hasFileMetadata(att)).length > 0 && (
                    <Button 
                      onClick={handleDownloadAll}
                      disabled={downloading.all}
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {downloading.all ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      Download All as ZIP
                    </Button>
                  )}
                </div>
              )}
            </div>

            {loadingAttachments ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading attachments...</span>
                </div>
              </div>
            ) : attachmentsError ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-600 text-sm mb-2">Failed to load attachments</p>
                  <p className="text-xs text-gray-500 mb-3">{attachmentsError}</p>
                  <Button onClick={fetchAttachments} size="sm" variant="outline">
                    Try Again
                  </Button>
                </div>
              </div>
            ) : attachments.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <File className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">No attachments found</p>
                  <p className="text-xs text-gray-500">This member doesn't have any attachments yet.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {attachments.filter(att => hasFileMetadata(att)).length > 0 && (
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                    <Checkbox
                      id="select-all"
                      checked={selectedAttachments.size === attachments.filter(att => hasFileMetadata(att)).length && attachments.filter(att => hasFileMetadata(att)).length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <Label htmlFor="select-all" className="text-sm font-medium">
                      Select All ({attachments.filter(att => hasFileMetadata(att)).length} downloadable)
                    </Label>
                  </div>
                )}
                {attachments.map((attachment) => (
                  <Card key={attachment.Id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {hasFileMetadata(attachment) && (
                            <Checkbox
                              id={`attachment-${attachment.Id}`}
                              checked={selectedAttachments.has(attachment.Id)}
                              onCheckedChange={(checked) => handleCheckboxChange(attachment.Id, checked as boolean)}
                            />
                          )}
                          {getFileIcon(attachment.ContentType)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm truncate">
                                {attachment.AttachmentType}
                              </h4>
                              {attachment.OriginalFileName && (
                                <span className="text-xs text-gray-500 truncate">
                                  ({attachment.OriginalFileName})
                                </span>
                              )}
                            </div>
                            {hasFileMetadata(attachment) && (
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>{formatFileSize(attachment.FileSize || 0)}</span>
                                <span>•</span>
                                <span>Uploaded {formatDate(attachment.UploadDate)}</span>
                                {attachment.UploadedBy && (
                                  <>
                                    <span>•</span>
                                    <span>by {attachment.UploadedBy}</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        {hasFileMetadata(attachment) && (
                          <Button
                            onClick={() => handleDownload(attachment)}
                            disabled={downloading[attachment.Id]}
                            size="sm"
                            variant="outline"
                            className="ml-3 flex-shrink-0"
                          >
                            {downloading[attachment.Id] ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
