import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function AddCourse() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { data } = await api.post('/courses', {
        title,
        description,
        price: Number(price),
        thumbnail: thumbnail.trim() || undefined,
      });
      toast.success('Course created');
      navigate(`/courses/${data.course._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create course.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold text-white">Add course</h1>
      <p className="mt-1 text-[#a3a1af]">Create a new catalog entry. You will be set as the instructor.</p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5 rounded-2xl border border-[#363544] bg-[#21202e] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)] sm:p-8"
      >
        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
        <label className="block">
          <span className="text-sm font-medium text-white">Title</span>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[#363544] bg-[#171620] px-4 py-2.5 text-white focus:border-[#8c51f4] focus:outline-none focus:ring-2 focus:ring-[#8c51f4]/25"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-white">Description</span>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[#363544] bg-[#171620] px-4 py-2.5 text-white focus:border-[#8c51f4] focus:outline-none focus:ring-2 focus:ring-[#8c51f4]/25"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-white">Price (USD)</span>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[#363544] bg-[#171620] px-4 py-2.5 text-white focus:border-[#8c51f4] focus:outline-none focus:ring-2 focus:ring-[#8c51f4]/25"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-white">Thumbnail URL (optional)</span>
          <input
            type="url"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="https://…"
            className="mt-1 w-full rounded-xl border border-[#363544] bg-[#171620] px-4 py-2.5 text-white placeholder:text-[#a3a1af] focus:border-[#8c51f4] focus:outline-none focus:ring-2 focus:ring-[#8c51f4]/25"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-[#8c51f4] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7b44e2] disabled:opacity-60"
        >
          {busy ? 'Saving…' : 'Create course'}
        </button>
      </form>
    </div>
  );
}
