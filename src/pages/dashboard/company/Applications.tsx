import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { fetchApplications } from '../../../store/slices/applicationsSlice';
import { User, Calendar, CheckCircle, XCircle, Clock, Mail, Phone, Download, FileText } from 'lucide-react';
import type { Application } from '../../../types';
import { ApiGeneric } from "../../../api";
import toast from 'react-hot-toast';

const api = new ApiGeneric();

export default function CompanyApplications() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { applications, loading, hasMore } = useSelector((state: RootState) => state.applications);
  const [page, setPage] = React.useState(1);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const observerTarget = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    dispatch(fetchApplications({ page: 1 }));
  }, [dispatch]);

  const loadMore = React.useCallback(async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;
    await dispatch(fetchApplications({ page: nextPage }));
    setPage(nextPage);
    setLoadingMore(false);
  }, [dispatch, page, loadingMore, hasMore]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading && !loadingMore && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loading, loadingMore, hasMore, loadMore]);

  const updateApplicationStatus = async (applicationId: string, status: Application['status']) => {
    try {
      await api.onSend(`/api/applications/${applicationId}/status`, {
        method: "PUT",
        data: {
          status
        },
        headers: {
          "Content-Type": 'application/json'
        }
      });

      toast.success('Le statut a été mis à jour avec succès !');
      navigate(0);
    } catch (e) {
      toast.error('Le statut n\'a pas été mis à jour !');
    }
  };

  const handleDownloadCV = async (application: Application) => {
    try {
      // Priorité au CV spécifique à la candidature
      const cvUrl = application.resume_url || application.candidate?.resume_url;
      
      if (!cvUrl) {
        toast.error('Aucun CV disponible pour ce candidat');
        return;
      }

      // Si l'URL est de Cloudinary, on la télécharge directement
      if (cvUrl.includes('cloudinary.com')) {
        window.open(cvUrl, '_blank');
      } else {
        // Sinon, on passe par notre API pour le téléchargement
        const response = await api.onSend(`/api/applications/${application.id}/cv`, {
          responseType: 'blob'
        });
        
        // Créer un lien temporaire pour le téléchargement
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `CV_${application.candidate?.firstName}_${application.candidate?.lastName}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      toast.error('Erreur lors du téléchargement du CV');
    }
  };

  const handleDownloadCoverLetter = async (application: Application) => {
    try {
      if (!application.coverLetter) {
        toast.error('Aucune lettre de motivation disponible');
        return;
      }

      // Créer un fichier texte à partir de la lettre de motivation
      const blob = new Blob([application.coverLetter], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `LM_${application.candidate?.firstName}_${application.candidate?.lastName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Erreur lors du téléchargement de la lettre de motivation');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Candidatures reçues</h1>

      <div className="mt-8">
        {loading && page === 1 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center bg-white py-12 px-4 shadow rounded-lg">
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune candidature reçue</h3>
            <p className="mt-1 text-sm text-gray-500">Les candidatures apparaîtront ici une fois que vous recevrez des postulations.</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {applications.map((application) => (
                <li key={application.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900">
                            {application.candidate?.firstName} {application.candidate?.lastName}
                          </h4>
                          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Mail className="flex-shrink-0 mr-1.5 h-4 w-4" />
                              {application.candidate?.email}
                            </span>
                            {application.candidate?.phone && (
                              <span className="flex items-center">
                                <Phone className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                {application.candidate?.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="ml-6">
                        <select
                          value={application.status}
                          onChange={(e) => updateApplicationStatus(application.id, e.target.value as Application['status'])}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                          <option value="pending">En attente</option>
                          <option value="reviewing">En cours d'examen</option>
                          <option value="accepted">Acceptée</option>
                          <option value="rejected">Refusée</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm text-gray-900 font-medium">
                        Candidature pour : {application.job.title}
                      </div>
                      {application.coverLetter && (
                        <div className="mt-2 text-sm text-gray-700">
                          <div className="bg-gray-50 p-4 rounded-md">
                            {application.coverLetter}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5" />
                        Reçue le {new Date(application.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleDownloadCV(application)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          CV
                        </button>
                        {application.coverLetter && (
                          <button
                            onClick={() => handleDownloadCoverLetter(application)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Lettre de motivation
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Loading indicator for infinite scroll */}
            <div ref={observerTarget} className="flex justify-center py-4">
              {loadingMore && (
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
              )}
            </div>

            {/* End of list message */}
            {!hasMore && applications.length > 0 && (
              <div className="text-center py-4 text-gray-500">
                Vous avez atteint la fin de la liste
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}