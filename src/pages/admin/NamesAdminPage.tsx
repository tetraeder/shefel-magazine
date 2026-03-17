import { useState } from 'react';
import { useNames } from '../../hooks/useNames';
import { createName, updateName, deleteName, seedNames } from '../../services/names';
import { NAMES } from '../../data/names';
import { Spinner } from '../../components/ui/Spinner';

export function NamesAdminPage() {
  const { names, loading, refetch } = useNames();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [search, setSearch] = useState('');

  async function handleAdd() {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      await createName(newName.trim());
      setNewName('');
      setShowAdd(false);
      refetch();
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: string) {
    if (!editValue.trim()) return;
    setSaving(true);
    try {
      await updateName(id, editValue.trim());
      setEditingId(null);
      refetch();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('למחוק את השם?')) return;
    await deleteName(id);
    refetch();
  }

  async function handleSeed() {
    if (!confirm(`לייבא ${NAMES.length} שמות מהרשימה הקיימת? פעולה זו תוסיף את כל השמות לבסיס הנתונים.`)) return;
    setSeeding(true);
    try {
      await seedNames(NAMES);
      refetch();
    } finally {
      setSeeding(false);
    }
  }

  const filtered = search
    ? names.filter((n) => n.name.includes(search))
    : names;

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-black text-shefel-black text-3xl">
          שמות מפעמים ({names.length})
        </h1>
        <div className="flex gap-2">
          {names.length === 0 && (
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="bg-shefel-black text-shefel-white font-bold px-4 py-2 rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {seeding ? 'מייבא...' : `ייבא ${NAMES.length} שמות`}
            </button>
          )}
          <button
            onClick={() => { setShowAdd(true); setNewName(''); }}
            className="bg-shefel-red text-shefel-white font-bold px-4 py-2 rounded hover:bg-shefel-black transition-colors"
          >
            + שם חדש
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="bg-shefel-white rounded-lg border-2 border-shefel-red p-6 mb-6">
          <h2 className="font-display font-bold text-xl mb-4">שם חדש</h2>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block font-body font-bold text-sm mb-1">שם</label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 text-sm"
                autoFocus
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={saving || !newName.trim()}
              className="bg-shefel-red text-shefel-white font-bold px-6 py-2 rounded hover:bg-shefel-black transition-colors disabled:opacity-50"
            >
              {saving ? 'שומר...' : 'הוסף'}
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="bg-gray-200 text-shefel-black font-bold px-6 py-2 rounded hover:bg-gray-300 transition-colors"
            >
              ביטול
            </button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חיפוש שם..."
          className="w-full md:w-80 border-2 border-gray-300 rounded px-3 py-2 text-sm"
        />
      </div>

      <div className="bg-shefel-white rounded-lg border-2 border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-shefel-black text-shefel-white">
            <tr>
              <th className="px-4 py-3 text-right font-bold w-12">#</th>
              <th className="px-4 py-3 text-right font-bold">שם</th>
              <th className="px-4 py-3 text-right font-bold w-32">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry, index) => (
              <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-400">{index + 1}</td>
                <td className="px-4 py-2">
                  {editingId === entry.id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdate(entry.id)}
                        className="flex-1 border-2 border-shefel-red rounded px-2 py-1 text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => handleUpdate(entry.id)}
                        disabled={saving}
                        className="text-shefel-red hover:underline font-bold text-xs"
                      >
                        שמור
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-500 hover:underline font-bold text-xs"
                      >
                        ביטול
                      </button>
                    </div>
                  ) : (
                    <span className="font-bold">{entry.name}</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {editingId !== entry.id && (
                    <>
                      <button
                        onClick={() => { setEditingId(entry.id); setEditValue(entry.name); }}
                        className="text-shefel-red hover:underline font-bold ml-3"
                      >
                        ערוך
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-gray-500 hover:text-shefel-red font-bold"
                      >
                        מחק
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                  {search ? 'לא נמצאו שמות' : 'אין שמות עדיין'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
