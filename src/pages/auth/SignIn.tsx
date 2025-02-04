import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { signIn } from '../../store/slices/authSlice';
import { Mail, Lock, ArrowRight, Home } from 'lucide-react';

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isEmailFocused, setIsEmailFocused] = React.useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await dispatch(signIn({ email, password })).unwrap();
      if (result) {
        if (result.role === 'company') {
          navigate('/dashboard/jobs');
        } else if (result.role === 'candidate') {
          navigate('/dashboard/applications');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Échec de la connexion:', error);
    }
  };

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'invalid_credentials':
        return 'Email ou mot de passe incorrect';
      case 'Invalid login credentials':
        return 'Identifiants de connexion invalides';
      default:
        return error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
      {/* Lien Accueil */}
      <div className="absolute top-8 left-8">
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-colors"
        >
          <Home className="h-4 w-4 mr-2" />
          Retour à l'accueil
        </Link>
      </div>

      <div className="flex min-h-screen">
        {/* Formulaire */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Connexion
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Pas encore de compte ?{' '}
                <Link to="/sign-up" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                  Inscrivez-vous
                </Link>
              </p>
            </div>

            <div className="mt-8">
              <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md" role="alert">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">
                            {getErrorMessage(error)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label 
                      htmlFor="email" 
                      className={`block text-sm font-medium transition-colors duration-200 ${
                        isEmailFocused ? 'text-indigo-600' : 'text-gray-700'
                      }`}
                    >
                      Adresse e-mail
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail 
                          className={`h-5 w-5 transition-colors duration-200 ${
                            isEmailFocused ? 'text-indigo-600' : 'text-gray-400'
                          }`} 
                        />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setIsEmailFocused(true)}
                        onBlur={() => setIsEmailFocused(false)}
                        className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                          isEmailFocused ? 'border-indigo-600' : 'border-gray-300'
                        } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 sm:text-sm`}
                        placeholder="vous@exemple.fr"
                      />
                    </div>
                  </div>

                  <div>
                    <label 
                      htmlFor="password" 
                      className={`block text-sm font-medium transition-colors duration-200 ${
                        isPasswordFocused ? 'text-indigo-600' : 'text-gray-700'
                      }`}
                    >
                      Mot de passe
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock 
                          className={`h-5 w-5 transition-colors duration-200 ${
                            isPasswordFocused ? 'text-indigo-600' : 'text-gray-400'
                          }`} 
                        />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                          isPasswordFocused ? 'border-indigo-600' : 'border-gray-300'
                        } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 sm:text-sm`}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <Link
                        to="/forgot-password"
                        className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                      >
                        Mot de passe oublié ?
                      </Link>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span className="ml-2">Connexion en cours...</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span>Se connecter</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Section droite - Fonctionnalités */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:bg-indigo-700 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000')] bg-cover bg-center opacity-10"></div>
          <div className="relative max-w-md mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Bienvenue sur notre plateforme
            </h2>
            <p className="mt-4 text-lg text-indigo-200">
              Connectez-vous pour accéder à votre espace personnel et gérer vos opportunités professionnelles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}