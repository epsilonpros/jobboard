import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center">
            <AlertCircle className="h-12 w-12 text-indigo-600" />
          </div>
        </div>
        
        <h1 className="mt-8 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          Page introuvable
        </h1>
        
        <p className="mt-4 text-base text-gray-500">
          Désolé, nous n'avons pas trouvé la page que vous recherchez. La page a peut-être été supprimée, 
          renommée ou est temporairement indisponible.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Home className="h-5 w-5 mr-2" />
            Retour à l'accueil
          </Link>
          
          <Link
            to="/jobs"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Search className="h-5 w-5 mr-2" />
            Parcourir les offres
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>
            Si vous pensez qu'il s'agit d'une erreur, veuillez{' '}
            <Link to="/contact" className="text-indigo-600 hover:text-indigo-500">
              contacter notre support
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}