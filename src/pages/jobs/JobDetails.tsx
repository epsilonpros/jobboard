import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin, Building2, Clock, Briefcase, DollarSign, ArrowLeft, Share2, Globe, Users, ChevronRight, Eye, Calendar, CheckCircle, XCircle, Star, ExternalLink, Heart } from 'lucide-react';
import { AppDispatch, RootState } from '../../store';
import { fetchJobDetails, clearSelectedJob, fetchJobs } from '../../store/slices/jobsSlice';
import { applyToJob } from '../../store/slices/applicationsSlice';
import toast from 'react-hot-toast';
import { AdvancedImage } from '@cloudinary/react';
import {getCloudinaryImage} from "../../lib/utils.ts";

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { selectedJob: job, loading, jobs } = useSelector((state: RootState) => state.jobs);
  const [showApplyModal, setShowApplyModal] = React.useState(false);
  const [coverLetter, setCoverLetter] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      dispatch(fetchJobDetails(id));
      dispatch(fetchJobs({})); // Pour les offres similaires
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
      title: `${job.title} chez ${job.company.name}`,
      text: `Découvrez cette opportunité : ${job.title} chez ${job.company.name}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Lien copié dans le presse-papier !');
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
    }
  };

  const getSimilarJobs = () => {
    if (!job || !jobs) return [];
    return jobs
      .filter(j => 
        j.id !== job.id && 
        (j.type === job.type || 
         j.location === job.location ||
         j.title.toLowerCase().includes(job.title.toLowerCase()))
      )
      .slice(0, 3);
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Non spécifié';
    if (!max) return `${min.toLocaleString()} $+`;
    if (!min) return `Jusqu'à ${max.toLocaleString()} $`;
    return `${min.toLocaleString()} $ - ${max.toLocaleString()} $`;
  };

  if (loading || !job) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const isOwnJob = user?.role === 'company' && user.company === job.company.id;
  const similarJobs = getSimilarJobs();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-indigo-700 py-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/50 to-indigo-900/30"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <Link to="/jobs" className="inline-flex items-center text-indigo-100 hover:text-white">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour aux offres
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isSaved 
                    ? 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Heart className={`h-5 w-5 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Sauvegardé' : 'Sauvegarder'}
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-white/10 text-white hover:bg-white/20"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Partager
              </button>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">{job.title}</h1>
            <div className="flex items-center justify-center space-x-4 text-indigo-100">
              <div className="flex items-center">
                <Link
                  to={`/companies/${job.company?.['@id']?.split('/').pop()}`}
                  className="flex items-center hover:text-white"
                >
                  <Building2 className="h-5 w-5 mr-2" />
                  {job.company.name}
                </Link>
                {job.featured && (
                  <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Star className="h-3 w-3 mr-1" />
                    En vedette
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <MapPin className="h-5 w-5 text-indigo-200 mr-2" />
              <span className="text-white">{job.location} {job.remote && '(Télétravail)'}</span>
            </div>
            <div className="flex items-center justify-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <Briefcase className="h-5 w-5 text-indigo-200 mr-2" />
              <span className="text-white">
                {job.type === 'full-time' ? 'CDI' : 
                 job.type === 'part-time' ? 'CDD' : 
                 job.type === 'contract' ? 'Freelance' : 'Stage'}
              </span>
            </div>
            <div className="flex items-center justify-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <DollarSign className="h-5 w-5 text-indigo-200 mr-2" />
              <span className="text-white">{formatSalary(job.salaryMin, job.salaryMax)}</span>
            </div>
            <div className="flex items-center justify-center p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <Calendar className="h-5 w-5 text-indigo-200 mr-2" />
              <span className="text-white">Expire le {new Date(job.expiresAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Description du poste</h2>
              <div className="prose max-w-none">
                {job.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-600 leading-relaxed">{paragraph}</p>
                ))}
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">Prérequis</h2>
              <ul className="space-y-4">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Offres similaires</h2>
                <div className="grid gap-6">
                  {similarJobs.map((similarJob) => (
                    <Link
                      key={similarJob.id}
                      to={`/jobs/${similarJob.id}`}
                      className="group block p-6 rounded-xl border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600">
                            {similarJob.title}
                          </h3>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <Building2 className="h-4 w-4 mr-1.5" />
                            {similarJob.company.name}
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-500" />
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1.5" />
                          {similarJob.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <DollarSign className="h-4 w-4 mr-1.5" />
                          {formatSalary(similarJob.salaryMin, similarJob.salaryMax)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-6">
                {job.company.logoUrl ? (
                  <div className="h-16 w-16 rounded-lg object-cover">
                    <AdvancedImage cldImg={getCloudinaryImage(job.company?.logoUrl)}/>
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-indigo-600" />
                  </div>
                )}
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{job.company.name}</h3>
                  {job.company.verified && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      Vérifié
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {job.company.description && (
                  <p className="text-sm text-gray-600 leading-relaxed">{job.company.description}</p>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{job.company.size || 'Taille non spécifiée'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{job.company.industry || 'Secteur non spécifié'}</span>
                </div>
                {job.company.website && (
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    <Globe className="h-5 w-5 mr-2" />
                    Visiter le site web
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                )}
              </div>
            </div>

            {/* Action Button */}
            {!isOwnJob && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                {user ? (
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
                  >
                    Postuler maintenant
                  </button>
                ) : (
                  <div className="space-y-4">
                    <Link
                      to="/sign-in"
                      className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
                    >
                      Se connecter pour postuler
                    </Link>
                    <p className="text-sm text-center text-gray-500">
                      Pas encore de compte ?{' '}
                      <Link to="/sign-up" className="text-indigo-600 hover:text-indigo-500 font-medium">
                        S'inscrire
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Postuler pour {job.title}</h2>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-6">
              <div>
                <label htmlFor="coverLetter" className="block text-lg font-medium text-gray-900 mb-2">
                  Lettre de motivation
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Expliquez pourquoi vous êtes le candidat idéal pour ce poste et ce qui vous distingue.
                </p>
                <textarea
                  id="coverLetter"
                  rows={8}
                  className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  required
                  placeholder="Cher recruteur..."
                ></textarea>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-6 py-3 text-base font-medium text-gray-700 hover:text-gray-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma candidature'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}