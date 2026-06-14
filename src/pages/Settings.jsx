import React, { useState } from 'react';
import { 
  FiSliders, 
  FiBell, 
  FiLock, 
  FiGlobe, 
  FiCheck,
  FiMail,
  FiUser
} from 'react-icons/fi';
import { useAppContext } from '../App';

export default function Settings() {
  const { user, showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile Form States
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');

  // Notifications Form States
  const [emailDigest, setEmailDigest] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [priorityAlert, setPriorityAlert] = useState(false);

  // Security Form States
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mfaEnabled, setMfaEnabled] = useState(false);

  // Language & Region Form States
  const [language, setLanguage] = useState('en');
  const [timeZone, setTimeZone] = useState('IST');
  const [dateFormat, setDateFormat] = useState('YYYY-MM-DD');

  // Submit Handler
  const handleSaveSettings = (e) => {
    e.preventDefault();
    showToast('Settings saved successfully!', 'success');
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: FiSliders },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'security', label: 'Security & Access', icon: FiLock },
    { id: 'language', label: 'Language & Region', icon: FiGlobe },
  ];

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
          Workspace Settings
        </h1>
        <p className="text-xs md:text-sm text-slate-400 dark:text-slate-500 font-semibold">
          Configure notifications, security credentials, and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative z-10">
        
        {/* Navigation settings sidebar */}
        <div className="glass-panel-elevated rounded-3xl p-5 h-fit space-y-1 relative z-20">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                }}
                className={`flex items-center w-full px-4 py-3 text-xs font-bold rounded-2xl transition-all cursor-pointer relative z-30 ${
                  isTabActive
                    ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/15 dark:to-purple-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-900/40 hover:text-slate-800 dark:hover:text-slate-200 border border-transparent'
                }`}
              >
                <Icon className="w-4.5 h-4.5 mr-3 pointer-events-none" />
                <span className="pointer-events-none">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Configuration forms panel */}
        <div className="glass-panel-elevated rounded-3xl p-6 xl:col-span-2 space-y-6 min-h-[420px] relative z-20">
          
          <form onSubmit={handleSaveSettings} className="space-y-5 flex flex-col justify-between h-full relative z-30">
            
            <div className="space-y-5">
              {/* Profile Information Panel */}
              {activeTab === 'profile' && (
                <div className="space-y-5 animate-slide-in">
                  <h2 className="text-base font-bold text-slate-800 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-850">
                    Account Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Full Name
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                          <FiUser className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-white"
                          placeholder="e.g. John Doe"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Email Address
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                          <FiMail className="w-4 h-4" />
                        </span>
                        <input
                          type="email"
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-white"
                          placeholder="e.g. john@example.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Panel */}
              {activeTab === 'notifications' && (
                <div className="space-y-5 animate-slide-in">
                  <h2 className="text-base font-bold text-slate-800 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-850">
                    Workspace Alerts
                  </h2>
                  
                  <div className="space-y-4 pt-1">
                    {/* Digest Toggle */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Email Digest Alert</p>
                        <p className="text-[10px] text-slate-400">Receive weekly compilation of completed milestones</p>
                      </div>
                      <div 
                        onClick={() => setEmailDigest(!emailDigest)}
                        className="relative inline-flex items-center cursor-pointer select-none"
                      >
                        <div className={`w-9 h-5 rounded-full transition-colors relative ${emailDigest ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'}`}>
                          <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-4 w-4 transition-transform ${emailDigest ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                      </div>
                    </div>

                    {/* Push Toggle */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Push Notifications</p>
                        <p className="text-[10px] text-slate-400">Receive live alerts in the browser for task deadlines</p>
                      </div>
                      <div 
                        onClick={() => setPushNotif(!pushNotif)}
                        className="relative inline-flex items-center cursor-pointer select-none"
                      >
                        <div className={`w-9 h-5 rounded-full transition-colors relative ${pushNotif ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'}`}>
                          <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-4 w-4 transition-transform ${pushNotif ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                      </div>
                    </div>

                    {/* Priority Alert Toggle */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Priority Task Reminders</p>
                        <p className="text-[10px] text-slate-400">Receive warning emails for overdue high priority items</p>
                      </div>
                      <div 
                        onClick={() => setPriorityAlert(!priorityAlert)}
                        className="relative inline-flex items-center cursor-pointer select-none"
                      >
                        <div className={`w-9 h-5 rounded-full transition-colors relative ${priorityAlert ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'}`}>
                          <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-4 w-4 transition-transform ${priorityAlert ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Security & Access Panel */}
              {activeTab === 'security' && (
                <div className="space-y-5 animate-slide-in">
                  <h2 className="text-base font-bold text-slate-800 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-850">
                    Change Password
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currPassword}
                        onChange={(e) => setCurrPassword(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-white"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-white"
                          placeholder="Min 8 characters"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-white"
                          placeholder="Re-type password"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-850 mt-2">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Two-Factor Authentication (2FA)</p>
                        <p className="text-[10px] text-slate-400">Secure your session credentials using verification keys</p>
                      </div>
                      <div 
                        onClick={() => setMfaEnabled(!mfaEnabled)}
                        className="relative inline-flex items-center cursor-pointer select-none"
                      >
                        <div className={`w-9 h-5 rounded-full transition-colors relative ${mfaEnabled ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'}`}>
                          <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-4 w-4 transition-transform ${mfaEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Language & Region Panel */}
              {activeTab === 'language' && (
                <div className="space-y-5 animate-slide-in">
                  <h2 className="text-base font-bold text-slate-800 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-855">
                    Regional Parameters
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Language Selection */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Default Language
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-white"
                      >
                        <option value="en">English (US)</option>
                        <option value="es">Español (ES)</option>
                        <option value="fr">Français (FR)</option>
                        <option value="de">Deutsch (DE)</option>
                      </select>
                    </div>

                    {/* Timezone */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Time Zone
                      </label>
                      <select
                        value={timeZone}
                        onChange={(e) => setTimeZone(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-white"
                      >
                        <option value="IST">India Standard (IST)</option>
                        <option value="UTC">Coordinated Universal (UTC)</option>
                        <option value="EST">Eastern Standard (EST)</option>
                        <option value="PST">Pacific Standard (PST)</option>
                      </select>
                    </div>

                    {/* Date formats */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Date format
                      </label>
                      <select
                        value={dateFormat}
                        onChange={(e) => setDateFormat(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-white"
                      >
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      </select>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Row */}
            <div className="flex justify-end pt-8 border-t border-slate-100 dark:border-slate-850 mt-6 relative z-30">
              <button
                type="submit"
                className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/15 hover:shadow-indigo-700/25 transition-all flex items-center space-x-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <FiCheck className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>

          </form>
        </div>
        
      </div>
    </div>
  );
}
