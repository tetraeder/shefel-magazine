import { useState } from 'react';
import { useIssues } from '../../hooks/useIssues';
import { createIssue, updateIssue, deleteIssue, setCurrentIssue } from '../../services/issues';
import type { Issue, IssueFormData } from '../../types/issue';
import { formatIssueDate } from '../../lib/date';
import { Spinner } from '../../components/ui/Spinner';

const emptyForm: IssueFormData = {
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  title: '',
  description: '',
  isCurrent: false,
  publishedAt: null,
};

export function IssuesPage() {
  const { issues, loading, refetch } = useIssues();
  const [editing, setEditing] = useState<Issue | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<IssueFormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(issue: Issue) {
    setEditing(issue);
    setForm({
      month: issue.month,
      year: issue.year,
      title: issue.title,
      description: issue.description || '',
      isCurrent: issue.isCurrent,
      publishedAt: issue.publishedAt,
    });
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editing) {
        await updateIssue(editing.id, form);
      } else {
        await createIssue(form);
      }
      setShowForm(false);
      refetch();
    } catch (err) {
      console.error('Failed to save issue:', err);
      alert('שגיאה בשמירה: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
    }
  }

  async function handleSetCurrent(id: string) {
    await setCurrentIssue(id);
    refetch();
  }

  async function handleDelete(id: string) {
    if (!confirm('למחוק את הגיליון?')) return;
    await deleteIssue(id);
    refetch();
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-black text-shefel-black text-3xl">
          גיליונות
        </h1>
        <button
          onClick={openNew}
          className="bg-shefel-red text-shefel-white font-bold px-4 py-2 rounded hover:bg-shefel-black transition-colors"
        >
          + גיליון חדש
        </button>
      </div>

      {showForm && (
        <div className="bg-shefel-white rounded-lg border-2 border-shefel-red p-6 mb-6">
          <h2 className="font-bold text-xl mb-4">
            {editing ? 'עריכת גיליון' : 'גיליון חדש'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-base mb-1">חודש</label>
              <select
                value={form.month}
                onChange={(e) => setForm({ ...form, month: Number(e.target.value) })}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 text-base"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {formatIssueDate(m, form.year)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-base mb-1">שנה</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 text-base"
              />
            </div>
            <div>
              <label className="block font-bold text-base mb-1">כותרת (אופציונלי)</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 text-base"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block font-bold text-base mb-1">תיאור הגיליון</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 text-base"
                placeholder="תיאור קצר של הגיליון — מופיע מתחת לכותרת בעמוד הראשי"
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
              <th className="px-4 py-3 text-right font-bold">תאריך</th>
              <th className="px-4 py-3 text-right font-bold">כותרת</th>
              <th className="px-4 py-3 text-right font-bold">תיאור</th>
              <th className="px-4 py-3 text-right font-bold">פוסטים</th>
              <th className="px-4 py-3 text-right font-bold">סטטוס</th>
              <th className="px-4 py-3 text-right font-bold">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 font-bold">
                  {formatIssueDate(issue.month, issue.year)}
                </td>
                <td className="px-4 py-3">{issue.title || '-'}</td>
                <td className="px-4 py-3 max-w-xs truncate">{issue.description || '-'}</td>
                <td className="px-4 py-3">{issue.postCount}</td>
                <td className="px-4 py-3">
                  {issue.isCurrent ? (
                    <span className="bg-shefel-red text-shefel-white text-base font-bold px-2 py-1 rounded-full">
                      נוכחי
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetCurrent(issue.id)}
                      className="text-shefel-red hover:underline text-base font-bold"
                    >
                      הגדר כנוכחי
                    </button>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => openEdit(issue)} className="text-shefel-red hover:underline font-bold ml-3">
                    ערוך
                  </button>
                  <button onClick={() => handleDelete(issue.id)} className="text-gray-500 hover:text-shefel-red font-bold">
                    מחק
                  </button>
                </td>
              </tr>
            ))}
            {issues.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  אין גיליונות עדיין
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
