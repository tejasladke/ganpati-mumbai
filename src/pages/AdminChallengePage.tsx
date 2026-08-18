import { Edit3, Plus, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import { api } from '../services/api';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { useToast } from '../context/ToastContext';
import { Challenge } from '../types';

interface AdminChallengePageProps {
  challenges: Challenge[];
  onRefresh: () => void;
  onBack: () => void;
}

export const AdminChallengePage: React.FC<AdminChallengePageProps> = ({ challenges, onRefresh, onBack }) => {
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState(100);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [category, setCategory] = useState('Photo Quest');
  const [pandalName, setPandalName] = useState('');
  const [image, setImage] = useState('');

  const openCreateModal = () => {
    setEditingChallenge(null);
    setTitle('');
    setDescription('');
    setPoints(100);
    setDifficulty('Medium');
    setCategory('Photo Quest');
    setPandalName('');
    setImage('https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg');
    setModalOpen(true);
  };

  const openEditModal = (c: Challenge) => {
    setEditingChallenge(c);
    setTitle(c.title);
    setDescription(c.description);
    setPoints(c.points);
    setDifficulty(c.difficulty);
    setCategory(c.category || 'Photo Quest');
    setPandalName(c.pandalName || '');
    setImage(c.image || '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingChallenge) {
        await api.updateChallenge(editingChallenge.id, {
          title,
          description,
          points: Number(points),
          difficulty,
          category,
          pandalName,
          image,
        });
        showToast('Challenge updated successfully! 🏆', 'success');
      } else {
        await api.createChallenge({
          title,
          description,
          points: Number(points),
          difficulty,
          category,
          pandalName,
          image,
        });
        showToast('New festival quest created! 🌺', 'success');
      }
      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to save challenge', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await api.deleteChallenge(deleteTargetId);
      showToast('Challenge deleted', 'info');
      setDeleteTargetId(null);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete challenge', 'error');
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
            Manage Festival Quests ({challenges.length})
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm">Create and configure photo challenges for devotees</p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-2xl shadow-md flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Quest</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-amber-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-stone-800">
            <thead className="bg-amber-100/60 text-stone-900 uppercase font-bold tracking-wider text-[11px] border-b border-amber-200">
              <tr>
                <th className="p-4">Quest Title</th>
                <th className="p-4">Points</th>
                <th className="p-4">Difficulty</th>
                <th className="p-4">Associated Pandal</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {challenges.map((c) => (
                <tr key={c.id} className="hover:bg-amber-50/50">
                  <td className="p-4 font-bold text-stone-900">{c.title}</td>
                  <td className="p-4 text-orange-600 font-extrabold">🪙 +{c.points}</td>
                  <td className="p-4">
                    <span className="bg-amber-100 text-amber-900 font-semibold px-2.5 py-1 rounded-full text-xs">
                      {c.difficulty}
                    </span>
                  </td>
                  <td className="p-4 text-stone-600">{c.pandalName || 'General Mumbai'}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(c)}
                      className="p-2 text-stone-600 hover:text-orange-600 bg-amber-50 hover:bg-amber-100 rounded-xl"
                      title="Edit Quest"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(c.id)}
                      className="p-2 text-stone-400 hover:text-rose-600 bg-rose-50 rounded-xl"
                      title="Delete Quest"
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-amber-200 relative max-h-[90vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-stone-900 font-['Rozha_One',serif]">
              {editingChallenge ? 'Edit Quest Details' : 'Create New Quest'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700">Quest Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 bg-amber-50/50 border border-amber-200 rounded-xl p-2.5 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700">Points Awarded</label>
                  <input
                    type="number"
                    required
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    className="w-full mt-1 bg-amber-50/50 border border-amber-200 rounded-xl p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full mt-1 bg-amber-50/50 border border-amber-200 rounded-xl p-2.5 outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700">Associated Pandal Name (Optional)</label>
                <input
                  type="text"
                  value={pandalName}
                  onChange={(e) => setPandalName(e.target.value)}
                  placeholder="e.g. Lalbaugcha Raja"
                  className="w-full mt-1 bg-amber-50/50 border border-amber-200 rounded-xl p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700">Description / Instructions</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-1 bg-amber-50/50 border border-amber-200 rounded-xl p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700">Image Cover URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
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
                  Save Quest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={!!deleteTargetId}
        title="Delete Quest"
        message="Are you sure you want to delete this quest?"
        isDangerous={true}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
