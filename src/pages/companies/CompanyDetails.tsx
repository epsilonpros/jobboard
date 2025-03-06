import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, MapPin, Globe, Users, Briefcase, Star, ExternalLink, Mail, Clock, DollarSign, ChevronRight } from 'lucide-react';
import { ApiGeneric } from "../../api";
import toast from 'react-hot-toast';

interface CompanyDetails {
  id: string;
  name: string;
  description: string;
  logo_url: string | null;
  industry: string;
  size: string;
  location: string;
  website: string | null;
  verified: boolean;
  jobs: Array<{
    id: string;
    title: string;
    type: string;
    location: string;
    remote: boolean;
    salaryMin?: number;
    salaryMax?: number;
    createdAt: string;
    requirements: string[];
  }>;
}

export default function CompanyDetails() {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = React.useState<CompanyDetails | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) {
      setError('ID de l\'entreprise non spécifié');
      setLoading(false);
      return;
    }
    
    fetchCompanyDetails();
  }, [id]);

  const fetchCompanyDetails = async () => {
    try {
      const api = new ApiGeneric();
      const data = await api.onSend(`/api/companies/${id}`);
      setCompany(data);
    } catch (error: any) {
      console.error('Erreur lors du chargement des détails de l\'entreprise:', error);
      setError('Impossible de charger les détails de l\'entreprise');
      toast.error('Erreur lors du chargement des détails de l\'entreprise');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Entreprise non trouvée</h3>
          <p className="mt-2 text-gray-500">{error || 'Cette entreprise n\'existe pas ou a été supprimée.'}</p>
          <Link
            to="/companies"
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Retour aux entreprises
          </Link>
        </div>
      </div>
    );
  }

  const displaySalary = (min?: number, max?: number) => {
    if(min && max) {
      return `${min.toLocaleString()} $ - ${max.toLocaleString()} $`;
    } else if(min) {
      return `À partir de ${min.toLocaleString()} $`;
    } else if(max) {
      return `Jusqu'à ${max.toLocaleString()} $`;
    }
    return 'Non spécifié';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-indigo-700">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/50 to-indigo-900/30"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <Link to="/companies" className="text-indigo-100 hover:text-white">
              ← Retour aux entreprises
            </Link>
          </div>

          <div className="flex items-center">
            <div className="h-24 w-24 rounded-xl bg-white p-2 shadow-lg">
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={company.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Building2 className="h-12 w-12 text-indigo-600" />
                </div>
              )}
            </div>
            <div className="ml-6">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold text-white">{company.name}</h1>
                {company.verified && (
                  <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Star className="h-3 w-3 mr-1" />
                    Vérifié
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-center text-indigo-100">
                <MapPin className="h-5 w-5 mr-2" />
                {company.location}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">À propos de {company.name}</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {company.description}
                </p>
              </div>
            </div>

            {/* Current Openings */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Offres d'emploi actuelles</h2>
              {company.jobs?.length > 0 ? (
                <div className="space-y-6">
                  {company.jobs.map((job) => (
                    <Link
                      key={job.id}
                      to={`/jobs/${job.id}`}
                      className="block p-6 rounded-xl border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600">
                            {job.title}
                          </h3>
                          <div className="mt-2 grid grid-cols-2 gap-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="h-4 w-4 mr-1.5" />
                              {job.location} {job.remote && '(Télétravail)'}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1.5" />
                              {job.type === 'full-time' ? 'CDI' : 
                               job.type === 'part-time' ? 'CDD' : 
                               job.type === 'contract' ? 'Freelance' : 'Stage'}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <DollarSign className="h-4 w-4 mr-1.5" />
                              {displaySalary(job.salaryMin, job.salaryMax)}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1.5" />
                              {new Date(job.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-500" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune offre disponible</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Cette entreprise n'a pas d'offres d'emploi actuellement.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informations</h3>
              <div className="space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{company.industry || 'Secteur non spécifié'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{company.size || 'Taille non spécifiée'}</span>
                </div>
                {company.website && (
                  <a
                    href={company.website}
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

            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact</h3>
              <button
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Mail className="h-5 w-5 mr-2" />
                Contacter l'entreprise
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}