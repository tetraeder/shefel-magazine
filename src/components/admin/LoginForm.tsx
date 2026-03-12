import { useState } from 'react';
import type { FormEvent } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getAppAuth } from '../../firebase';
import { useNavigate } from 'react-router-dom';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(getAppAuth(), email, password);
      navigate('/admin');
    } catch {
      setError('שם משתמש או סיסמה שגויים');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-shefel-yellow flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-shefel-white rounded-lg border-4 border-shefel-red p-8 w-full max-w-md"
      >
        <h1 className="font-display font-black text-shefel-red text-3xl text-center mb-6">
          כניסת מנהל
        </h1>

        {error && (
          <div className="bg-shefel-red text-shefel-white rounded p-3 mb-4 text-center font-body text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block font-body font-bold text-shefel-black text-sm mb-1">
            אימייל
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border-2 border-shefel-red rounded px-3 py-2 font-body text-shefel-black focus:outline-none focus:ring-2 focus:ring-shefel-red"
            dir="ltr"
          />
        </div>

        <div className="mb-6">
          <label className="block font-body font-bold text-shefel-black text-sm mb-1">
            סיסמה
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border-2 border-shefel-red rounded px-3 py-2 font-body text-shefel-black focus:outline-none focus:ring-2 focus:ring-shefel-red"
            dir="ltr"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-shefel-red text-shefel-white font-display font-bold py-3 rounded
            hover:bg-shefel-black transition-colors disabled:opacity-50"
        >
          {loading ? 'מתחבר...' : 'התחבר'}
        </button>
      </form>
    </div>
  );
}
