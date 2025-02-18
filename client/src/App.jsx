import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login } from './features/authSlice.js';
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
  const dispatch = useDispatch();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    const accessToken = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user'));

    if (accessToken && user) {
      dispatch(login({ accessToken, user, refreshToken: null }));
    }
  }, [theme, dispatch]);

  const routes = [
    { path: '/', element: isAuthenticated ? <Videos /> : <Home /> },
    { path: '/signup', element: isAuthenticated ? <Navigate to="/" /> : <Signup /> },
    { path: '/login', element: isAuthenticated ? <Navigate to="/" /> : <Login /> },
    { path: '/videos', element: isAuthenticated ? <Videos /> : <Navigate to="/login" /> },
    { path: '/upload', element: isAuthenticated ? <UploadVideo /> : <Navigate to="/login" /> },
    { path: '/me', element: isAuthenticated ? <ChannelPage /> : <Navigate to="/login" /> },
    { path: '/subscribed', element: isAuthenticated ? <Subscribed /> : <Navigate to="/login" /> },
    { path: '/video', element: isAuthenticated ? <Video /> : <Navigate to="/login" /> },
    { path: '*', element: <NotFound /> },
  ];

  return (
    <Router>
      <Layout>
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
