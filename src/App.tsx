import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

import { DashboardPage } from './pages/DashboardPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { CreatePostPage } from './pages/CreatePostPage';
import { SavedPostsPage } from './pages/SavedPostsPage';
import { UsersPage } from './pages/UsersPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:id" element={<UserProfilePage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/posts/create" element={<CreatePostPage />} />
            <Route path="/saved" element={<SavedPostsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
