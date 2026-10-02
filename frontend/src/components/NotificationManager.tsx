import React, { useState } from 'react';
import { PeriodSlot, Subject, TimetableCell } from '../types/student';
import { Bell, Volume2, ShieldCheck, Download, Smartphone, Laptop } from 'lucide-react';

interface NotificationManagerProps {
  periods: PeriodSlot[];
  subjects: Subject[];
  timetable: TimetableCell[];
  notifEnabled: boolean;
  onToggleNotif: () => void;
}

export const NotificationManager: React.FC<NotificationManagerProps> = ({
  periods,
  subjects,
  timetable,
  notifEnabled,
  onToggleNotif,
}) => {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const requestPermission = async () => {
    if (typeof Notification === 'undefined') {
      alert('Browser notifications are not supported on this browser.');
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      onToggleNotif();
      new Notification('ClassMate PWA Alerts Active!', {
        body: 'You will receive home screen notifications when your class period starts.',
        icon: '/logo.jpg',
      });
    }
  };

  const playTestChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.log('Audio Context Error:', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Settings Card */}
      <div className="cream-card p-6 rounded-xl border-2 border-[#323232] bg-[#F4ECE6] shadow-[4px_4px_0px_#323232]">
        <h2 className="text-2xl font-black text-[#323232] flex items-center gap-2 mb-2">
          <Bell className="w-6 h-6 text-[#323232]" /> Class Start Home Screen Notifications & PWA Setup
        </h2>
        <p className="text-xs font-semibold text-gray-700 mb-6">
          Receive home screen push alert notifications right before your class starts so you never miss a period!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Box */}
          <div className="p-5 bg-[#DDD0C8] border-2 border-[#323232] rounded-lg shadow-[2px_2px_0px_#323232]">
            <div className="text-xs font-black uppercase text-gray-700">Notification Permission Status</div>
            <div className="text-lg font-black text-[#323232] mt-1 uppercase flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#323232]" /> {permission}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {permission !== 'granted' ? (
                <button
                  onClick={requestPermission}
                  className="grey-btn px-4 py-2 rounded-lg text-xs font-black shadow-[2px_2px_0px_#323232]"
                >
                  🔔 Enable Push Notifications
                </button>
              ) : (
                <button
                  onClick={onToggleNotif}
                  className="grey-btn px-4 py-2 rounded-lg text-xs font-black shadow-[2px_2px_0px_#323232]"
                >
                  {notifEnabled ? 'Disable Alerts' : 'Enable Alerts'}
                </button>
              )}

              <button
                onClick={playTestChime}
                className="cream-btn px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <Volume2 className="w-4 h-4 text-[#323232]" /> Test Chime Sound
              </button>
            </div>
          </div>

          {/* PWA Download Guide */}
          <div className="p-5 bg-[#DDD0C8] border-2 border-[#323232] rounded-lg shadow-[2px_2px_0px_#323232]">
            <h4 className="font-extrabold text-base text-[#323232] flex items-center gap-2">
              <Download className="w-4 h-4 text-[#323232]" /> How to Download PWA on your Phone:
            </h4>
            <ul className="mt-2 space-y-1.5 text-xs font-bold text-gray-700">
              <li className="flex items-start gap-1.5">
                <Smartphone className="w-4 h-4 shrink-0 text-[#323232] mt-0.5" />
                <span><strong>Android (Chrome):</strong> Tap 3 dots menu top right &rarr; Select "Add to Home screen" or "Install App".</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Smartphone className="w-4 h-4 shrink-0 text-[#323232] mt-0.5" />
                <span><strong>iPhone (Safari):</strong> Tap Share button at bottom &rarr; Scroll and select "Add to Home Screen".</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Laptop className="w-4 h-4 shrink-0 text-[#323232] mt-0.5" />
                <span><strong>Desktop (Chrome/Edge):</strong> Click the install icon in the address bar to download app.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
