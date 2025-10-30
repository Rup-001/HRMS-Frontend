import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import './styles/global.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const location = useLocation();

  const publicRoutes = ['/', '/login', '/accept-invitation'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth > 768;
      setIsDesktop(desktop);
      setIsSidebarOpen(desktop);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    // Old code for mainContent toggle
    /*
    const mainContent = document.querySelector('main');
    if (mainContent && mainContent.classList.contains('main-content')) {
      mainContent.classList.toggle('main-content-expanded');
    }
    */
    // New code for mainContent toggle for Bug #1
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.classList.toggle('main-content-expanded', !isSidebarOpen);
    }
  };

  return (
    // Old return statement
    /*
    <div className="app">
      {!isPublicRoute && (
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          isDesktop={isDesktop}
        />
      )}
              <div
                className={`main-content ${
                  isDesktop ? (isSidebarOpen ? 'main-content-shifted' : 'main-content-collapsed') : ''
                }`}>
                {!isPublicRoute && (
                  <Header
                    toggleSidebar={toggleSidebar}
                    isDesktop={isDesktop}
                    isSidebarOpen={isSidebarOpen}
                  />
                )}        <main>
          <Outlet />
        </main>
        {!isPublicRoute && <Footer />}
      </div>
    </div>
    */
    // Reverted return statement to the state before header flexibility fix
    <div className="app">
      {!isPublicRoute && (
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          isDesktop={isDesktop}
        />
      )}
      <main className={!isPublicRoute ? 'main-content' : ''}>
        {!isPublicRoute && (
          <Header
            toggleSidebar={toggleSidebar}
            isDesktop={isDesktop}
            isSidebarOpen={isSidebarOpen}
          />
        )}
        <Outlet />
      </main>
      {!isPublicRoute && <Footer />}
    </div>
  );
}

export default App;