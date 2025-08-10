"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  useGetPreferencesQuery, 
  useUpdatePreferencesMutation,
  useGetCustomLinksQuery,
  useCreateCustomLinkMutation,
  useUpdateCustomLinkMutation,
  useDeleteCustomLinkMutation
} from '@/lib/store/api';
import { getAllAvailableLinks } from '@/lib/linkUtils';
import { LinkCard, CustomLink } from '@/types';
import { CustomLinkModal } from './CustomLinkModal';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreferencesSaved?: () => void;
}

export const PreferencesModal = ({ isOpen, onClose, onPreferencesSaved }: PreferencesModalProps) => {
  const { data: session } = useSession();
  
  // RTK Query hooks
  const { data: preferences = { enabledLinks: [], hasSetPreferences: false } } = useGetPreferencesQuery(undefined, { skip: !session });
  const { data: customLinks = [] } = useGetCustomLinksQuery(undefined, { skip: !session });
  const [updatePreferences, { isLoading: isUpdatingPreferences }] = useUpdatePreferencesMutation();
  const [createCustomLink, { isLoading: isCreatingCustomLink }] = useCreateCustomLinkMutation();
  const [updateCustomLink, { isLoading: isUpdatingCustomLink }] = useUpdateCustomLinkMutation();
  const [deleteCustomLink] = useDeleteCustomLinkMutation();
  
  const [localPreferences, setLocalPreferences] = useState({
    enabledLinks: [] as string[]
  });
  const [availableLinksData, setAvailableLinksData] = useState<{
    availableLinks: LinkCard[];
  }>({ availableLinks: [] });
  const [showCustomLinkModal, setShowCustomLinkModal] = useState(false);
  const [editingCustomLink, setEditingCustomLink] = useState<CustomLink | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLocalPreferences({
        enabledLinks: [...(preferences.enabledLinks || [])]
      });
      setAvailableLinksData(getAllAvailableLinks());
    }
  }, [isOpen, preferences]);

  const handleToggleLink = (linkId: string) => {
    const currentLinks = localPreferences.enabledLinks || [];
    
    setLocalPreferences(prev => ({
      ...prev,
      enabledLinks: currentLinks.includes(linkId)
        ? currentLinks.filter(id => id !== linkId)
        : [...currentLinks, linkId]
    }));
  };

  const handleSave = async () => {
    try {
      await updatePreferences(localPreferences).unwrap();
      onPreferencesSaved?.();
      onClose();
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  const handleSelectAll = () => {
    setLocalPreferences(prev => ({
      ...prev,
      enabledLinks: (availableLinksData.availableLinks || []).map(link => link.id)
    }));
  };

  const handleDeselectAll = () => {
    setLocalPreferences(prev => ({
      ...prev,
      enabledLinks: []
    }));
  };

  const handleCreateCustomLink = async (linkData: {
    title: string;
    url: string;
    icon: string;
    color: string;
    gradient: string;
  }) => {
    try {
      await createCustomLink(linkData).unwrap();
      setShowCustomLinkModal(false);
      onPreferencesSaved?.();
    } catch (error) {
      console.error('Failed to create custom link:', error);
    }
  };

  const handleEditCustomLink = async (linkData: {
    title: string;
    url: string;
    icon: string;
    color: string;
    gradient: string;
  }) => {
    if (editingCustomLink) {
      try {
        await updateCustomLink({ id: editingCustomLink.id, ...linkData }).unwrap();
        setEditingCustomLink(null);
        setShowCustomLinkModal(false);
        onPreferencesSaved?.();
      } catch (error) {
        console.error('Failed to update custom link:', error);
      }
    }
  };

  const handleDeleteCustomLink = async (linkId: string) => {
    if (confirm('Are you sure you want to delete this custom link?')) {
      try {
        await deleteCustomLink(linkId).unwrap();
        onPreferencesSaved?.();
      } catch (error) {
        console.error('Failed to delete custom link:', error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-light text-white">
            Dashboard Preferences
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        <p className="text-gray-400 mb-8 font-sans font-light">
          Choose which icons appear on your dashboard. Changes will be saved to your account.
        </p>

        {/* Available Links Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-serif font-light text-white">
              Available Links
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleSelectAll}
                className="px-3 py-1 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/80 hover:text-white transition-all"
              >
                Select All
              </button>
              <button
                onClick={handleDeselectAll}
                className="px-3 py-1 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/80 hover:text-white transition-all"
              >
                Deselect All
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableLinksData.availableLinks.map((link) => (
              <LinkCheckbox
                key={link.id}
                link={link}
                checked={(localPreferences.enabledLinks || []).includes(link.id)}
                onChange={() => handleToggleLink(link.id)}
              />
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-400">
            <strong>Note:</strong> Email link is always available for admin users and doesn't need to be selected here.
          </div>
        </div>

        {/* Custom Links Section */}
        {session && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-serif font-light text-white">
                Custom Links
              </h3>
              <button
                onClick={() => {
                  setEditingCustomLink(null);
                  setShowCustomLinkModal(true);
                }}
                className="px-3 py-1 text-sm bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all"
              >
                + Add Custom Link
              </button>
            </div>
            
            {customLinks.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                <p className="mb-2">No custom links yet</p>
                <p className="text-sm">Add your own custom links to quickly access your favorite sites!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {customLinks.map((link) => (
                  <CustomLinkItem
                    key={link.id}
                    link={link}
                    onEdit={() => {
                      setEditingCustomLink(link);
                      setShowCustomLinkModal(true);
                    }}
                    onDelete={() => handleDeleteCustomLink(link.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/80 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isUpdatingPreferences}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdatingPreferences ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>

      {/* Custom Link Modal */}
      <CustomLinkModal
        isOpen={showCustomLinkModal}
        onClose={() => {
          setShowCustomLinkModal(false);
          setEditingCustomLink(null);
        }}
        onSave={editingCustomLink ? handleEditCustomLink : handleCreateCustomLink}
        editingLink={editingCustomLink}
        loading={isCreatingCustomLink || isUpdatingCustomLink}
      />
    </div>
  );
};

interface LinkCheckboxProps {
  link: LinkCard;
  checked: boolean;
  onChange: () => void;
}

const LinkCheckbox = ({ link, checked, onChange }: LinkCheckboxProps) => {
  return (
    <label className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl cursor-pointer transition-all group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500 focus:ring-2 focus:ring-offset-0"
      />
      <div className="flex items-center gap-2 flex-1">
        <span className="text-lg">{link.icon}</span>
        <span className="text-white/80 group-hover:text-white font-sans font-light text-sm">
          {link.title}
        </span>
      </div>
    </label>
  );
};

interface CustomLinkItemProps {
  link: CustomLink;
  onEdit: () => void;
  onDelete: () => void;
}

const CustomLinkItem = ({ link, onEdit, onDelete }: CustomLinkItemProps) => {
  return (
    <div className={`p-3 ${link.gradient} rounded-xl border border-white/10 flex items-center justify-between group`}>
      <div className="flex items-center gap-3">
        <span className="text-lg">{link.icon}</span>
        <div>
          <div className="text-white font-sans font-light text-sm">{link.title}</div>
          <div className="text-white/60 text-xs truncate max-w-32">{link.url}</div>
        </div>
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="p-1 text-white/60 hover:text-white text-xs"
          title="Edit"
        >
          ✏️
        </button>
        <button
          onClick={onDelete}
          className="p-1 text-white/60 hover:text-red-400 text-xs"
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};