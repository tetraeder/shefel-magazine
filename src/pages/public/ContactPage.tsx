import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAppDb } from '../../firebase';
import { isMockMode } from '../../lib/mockData';

const REGIONS = ['מרכז', 'צפון', 'דרום', 'ירושלים'] as const;

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const [updateForm, setUpdateForm] = useState({ name: '', email: '', phone: '', region: '', notes: '' });
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [location.hash]);

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateForm.name.trim()) return;
    setUpdateStatus('sending');
    try {
      if (!isMockMode()) {
        const db = getAppDb();
        await addDoc(collection(db, 'updateSubscribers'), {
          name: updateForm.name.trim(),
          email: updateForm.email.trim(),
          phone: updateForm.phone.trim(),
          region: updateForm.region,
          notes: updateForm.notes.trim(),
          createdAt: serverTimestamp(),
        });
      }
      setUpdateStatus('sent');
      setUpdateForm({ name: '', email: '', phone: '', region: '', notes: '' });
    } catch {
      setUpdateStatus('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setStatus('sending');
    try {
      if (!isMockMode()) {
        const db = getAppDb();
        await addDoc(collection(db, 'contactMessages'), {
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          createdAt: serverTimestamp(),
        });
      }
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display font-black text-shefel-red text-5xl text-center mb-8">
        דברו איתנו
      </h1>

      <div className="bg-shefel-red rounded-lg border-4 border-shefel-red p-8 space-y-6">
        <p className="font-body text-shefel-yellow text-2xl leading-relaxed">
          אפשר למצוא אותנו באינסטגרם של{' '}
          <a
            href="https://www.instagram.com/kaduregelshefel/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-shefel-white transition-colors"
          >
            כדורגל שפל
          </a>{' '}
          או{' '}
          <a
            href="https://www.instagram.com/shefelshop/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-shefel-white transition-colors"
          >
            השפל שופ
          </a>
        </p>

        <p className="font-body text-shefel-yellow text-2xl leading-relaxed">
          <a
            href="http://instagram.com/ligashirts"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-shefel-white transition-colors"
          >
            ליגה
          </a>{' '}
          – פוטלגים ושחזורים, באינסטגרם של ליגה
        </p>

        <p className="font-body text-shefel-yellow text-2xl leading-relaxed">
          לעדכונים והצטרפות לקהילת כדורגל שפל{' '}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdaVclAPwJ641OeXIO23DT3GZ9vALegcOyDy78FQR1gozkGiQ/viewform?usp=dialog"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-shefel-white transition-colors"
          >
            בלינק
          </a>
        </p>
      </div>

      {/* Updates Form */}
      <div id="join" className="bg-shefel-yellow rounded-lg border-4 border-shefel-red p-8 mt-8">
        <h2 className="font-display font-bold text-shefel-red text-3xl text-center mb-2">
          השאירו פרטים לעדכונים
        </h2>
        <p className="font-body text-shefel-red text-xl text-center mb-6">
          פופ-אפים של השפל שופ, הרצאות, אירועי תרבות כדורגל ועוד הפתעות
        </p>

        {updateStatus === 'sent' ? (
          <div className="text-center py-8">
            <p className="font-display font-bold text-shefel-red text-xl">
              הפרטים נשלחו בהצלחה!
            </p>
            <button
              onClick={() => setUpdateStatus('idle')}
              className="mt-4 font-body font-bold text-sm px-4 py-2 rounded-full bg-shefel-red text-shefel-yellow hover:bg-shefel-black transition-colors"
            >
              שליחה נוספת
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div>
              <label className="block font-body font-bold text-shefel-red text-xl mb-1">
                שם מלא *
              </label>
              <input
                type="text"
                required
                value={updateForm.name}
                onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-shefel-red/30 focus:border-shefel-red outline-none font-body text-shefel-black"
              />
            </div>

            <div>
              <label className="block font-body font-bold text-shefel-red text-xl mb-1">
                אימייל
              </label>
              <input
                type="email"
                value={updateForm.email}
                onChange={(e) => setUpdateForm({ ...updateForm, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-shefel-red/30 focus:border-shefel-red outline-none font-body text-shefel-black"
              />
            </div>

            <div>
              <label className="block font-body font-bold text-shefel-red text-xl mb-1">
                טלפון נייד
              </label>
              <input
                type="tel"
                value={updateForm.phone}
                onChange={(e) => setUpdateForm({ ...updateForm, phone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-shefel-red/30 focus:border-shefel-red outline-none font-body text-shefel-black"
              />
            </div>

            <div>
              <label className="block font-body font-bold text-shefel-red text-xl mb-1">
                אזור
              </label>
              <select
                value={updateForm.region}
                onChange={(e) => setUpdateForm({ ...updateForm, region: e.target.value })}
                className="w-auto px-6 py-2 rounded-lg border-2 border-shefel-red focus:border-shefel-black outline-none font-body text-shefel-yellow bg-shefel-red"
              >
                <option value="">בחרו אזור</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-body font-bold text-shefel-red text-xl mb-1">
                הערות
              </label>
              <textarea
                rows={3}
                value={updateForm.notes}
                onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-shefel-red/30 focus:border-shefel-red outline-none font-body text-shefel-black resize-none"
              />
            </div>

            {updateStatus === 'error' && (
              <p className="font-body text-shefel-red font-bold text-sm">
                שגיאה בשליחה, נסו שוב
              </p>
            )}

            <div className="text-center">
              <button
                type="submit"
                disabled={updateStatus === 'sending'}
                className="px-12 py-3 rounded-lg bg-shefel-red text-shefel-yellow font-display font-bold text-lg hover:bg-shefel-black transition-colors disabled:opacity-50"
              >
                {updateStatus === 'sending' ? 'שולח...' : 'שליחה'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Contact Form */}
      <div className="bg-shefel-yellow rounded-lg border-4 border-shefel-red p-8 mt-8">
        <h2 className="font-display font-bold text-shefel-red text-3xl text-center mb-6">
          השאירו הודעה
        </h2>

        {status === 'sent' ? (
          <div className="text-center py-8">
            <p className="font-display font-bold text-shefel-red text-xl">
              ההודעה נשלחה בהצלחה!
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-4 font-body font-bold text-sm px-4 py-2 rounded-full bg-shefel-red text-shefel-yellow hover:bg-shefel-black transition-colors"
            >
              שליחת הודעה נוספת
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-body font-bold text-shefel-red text-xl mb-1">
                שם *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-shefel-red/30 focus:border-shefel-red outline-none font-body text-shefel-black"
              />
            </div>

            <div>
              <label className="block font-body font-bold text-shefel-red text-xl mb-1">
                אימייל *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-shefel-red/30 focus:border-shefel-red outline-none font-body text-shefel-black"
              />
            </div>

            <div>
              <label className="block font-body font-bold text-shefel-red text-xl mb-1">
                הודעה *
              </label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-shefel-red/30 focus:border-shefel-red outline-none font-body text-shefel-black resize-none"
              />
            </div>

            {status === 'error' && (
              <p className="font-body text-shefel-red font-bold text-sm">
                שגיאה בשליחה, נסו שוב
              </p>
            )}

            <div className="text-center">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="px-12 py-3 rounded-lg bg-shefel-red text-shefel-yellow font-display font-bold text-lg hover:bg-shefel-black transition-colors disabled:opacity-50"
              >
                {status === 'sending' ? 'שולח...' : 'שליחה'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
