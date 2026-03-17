import { useState } from 'react';
import { useTags } from '../../hooks/useTags';
import { createTag, updateTag, deleteTag } from '../../services/tags';
import type { Tag, TagFormData } from '../../types/tag';
import { Spinner } from '../../components/ui/Spinner';

const emptyForm: TagFormData = { name: '', slug: '', color: null };

export function TagsPage() {
  const { tags, loading, refetch } = useTags();
  const [editing, setEditing] = useState<Tag | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<TagFormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(tag: Tag) {
    setEditing(tag);
    setForm({ name: tag.name, slug: tag.slug, color: tag.color });
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editing) {
        await updateTag(editing.id, form);
      } else {
        await createTag(form);
      }
      setShowForm(false);
      refetch();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('למחוק את התגית?')) return;
    await deleteTag(id);
    refetch();
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-black text-shefel-black text-3xl">
          תגיות
        </h1>
        <button
          onClick={openNew}
          className="bg-shefel-red text-shefel-white font-bold px-4 py-2 rounded hover:bg-shefel-black transition-colors"
        >
          + תגית חדשה
        </button>
      </div>

      {showForm && (
        <div className="bg-shefel-white rounded-lg border-2 border-shefel-red p-6 mb-6">
          <h2 className="font-bold text-xl mb-4">
            {editing ? 'עריכת תגית' : 'תגית חדשה'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-base mb-1">שם (עברית)</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 text-base"
              />
            </div>
            <div>
              <label className="block font-bold text-base mb-1">Slug (לכתובת URL)</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 text-base"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block font-bold text-base mb-1">צבע (אופציונלי)</label>
              <input
                type="color"
                value={form.color || '#CC0000'}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="w-full h-10 border-2 border-gray-300 rounded"
              />
            </div>
          </div>

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
              <th className="px-4 py-3 text-right font-bold">שם</th>
              <th className="px-4 py-3 text-right font-bold">Slug</th>
              <th className="px-4 py-3 text-right font-bold">צבע</th>
              <th className="px-4 py-3 text-right font-bold">פוסטים</th>
              <th className="px-4 py-3 text-right font-bold">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr key={tag.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 font-bold">{tag.name}</td>
                <td className="px-4 py-3 text-gray-500" dir="ltr">{tag.slug}</td>
                <td className="px-4 py-3">
                  {tag.color && (
                    <span
                      className="inline-block w-6 h-6 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: tag.color }}
                    />
                  )}
                </td>
                <td className="px-4 py-3">{tag.postCount}</td>
                <td className="px-4 py-3">
                  <button onClick={() => openEdit(tag)} className="text-shefel-red hover:underline font-bold ml-3">
                    ערוך
                  </button>
                  <button onClick={() => handleDelete(tag.id)} className="text-gray-500 hover:text-shefel-red font-bold">
                    מחק
                  </button>
                </td>
              </tr>
            ))}
            {tags.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  אין תגיות עדיין
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
