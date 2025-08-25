'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin, Calendar } from 'lucide-react';
import { Member, getStatusLabel, getStatusVariant, getMembershipTypeLabel, getGenderLabel, getCivilStatusLabel } from '@/lib/types/members';

interface MemberDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
}

export default function MemberDetailsModal({ isOpen, onClose, member }: MemberDetailsModalProps) {
  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Member Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Member Number</Label>
              <p className="text-lg font-medium">{member.MemberNumber}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Status</Label>
              <Badge variant={getStatusVariant(member.Status)}>
                {member.Status}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
