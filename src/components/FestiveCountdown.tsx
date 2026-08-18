import React, { useEffect, useState } from 'react';
import { Calendar, Bell, Sparkles, Clock, Flame, HeartHandshake } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isFestivalActive: boolean;
}

interface FestiveCountdownProps {
  targetDateStr?: string; // Default: '2026-09-14T00:00:00+05:30' (Ganesh Chaturthi 2026)
  className?: string;
}

export const FestiveCountdown: React.FC<FestiveCountdownProps> = ({
  targetDateStr = '2026-09-14T00:00:00+05:30',
  className = '',
}) => {
  const { showToast } = useToast();

  const calculateTimeLeft = (): TimeLeft => {
    const targetTime = new Date(targetDateStr).getTime();
    const nowTime = new Date().getTime();
    const difference = targetTime - nowTime;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isFestivalActive: true,
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      isFestivalActive: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateStr]);

  const handleAddCalendarReminder = () => {
    const title = encodeURIComponent('Ganesh Chaturthi Festival Peak 2026 🪔');
    const details = encodeURIComponent(
      'Celebrate Ganesh Chaturthi in Mumbai! Explore Lalbaugcha Raja, Chinchpokli Chintamani, and top pandals live with the Ganpati Mumbai Explorer app.'
    );
    const location = encodeURIComponent('Mumbai, Maharashtra, India');
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=20260914T000000Z/20260925T235959Z`;

    window.open(googleCalendarUrl, '_blank');
    showToast('Opening Google Calendar to set your festival reminder! 🗓️', 'success');
  };

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-amber-900 via-stone-900 to-orange-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-amber-500/40 font-['Poppins',sans-serif] ${className}`}
    >
      {/* Background Decorative Glows */}
      <div className="absolute -top-20 -left-20 w-56 h-56 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header Title with Festive Styling */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 via-orange-500/30 to-amber-500/20 border border-amber-400/40 text-amber-200 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>MUMBAI GANESHOTSAV 2026 COUNTDOWN</span>
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-['Yatra_One',serif] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-300 to-amber-100 drop-shadow-md tracking-wide leading-tight pt-1">
            {timeLeft.isFestivalActive
              ? '🎉 Ganpati Bappa Morya! Festival is Live! 🎉'
              : 'Ganesh Chaturthi Festival Peak'}
          </h2>

          <p className="text-stone-300 text-xs sm:text-sm font-medium max-w-xl mx-auto">
            {timeLeft.isFestivalActive
              ? 'The grand festival has arrived across Mumbai! Explore live crowd status and pandal darshan timings below.'
              : 'Counting down the days, hours, and minutes to the grand arrival of Lord Ganesha in Mumbai.'}
          </p>
        </div>

        {/* Digit Tiles Display */}
        {!timeLeft.isFestivalActive && (
          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-3xl mx-auto">
            {/* Days Card */}
            <div className="bg-stone-900/90 border border-amber-500/30 rounded-2xl p-3 sm:p-5 text-center shadow-lg hover:border-amber-400/60 transition-all flex flex-col justify-between">
              <span className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-['Yatra_One',serif] text-amber-300 drop-shadow-lg tracking-tight">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <div className="mt-2 text-[10px] sm:text-xs font-bold text-amber-200/80 uppercase tracking-widest border-t border-amber-500/20 pt-1.5 flex items-center justify-center gap-1">
                <span>DAYS</span>
              </div>
            </div>

            {/* Hours Card */}
            <div className="bg-stone-900/90 border border-amber-500/30 rounded-2xl p-3 sm:p-5 text-center shadow-lg hover:border-amber-400/60 transition-all flex flex-col justify-between">
              <span className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-['Yatra_One',serif] text-orange-400 drop-shadow-lg tracking-tight">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <div className="mt-2 text-[10px] sm:text-xs font-bold text-amber-200/80 uppercase tracking-widest border-t border-amber-500/20 pt-1.5 flex items-center justify-center gap-1">
                <span>HOURS</span>
              </div>
            </div>

            {/* Minutes Card */}
            <div className="bg-stone-900/90 border border-amber-500/30 rounded-2xl p-3 sm:p-5 text-center shadow-lg hover:border-amber-400/60 transition-all flex flex-col justify-between">
              <span className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-['Yatra_One',serif] text-amber-200 drop-shadow-lg tracking-tight">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <div className="mt-2 text-[10px] sm:text-xs font-bold text-amber-200/80 uppercase tracking-widest border-t border-amber-500/20 pt-1.5 flex items-center justify-center gap-1">
                <span>MINS</span>
              </div>
            </div>

            {/* Seconds Ticker Card */}
            <div className="bg-stone-900/90 border border-orange-500/40 rounded-2xl p-3 sm:p-5 text-center shadow-lg hover:border-orange-400/70 transition-all flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              <span className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-['Yatra_One',serif] text-orange-300 drop-shadow-lg tracking-tight">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <div className="mt-2 text-[10px] sm:text-xs font-bold text-orange-200/80 uppercase tracking-widest border-t border-amber-500/20 pt-1.5 flex items-center justify-center gap-1">
                <span>SECS</span>
              </div>
            </div>
          </div>
        )}

        {/* Festival Timeline Milestones & Calendar Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-amber-500/20 text-xs text-amber-100/90">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <span className="flex items-center gap-1 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Ganesh Chaturthi: <strong className="text-amber-200">Sept 14, 2026</strong></span>
            </span>
            <span className="flex items-center gap-1 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
              <HeartHandshake className="w-3.5 h-3.5 text-orange-400" />
              <span>Anant Chaturdashi: <strong className="text-amber-200">Sept 24, 2026</strong></span>
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddCalendarReminder}
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-black px-4 py-2 rounded-xl shadow-lg border border-amber-300/60 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer text-xs"
          >
            <Calendar className="w-4 h-4 text-stone-950" />
            <span>Add Festival to Calendar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
