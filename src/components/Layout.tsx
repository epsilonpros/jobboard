import React, {useEffect} from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {setUser, signOut} from '../store/slices/authSlice';
import { Briefcase, Menu, X, User, Bell } from 'lucide-react';
import twfs from '../assets/tia-wfs.png';
import {ApiGeneric} from "../api";

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('tia-wfs-token');
    if(!user){
      if (token) {
        const api = new ApiGeneric()
        api.onSend('/api/me').then((data) => {
          dispatch(setUser(data));
          setLoading(false);
        }).catch(() => {
          setLoading(false);
        });
      }else {
        setLoading(false);
      }
    }else {
      setLoading(false);
    }
  }, []);

  // Navigation de base pour les visiteurs
  const publicNavigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Offres d\'emploi', href: '/jobs' },
    { name: 'Entreprises', href: '/companies' },
  ];

  // Navigation pour les utilisateurs connectés
  const userNavigation = user?.role === 'company' ? [
    // { name: 'Tableau de bord', href: '/dashboard' },
    { name: 'Offres d\'emploi', href: '/dashboard/jobs' },
    { name: 'Candidatures', href: '/dashboard/applications' },
    { name: 'Candidats', href: '/dashboard/candidates' },
  ] : (user?.role === 'admin' ? [
    { name: 'Entreprises', href: '/admin/companies' },
    { name: 'Offres d\'emploi', href: '/admin/jobs' },
    { name: 'Candidats', href: '/admin/candidates' },
  ] : [
    // { name: 'Tableau de bord', href: '/dashboard' },
    { name: 'Mes candidatures', href: '/dashboard/applications' },
    { name: 'Offres d\'emploi', href: '/jobs' },
    { name: 'Entreprises', href: '/companies' },
  ]);

  const handleSignOut = () => {
    dispatch(signOut());
    setShowProfileMenu(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-indigo-600 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <img src={twfs} alt="TIA WFS" className="h-12 w-auto animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 animate-pulse">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              {/* Logo et navigation principale */}
              <div className="flex items-center">
                <Link to="/" className="flex-shrink-0 flex items-center">
                  <img src={twfs} alt="TIA WFS" className="h-12 w-auto"/>
                </Link>

                <div className="hidden md:ml-10 md:flex md:space-x-8">
                  {(user ? userNavigation : publicNavigation).map((item) => (
                      <Link
                          key={item.name}
                          to={item.href}
                          className={`${
                              location.pathname === item.href
                                  ? 'text-indigo-600 border-indigo-600'
                                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                          } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                      >
                        {item.name}
                      </Link>
                  ))}
                </div>
              </div>

              {/* Actions utilisateur */}
              <div className="flex items-center">
                {user ? (
                    <div className="flex items-center space-x-4">
                      {/* Notifications */}
                      <button className="p-2 text-gray-400 hover:text-gray-500 transition-colors duration-200">
                        <Bell className="h-6 w-6"/>
                      </button>

                      {/* Menu profil */}
                      <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-indigo-600"/>
                          </div>
                          <span className="hidden sm:block text-sm font-medium text-gray-700">
                        {user.role === 'company' ? 'Mon entreprise' : 'Mon profil'}
                      </span>
                        </button>

                        {showProfileMenu && (
                            <div
                                className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50">
                              {user.role !== 'admin' && <Link
                                  to="/profile"
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => setShowProfileMenu(false)}
                              >
                                Paramètres
                              </Link>}
                              <button
                                  onClick={handleSignOut}
                                  className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                              >
                                Se déconnecter
                              </button>
                            </div>
                        )}
                      </div>
                    </div>
                ) : (
                    <div className="flex items-center space-x-4">
                      <Link
                          to="/sign-in"
                          className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        Se connecter
                      </Link>
                      <Link
                          to="/sign-up"
                          className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        S'inscrire
                      </Link>
                    </div>
                )}

                {/* Menu mobile */}
                <div className="flex items-center md:hidden ml-4">
                  <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                  >
                    {isMenuOpen ? (
                        <X className="block h-6 w-6"/>
                    ) : (
                        <Menu className="block h-6 w-6"/>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Menu mobile */}
          {isMenuOpen && (
              <div className="md:hidden border-t border-gray-200">
                <div className="pt-2 pb-3 space-y-1">
                  {(user ? userNavigation : publicNavigation).map((item) => (
                      <Link
                          key={item.name}
                          to={item.href}
                          className={`${
                              location.pathname === item.href
                                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                          } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200`}
                          onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                  ))}
                  {user && (
                      <>
                        <Link
                            to="/dashboard/messaging"
                            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 text-base font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                          Messagerie
                        </Link>
                        <button
                            onClick={handleSignOut}
                            className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-red-700 hover:bg-red-50 hover:border-red-300 text-base font-medium"
                        >
                          Se déconnecter
                        </button>
                      </>
                  )}
                </div>
              </div>
          )}
        </nav>

        <main className="">
          <div className="tia-wfs.pngmx-auto  ">
            <Outlet/>
          </div>
        </main>

        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
              <div className="flex space-x-6 md:order-2">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"/>
                  </svg>
                </a>
              </div>
              <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
                &copy; 2025 Tia Group. All rights reserved. by <a href="https://epsilon-pros.com" className="underline">Epsilon pros</a>
              </p>
            </div>
          </div>
        </footer>
      </div>
  );
}