import React from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Lock, ArrowRight, Shield, CheckCircle, Eye, EyeOff, Home } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = React.useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  // Get the token from the URL
  const token = searchParams.get('token');

  React.useEffect(() => {
    if (!token) {
      toast.error('Lien de réinitialisation invalide');
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);
    try {
      // const { error } = await supabase.auth.updateUser({
      //   password: formData.newPassword
      // });

      if (error) throw error;
      
      setIsSuccess(true);
      toast.success('Mot de passe réinitialisé avec succès !');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/sign-in');
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la réinitialisation du mot de passe');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!token) {
    return null;
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
            {isSuccess ? (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Mot de passe réinitialisé</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion...
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
                    Réinitialiser le mot de passe
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Choisissez un nouveau mot de passe sécurisé
                  </p>
                </div>

                <div className="mt-8">
                  <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* New Password */}
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                          Nouveau mot de passe
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type={showNewPassword ? "text" : "password"}
                            id="newPassword"
                            name="newPassword"
                            required
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 sm:text-sm"
                            placeholder="Au moins 8 caractères"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                          Confirmer le nouveau mot de passe
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 sm:text-sm"
                            placeholder="Confirmez votre nouveau mot de passe"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
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
                              <span className="ml-2">Réinitialisation en cours...</span>
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
              Sécurité renforcée
            </h2>
            <p className="mt-4 text-lg text-indigo-200">
              Protégez votre compte avec un mot de passe fort et unique
            </p>

            <div className="mt-12 space-y-10">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <Shield className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4 text-left">
                  <h3 className="text-xl font-medium text-white">Mot de passe sécurisé</h3>
                  <p className="mt-2 text-base text-indigo-200">
                    Utilisez un mot de passe fort avec au moins 8 caractères, des chiffres et des caractères spéciaux.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4 text-left">
                  <h3 className="text-xl font-medium text-white">Protection des données</h3>
                  <p className="mt-2 text-base text-indigo-200">
                    Vos informations sont cryptées et protégées selon les normes de sécurité les plus strictes.
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