import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin, Building2, Clock, Briefcase, DollarSign, ArrowLeft, Share2, Globe, Users, ChevronRight, Eye } from 'lucide-react';
import { AppDispatch, RootState } from '../../store';
import { fetchJobDetails, clearSelectedJob } from '../../store/slices/jobsSlice';
import { applyToJob } from '../../store/slices/applicationsSlice';
import toast from 'react-hot-toast';

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { selectedJob: job, loading } = useSelector((state: RootState) => state.jobs);
  const [showApplyModal, setShowApplyModal] = React.useState(false);
  const [coverLetter, setCoverLetter] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      dispatch(fetchJobDetails(id));
    }
    return () => {
      dispatch(clearSelectedJob());
    };
  }, [dispatch, id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !job) return;

    setIsSubmitting(true);
    try {
      await dispatch(applyToJob({
        job_id: job.id as string,
        cover_letter: coverLetter,
      })).unwrap();

      setShowApplyModal(false);
      navigate('/dashboard/applications');
    } catch (error) {
      // Error is handled by the slice
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    if (!job) return;

    const shareData = {
      title: `${job.title} at ${job.company.name}`,
      text: `Check out this job opportunity: ${job.title} at ${job.company.name}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading || !job) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const isOwnJob = user?.role === 'company' && user.company === job.company.id;
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Not specified';
    if (!max) return `$${min.toLocaleString()}+`;
    if (!min) return `Up to $${max.toLocaleString()}`;
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <Link to="/jobs" className="inline-flex items-center text-indigo-600 hover:text-indigo-500">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour aux emplois
        </Link>
        <button
          onClick={handleShare}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Share2 className="h-5 w-5 mr-2" />
          Partager
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              {job.company.logo_url ? (
                <img
                  src={job.company.logo_url}
                  alt={job.company.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-indigo-600" />
                </div>
              )}
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                <div className="mt-1 flex items-center">
                  <Link
                    to={`/companies/${job.company.id}`}
                    className="text-lg text-indigo-600 hover:text-indigo-500"
                  >
                    {job.company.name}
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-gray-500 text-sm">
                <Eye className="h-4 w-4 mr-1" />
                {job.views || 0} vues
              </div>
              {job.featured && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  En vedette
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center text-gray-500">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{job.location} {job.remote && '(Télétravail)'}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Briefcase className="h-5 w-5 mr-2" />
              <span className="capitalize">{job.type.replace('-', ' ')}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <DollarSign className="h-5 w-5 mr-2" />
              <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Clock className="h-5 w-5 mr-2" />
              <span>Publié {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description de l'emploi</h2>
              {job.description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-600">{paragraph}</p>
              ))}

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Exigences</h2>
              <ul className="list-disc pl-5 space-y-2">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="text-gray-600">{requirement}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Company Info */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">À propos de l'entreprise</h3>
              <div className="space-y-4">
                {job.company.description && (
                  <p className="text-sm text-gray-600">{job.company.description}</p>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{job.company.size || 'Company size not specified'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="h-5 w-5 mr-2" />
                  <span>{job.company.industry || 'Industry not specified'}</span>
                </div>
                {job.company.website && (
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    <Globe className="h-5 w-5 mr-2" />
                    Visitez le site Web
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </a>
                )}
              </div>
            </div>

            {/* Action Button */}
            {!isOwnJob && (
              <div className="flex flex-col space-y-4">
                {user ? (
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Postulez maintenant
                  </button>
                ) : (
                  <>
                    <Link
                      to="/sign-in"
                      className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Connectez-vous pour postuler
                    </Link>
                    <p className="text-sm text-center text-gray-500">
                      Vous n'avez pas de compte ?{' '}
                      <Link to="/sign-up" className="text-indigo-600 hover:text-indigo-500">
                        S'inscrire
                      </Link>
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Postulez pour {job.title}</h2>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleApply}>
              <div className="mb-6">
                <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                  Lettre de motivation
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  Expliquez pourquoi vous êtes le candidat idéal pour ce poste et ce qui vous distingue.
                </p>
                <textarea
                  id="coverLetter"
                  rows={8}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  required
                  placeholder="Dear Hiring Manager..."
                ></textarea>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Soumission...' : 'Soumettre une demande'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}