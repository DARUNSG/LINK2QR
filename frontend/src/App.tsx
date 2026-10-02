import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BeginnerGuideBanner } from './components/BeginnerGuideBanner';
import { DateSelector } from './components/DateSelector';
import { ParticipantCard } from './components/ParticipantCard';
import { TimezoneComparisonTable } from './components/TimezoneComparisonTable';
import { TimezoneTimeline } from './components/TimezoneTimeline';
import { MeetingTimeFinder } from './components/MeetingTimeFinder';
import { SelectedMeetingTime } from './components/SelectedMeetingTime';
import { MeetingSummary } from './components/MeetingSummary';
import { PhilosophySection } from './components/PhilosophySection';
import { AsymmetricalShowcase } from './components/AsymmetricalShowcase';
import { ServiceCards } from './components/ServiceCards';
import { PillShowcase } from './components/PillShowcase';
import { Footer } from './components/Footer';
import { HowItWorksModal } from './components/HowItWorksModal';

import { Participant } from './types/planner';
import { WORLD_CITIES, CityItem } from './data/cities';
import { calculateOverlappingWorkingHours } from './utils/timezoneUtils';
import { Plus, Users, Clock, AlertCircle } from 'lucide-react';
import { DateTime } from 'luxon';

export const App: React.FC = () => {
  // 1. Initial State: Date (Default Today)
  const initialDate = useMemo(() => DateTime.now().toISODate() || '2026-10-15', []);
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);

  // 2. Initial Participants List (Default: PARTICIPANT 1..4 with blank locations)
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: 'p-1',
      name: 'PARTICIPANT 1',
      cityName: '',
      countryName: '',
      timezone: '',
      flag: '',
      workStart: '09:00',
      workEnd: '18:00',
    },
    {
      id: 'p-2',
      name: 'PARTICIPANT 2',
      cityName: '',
      countryName: '',
      timezone: '',
      flag: '',
      workStart: '09:00',
      workEnd: '18:00',
    },
    {
      id: 'p-3',
      name: 'PARTICIPANT 3',
      cityName: '',
      countryName: '',
      timezone: '',
      flag: '',
      workStart: '09:00',
      workEnd: '18:00',
    },
    {
      id: 'p-4',
      name: 'PARTICIPANT 4',
      cityName: '',
      countryName: '',
      timezone: '',
      flag: '',
      workStart: '09:00',
      workEnd: '18:00',
    },
  ]);

  // 3. Selected Meeting Time UTC (e.g. "14:00")
  const [selectedTimeUtc, setSelectedTimeUtc] = useState<string>('14:00');

  // 4. Modal State
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);

  // Auto-adjust selected time to first overlap window if available
  const overlapWindows = useMemo(() => {
    return calculateOverlappingWorkingHours(selectedDate, participants);
  }, [selectedDate, participants]);

  // 1-Click Beginner Demo Preset (Fills sample locations for demo)
  const handleLoadDemo = () => {
    setParticipants([
      {
        id: 'p-1',
        name: 'PARTICIPANT 1',
        cityName: 'Chennai',
        countryName: 'India',
        timezone: 'Asia/Kolkata',
        flag: '🇮🇳',
        workStart: '09:00',
        workEnd: '18:00',
      },
      {
        id: 'p-2',
        name: 'PARTICIPANT 2',
        cityName: 'London',
        countryName: 'United Kingdom',
        timezone: 'Europe/London',
        flag: '🇬🇧',
        workStart: '09:00',
        workEnd: '18:00',
      },
      {
        id: 'p-3',
        name: 'PARTICIPANT 3',
        cityName: 'New York',
        countryName: 'USA',
        timezone: 'America/New_York',
        flag: '🇺🇸',
        workStart: '09:00',
        workEnd: '18:00',
      },
      {
        id: 'p-4',
        name: 'PARTICIPANT 4',
        cityName: 'Tokyo',
        countryName: 'Japan',
        timezone: 'Asia/Tokyo',
        flag: '🇯🇵',
        workStart: '09:00',
        workEnd: '18:00',
      },
    ]);
    setSelectedTimeUtc('14:00');
    scrollToPlanner();
  };

  // Add Participant Handler (Starts blank location)
  const handleAddParticipant = () => {
    const newParticipant: Participant = {
      id: `p-${Date.now()}`,
      name: `PARTICIPANT ${participants.length + 1}`,
      cityName: '',
      countryName: '',
      timezone: '',
      flag: '',
      workStart: '09:00',
      workEnd: '18:00',
    };

    setParticipants([...participants, newParticipant]);
  };

  // Update Participant Handler
  const handleUpdateParticipant = (updated: Participant) => {
    setParticipants(participants.map(p => p.id === updated.id ? updated : p));
  };

  // Remove Participant Handler
  const handleRemoveParticipant = (id: string) => {
    if (participants.length <= 1) return; // Maintain at least 1 participant card
    setParticipants(participants.filter(p => p.id !== id));
  };

  const scrollToPlanner = () => {
    const el = document.getElementById('planner');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-[#111111] font-satoshi selection:bg-[#111111] selection:text-[#f2f2f2] overflow-x-hidden">
      
      {/* Sticky Navigation Header */}
      <Header
        onNavigate={(id) => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
      />

      {/* Hero Section */}
      <Hero onStartPlanning={scrollToPlanner} />

      {/* MAIN MEETING PLANNER CONTAINER */}
      <main id="planner" className="max-w-7xl mx-auto px-6 py-20">
        
        {/* Planner Header */}
        <div className="mb-10 border-b border-[#1e1e1e]/15 pb-8">
          <div className="flex items-center gap-2 text-xs font-satoshi font-bold tracking-[0.2em] text-[#838282] uppercase mb-2">
            <Clock className="w-4 h-4 text-[#111111]" />
            <span>GLOBAL OVERLAP PLANNER</span>
          </div>
          <h2 className="font-clash font-bold text-4xl sm:text-5xl md:text-6xl text-[#111111] uppercase tracking-wide">
            PLAN THE TIME
          </h2>
          <p className="font-satoshi text-base sm:text-lg text-[#838282] max-w-2xl mt-2 leading-relaxed">
            Add your team members, choose their working hours, and find the perfect overlapping meeting time.
          </p>
        </div>

        {/* 0. Beginner Quick Start Banner */}
        <BeginnerGuideBanner
          onLoadDemo={handleLoadDemo}
          onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        />

        {/* 1. Date Selection Component */}
        <DateSelector
          selectedDate={selectedDate}
          onChangeDate={(newDate) => setSelectedDate(newDate)}
        />

        {/* 2. Participant Management Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[#111111]" />
                <h3 className="font-clash font-bold text-xl uppercase tracking-wide text-[#111111]">
                  TEAM MEMBERS ({participants.length})
                </h3>
              </div>
              <p className="text-xs text-[#838282] mt-0.5">
                💡 Tip: Change working hours or cities below to see instant availability updates.
              </p>
            </div>

            {/* + ADD PARTICIPANT Button */}
            <button
              onClick={handleAddParticipant}
              className="px-5 py-2.5 text-xs font-satoshi font-bold tracking-[0.15em] uppercase flex items-center gap-2 transition-all duration-200 border border-[#111111] bg-[#111111] text-[#ffffff] hover:bg-[#1e1e1e] shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#ffffff]" />
              <span>+ ADD MEMBER</span>
            </button>
          </div>

          {/* Participant Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {participants.map((p) => (
              <ParticipantCard
                key={p.id}
                participant={p}
                selectedDate={selectedDate}
                selectedTimeUtc={selectedTimeUtc}
                canRemove={participants.length > 1}
                onUpdate={handleUpdateParticipant}
                onRemove={handleRemoveParticipant}
              />
            ))}
          </div>

          {participants.length < 2 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>At least 2 team members are required to find an overlap window.</span>
            </div>
          )}
        </div>

        {/* 3. Time Zone Comparison Matrix */}
        <TimezoneComparisonTable
          participants={participants}
          selectedDate={selectedDate}
          selectedTimeUtc={selectedTimeUtc}
        />

        {/* 4. Overlap Timeline */}
        <TimezoneTimeline
          participants={participants}
          selectedDate={selectedDate}
          selectedTimeUtc={selectedTimeUtc}
          onSelectTimeUtc={(utcStr) => setSelectedTimeUtc(utcStr)}
        />

        {/* 5. Meeting Time Finder (Calculated Overlap Windows) */}
        <MeetingTimeFinder
          participants={participants}
          selectedDate={selectedDate}
          selectedTimeUtc={selectedTimeUtc}
          onSelectTimeUtc={(utcStr) => setSelectedTimeUtc(utcStr)}
        />

        {/* 6. Selected Meeting Time (Converted Local Clocks for All) */}
        <SelectedMeetingTime
          selectedTimeUtc={selectedTimeUtc}
          selectedDate={selectedDate}
          participants={participants}
          onSelectTimeUtc={(utcStr) => setSelectedTimeUtc(utcStr)}
        />

        {/* 7. Final Meeting Summary Card */}
        <MeetingSummary
          selectedDate={selectedDate}
          selectedTimeUtc={selectedTimeUtc}
          participants={participants}
        />

      </main>

      {/* 8. Philosophy & Editorial Narrative Section */}
      <PhilosophySection />

      {/* 9. Asymmetrical Showcase Grid (12-column) */}
      <AsymmetricalShowcase />

      {/* 10. Bespoke Service Cards */}
      <ServiceCards />

      {/* 11. Pill-Shaped Vertical Showcase */}
      <PillShowcase />

      {/* 12. Deep Dark Editorial Footer */}
      <Footer onOpenHowItWorks={() => setIsHowItWorksOpen(true)} />

      {/* 13. Interactive How It Works Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

    </div>
  );
};

export default App;
