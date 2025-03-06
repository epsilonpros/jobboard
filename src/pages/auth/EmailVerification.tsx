import React from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Mail, ArrowRight, Shield, CheckCircle, AlertCircle, Home } from 'lucide-react';
import toast from 'react-hot-toast';
import {ApiGeneric} from "../../api";

const api = new ApiGeneric()
export default function EmailVerification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [code, setCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isVerified, setIsVerified] = React.useState(false);

  const email = searchParams.get('email');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !code) return;

    setLoading(true);
    try {
      await api.onSend(`/api/verify-email/${code}`);

      setIsVerified(true);
      toast.success('Email vérifié avec succès !');
      
      // Redirection après un court délai
      setTimeout(() => {
        navigate('/sign-in');
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la vérification');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;

    try {
      await api.onSend(`/api/verify-email/resend`,{
        method: 'POST',
        data: {email},
        headers: {
            'Content-Type': 'application/json'
        }
      });
      
      toast.success('Un nouveau code a été envoyé');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'envoi du code');
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="rounded-full bg-red-100 p-3 mx-auto w-fit">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Email manquant</h2>
          <p className="mt-2 text-gray-600">
            L'adresse email est requise pour la vérification.
          </p>
          <Link
            to="/sign-up"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Retour à l'inscription
          </Link>
        </div>
      </div>
    );
  }

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
            {isVerified ? (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Email vérifié</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Votre email a été vérifié avec succès. Vous allez être redirigé...
                </p>
                <Link
                  to="/sign-in"
                  className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Aller à la connexion
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold text-gray-900">
                    Vérification de l'email
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Entrez le code reçu à l'adresse {email}
                  </p>
                </div>

                <div className="mt-8">
                  <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                          Code de vérification
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Shield className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="code"
                            required
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 sm:text-sm"
                            placeholder="Entrez le code à 8 chiffres"
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
                              <span className="ml-2">Vérification...</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <span>Vérifier l'email</span>
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </div>
                          )}
                        </button>
                      </div>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={handleResendCode}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Renvoyer le code
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right side - Features */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:bg-indigo-700 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000')] bg-cover bg-center opacity-10"></div>
          <div className="relative max-w-md mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Sécurisez votre compte
            </h2>
            <p className="mt-4 text-lg text-indigo-200">
              La vérification de votre email nous permet de sécuriser votre compte et de vous protéger contre les accès non autorisés.
            </p>

            <div className="mt-12 space-y-10">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <Shield className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4 text-left">
                  <h3 className="text-xl font-medium text-white">Protection renforcée</h3>
                  <p className="mt-2 text-base text-indigo-200">
                    La vérification en deux étapes assure une sécurité optimale pour votre compte.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <Mail className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4 text-left">
                  <h3 className="text-xl font-medium text-white">Communication sécurisée</h3>
                  <p className="mt-2 text-base text-indigo-200">
                    Recevez des notifications importantes concernant votre compte en toute sécurité.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}