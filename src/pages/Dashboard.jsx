import React, { useState } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Copy, Users, Clipboard, ClipboardCheck } from 'lucide-react';
import { useSlotStore } from '../store/slotStore';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00'
];

function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showUserList, setShowUserList] = useState(false);
  const { users, addSlot, removeSlot, selectedUser, setSelectedUser, copySlots, pasteSlots, copiedSlots } = useSlotStore();
  const { user, timezone } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  const weekDays = [...Array(7)].map((_, i) => 
    addDays(startOfWeek(currentDate), i)
  );

  const handleSlotToggle = (date, timeSlot) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const currentUserSlots = users[user.username]?.slots[dateKey] || [];
    
    if (currentUserSlots.includes(timeSlot)) {
      removeSlot(date, timeSlot, user.username);
    } else {
      addSlot(date, timeSlot, user.username);
    }
  };

  const handleUserSelect = (username) => {
    setSelectedUser(username === user.username ? null : username);
    setShowUserList(false);
  };

  const getSlotStatus = (date, timeSlot) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const viewingUser = selectedUser || user.username;
    return users[viewingUser]?.slots[dateKey]?.includes(timeSlot) || false;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg mb-8`}>
        <div className="px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {selectedUser ? `${selectedUser}'s Schedule` : 'My Schedule'}
              </h1>
              <button
                onClick={() => setShowUserList(!showUserList)}
                className={`p-2 rounded-full ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                } relative`}
                title="View Other Users"
              >
                <Users className={`h-5 w-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              </button>
              {showUserList && (
                <div className={`absolute top-16 left-0 mt-2 w-48 rounded-md shadow-lg ${
                  isDarkMode ? 'bg-gray-800 ring-gray-700' : 'bg-white ring-black ring-opacity-5'
                } ring-1 z-10`}>
                  <div className="py-1">
                    {Object.keys(users).map((username) => (
                      <button
                        key={username}
                        onClick={() => handleUserSelect(username)}
                        className={`block w-full px-4 py-2 text-sm text-left
                          ${username === selectedUser 
                            ? isDarkMode ? 'bg-gray-700 text-white' : 'bg-indigo-50 text-indigo-700'
                            : isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}
                          ${username === user.username ? 'font-medium' : ''}`}
                      >
                        {username} {username === user.username && '(You)'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Timezone: {timezone}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentDate(addDays(currentDate, -7))}
                  className={`p-2 rounded ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft className={`h-5 w-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                </button>
                <button
                  onClick={() => setCurrentDate(addDays(currentDate, 7))}
                  className={`p-2 rounded ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <ChevronRight className={`h-5 w-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className={`overflow-hidden shadow ring-1 ${
            isDarkMode ? 'ring-gray-700' : 'ring-black ring-opacity-5'
          } rounded-lg`}>
            <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-300'}`}>
              <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
                <tr>
                  <th className={`py-3.5 pl-4 pr-3 text-left text-sm font-semibold ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-900'
                  }`}>
                    Time
                  </th>
                  {weekDays.map((date) => (
                    <th
                      key={date.toString()}
                      className={`px-3 py-3.5 text-left text-sm font-semibold ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{format(date, 'EEE, MMM d')}</span>
                        {!selectedUser && (
                          <div className="flex space-x-1">
                            <button
                              onClick={() => copySlots(date)}
                              className={`p-1 rounded ${
                                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                              }`}
                              title="Copy slots"
                            >
                              <Copy className={`h-4 w-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                            </button>
                            <button
                              onClick={() => pasteSlots(date, user.username)}
                              className={`p-1 rounded ${
                                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                              } ${!copiedSlots ? 'opacity-50 cursor-not-allowed' : ''}`}
                              title="Paste slots"
                              disabled={!copiedSlots}
                            >
                              {copiedSlots ? (
                                <ClipboardCheck className="h-4 w-4 text-green-500" />
                              ) : (
                                <Clipboard className={`h-4 w-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${
                isDarkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'
              }`}>
                {timeSlots.map((timeSlot) => (
                  <tr key={timeSlot}>
                    <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      {timeSlot}
                    </td>
                    {weekDays.map((date) => {
                      const isSelected = getSlotStatus(date, timeSlot);
                      const isEditable = !selectedUser;
                      
                      return (
                        <td
                          key={`${date}-${timeSlot}`}
                          className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                        >
                          <button
                            onClick={() => isEditable && handleSlotToggle(date, timeSlot)}
                            disabled={!isEditable}
                            className={`w-full py-2 px-4 rounded transition-all duration-200 ${
                              isSelected
                                ? isDarkMode
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-indigo-600 text-white'
                                : isDarkMode
                                  ? 'bg-gray-700 text-gray-300'
                                  : 'bg-gray-100 text-gray-700'
                            } ${!isEditable ? 'cursor-default opacity-80' : 'cursor-pointer hover:shadow-md'}`}
                          >
                            {isSelected ? 'Available' : 'Unavailable'}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

