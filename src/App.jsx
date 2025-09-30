import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './styles/global.css';

function App() {
  const location = useLocation();
  const isPublicRoute = ['/', '/login', '/accept-invitation'].includes(location.pathname);

  return (
    <div className="app">
      {!isPublicRoute && <Navbar />}
      <main>
        <Outlet />
      </main>
      {!isPublicRoute && <Footer />}
    </div>
  );
}

export default App;