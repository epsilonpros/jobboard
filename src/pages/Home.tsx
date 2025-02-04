import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Briefcase, Users, Building2, TrendingUp, Globe, Shield, Zap, ChevronRight, MapPin, ArrowRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category.toLowerCase());
    navigate(`/jobs?category=${encodeURIComponent(category.toLowerCase())}`);
  };

  const handlePopularSearch = (term: string) => {
    setSearchTerm(term);
    navigate(`/jobs?search=${encodeURIComponent(term)}`);
  };

  return (
    <div className="relative">
      <div className="relative w-full bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/50 to-indigo-900/30"></div>
        </div>

        <div className="relative max-w-[90rem] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen px-4 sm:px-6 lg:px-8 py-24 lg:pt-20 lg:pb-32">
            <div className="text-left space-y-8">
              <div className="space-y-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/20 text-indigo-200">
                  #1 Plateforme de Recrutement en République démocratique du congo
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white">
                  <span className="block">Trouvez le Job</span>
                  <span className="block mt-2 text-indigo-400">de Vos Rêves</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 max-w-xl">
                  Connectez-vous avec les meilleures entreprises et découvrez des opportunités qui correspondent à vos ambitions.
                </p>
              </div>

              <div className="max-w-2xl">
                <form onSubmit={handleSearch} className="relative">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Quel poste recherchez-vous ?"
                        className="w-full px-6 py-4 rounded-xl bg-white/95 backdrop-blur-sm border-2 border-transparent focus:border-indigo-500 focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500"
                      />
                      <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    <button
                      type="submit"
                      className="sm:w-auto w-full inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      Rechercher
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </form>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-gray-400 text-sm">Recherches populaires:</span>
                  {['Développeur', 'Marketing', 'Design', 'Commercial'].map((term) => (
                    <button
                      key={term}
                      onClick={() => handlePopularSearch(term)}
                      className="text-sm text-indigo-300 hover:text-white transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
                {[
                  { label: 'Offres Actives', value: '2 500+' },
                  { label: 'Entreprises', value: '1 200+' },
                  { label: 'Candidats', value: '50 000+' },
                  { label: 'Recrutements', value: '10 000+' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 transform hover:scale-105 transition-all duration-300"
                  >
                    <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-gray-300 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Offres en Vedette</h3>
                <div className="space-y-4">
                  {[
                    { id: '1', title: 'Senior Developer', company: 'Tech Corp', location: 'Paris' },
                    { id: '2', title: 'Product Manager', company: 'Innovate Inc', location: 'Lyon' },
                    { id: '3', title: 'UX Designer', company: 'Future Labs', location: 'Bordeaux' },
                  ].map((job) => (
                    <Link
                      key={job.id}
                      to={`/jobs/${job.id}`}
                      className="block bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                          <Briefcase className="h-6 w-6 text-indigo-300" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{job.title}</h4>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-300">
                            <span className="flex items-center">
                              <Building2 className="h-4 w-4 mr-1" />
                              {job.company}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  to="/jobs"
                  className="mt-4 inline-flex items-center text-indigo-300 hover:text-white text-sm"
                >
                  Voir toutes les offres
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative bg-white py-16 sm:py-24 px-4 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Parcourir par Catégorie</h2>
            <p className="mt-3 text-xl text-gray-500">Trouvez des opportunités dans votre domaine d'expertise</p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Technologie', icon: Zap, count: 234 },
              { name: 'Business', icon: TrendingUp, count: 156 },
              { name: 'Design', icon: Globe, count: 98 },
              { name: 'Marketing', icon: Users, count: 145 },
            ].map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`group relative rounded-xl border p-6 text-left transition-all hover:border-indigo-600 ${
                    selectedCategory === category.name.toLowerCase()
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`h-8 w-8 ${
                      selectedCategory === category.name.toLowerCase()
                        ? 'text-indigo-600'
                        : 'text-gray-400 group-hover:text-indigo-600'
                    }`} />
                    <span className="text-sm font-medium text-gray-500">{category.count} offres</span>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">{category.name}</h3>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-16 sm:py-24 px-4 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Entreprises en Vedette
            </h2>
            <p className="mt-3 text-xl text-gray-500">
              Découvrez des entreprises innovantes qui recrutent activement
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: '1',
                name: 'Tech Corp',
                logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
                jobs: 12,
                description: 'Leader dans le développement de solutions innovantes',
                industry: 'Technologie',
                location: 'Paris, France',
                benefits: ['Télétravail flexible', 'Formation continue', 'RTT'],
              },
              {
                id: '2',
                name: 'Innovate Inc',
                logo: 'https://images.unsplash.com/photo-1549421263-5ec394a5ad4c?w=100&h=100&fit=crop',
                jobs: 8,
                description: 'Startup en pleine croissance spécialisée en IA',
                industry: 'Intelligence Artificielle',
                location: 'Lyon, France',
                benefits: ['Stock-options', 'Horaires flexibles', 'Événements d\'équipe'],
              },
              {
                id: '3',
                name: 'Future Labs',
                logo: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=100&h=100&fit=crop',
                jobs: 15,
                description: 'Pionnier dans la recherche et développement durable',
                industry: 'Recherche & Développement',
                location: 'Bordeaux, France',
                benefits: ['Prime annuelle', 'Mutuelle familiale', 'Formation à l\'étranger'],
              },
            ].map((company) => (
              <div 
                key={company.id} 
                className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-48 w-full bg-indigo-600">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-700 opacity-90"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="h-24 w-24 rounded-lg object-cover border-4 border-white shadow-lg"
                    />
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{company.name}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {company.jobs} postes
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">{company.description}</p>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <Building2 className="h-4 w-4 mr-2" />
                      {company.industry}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      {company.location}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Avantages clés :</h4>
                    <div className="flex flex-wrap gap-2">
                      {company.benefits.map((benefit) => (
                        <span
                          key={benefit}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <Link
                      to={`/companies/${company.id}`}
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
                    >
                      Voir le profil
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                    <Link
                      to={`/companies/${company.id}/jobs`}
                      className="inline-flex items-center px-3 py-1.5 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 hover:bg-indigo-50"
                    >
                      Voir les offres
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/companies"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Découvrir plus d'entreprises
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white py-16 sm:py-24 px-4 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Pourquoi Nous Choisir</h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Nous fournissons les outils et les ressources nécessaires pour réussir votre parcours professionnel
            </p>
          </div>

          <div className="mt-16">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: Globe,
                  title: 'Opportunités Mondiales',
                  description: 'Accédez à des emplois d\'entreprises du monde entier et travaillez de n\'importe où',
                },
                {
                  icon: Shield,
                  title: 'Entreprises Vérifiées',
                  description: 'Toutes les entreprises sont soigneusement évaluées pour garantir des opportunités légitimes',
                },
                {
                  icon: Zap,
                  title: 'Matching Intelligent',
                  description: 'Notre système alimenté par l\'IA vous met en relation avec les postes les plus pertinents',
                },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="relative p-8 bg-white rounded-2xl shadow-sm border border-gray-200 hover:border-indigo-600 transition-colors">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="rounded-full bg-indigo-600 p-3 shadow-lg">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="pt-4 text-center">
                      <h3 className="text-xl font-medium text-gray-900 mt-8">{feature.title}</h3>
                      <p className="mt-4 text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="relative bg-indigo-700 px-4 sm:px-12 lg:px-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2000')] bg-cover bg-center opacity-10"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Prêt à Franchir le Pas ?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-indigo-100">
              Rejoignez des milliers de professionnels qui trouvent leur emploi de rêve chaque jour
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                to="/sign-up"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
              >
                Créer un Compte
              </Link>
              <Link
                to="/jobs"
                className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-600"
              >
                Parcourir les Offres
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}