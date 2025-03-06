import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Shield, Home, Lock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = React.useState('');
  const [isEmailFocused, setIsEmailFocused] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // const { error } = await supabase.auth.resetPasswordForEmail(email, {
      //   redirectTo: `${window.location.origin}/reset-password`,
      // });

      // if (error) throw error;
      
      setIsSubmitted(true);
      toast.success('Instructions envoyées par email');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Shield,
      title: "Sécurité Garantie",
      description: "Processus de réinitialisation sécurisé et fiable"
    },
    {
      icon: Lock,
      title: "Confidentialité",
      description: "Vos données sont protégées et cryptées"
    },
    {
      icon: CheckCircle,
      title: "Simple et Rapide",
      description: "Récupérez l'accès à votre compte en quelques minutes"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
      {/* Home Link */}
      <div className="absolute top-8 left-8">
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-colors"
        >
          <Home className="h-4 w-4 mr-2" />
          Accueil
        </Link>
      </div>

      <div className="flex min-h-screen">
        {/* Left side - Form */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Mot de passe oublié ?
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Pas de panique ! Nous allons vous aider à récupérer votre compte.
              </p>
            </div>

            <div className="mt-8">
              <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
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
                          placeholder="user@grouptiajob.com"
                        />
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
                            <span className="ml-2">Envoi en cours...</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span>Réinitialiser le mot de passe</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </div>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Instructions envoyées</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Nous vous avons envoyé un email contenant les instructions pour réinitialiser votre mot de passe.
                      Vérifiez votre boîte de réception.
                    </p>
                    <div className="mt-6">
                      <Link
                        to="/sign-in"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Retour à la connexion
                      </Link>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <div className="text-sm text-center">
                    <Link
                      to="/sign-in"
                      className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                    >
                      Retour à la connexion
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Features */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:bg-indigo-700 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000')] bg-cover bg-center opacity-10"></div>
          <div className="relative max-w-md mx-auto">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white">
                Récupération de compte sécurisée
              </h2>
              <p className="mt-4 text-lg text-indigo-200">
                Nous prenons la sécurité de votre compte au sérieux
              </p>
            </div>

            <div className="mt-12">
              <div className="space-y-10">
                {features.map((feature, index) => {
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
          </div>
        </div>
      </div>
    </div>
  );
}