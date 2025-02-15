import React, { useState } from 'react';
import { Calendar, UserCircle2, PlusCircle, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

function Login() {
  const [username, setUsername] = useState('');
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const { login, existingUsers, deleteUser } = useAuthStore();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      login(username);
    }
  };

  const handleExistingUserSelect = (username) => {
    login(username);
  };

  const handleDeleteUser = (username) => {
    if (window.confirm(`Are you sure you want to delete ${username}?`)) {
      deleteUser(username);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col justify-center py-12 sm:px-6 lg:px-8`}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Calendar className={`h-12 w-12 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
        </div>
        <h2 className={`mt-6 text-center text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Welcome to SlotBook
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {!showNewUserForm && existingUsers.length > 0 && (
          <div className="px-4 sm:px-0">
            <h3 className={`text-xl font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} text-center mb-6`}>
              Who's booking?
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {existingUsers.map((user) => (
                <div
                  key={user}
                  className={`group relative aspect-square ${
                    isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                  } rounded-lg shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <button
                    onClick={() => handleExistingUserSelect(user)}
                    className="absolute inset-0 w-full h-full flex flex-col items-center justify-center"
                  >
                    <UserCircle2 className="h-12 w-12 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-300" />
                    <span className={`mt-2 text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {user}
                    </span>
                  </button>
                  <div 
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-100 group-hover:opacity-100 opacity-0 transition-opacity duration-200"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteUser(user);
                      }}
                      className="p-1"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setShowNewUserForm(true)}
                className={`group relative aspect-square ${
                  isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                } rounded-lg shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <PlusCircle className="h-12 w-12 text-indigo-500 group-hover:text-indigo-600 transition-colors duration-300" />
                  <span className={`mt-2 text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    New User
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}

        {(showNewUserForm || existingUsers.length === 0) && (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} py-8 px-4 shadow sm:rounded-lg sm:px-10`}>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
                >
                  Username
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Start Booking
                </button>
                {existingUsers.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowNewUserForm(false)}
                    className={`w-full flex justify-center py-2 px-4 border ${
                      isDarkMode ? 'border-gray-600 text-gray-200' : 'border-gray-300 text-gray-700'
                    } rounded-md shadow-sm text-sm font-medium bg-transparent hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  >
                    Back to User Selection
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;