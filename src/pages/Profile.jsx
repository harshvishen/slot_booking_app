import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useSlotStore } from '../store/slotStore';
import { useThemeStore } from '../store/themeStore';
import { Save, Bell, Mail, User } from 'lucide-react';

function Profile() {
  const { user, timezone, setTimezone } = useAuthStore();
  const { users, updateUserProfile } = useSlotStore();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  
  const [bio, setBio] = useState(users[user?.username]?.bio || '');
  const [preferences, setPreferences] = useState(
    users[user?.username]?.preferences || {
      notifications: true,
      emailUpdates: true
    }
  );

  const timezones = Intl.supportedValuesOf('timeZone');

  const handleSave = () => {
    updateUserProfile(user.username, {
      bio,
      preferences
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg`}>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Profile Settings</h2>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
          
          <div className="space-y-8">
            <div>
              <div className="flex items-center mb-4">
                <User className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Username
                </label>
              </div>
              <input
                type="text"
                value={user?.username}
                disabled
                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-50'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center mb-4">
                <User className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Bio
                </label>
              </div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-white'
                }`}
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <div className="flex items-center mb-4">
                <Bell className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Notifications
                </label>
              </div>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.notifications}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      notifications: e.target.checked
                    })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Enable push notifications
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.emailUpdates}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      emailUpdates: e.target.checked
                    })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Receive email updates
                  </span>
                </label>
              </div>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <Mail className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
                <label htmlFor="timezone" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Timezone
                </label>
              </div>
              <select
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${
                  isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-white'
                }`}
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;