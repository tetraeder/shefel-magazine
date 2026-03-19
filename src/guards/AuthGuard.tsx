import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Spinner } from '../components/ui/Spinner';

export function AuthGuard() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-shefel-yellow flex items-center justify-center px-4">
        <div className="bg-shefel-white rounded-lg border-4 border-shefel-red p-8 w-full max-w-md text-center">
          <h1 className="font-black text-shefel-red text-2xl mb-4">אין הרשאה</h1>
          <p className="font-body text-shefel-black text-lg">אין לך הרשאות מנהל לגשת לעמוד זה.</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
