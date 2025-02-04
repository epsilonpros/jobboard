import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { signUp } from '../../store/slices/authSlice';
import { Mail, Lock, ArrowRight, Building2, User, ChevronLeft, Briefcase, MapPin, Globe, Shield, Users, Clock, Home } from 'lucide-react';

export default function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const [step, setStep] = React.useState<'select-type' | 'candidate' | 'company'>('select-type');
  const [role, setRole] = React.useState<'company' | 'candidate' | null>(null);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isEmailFocused, setIsEmailFocused] = React.useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = React.useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || password !== confirmPassword) return;
    
    const result = await dispatch(signUp({ email, password, role }));
    if (!result.error) {
      navigate('/dashboard');
    }
  };

  const accountTypes = [
    {
      id: 'candidate',
      title: 'Candidat',
      description: 'Je cherche un emploi',
      icon: User,
      color: 'indigo',
      features: [
        {
          icon: Briefcase,
          title: "Accès aux Offres",
          description: "Trouvez des opportunités adaptées à votre profil"
        },
        {
          icon: Clock,
          title: "Candidature Simplifiée",
          description: "Postulez en un clic et suivez vos candidatures"
        },
        {
          icon: Shield,
          title: "Profil Sécurisé",
          description: "Gérez vos informations en toute confidentialité"
        }
      ]
    },
    {
      id: 'company',
      title: 'Entreprise',
      description: 'Je recrute des talents',
      icon: Building2,
      color: 'emerald',
      features: [
        {
          icon: Users,
          title: "Gestion des Talents",
          description: "Accédez à une base de candidats qualifiés"
        },
        {
          icon: Globe,
          title: "Visibilité Maximale",
          description: "Diffusez vos offres auprès des meilleurs profils"
        },
        {
          icon: MapPin,
          title: "Recrutement Efficace",
          description: "Outils avancés de sélection et d'entretien"
        }
      ]
    }
  ];

  const selectedType = accountTypes.find(type => type.id === role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
      {/* Add Home Link */}
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
        {/* Left side - Form */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="text-center">
              {step === 'select-type' ? (
                <>
                  <h2 className="text-3xl font-extrabold text-gray-900">
                    Créer un compte
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Déjà inscrit ?{' '}
                    <Link to="/sign-in" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                      Connectez-vous
                    </Link>
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-extrabold text-gray-900">
                    {role === 'candidate' ? 'Inscription Candidat' : 'Inscription Entreprise'}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Commencez votre aventure avec nous
                  </p>
                </>
              )}
            </div>

            <div className="mt-8">
              <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10">
                {step === 'select-type' ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      {accountTypes.map((type) => {
                        const Icon = type.icon;
                        const isSelected = role === type.id;
                        const colorClasses = type.color === 'indigo' 
                          ? 'hover:border-indigo-500 hover:bg-indigo-50 group-hover:text-indigo-600'
                          : 'hover:border-emerald-500 hover:bg-emerald-50 group-hover:text-emerald-600';
                        const selectedClasses = type.color === 'indigo'
                          ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500'
                          : 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500';

                        return (
                          <button
                            key={type.id}
                            onClick={() => {
                              setRole(type.id as 'company' | 'candidate');
                              setStep(type.id as 'company' | 'candidate');
                            }}
                            className={`group relative rounded-2xl border-2 p-6 text-left transition-all hover:shadow-md focus:outline-none ${
                              isSelected ? selectedClasses : `border-gray-300 ${colorClasses}`
                            }`}
                          >
                            <div className="flex items-center space-x-4">
                              <div className={`rounded-xl p-3 ${
                                isSelected 
                                  ? type.color === 'indigo' ? 'bg-indigo-500' : 'bg-emerald-500'
                                  : 'bg-gray-100 group-hover:bg-white'
                              }`}>
                                <Icon className={`h-6 w-6 ${
                                  isSelected ? 'text-white' : 'text-gray-500 group-hover:text-gray-600'
                                }`} />
                              </div>
                              <div>
                                <p className={`text-lg font-medium ${
                                  isSelected 
                                    ? type.color === 'indigo' ? 'text-indigo-700' : 'text-emerald-700'
                                    : 'text-gray-900'
                                }`}>
                                  {type.title}
                                </p>
                                <p className="text-sm text-gray-500">{type.description}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() => setStep('select-type')}
                      className="mb-6 inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Retour
                    </button>

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
                              <p className="text-sm text-red-700">{error}</p>
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
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setIsPasswordFocused(true)}
                            onBlur={() => setIsPasswordFocused(false)}
                            className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                              isPasswordFocused ? 'border-indigo-600' : 'border-gray-300'
                            } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 sm:text-sm`}
                            placeholder="Minimum 8 caractères"
                          />
                        </div>
                      </div>

                      <div>
                        <label 
                          htmlFor="confirm-password" 
                          className={`block text-sm font-medium transition-colors duration-200 ${
                            isConfirmPasswordFocused ? 'text-indigo-600' : 'text-gray-700'
                          }`}
                        >
                          Confirmer le mot de passe
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock 
                              className={`h-5 w-5 transition-colors duration-200 ${
                                isConfirmPasswordFocused ? 'text-indigo-600' : 'text-gray-400'
                              }`} 
                            />
                          </div>
                          <input
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onFocus={() => setIsConfirmPasswordFocused(true)}
                            onBlur={() => setIsConfirmPasswordFocused(false)}
                            className={`appearance-none block w-full pl-10 pr-3 py-3 border ${
                              isConfirmPasswordFocused ? 'border-indigo-600' : 'border-gray-300'
                            } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 sm:text-sm`}
                            placeholder="Confirmez votre mot de passe"
                          />
                        </div>
                      </div>

                      <div>
                        <button
                          type="submit"
                          disabled={loading || password !== confirmPassword}
                          className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          {loading ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              <span className="ml-2">Création en cours...</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <span>Créer mon compte</span>
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </div>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Features */}
        {selectedType && step !== 'select-type' && (
          <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:bg-indigo-700 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000')] bg-cover bg-center opacity-10"></div>
            <div className="relative max-w-md mx-auto">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-white">
                  {role === 'candidate' ? 'Trouvez votre emploi idéal' : 'Recrutez les meilleurs talents'}
                </h2>
                <p className="mt-4 text-lg text-indigo-200">
                  {role === 'candidate' 
                    ? 'Accédez à des milliers d\'opportunités professionnelles'
                    : 'Construisez une équipe performante avec les meilleurs profils'
                  }
                </p>
              </div>

              <div className="mt-12">
                <div className="space-y-10">
                  {selectedType.features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                            <Icon className="h-6 w-6" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-xl font-medium text-white">{feature.title}</h3>
                          <p className="mt-2 text-base text-indigo-200">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-12">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { number: role === 'candidate' ? '10,000+' : '50,000+', 
                      label: role === 'candidate' ? 'Offres' : 'Candidats' },
                    { number: '2,500+', label: 'Entreprises' },
                    { number: '95%', label: 'Satisfaction' },
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <p className="text-2xl font-bold text-white">{stat.number}</p>
                      <p className="text-sm text-indigo-200">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}