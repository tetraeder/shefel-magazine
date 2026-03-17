import { useState } from 'react';
import { useMedia } from '../../hooks/useMedia';
import { useTags } from '../../hooks/useTags';
import { useIssues } from '../../hooks/useIssues';
import { createMedia, updateMedia, deleteMedia } from '../../services/media';
import { createTag } from '../../services/tags';
import type { MediaItem, MediaFormData } from '../../types/media';
import { Spinner } from '../../components/ui/Spinner';

function tsToDateStr(ts: { toDate: () => Date } | null): string {
  if (!ts) return '';
  return ts.toDate().toISOString().split('T')[0];
}

const emptyForm: MediaFormData = {
  title: '',
  mediaOriginUrl: '',
  thumbnailUrl: '',
  tags: [],
  credits: '',
  issueId: '',
  order: 0,
  publishedAt: '',
};

export function MediaAdminPage() {
  const { media, loading, refetch } = useMedia();
  const { tags, refetch: refetchTags } = useTags();
  const { issues } = useIssues();
  const [editing, setEditing] = useState<MediaItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<MediaFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(item: MediaItem) {
    setEditing(item);
    setForm({
      title: item.title,
      mediaOriginUrl: item.mediaOriginUrl,
      thumbnailUrl: item.thumbnailUrl,
      tags: item.tags,
      credits: item.credits || '',
      issueId: item.issueId || '',
      order: item.order,
      publishedAt: tsToDateStr(item.publishedAt),
    });
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editing) {
        await updateMedia(editing.id, form);
      } else {
        await createMedia(form);
      }
      setShowForm(false);
      refetch();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('למחוק את פריט המדיה?')) return;
    await deleteMedia(id);
    refetch();
  }

  function toggleTag(tagId: string) {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tagId)
        ? f.tags.filter((t) => t !== tagId)
        : [...f.tags, tagId],
    }));
  }

  async function handleAddTag() {
    const name = newTagName.trim();
    if (!name) return;
    const slug = name.replace(/\s+/g, '-');
    const id = await createTag({ name, slug, color: null });
    setNewTagName('');
    await refetchTags();
    setForm((f) => ({ ...f, tags: [...f.tags, id] }));
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-black text-shefel-black text-3xl">
          מדיה
        </h1>
        <button
          onClick={openNew}
          className="bg-shefel-red text-shefel-white font-bold px-4 py-2 rounded hover:bg-shefel-black transition-colors"
        >
          + מדיה חדשה
        </button>
      </div>

      {showForm && (
        <div className="bg-shefel-white rounded-lg border-2 border-shefel-red p-6 mb-6">
          <h2 className="font-bold text-xl mb-4">
            {editing ? 'עריכת מדיה' : 'מדיה חדשה'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block font-bold text-base mb-1">כותרת</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 text-base"
              />
            </div>
            <div>
              <label className="block font-bold text-base mb-1">קישור וידאו</label>
              <input
                type="url"
                value={form.mediaOriginUrl}
                onChange={(e) => setForm({ ...form, mediaOriginUrl: e.target.value })}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 text-base"
                dir="ltr"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block font-bold text-base mb-1">קישור תמונת תצוגה</label>
              <input
                type="url"
                value={form.thumbnailUrl}
                onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 text-base"
                dir="ltr"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-bold text-base mb-1">קרדיטים</label>
              <input
                value={form.credits}
                onChange={(e) => setForm({ ...form, credits: e.target.value })}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 text-base"
                placeholder="אופציונלי — שמות תורמים, צלמים וכו׳"
              />
            </div>
            <div>
              <label className="block font-bold text-base mb-1">גיליון</label>
              <select
                value={form.issueId}
                onChange={(e) => setForm({ ...form, issueId: e.target.value })}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 text-base"
              >
                <option value="">בחר גיליון</option>
                {issues.map((issue) => (
                  <option key={issue.id} value={issue.id}>
                    {issue.title || `${issue.month}/${issue.year}`}
                    {issue.isCurrent ? ' (נוכחי)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-base mb-1">סדר</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 text-base"
              />
            </div>
            <div>
              <label className="block font-bold text-base mb-1">תאריך פרסום</label>
              <input
                type="date"
                value={form.publishedAt}
                onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 text-base"
                dir="ltr"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-bold text-base mb-1">תגיות</label>
              <div className="flex flex-wrap gap-2 items-center">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1 text-base font-bold rounded-full border-2 transition-colors ${
                      form.tags.includes(tag.id)
                        ? 'bg-shefel-red text-shefel-white border-shefel-red'
                        : 'bg-shefel-white text-shefel-black border-gray-300 hover:border-shefel-red'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
                <div className="flex items-center gap-1">
                  <input
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="תגית חדשה..."
                    className="border-2 border-gray-300 rounded-full px-3 py-1 text-base w-28"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    disabled={!newTagName.trim()}
                    className="bg-shefel-red text-shefel-white font-bold px-3 py-1 text-base rounded-full disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {form.thumbnailUrl && (
            <div className="mt-4">
              <p className="font-bold text-base mb-1">תצוגה מקדימה</p>
              <img src={form.thumbnailUrl} alt="preview" className="w-32 h-auto rounded border-2 border-gray-300" />
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-shefel-red text-shefel-white font-bold px-6 py-2 rounded hover:bg-shefel-black transition-colors disabled:opacity-50"
            >
              {saving ? 'שומר...' : 'שמור'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-200 text-shefel-black font-bold px-6 py-2 rounded hover:bg-gray-300 transition-colors"
            >
              ביטול
            </button>
          </div>
        </div>
      )}

      <div className="bg-shefel-white rounded-lg border-2 border-gray-200 overflow-hidden">
        <table className="w-full text-lg">
          <thead className="bg-shefel-black text-shefel-white">
            <tr>
              <th className="px-4 py-3 text-right font-bold">תמונה</th>
              <th className="px-4 py-3 text-right font-bold">כותרת</th>
              <th className="px-4 py-3 text-right font-bold">סדר</th>
              <th className="px-4 py-3 text-right font-bold">פורסם</th>
              <th className="px-4 py-3 text-right font-bold">תגיות</th>
              <th className="px-4 py-3 text-right font-bold">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {media.map((item) => (
              <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3">
                  {item.thumbnailUrl && (
                    <img src={item.thumbnailUrl} alt="" className="w-12 h-16 object-cover rounded" />
                  )}
                </td>
                <td className="px-4 py-3 font-bold">{item.title}</td>
                <td className="px-4 py-3">{item.order}</td>
                <td className="px-4 py-3 text-base" dir="ltr">{tsToDateStr(item.publishedAt) || '—'}</td>
                <td className="px-4 py-3">{item.tags.length} תגיות</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => openEdit(item)}
                    className="text-shefel-red hover:underline font-bold ml-3"
                  >
                    ערוך
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-gray-500 hover:text-shefel-red font-bold"
                  >
                    מחק
                  </button>
                </td>
              </tr>
            ))}
            {media.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  אין פריטי מדיה עדיין
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
