import { CheckCircle2, Clock, MapPin, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Submission } from '../types';

interface AdminSubmissionPageProps {
  onRefresh: () => void;
  onBack: () => void;
}

export const AdminSubmissionPage: React.FC<AdminSubmissionPageProps> = ({ onRefresh, onBack }) => {
  const { showToast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await api.getSubmissions();
      setSubmissions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await api.reviewSubmission(id, 'Approved');
      showToast('Submission approved! Points awarded to devotee. 🪙', 'success');
      fetchSubmissions();
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Approval failed', 'error');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.reviewSubmission(id, 'Rejected', rejectionReason || 'Invalid proof photo');
      showToast('Submission rejected', 'info');
      setRejectingId(null);
      setRejectionReason('');
      fetchSubmissions();
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Rejection failed', 'error');
    }
  };

  const filtered = submissions.filter((s) => {
    if (filter === 'All') return true;
    return s.status === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 pb-24">
      <button onClick={onBack} className="text-xs font-bold text-stone-600 hover:text-stone-900">
        ← Back to Admin Dashboard
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Rozha_One',serif]">
            Verify Devotee Proof Submissions
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm">Review uploaded photos, approve points, or decline invalid submissions</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-amber-100/80 p-1 rounded-2xl">
          {(['Pending', 'Approved', 'Rejected', 'All'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === tab ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-stone-500 font-medium">Loading submissions...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-amber-200/80 text-stone-500">
          No submissions found for status: <strong>{filter}</strong>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-3xl border border-amber-200/90 shadow-sm p-5 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-bold text-stone-900 text-base">{sub.user.name}</h3>
                    <span className="text-xs text-stone-500">{sub.user.email}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      sub.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : sub.status === 'Rejected'
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>

                <div className="relative h-48 rounded-2xl overflow-hidden bg-amber-100 border border-amber-200">
                  <img src={sub.image} alt="Proof" className="w-full h-full object-cover" />
                </div>

                <div className="space-y-1 text-xs text-stone-700 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                  <p>
                    <strong>Quest:</strong> {sub.challengeTitle}
                  </p>
                  {sub.notes && (
                    <p>
                      <strong>Devotee Note:</strong> "{sub.notes}"
                    </p>
                  )}
                  {sub.latitude && sub.longitude && (
                    <p className="text-emerald-700 font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> GPS Tagged ({sub.latitude.toFixed(2)}, {sub.longitude.toFixed(2)})
                    </p>
                  )}
                  <p className="text-stone-400 text-[10px] pt-1">
                    Submitted: {new Date(sub.submittedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {sub.status === 'Pending' && (
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => handleApprove(sub.id)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => setRejectingId(sub.id)}
                    className="flex-1 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Decline</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-200 space-y-4">
            <h3 className="text-lg font-bold text-stone-900">Decline Submission</h3>
            <p className="text-xs text-stone-600">Please provide a brief reason for declining this proof photo.</p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Photo does not clearly show the Ganpati pandal..."
              className="w-full bg-amber-50/50 border border-amber-200 rounded-xl p-3 text-xs outline-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(rejectingId)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
