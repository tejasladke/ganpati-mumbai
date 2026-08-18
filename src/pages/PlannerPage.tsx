import { Bot, Calendar, Clock, MapPin, Navigation, Plus, Printer, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Pandal, PlannerItem } from '../types';
import { AiItineraryPlanner } from '../components/AiItineraryPlanner';

interface PlannerPageProps {
  pandals: Pandal[];
  plannerItems: PlannerItem[];
  onRefreshPlanner: () => void;
  onSelectPandal: (pandal: Pandal) => void;
}

export const PlannerPage: React.FC<PlannerPageProps> = ({
  pandals,
  plannerItems,
  onRefreshPlanner,
  onSelectPandal,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'ai' | 'manual'>('ai');
  const [selectedPandalId, setSelectedPandalId] = useState<string>(pandals[0]?.id || '');
  const [visitDate, setVisitDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [visitTime, setVisitTime] = useState<string>('08:00 AM');
  const [adding, setAdding] = useState(false);

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please log in to build your personal festival itinerary', 'info');
      return;
    }
    if (!selectedPandalId) return;

    try {
      setAdding(true);
      await api.addPlannerItem(selectedPandalId, visitDate, visitTime);
      showToast('Added to your festival itinerary! 🗓️', 'success');
      onRefreshPlanner();
    } catch (err: any) {
      showToast(err.message || 'Failed to add to planner', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await api.deletePlannerItem(id);
      showToast('Removed from itinerary', 'info');
      onRefreshPlanner();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete item', 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 block mb-1">
            🗓️ FESTIVAL TOUR PLANNER & AI MAP ROUTE
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 font-['Rozha_One',serif]">
            Mumbai Festival Tour Planner
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
            Plan an optimal line-by-line tour based on your location and map coordinates, or manage your saved schedule.
          </p>
        </div>

        {plannerItems.length > 0 && activeTab === 'manual' && (
          <button
            onClick={handlePrint}
            className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 self-start sm:self-auto"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print / Save Schedule</span>
          </button>
        )}
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 bg-amber-100/60 p-1.5 rounded-2xl border border-amber-200/80 max-w-md">
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'ai'
              ? 'bg-stone-900 text-amber-300 shadow-md scale-[1.02]'
              : 'text-stone-700 hover:bg-amber-200/60'
          }`}
        >
          <Bot className="w-4 h-4 text-orange-400" />
          <span>AI Map Route Planner</span>
        </button>

        <button
          onClick={() => setActiveTab('manual')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'manual'
              ? 'bg-stone-900 text-amber-300 shadow-md scale-[1.02]'
              : 'text-stone-700 hover:bg-amber-200/60'
          }`}
        >
          <Calendar className="w-4 h-4 text-orange-400" />
          <span>My Saved Schedule ({plannerItems.length})</span>
        </button>
      </div>

      {/* Tab Content 1: AI Map Route Planner */}
      {activeTab === 'ai' && (
        <AiItineraryPlanner
          pandals={pandals}
          onRefreshPlanner={onRefreshPlanner}
          onSelectPandal={onSelectPandal}
        />
      )}

      {/* Tab Content 2: Manual Schedule Management */}
      {activeTab === 'manual' && (
        <div className="space-y-8">
          {/* Add Item Form */}
          <form onSubmit={handleAddPlan} className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-orange-500" />
              <span>Add Custom Pandal Stop</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 uppercase">Select Pandal</label>
                <select
                  value={selectedPandalId}
                  onChange={(e) => setSelectedPandalId(e.target.value)}
                  className="w-full mt-1 bg-amber-50/50 border border-amber-200 rounded-xl p-2.5 text-xs sm:text-sm text-stone-900 outline-none"
                >
                  {pandals.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.area})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 uppercase">Visit Date</label>
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full mt-1 bg-amber-50/50 border border-amber-200 rounded-xl p-2.5 text-xs sm:text-sm text-stone-900 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 uppercase">Target Visit Time</label>
                <input
                  type="text"
                  value={visitTime}
                  onChange={(e) => setVisitTime(e.target.value)}
                  placeholder="e.g. 08:30 AM"
                  className="w-full mt-1 bg-amber-50/50 border border-amber-200 rounded-xl p-2.5 text-xs sm:text-sm text-stone-900 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={adding}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-sm transition-all"
            >
              {adding ? 'Adding...' : 'Add Stop to Tour'}
            </button>
          </form>

          {/* Planned Stops Timeline */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-stone-900 font-['Rozha_One',serif]">
              Your Planned Darshan Stops ({plannerItems.length})
            </h2>

            {plannerItems.length === 0 ? (
              <p className="text-stone-500 text-xs italic">
                Your tour schedule is empty. Use the AI Map Route Planner tab to automatically generate an optimized tour line!
              </p>
            ) : (
              <div className="space-y-4">
                {plannerItems.map((item, idx) => {
                  const p = item.pandal;
                  return (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 rounded-2xl border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                          #{idx + 1}
                        </span>
                        <div>
                          <h4 className="text-base font-bold text-stone-900">{p?.name || 'Pandal'}</h4>
                          <p className="text-xs text-stone-600 flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1 text-orange-600 font-semibold">
                              <MapPin className="w-3.5 h-3.5" /> {p?.area}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 font-semibold text-stone-700">
                              <Clock className="w-3.5 h-3.5 text-amber-600" /> {item.visitDate} @ {item.visitTime}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        {p && (
                          <button
                            onClick={() => onSelectPandal(p)}
                            className="bg-amber-100 text-amber-900 hover:bg-amber-200 text-xs font-bold px-3 py-2 rounded-xl"
                          >
                            View Details
                          </button>
                        )}
                        {p && (
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-orange-500 text-white hover:bg-orange-600 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            <span>Navigate</span>
                          </a>
                        )}
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="p-2 text-stone-400 hover:text-rose-600 rounded-xl hover:bg-rose-50"
                          title="Remove stop"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
