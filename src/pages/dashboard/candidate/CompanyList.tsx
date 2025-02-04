import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Globe, Users, Star, ChevronRight } from 'lucide-react';

export default function CompanyList() {
  // Mock data - À remplacer par des données réelles de l'API
  const companies = [
    {
      id: '1',
      name: 'Tech Corp',
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
      industry: 'Technologie',
      location: 'Paris, France',
      size: '500-1000',
      description: 'Leader dans le développement de solutions innovantes',
      rating: 4.5,
      jobCount: 12,
      following: true,
    },
    {
      id: '2',
      name: 'Innovate Inc',
      logo: 'https://images.unsplash.com/photo-1549421263-5ec394a5ad4c?w=100&h=100&fit=crop',
      industry: 'Intelligence Artificielle',
      location: 'Lyon, France',
      size: '100-500',
      description: 'Startup spécialisée en IA et machine learning',
      rating: 4.2,
      jobCount: 8,
      following: false,
    },
    {
      id: '3',
      name: 'Future Labs',
      logo: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=100&h=100&fit=crop',
      industry: 'Recherche & Développement',
      location: 'Bordeaux, France',
      size: '50-100',
      description: 'Pionnier dans la recherche et développement durable',
      rating: 4.8,
      jobCount: 5,
      following: true,
    },
  ];

  const toggleFollow = (companyId: string) => {
    // Implémenter la logique pour suivre/ne plus suivre une entreprise
    console.log('Toggle follow for company:', companyId);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Entreprises suivies</h1>
        <Link
          to="/companies"
          className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
        >
          Découvrir plus d'entreprises
        </Link>
      </div>

      <div className="mt-8 grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {companies.map((company) => (
          <div
            key={company.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="ml-4">
                    <h2 className="text-lg font-medium text-gray-900">{company.name}</h2>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="ml-1 text-sm text-gray-600">{company.rating}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleFollow(company.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    company.following
                      ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {company.following ? 'Suivi' : 'Suivre'}
                </button>
              </div>

              <p className="mt-4 text-sm text-gray-600 line-clamp-2">
                {company.description}
              </p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Building2 className="h-4 w-4 mr-2" />
                  {company.industry}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  {company.location}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2" />
                  {company.size} employés
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {company.jobCount} offres d'emploi
                </div>
                <Link
                  to={`/companies/${company.id}`}
                  className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Voir le profil
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}