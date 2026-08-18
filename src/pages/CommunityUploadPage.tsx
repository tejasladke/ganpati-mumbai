import { Camera, CheckCircle2, Image as ImageIcon, MapPin, Upload, X } from 'lucide-react';
import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Pandal } from '../types';

interface CommunityUploadPageProps {
  pandals: Pandal[];
  onNavigateLogin: () => void;
  onSuccess: () => void;
}

export const CommunityUploadPage: React.FC<CommunityUploadPageProps> = ({ pandals, onNavigateLogin, onSuccess }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [preview, setPreview] = useState('');
  const [notes, setNotes] = useState('');
  const [pandalId, setPandalId] = useState('');
  const [coords, setCoords] = useState<{ lat?: number; lng?: number }>({});
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl border border-amber-200 p-8 text-center shadow-sm space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Camera className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900">Share Your Ganpati Photo</h1>
          <p className="text-sm text-stone-600">Please log in or create a devotee account before uploading a photo.</p>
          <button onClick={onNavigateLogin} className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md">
            Log In to Upload
          </button>
        </div>
      </div>
    );
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please choose an image file.', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('Please choose an image up to 10MB.', 'error');
      return;
    }

    try {
      setUploading(true);
      const url = await api.uploadImage(file);
      setPreview(url);
      showToast('Photo uploaded and ready to submit! 📸', 'success');
    } catch (err: any) {
      showToast(err.message || 'Photo upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      showToast('Location is not supported on this device.', 'error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        showToast('Location added to your photo! 📍', 'success');
      },
      () => showToast('Location permission was not granted. You can still upload.', 'info')
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview) {
      showToast('Please choose a photo first.', 'error');
      return;
    }
    try {
      setSubmitting(true);
      const selected = pandals.find((p) => p.id === pandalId);
      const locationNote = selected ? `Pandal: ${selected.name}\n` : '';
      await api.submitChallenge(
        'community-photo-upload',
        preview,
        coords.lat,
        coords.lng,
        `${locationNote}${notes}`.trim()
      );
      showToast('Your photo was submitted for admin review! 🌺', 'success');
      setPreview('');
      setNotes('');
      setPandalId('');
      setCoords({});
      onSuccess();
    } catch (err: any) {
      showToast(err.message || 'Could not submit photo', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-7 sm:py-10 pb-24">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-100">Community</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Upload Your Ganpati Photo</h1>
          </div>
        </div>
        <p className="mt-4 text-sm text-amber-50">Share your darshan, pandal, decoration or Ganpati festival moment. Every upload is sent to the admin for review.</p>
      </div>

      <form onSubmit={submit} className="bg-white rounded-3xl border border-amber-200 p-5 sm:p-7 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-2">Photo</label>
          <div className="relative border-2 border-dashed border-amber-300 rounded-2xl p-5 text-center bg-amber-50/50 min-h-56 flex items-center justify-center overflow-hidden">
            <input type="file" accept="image/*" onChange={handleFile} disabled={uploading || submitting} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
            {uploading ? (
              <p className="font-bold text-orange-700 animate-pulse">Uploading photo...</p>
            ) : preview ? (
              <div className="relative w-full">
                <img src={preview} alt="Selected Ganpati" className="max-h-80 mx-auto rounded-2xl object-contain shadow" />
                <button type="button" onClick={() => setPreview('')} className="absolute top-2 right-2 bg-stone-900/80 text-white rounded-full p-2" aria-label="Remove photo">
                  <X className="w-4 h-4" />
                </button>
                <p className="text-xs font-bold text-emerald-700 mt-3">✓ Photo ready. Click to replace.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <ImageIcon className="w-12 h-12 mx-auto text-amber-500" />
                <p className="font-bold text-stone-800">Tap / click to choose a photo</p>
                <p className="text-xs text-stone-500">JPG, PNG or other image • maximum 10MB</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-2">Which Pandal? <span className="font-normal text-stone-400">(optional)</span></label>
          <select value={pandalId} onChange={(e) => setPandalId(e.target.value)} className="w-full rounded-xl border border-amber-200 bg-amber-50/40 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-400">
            <option value="">Select a pandal</option>
            {pandals.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.area}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-2">Caption / Experience</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} maxLength={500} placeholder="Tell other devotees what you saw..." className="w-full rounded-xl border border-amber-200 bg-amber-50/40 px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-400" />
        </div>

        <button type="button" onClick={getLocation} className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 text-orange-700 font-bold text-xs flex items-center justify-center gap-2">
          <MapPin className="w-4 h-4" /> {coords.lat ? `Location added (${coords.lat.toFixed(4)}, ${coords.lng?.toFixed(4)})` : 'Add Current Location (optional)'}
        </button>

        <button type="submit" disabled={submitting || uploading || !preview} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
          {submitting ? 'Submitting...' : <><Upload className="w-4 h-4" /> Submit Photo for Admin Review</>}
        </button>

        <div className="flex items-start gap-2 text-xs text-stone-500 bg-stone-50 border border-stone-200 rounded-xl p-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Your photo is not published immediately. An admin reviews it first.</span>
        </div>
      </form>
    </div>
  );
};
