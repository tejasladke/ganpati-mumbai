import { Award, CheckCircle2, Clock, Image as ImageIcon, MapPin, Upload, XCircle } from 'lucide-react';
import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Challenge, Submission } from '../types';

interface ChallengeSubmissionPageProps {
  challenge: Challenge;
  mySubmissions?: Submission[];
  onSubmitSuccess: () => void;
  onBack: () => void;
}

export const ChallengeSubmissionPage: React.FC<ChallengeSubmissionPageProps> = ({
  challenge,
  mySubmissions = [],
  onSubmitSuccess,
  onBack,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [imagePreview, setImagePreview] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [coords, setCoords] = useState<{ lat?: number; lng?: number }>({});
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }

    try {
      setUploading(true);
      const url = await api.uploadImage(file);
      setImagePreview(url);
      showToast('Photo uploaded successfully! 📸', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload photo', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation not supported by browser', 'error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        showToast('GPS coordinates verified! 📍', 'success');
      },
      (err) => {
        showToast('Could not access GPS location. You can still submit your photo.', 'info');
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      showToast('Please upload a proof photo before submitting', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await api.submitChallenge(challenge.id, imagePreview, coords.lat, coords.lng, notes);
      showToast('Challenge proof submitted! Admin will verify soon. 🌺', 'success');
      onSubmitSuccess();
    } catch (err: any) {
      showToast(err.message || 'Failed to submit proof', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const existingSubmissions = (mySubmissions || []).filter((s) => s.challengeId === challenge.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 pb-24">
      <button
        onClick={onBack}
        className="text-stone-600 hover:text-stone-900 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
      >
        ← Back to Challenges
      </button>

      {/* Challenge Summary Box */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
        <img
          src={challenge.image}
          alt={challenge.title}
          className="w-full sm:w-48 h-40 rounded-2xl object-cover shrink-0"
        />
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
              🪙 +{challenge.points} Points
            </span>
            <span className="text-xs font-semibold text-stone-500">{challenge.difficulty}</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">{challenge.title}</h1>
          <p className="text-stone-600 text-xs sm:text-sm">{challenge.description}</p>
        </div>
      </div>

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-stone-900 font-['Rozha_One',serif] flex items-center gap-2">
          <Upload className="w-5 h-5 text-orange-500" />
          <span>Upload Challenge Proof Photo</span>
        </h2>

        {/* Upload Zone */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            Photo / Selfie Proof
          </label>
          <div className="border-2 border-dashed border-amber-300 rounded-2xl p-6 text-center bg-amber-50/40 hover:bg-amber-50 transition-colors relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              disabled={uploading}
            />
            {uploading ? (
              <div className="py-4 text-xs font-semibold text-amber-800 animate-pulse">
                Uploading photo...
              </div>
            ) : imagePreview ? (
              <div className="space-y-3">
                <img
                  src={imagePreview}
                  alt="Proof preview"
                  className="max-h-64 mx-auto rounded-xl shadow-md border border-amber-300"
                />
                <p className="text-xs font-bold text-emerald-700">✓ Photo attached! Click to change photo.</p>
              </div>
            ) : (
              <div className="space-y-2 py-4">
                <ImageIcon className="w-10 h-10 text-amber-500 mx-auto" />
                <p className="text-sm font-bold text-stone-800">Click to select or drop proof photo</p>
                <p className="text-xs text-stone-500">Supports JPG, PNG up to 10MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Optional Location Verification */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Optional Location Check
            </label>
            <button
              type="button"
              onClick={handleGetLocation}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{coords.lat ? 'Location Tagged ✓' : 'Verify Location via GPS'}</span>
            </button>
          </div>
          {coords.lat && (
            <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-xl border border-emerald-200">
              📍 GPS Tagged: {coords.lat.toFixed(4)}, {coords.lng?.toFixed(4)}
            </p>
          )}
        </div>

        {/* Comment / Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            Devotee Comment / Experience Notes
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="E.g., Visited Lalbaugcha Raja at 7 AM during morning aarti..."
            className="w-full bg-amber-50/50 border border-amber-200 rounded-xl p-3 text-xs sm:text-sm text-stone-900 outline-none focus:ring-2 focus:ring-orange-500/40"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || !imagePreview}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3.5 rounded-2xl shadow-md transition-all disabled:opacity-50 text-sm"
        >
          {submitting ? 'Submitting Proof...' : 'Submit Challenge Proof for Verification 🌺'}
        </button>
      </form>

      {/* Submission History for this challenge */}
      {existingSubmissions.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-stone-900">Your Previous Submissions for this Quest</h3>
          <div className="space-y-3">
            {existingSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="p-4 rounded-2xl border flex items-center justify-between gap-4 bg-amber-50/40 border-amber-200"
              >
                <div className="flex items-center gap-3">
                  <img src={sub.image} alt="" className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <span className="text-xs font-semibold text-stone-500 block">
                      Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                    </span>
                    <p className="text-xs text-stone-800 line-clamp-1">{sub.notes || 'No notes provided'}</p>
                    {sub.rejectionReason && (
                      <p className="text-xs text-rose-600 font-semibold mt-1">Reason: {sub.rejectionReason}</p>
                    )}
                  </div>
                </div>

                <div>
                  {sub.status === 'Approved' ? (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                    </span>
                  ) : sub.status === 'Rejected' ? (
                    <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-rose-300">
                      <XCircle className="w-3.5 h-3.5" /> Rejected
                    </span>
                  ) : (
                    <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-amber-300">
                      <Clock className="w-3.5 h-3.5" /> Pending Approval
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
