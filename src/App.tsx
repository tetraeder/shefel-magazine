import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ContentProviderWrapper } from './contexts/ContentContext';
import { Shell } from './components/layout/Shell';
import { AuthGuard } from './guards/AuthGuard';
import { AdminLayout } from './components/admin/AdminLayout';
import { LoginForm } from './components/admin/LoginForm';
import { HomePage } from './pages/public/HomePage';
import { IssuePage } from './pages/public/IssuePage';
import { TagPage } from './pages/public/TagPage';
import { ArchivePage } from './pages/public/ArchivePage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { FestivalPage } from './pages/public/FestivalPage';
import { AccessibilityPage } from './pages/public/AccessibilityPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { PostsPage } from './pages/admin/PostsPage';
import { TagsPage } from './pages/admin/TagsPage';
import { IssuesPage } from './pages/admin/IssuesPage';
import { MediaPage } from './pages/public/MediaPage';
import { MediaAdminPage } from './pages/admin/MediaAdminPage';
import { SeedPage } from './pages/admin/SeedPage';
import { NamesAdminPage } from './pages/admin/NamesAdminPage';
import { EmbedPage } from './pages/public/EmbedPage';
import { NameGeneratorPage } from './pages/public/NameGeneratorPage';

const router = createBrowserRouter([
  {
    element: <Shell />,
    children: [
      { path: '/', element: <MediaPage /> },
      { path: '/media', element: <MediaPage /> },
      { path: '/magazine', element: <HomePage /> },
      { path: '/issue/:year/:month', element: <IssuePage /> },
      { path: '/tag/:slug', element: <TagPage /> },
      { path: '/archive', element: <ArchivePage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/90seconds', element: <FestivalPage /> },
      { path: '/accessibility', element: <AccessibilityPage /> },
      { path: '/embed', element: <EmbedPage /> },
      { path: '/name', element: <NameGeneratorPage /> },
    ],
  },
  {
    path: '/admin/login',
    element: <LoginForm />,
  },
  {
    path: '/admin',
    element: <AuthGuard />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'posts', element: <PostsPage /> },
          { path: 'tags', element: <TagsPage /> },
          { path: 'issues', element: <IssuesPage /> },
          { path: 'media', element: <MediaAdminPage /> },
          { path: 'names', element: <NamesAdminPage /> },
          { path: 'seed', element: <SeedPage /> },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <ContentProviderWrapper>
        <RouterProvider router={router} />
      </ContentProviderWrapper>
    </AuthProvider>
  );
}

export default App;
