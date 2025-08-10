"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { 
  useGetEmailAddressesQuery,
  useCreateEmailAddressMutation,
  useUpdateEmailAddressMutation,
  useDeleteEmailAddressMutation
} from '@/lib/store/api';
import { EmailAddress } from '@/types';

interface EmailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopyEmail: (email: string) => void;
  onOpenInbox: (inboxUrl: string) => void;
}

interface EmailFormData {
  name: string;
  email: string;
  inboxUrl: string;
}

export const EmailsModal = ({ 
  isOpen, 
  onClose, 
  onCopyEmail, 
  onOpenInbox 
}: EmailsModalProps) => {
  const { data: session } = useSession();
  const { data: emailsResponse, isLoading } = useGetEmailAddressesQuery();
  const [createEmail, { isLoading: isCreating }] = useCreateEmailAddressMutation();
  const [updateEmail, { isLoading: isUpdating }] = useUpdateEmailAddressMutation();
  const [deleteEmail] = useDeleteEmailAddressMutation();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmail, setEditingEmail] = useState<EmailAddress | null>(null);
  const [formData, setFormData] = useState<EmailFormData>({
    name: '',
    email: '',
    inboxUrl: ''
  });

  const emails = emailsResponse?.emailAddresses || [];
  
  // Check if user is admin (this should match the backend check)
  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!isOpen) return null;

  const handleAddEmail = async () => {
    if (!formData.name || !formData.email || !formData.inboxUrl) return;
    
    try {
      await createEmail(formData).unwrap();
      setFormData({ name: '', email: '', inboxUrl: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to create email:', error);
    }
  };

  const handleUpdateEmail = async () => {
    if (!editingEmail || !formData.name || !formData.email || !formData.inboxUrl) return;
    
    try {
      await updateEmail({ id: editingEmail.id, ...formData }).unwrap();
      setFormData({ name: '', email: '', inboxUrl: '' });
      setEditingEmail(null);
    } catch (error) {
      console.error('Failed to update email:', error);
    }
  };

  const handleDeleteEmail = async (emailId: string) => {
    if (!confirm('Are you sure you want to delete this email address?')) return;
    
    try {
      await deleteEmail(emailId).unwrap();
    } catch (error) {
      console.error('Failed to delete email:', error);
    }
  };

  const startEdit = (email: EmailAddress) => {
    setEditingEmail(email);
    setFormData({
      name: email.name,
      email: email.email,
      inboxUrl: email.inboxUrl
    });
    setShowAddForm(true);
  };

  const cancelEdit = () => {
    setEditingEmail(null);
    setFormData({ name: '', email: '', inboxUrl: '' });
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-8 flex-shrink-0">
          <h2 className="text-3xl font-serif font-light text-white">Email Addresses</h2>
          <div className="flex gap-3">
            {isAdmin && (
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 text-sm bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Email
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-sans font-light transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="mb-6 p-6 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-xl font-serif font-light text-white mb-4">
              {editingEmail ? 'Edit Email Address' : 'Add New Email Address'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder="Name/Description"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="p-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="p-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
              <input
                type="url"
                placeholder="Inbox URL"
                value={formData.inboxUrl}
                onChange={(e) => setFormData({ ...formData, inboxUrl: e.target.value })}
                className="p-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={editingEmail ? handleUpdateEmail : handleAddEmail}
                disabled={isCreating || isUpdating}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl transition-all disabled:opacity-50"
              >
                {isCreating || isUpdating ? 'Saving...' : editingEmail ? 'Update' : 'Add'}
              </button>
              <button
                onClick={cancelEdit}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        <div className="overflow-y-auto flex-1 pr-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/30 border-t-white"></div>
            </div>
          ) : emails.length === 0 ? (
            <div className="text-center py-8 px-6 rounded-xl bg-white/5 border border-white/10">
              <div className="mb-4">
                <svg className="w-12 h-12 text-white/40 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-white/70 font-medium mb-2">No email addresses yet</p>
              <p className="text-white/50 text-sm">
                {isAdmin ? 'Add email addresses to quickly access your inboxes' : 'No email addresses available'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emails.map((email) => (
                <EmailItem
                  key={email.id}
                  email={email}
                  isAdmin={isAdmin}
                  onCopy={() => onCopyEmail(email.email)}
                  onOpen={() => onOpenInbox(email.inboxUrl)}
                  onEdit={() => startEdit(email)}
                  onDelete={() => handleDeleteEmail(email.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface EmailItemProps {
  email: EmailAddress;
  isAdmin: boolean;
  onCopy: () => void;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const EmailItem = ({ email, isAdmin, onCopy, onOpen, onEdit, onDelete }: EmailItemProps) => {
  return (
    <div className="relative bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200 group overflow-hidden">
      {/* Gradient overlay for visual interest */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10"></div>
      
      {/* Content */}
      <div className="relative p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-md bg-purple-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-medium text-sm mb-1" title={email.name}>
              {email.name}
            </div>
            <div className="text-purple-300 text-xs font-mono bg-black/20 px-2 py-1 rounded truncate" title={email.email}>
              {email.email}
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={onCopy}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs rounded-md transition-all flex items-center gap-1"
              title="Copy email address"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </button>
            <button
              onClick={onOpen}
              className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-white/80 hover:text-white text-xs rounded-md transition-all flex items-center gap-1"
              title="Open inbox"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open
            </button>
          </div>
          
          {/* Admin actions - properly aligned */}
          {isAdmin && (
            <div className="flex gap-1 items-center">
              <button
                onClick={onEdit}
                className="p-2 bg-black/20 hover:bg-blue-500/30 text-white/60 hover:text-white text-xs rounded transition-all flex items-center justify-center"
                title="Edit email"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={onDelete}
                className="p-2 bg-black/20 hover:bg-red-500/30 text-white/60 hover:text-red-400 text-xs rounded transition-all flex items-center justify-center"
                title="Delete email"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};