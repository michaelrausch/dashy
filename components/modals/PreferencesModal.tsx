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
    enabledLinks: [] as string[],
    city: '' as string,
    displayName: '' as string
  });
  const [availableLinksData, setAvailableLinksData] = useState<{
    availableLinks: LinkCard[];
  }>({ availableLinks: [] });
  const [showCustomLinkModal, setShowCustomLinkModal] = useState(false);
  const [editingCustomLink, setEditingCustomLink] = useState<CustomLink | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLocalPreferences({
        enabledLinks: [...(preferences.enabledLinks || [])],
        city: preferences.city || '',
        displayName: preferences.displayName || ''
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

        {/* Display Name Setting */}
        <div className="mb-8">
          <h3 className="text-lg font-serif font-light text-white mb-4">
            Display Name
          </h3>
          <input
            type="text"
            value={localPreferences.displayName}
            onChange={(e) => setLocalPreferences(prev => ({ ...prev, displayName: e.target.value }))}
            placeholder={session?.user?.name || "Enter your display name"}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
          <p className="text-sm text-gray-400 mt-2">
            This name will appear in your greetings. Leave empty to use your account name ({session?.user?.name || "Not available"}).
          </p>
        </div>

        {/* City Setting */}
        <div className="mb-8">
          <h3 className="text-lg font-serif font-light text-white mb-4">
            Weather Location
          </h3>
          <div className="relative">
            <select
              value={localPreferences.city || ''}
              onChange={(e) => setLocalPreferences(prev => ({ ...prev, city: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer appearance-none"
            >
              <option value="" className="bg-gray-900 text-white">
                Select a city
              </option>
              <option value="christchurch" className="bg-gray-900 text-white">
                🇳🇿 Christchurch
              </option>
              <option value="sydney" className="bg-gray-900 text-white">
                🇦🇺 Sydney
              </option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Choose your city to display weather information on your dashboard.
          </p>
        </div>

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

        </div>

        {/* Custom Links Section */}
        {session && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-serif font-light text-white">
                Custom Links
              </h3>
              <button
                onClick={() => {
                  setEditingCustomLink(null);
                  setShowCustomLinkModal(true);
                }}
                className="px-4 py-2 text-sm bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Custom Link
              </button>
            </div>
            
            {customLinks.length === 0 ? (
              <div className="text-center py-8 px-6 rounded-xl bg-white/5 border border-white/10">
                <div className="mb-4">
                  <svg className="w-12 h-12 text-white/40 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <p className="text-white/70 font-medium mb-2">No custom links yet</p>
                <p className="text-white/50 text-sm">Create personalized shortcuts to your favorite websites and services</p>
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto pr-2 -mr-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
    <div className="relative bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200 group overflow-hidden">
      {/* Gradient overlay for brand color */}
      <div className={`absolute inset-0 ${link.gradient} opacity-20`}></div>
      
      {/* Content */}
      <div className="relative p-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-md bg-black/20 backdrop-blur-sm flex items-center justify-center">
            <span className="text-sm">{link.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-sans font-medium text-sm mb-1 truncate" title={link.title}>
              {link.title}
            </div>
            <div className="text-white/60 text-xs truncate" title={link.url}>
              {link.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={onEdit}
              className="p-1 rounded bg-black/20 hover:bg-black/30 text-white/70 hover:text-white transition-all text-xs"
              title="Edit"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={onDelete}
              className="p-1 rounded bg-black/20 hover:bg-red-500/30 text-white/70 hover:text-red-400 transition-all text-xs"
              title="Delete"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};