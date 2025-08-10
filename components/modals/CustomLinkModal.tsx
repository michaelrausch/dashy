"use client";

import { useState, useEffect } from 'react';
import { CustomLink } from '@/types';

interface CustomLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (linkData: {
    title: string;
    url: string;
    icon: string;
    color: string;
    gradient: string;
  }) => Promise<void>;
  editingLink?: CustomLink | null;
  loading?: boolean;
}

const COLOR_OPTIONS = [
  { name: 'Blue', color: 'from-blue-500 to-blue-600', gradient: 'bg-gradient-to-br from-blue-500 to-blue-600' },
  { name: 'Purple', color: 'from-purple-500 to-purple-600', gradient: 'bg-gradient-to-br from-purple-500 to-purple-600' },
  { name: 'Green', color: 'from-green-500 to-green-600', gradient: 'bg-gradient-to-br from-green-500 to-green-600' },
  { name: 'Red', color: 'from-red-500 to-red-600', gradient: 'bg-gradient-to-br from-red-500 to-red-600' },
  { name: 'Orange', color: 'from-orange-500 to-orange-600', gradient: 'bg-gradient-to-br from-orange-500 to-orange-600' },
  { name: 'Pink', color: 'from-pink-500 to-pink-600', gradient: 'bg-gradient-to-br from-pink-500 to-pink-600' },
  { name: 'Teal', color: 'from-teal-500 to-teal-600', gradient: 'bg-gradient-to-br from-teal-500 to-teal-600' },
  { name: 'Gray', color: 'from-gray-500 to-gray-600', gradient: 'bg-gradient-to-br from-gray-500 to-gray-600' },
];

const EMOJI_OPTIONS = [
  '🌐', '🔗', '📱', '💼', '🎵', '🎮', '📚', '🛒', '📧', '💰',
  '🏠', '🚗', '✈️', '🍕', '☕', '🎯', '⚡', '🔥', '💎', '🚀',
  '📊', '🎨', '🏆', '⚽', '🎬', '📷', '🎭', '🎪', '🌟', '🎉'
];

export const CustomLinkModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingLink, 
  loading = false 
}: CustomLinkModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    icon: '🌐',
    color: 'from-blue-500 to-blue-600',
    gradient: 'bg-gradient-to-br from-blue-500 to-blue-600'
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingLink) {
        setFormData({
          title: editingLink.title,
          url: editingLink.url,
          icon: editingLink.icon,
          color: editingLink.color,
          gradient: editingLink.gradient
        });
      } else {
        setFormData({
          title: '',
          url: '',
          icon: '🌐',
          color: 'from-blue-500 to-blue-600',
          gradient: 'bg-gradient-to-br from-blue-500 to-blue-600'
        });
      }
    }
  }, [isOpen, editingLink]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.url.trim()) {
      return;
    }

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save custom link:', error);
    }
  };

  const handleColorSelect = (colorOption: typeof COLOR_OPTIONS[0]) => {
    setFormData(prev => ({
      ...prev,
      color: colorOption.color,
      gradient: colorOption.gradient
    }));
  };

  const handleEmojiSelect = (emoji: string) => {
    setFormData(prev => ({ ...prev, icon: emoji }));
    setShowEmojiPicker(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-light text-white">
            {editingLink ? 'Edit' : 'Add'} Custom Link
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-white/80 font-sans font-light mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all"
              placeholder="e.g., My Website"
              required
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-white/80 font-sans font-light mb-2">
              URL
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all"
              placeholder="https://example.com"
              required
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-white/80 font-sans font-light mb-2">
              Icon
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all flex items-center gap-3"
              >
                <span className="text-2xl">{formData.icon}</span>
                <span className="text-white/60">Click to choose an icon</span>
              </button>
              
              {showEmojiPicker && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 border border-white/10 rounded-xl p-4 grid grid-cols-6 gap-2 max-h-48 overflow-y-auto z-10">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleEmojiSelect(emoji)}
                      className="text-2xl p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-white/80 font-sans font-light mb-2">
              Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_OPTIONS.map((colorOption) => (
                <button
                  key={colorOption.name}
                  type="button"
                  onClick={() => handleColorSelect(colorOption)}
                  className={`relative h-12 rounded-lg ${colorOption.gradient} transition-all hover:scale-105 ${
                    formData.color === colorOption.color ? 'ring-2 ring-white/50' : ''
                  }`}
                  title={colorOption.name}
                >
                  {formData.color === colorOption.color && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-white/80 font-sans font-light mb-2">
              Preview
            </label>
            <div className={`p-4 ${formData.gradient} rounded-xl border border-white/10 flex items-center gap-3`}>
              <span className="text-2xl">{formData.icon}</span>
              <span className="text-white font-sans font-light">
                {formData.title || 'Your Link Title'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/80 hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : editingLink ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};