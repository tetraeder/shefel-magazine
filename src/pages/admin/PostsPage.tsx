import { useState } from 'react';
import { useAllPosts } from '../../hooks/usePosts';
import { useTags } from '../../hooks/useTags';
import { useIssues } from '../../hooks/useIssues';
import { createPost, updatePost, deletePost } from '../../services/posts';
import type { Post, PostFormData } from '../../types/post';
import { Spinner } from '../../components/ui/Spinner';

const emptyForm: PostFormData = {
  imageUrl: '',
  caption: '',
  captionSnippet: '',
  author: '',
  instagramUrl: null,
  tags: [],
  issueId: '',
  order: 0,
  source: 'manual',
};

export function PostsPage() {
  const { posts, loading, refetch } = useAllPosts();
  const { tags } = useTags();
  const { issues } = useIssues();
  const [editing, setEditing] = useState<Post | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<PostFormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(post: Post) {
    setEditing(post);
    setForm({
      imageUrl: post.imageUrl,
      caption: post.caption,
      captionSnippet: post.captionSnippet,
      author: post.author,
      instagramUrl: post.instagramUrl,
      tags: post.tags,
      issueId: post.issueId,
      order: post.order,
      source: post.source,
    });
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editing) {
        await updatePost(editing.id, form);
      } else {
        await createPost(form);
      }
      setShowForm(false);
      refetch();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('למחוק את הפוסט?')) return;
    await deletePost(id);
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

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-black text-shefel-black text-3xl">
          פוסטים
        </h1>
        <button
          onClick={openNew}
          className="bg-shefel-red text-shefel-white font-bold px-4 py-2 rounded hover:bg-shefel-black transition-colors"
        >
          + פוסט חדש
        </button>
      </div>

      {showForm && (
        <div className="bg-shefel-white rounded-lg border-2 border-shefel-red p-6 mb-6">
          <h2 className="font-display font-bold text-xl mb-4">
            {editing ? 'עריכת פוסט' : 'פוסט חדש'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-body font-bold text-sm mb-1">קישור תמונה</label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 text-sm"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block font-body font-bold text-sm mb-1">מחבר</label>
              <input
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-body font-bold text-sm mb-1">כיתוב</label>
              <textarea
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                rows={3}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block font-body font-bold text-sm mb-1">כיתוב מקוצר</label>
              <input
                value={form.captionSnippet}
                onChange={(e) => setForm({ ...form, captionSnippet: e.target.value })}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block font-body font-bold text-sm mb-1">קישור אינסטגרם</label>
              <input
                type="url"
                value={form.instagramUrl || ''}
                onChange={(e) => setForm({ ...form, instagramUrl: e.target.value || null })}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 text-sm"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block font-body font-bold text-sm mb-1">גיליון</label>
              <select
                value={form.issueId}
                onChange={(e) => setForm({ ...form, issueId: e.target.value })}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 text-sm"
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
              <label className="block font-body font-bold text-sm mb-1">סדר</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-body font-bold text-sm mb-1">תגיות</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1 text-sm font-bold rounded-full border-2 transition-colors ${
                      form.tags.includes(tag.id)
                        ? 'bg-shefel-red text-shefel-white border-shefel-red'
                        : 'bg-shefel-white text-shefel-black border-gray-300 hover:border-shefel-red'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {form.imageUrl && (
            <div className="mt-4">
              <p className="font-body font-bold text-sm mb-1">תצוגה מקדימה</p>
              <img src={form.imageUrl} alt="preview" className="w-32 h-32 object-cover rounded border-2 border-gray-300" />
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
        <table className="w-full text-sm">
          <thead className="bg-shefel-black text-shefel-white">
            <tr>
              <th className="px-4 py-3 text-right font-bold">תמונה</th>
              <th className="px-4 py-3 text-right font-bold">מחבר</th>
              <th className="px-4 py-3 text-right font-bold">כיתוב</th>
              <th className="px-4 py-3 text-right font-bold">תגיות</th>
              <th className="px-4 py-3 text-right font-bold">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3">
                  {post.imageUrl && (
                    <img src={post.imageUrl} alt="" className="w-12 h-12 object-cover rounded" />
                  )}
                </td>
                <td className="px-4 py-3">{post.author}</td>
                <td className="px-4 py-3 max-w-xs truncate">{post.captionSnippet || post.caption}</td>
                <td className="px-4 py-3">{post.tags.length} תגיות</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => openEdit(post)}
                    className="text-shefel-red hover:underline font-bold ml-3"
                  >
                    ערוך
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-gray-500 hover:text-shefel-red font-bold"
                  >
                    מחק
                  </button>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  אין פוסטים עדיין
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
