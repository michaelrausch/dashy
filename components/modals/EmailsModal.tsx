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
                className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl text-white font-sans font-light transition-all duration-300 hover:scale-105 cursor-pointer"
              >
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
            <div className="text-center py-8 text-gray-400">
              {isAdmin ? 'No email addresses added yet. Click "Add Email" to get started.' : 'No email addresses available.'}
            </div>
          ) : (
            <div className="space-y-4">
              {emails.map((email) => (
                <div key={email.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-white font-medium">{email.name}</span>
                      <code className="text-purple-400 font-mono text-sm bg-black/30 px-2 py-1 rounded">
                        {email.email}
                      </code>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => onCopyEmail(email.email)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-sans font-light transition-all duration-300 hover:scale-105 cursor-pointer"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => onOpenInbox(email.inboxUrl)}
                      className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl text-white font-sans font-light transition-all duration-300 hover:scale-105 cursor-pointer"
                    >
                      Open
                    </button>
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => startEdit(email)}
                          className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl text-white font-sans font-light transition-all duration-300 hover:scale-105 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEmail(email.id)}
                          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-white font-sans font-light transition-all duration-300 hover:scale-105 cursor-pointer"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};