import { Edit3, Plus, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import { api } from '../services/api';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { useToast } from '../context/ToastContext';
import { CrowdLevel, Pandal } from '../types';

interface AdminPandalPageProps {
  pandals: Pandal[];
  onRefresh: () => void;
  onBack: () => void;
}

export const AdminPandalPage: React.FC<AdminPandalPageProps> = ({ pandals, onRefresh, onBack }) => {
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPandal, setEditingPandal] = useState<Pandal | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [history, setHistory] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('Lalbaug');
  const [latitude, setLatitude] = useState('18.9912');
  const [longitude, setLongitude] = useState('72.8385');
  const [darshanStart, setDarshanStart] = useState('06:00 AM');
  const [darshanEnd, setDarshanEnd] = useState('11:00 PM');
  const [crowdLevel, setCrowdLevel] = useState<CrowdLevel>('Moderate');
  const [facilities, setFacilities] = useState('Wheelchair Access, Prasad Counter, First Aid');
  const [imageUrl, setImageUrl] = useState('');

  const openCreateModal = () => {
    setEditingPandal(null);
    setName('');
    setDescription('');
    setHistory('');
    setAddress('');
    setArea('Lalbaug');
    setLatitude('18.9912');
    setLongitude('72.8385');
    setDarshanStart('06:00 AM');
    setDarshanEnd('11:00 PM');
    setCrowdLevel('Moderate');
    setFacilities('Wheelchair Access, Prasad Counter, First Aid');
    setImageUrl('https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg');
    setModalOpen(true);
  };

  const openEditModal = (p: Pandal) => {
    setEditingPandal(p);
    setName(p.name);
    setDescription(p.description);
    setHistory(p.history);
    setAddress(p.address);
    setArea(p.area);
    setLatitude(p.latitude.toString());
    setLongitude(p.longitude.toString());
    setDarshanStart(p.darshanStart);
    setDarshanEnd(p.darshanEnd);
    setCrowdLevel(p.crowdLevel);
    setFacilities(p.facilities ? p.facilities.join(', ') : '');
    setImageUrl(p.images?.[0] || '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const facArray = facilities.split(',').map((f) => f.trim()).filter(Boolean);
    const imgArray = [imageUrl || 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg'];

    try {
      if (editingPandal) {
        await api.updatePandal(editingPandal.id, {
          name,
          description,
          history,
          address,
          area,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          darshanStart,
          darshanEnd,
          crowdLevel,
          facilities: facArray,
          images: imgArray,
        });
        showToast('Pandal updated successfully! 🌺', 'success');
      } else {
        await api.createPandal({
          name,
          description,
          history,
          address,
          area,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          darshanStart,
          darshanEnd,
          crowdLevel,
          facilities: facArray,
          images: imgArray,
        });
        showToast('New pandal created successfully! 🪔', 'success');
      }
      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to save pandal', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await api.deletePandal(deleteTargetId);
      showToast('Pandal deleted', 'info');
      setDeleteTargetId(null);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 pb-24">
      <button onClick={onBack} className="text-xs font-bold text-stone-600 hover:text-stone-900">
        ← Back to Admin Dashboard
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Rozha_One',serif]">
            Admin Pandal Management ({pandals.length})
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm">Create, edit, or delete pandals and update crowd levels</p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-2xl shadow-md flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Pandal</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-amber-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-stone-800">
            <thead className="bg-amber-100/60 text-stone-900 uppercase font-bold tracking-wider text-[11px] border-b border-amber-200">
              <tr>
                <th className="p-4">Pandal Name</th>
                <th className="p-4">Area</th>
                <th className="p-4">Crowd Level</th>
                <th className="p-4">Darshan Hours</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {pandals.map((p) => (
                <tr key={p.id} className="hover:bg-amber-50/50">
                  <td className="p-4 font-bold text-stone-900">{p.name}</td>
                  <td className="p-4 text-stone-600">{p.area}</td>
                  <td className="p-4">
                    <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-full text-xs">
                      {p.crowdLevel}
                    </span>
                  </td>
                  <td className="p-4 text-stone-600">
                    {p.darshanStart} - {p.darshanEnd}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-2 text-stone-600 hover:text-orange-600 bg-amber-50 hover:bg-amber-100 rounded-xl"
                      title="Edit Pandal"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(p.id)}
                      className="p-2 text-stone-400 hover:text-rose-600 bg-rose-50 rounded-xl"
                      title="Delete Pandal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-amber-200 relative max-h-[90vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-stone-900 font-['Rozha_One',serif]">
              {editingPandal ? 'Edit Pandal Details' : 'Create New Pandal'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700">Pandal Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mt-1 bg-amber-50/50 border border-amber-200 rounded-xl p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700">Area</label>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full mt-1 bg-amber-50/50 border border-amber-200 rounded-xl p-2.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700">Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full mt-1 bg-amber-50/50 border border-amber-200 rounded-xl p-2.5 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700">Latitude</label>
                  <input
                    type="text"
                    required
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full mt-1 bg-amber-50/50 border border-amber-200 rounded-xl p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700">Longitude</label>
                  <input
                    type="text"
                    required
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full mt-1 bg-amber-50/50 border border-amber-200 rounded-xl p-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-stone-700">Darshan Start</label>
                  <input
                    type="text"
                    value={darshanStart}
                    onChange={(e) => setDarshanStart(e.target.value)}
                    className="w-full mt-1 bg-amber-50/50 border border-amber-200 rounded-xl p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700">Darshan End</label>
                  <input
                    type="text"
                    value={darshanEnd}
                    onChange={(e) => setDarshanEnd(e.target.value)}
                    className="w-full mt-1 bg-amber-50/50 border border-amber-200 rounded-xl p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700">Crowd Level</label>
                  <select
                    value={crowdLevel}
                    onChange={(e) => setCrowdLevel(e.target.value as CrowdLevel)}
                    className="w-full mt-1 bg-amber-50/50 border border-amber-200 rounded-xl p-2.5 outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                    <option value="Heavy">Heavy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-1 bg-amber-50/50 border border-amber-200 rounded-xl p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700">History & Significance</label>
                <textarea
                  rows={2}
                  value={history}
                  onChange={(e) => setHistory(e.target.value)}
                  className="w-full mt-1 bg-amber-50/50 border border-amber-200 rounded-xl p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700">Facilities (comma separated)</label>
                <input
                  type="text"
                  value={facilities}
                  onChange={(e) => setFacilities(e.target.value)}
                  className="w-full mt-1 bg-amber-50/50 border border-amber-200 rounded-xl p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700">Cover Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full mt-1 bg-amber-50/50 border border-amber-200 rounded-xl p-2.5 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md"
                >
                  Save Pandal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteTargetId}
        title="Delete Pandal"
        message="Are you sure you want to delete this pandal from the database?"
        isDangerous={true}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
