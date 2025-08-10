"use client";

import { useState, useEffect } from 'react';
import { TrainingWeek, TrainingActivity } from '@/types';
import { useGetTrainingWeekQuery, useUpdateTrainingWeekMutation } from '@/lib/store/api';

interface TrainingPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const trainingActivities: { value: TrainingActivity; label: string; icon: string; color: string }[] = [
  { value: "rest", label: "Rest Day", icon: "💤", color: "bg-gray-500" },
  { value: "workout", label: "Weight Training", icon: "💪", color: "bg-blue-500" },
  { value: "run", label: "Run", icon: "🏃", color: "bg-green-500" },
  { value: "walk", label: "Walk", icon: "🚶", color: "bg-yellow-500" },
  { value: "bike", label: "Bike", icon: "🚴", color: "bg-purple-500" },
  { value: "swim", label: "Swim", icon: "🏊", color: "bg-blue-400" },
  { value: "other", label: "Other", icon: "🤷", color: "bg-red-500" },
];

const daysOfWeek = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

export const TrainingPlanModal = ({ isOpen, onClose }: TrainingPlanModalProps) => {
  const { data: trainingWeek, isLoading } = useGetTrainingWeekQuery();
  const [updateTrainingWeek, { isLoading: isUpdating }] = useUpdateTrainingWeekMutation();
  
  const [localWeek, setLocalWeek] = useState<TrainingWeek>({
    monday: "rest",
    tuesday: "rest",
    wednesday: "rest",
    thursday: "rest",
    friday: "rest",
    saturday: "rest",
    sunday: "rest"
  });

  // Update local state when data loads
  useEffect(() => {
    if (trainingWeek) {
      setLocalWeek(trainingWeek);
    }
  }, [trainingWeek]);

  const handleActivityChange = (day: keyof TrainingWeek, activity: TrainingActivity) => {
    setLocalWeek(prev => ({ ...prev, [day]: activity }));
  };

  const handleSave = async () => {
    try {
      await updateTrainingWeek({ week: localWeek }).unwrap();
      onClose();
    } catch (error) {
      console.error('Failed to update training week:', error);
    }
  };

  const getActivityInfo = (activity: string) => {
    return trainingActivities.find(a => a.value === activity) || trainingActivities[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-black rounded-2xl border border-white/10 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif font-light text-white">Training Plan</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200 p-1"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading training plan...</p>
            </div>
          )}

          {/* Training Week */}
          {!isLoading && (
            <div className="grid grid-cols-1 gap-3 mb-6">
              {daysOfWeek.map(({ key, label }) => {
                const activity = localWeek[key as keyof TrainingWeek] as TrainingActivity;
                const activityInfo = getActivityInfo(activity);
                
                return (
                  <div key={key} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{activityInfo.icon}</span>
                        <span className="text-white/80 group-hover:text-white font-sans font-light">
                          {label}
                        </span>
                      </div>
                      <div className="relative">
                        <select
                          value={activity}
                          onChange={(e) => handleActivityChange(key as keyof TrainingWeek, e.target.value as TrainingActivity)}
                          className="appearance-none bg-white/10 border border-white/20 text-white px-3 py-1 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer text-sm"
                        >
                          {trainingActivities.map((activityOption) => (
                            <option key={activityOption.value} value={activityOption.value} className="bg-gray-900 text-white">
                              {activityOption.icon} {activityOption.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <svg className="w-3 h-3 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isUpdating ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};