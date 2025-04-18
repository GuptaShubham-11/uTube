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
  Subscription,
  Video,
  Home,
  Signup,
  Login,
  Search,
} from './pages';

function App() {
  const theme = useSelector((state) => state.theme.theme);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    const user = JSON.parse(localStorage.getItem('user'));
    const accessToken = localStorage.getItem('accessToken');

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
    { path: '/channel/:id', element: isAuthenticated ? <ChannelPage /> : <Navigate to="/login" /> },
    {
      path: '/subscription',
      element: isAuthenticated ? <Subscription /> : <Navigate to="/login" />,
    },
    { path: '/video', element: isAuthenticated ? <Video /> : <Navigate to="/login" /> },
    { path: '/search', element: isAuthenticated ? <Search /> : <Navigate to="/login" /> },
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
