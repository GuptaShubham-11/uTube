import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Layout } from './components';
import {
  Videos,
  NotFound,
  UploadVideo,
  ChannelPage,
  Subscribed,
  Video,
  Home,
  Signup,
  Login,
} from './pages';

function App() {
  const theme = useSelector((state) => state.theme.theme);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Videos /> : <Home />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
          <Route path="/videos" element={isAuthenticated ? <Videos /> : <Navigate to="/login" />} />
          <Route
            path="/upload"
            element={isAuthenticated ? <UploadVideo /> : <Navigate to="/login" />}
          />
          <Route
            path="/me"
            element={isAuthenticated ? <ChannelPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/subscribed"
            element={isAuthenticated ? <Subscribed /> : <Navigate to="/login" />}
          />
          <Route path="/video" element={isAuthenticated ? <Video /> : <Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
