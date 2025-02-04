import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { createJob } from '../../store/slices/jobsSlice';
import { Briefcase, MapPin, DollarSign, Calendar, Clock, Globe, Building2, Trash2, Plus, AlertCircle } from 'lucide-react';

export default function CreateJob() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.jobs);
  const { user } = useSelector((state: RootState) => state.auth);

  const [step, setStep] = React.useState<'basics' | 'details' | 'preview'>('basics');
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    requirements: [''],
    type: 'full-time',
    location: '',
    remote: false,
    salary_min: '',
    salary_max: '',
    expires_at: '',
    status: 'draft' as 'draft' | 'published',
    featured: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const result = await dispatch(createJob({
      ...formData,
      company_id: user.id,
      requirements: formData.requirements.filter(Boolean),
      salary_min: formData.salary_min ? parseInt(formData.salary_min) : undefined,
      salary_max: formData.salary_max ? parseInt(formData.salary_max) : undefined,
    }));

    if (!result.error) {
      navigate('/dashboard/jobs');
    }
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    if (index === newRequirements.length - 1 && value) {
      newRequirements.push('');
    }
    setFormData({ ...formData, requirements: newRequirements });
  };

  const removeRequirement = (index: number) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData({ ...formData, requirements: newRequirements });
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-4">
        {['basics', 'details', 'preview'].map((s, index) => (
          <React.Fragment key={s}>
            <button
              onClick={() => setStep(s as typeof step)}
              className={`flex items-center ${
                step === s 
                  ? 'text-indigo-600' 
                  : index < ['basics', 'details', 'preview'].indexOf(step)
                  ? 'text-green-600'
                  : 'text-gray-400'
              }`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step === s 
                  ? 'border-indigo-600 bg-indigo-50' 
                  : index < ['basics', 'details', 'preview'].indexOf(step)
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-300'
              }`}>
                {index + 1}
              </span>
              <span className="ml-2 font-medium capitalize hidden sm:inline">
                {s === 'basics' ? 'Informations de base' : s === 'details' ? 'Détails' : 'Aperçu'}
              </span>
            </button>
            {index < 2 && (
              <div className={`w-12 h-0.5 ${
                index < ['basics', 'details', 'preview'].indexOf(step)
                  ? 'bg-green-600'
                  : 'bg-gray-300'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderBasicsStep = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Titre du poste <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Briefcase className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg"
            placeholder="ex: Développeur Full Stack Senior"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type de contrat <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="type"
              name="type"
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as typeof formData.type })}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg"
            >
              <option value="full-time">Temps plein</option>
              <option value="part-time">Temps partiel</option>
              <option value="contract">Contrat</option>
              <option value="internship">Stage</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Localisation <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="location"
              id="location"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg"
              placeholder="ex: Paris, France"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="remote"
          name="remote"
          type="checkbox"
          checked={formData.remote}
          onChange={(e) => setFormData({ ...formData, remote: e.target.checked })}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="remote" className="ml-2 block text-sm text-gray-700">
          Télétravail possible
        </label>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="salary_min" className="block text-sm font-medium text-gray-700">
            Salaire minimum (annuel)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="salary_min"
              id="salary_min"
              value={formData.salary_min}
              onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg"
              placeholder="ex: 45000"
            />
          </div>
        </div>

        <div>
          <label htmlFor="salary_max" className="block text-sm font-medium text-gray-700">
            Salaire maximum (annuel)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="salary_max"
              id="salary_max"
              value={formData.salary_max}
              onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg"
              placeholder="ex: 65000"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="expires_at" className="block text-sm font-medium text-gray-700">
          Date d'expiration <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="date"
            name="expires_at"
            id="expires_at"
            required
            value={formData.expires_at}
            onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setStep('details')}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Suivant
        </button>
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description du poste <span className="text-red-500">*</span>
        </label>
        <div className="mt-1">
          <textarea
            id="description"
            name="description"
            rows={8}
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg"
            placeholder="Décrivez le poste, les responsabilités et le profil idéal..."
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Prérequis <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, requirements: [...formData.requirements, ''] })}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </button>
        </div>
        <div className="space-y-2">
          {formData.requirements.map((requirement, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={requirement}
                onChange={(e) => handleRequirementChange(index, e.target.value)}
                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full sm:text-sm border-gray-300 rounded-lg"
                placeholder="ex: 5 ans d'expérience en React"
              />
              {index !== formData.requirements.length - 1 && (
                <button
                  type="button"
                  onClick={() => removeRequirement(index)}
                  className="p-2 text-red-600 hover:text-red-700 rounded-md hover:bg-red-50"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Statut de l'offre
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg"
          >
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
            Mettre en avant cette offre
          </label>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep('basics')}
          className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Retour
        </button>
        <button
          type="button"
          onClick={() => setStep('preview')}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Aperçu
        </button>
      </div>
    </div>
  );

  const renderPreviewStep = () => (
    <div className="space-y-8">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{formData.title}</h2>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              formData.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {formData.status === 'published' ? 'Publié' : 'Brouillon'}
            </span>
          </div>
        </div>

        <div className="px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center text-gray-500">
              <Building2 className="h-5 w-5 mr-2" />
              <span>{formData.type === 'full-time' ? 'Temps plein' : formData.type === 'part-time' ? 'Temps partiel' : formData.type === 'contract' ? 'Contrat' : 'Stage'}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{formData.location} {formData.remote && '(Télétravail possible)'}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <DollarSign className="h-5 w-5 mr-2" />
              <span>
                {formData.salary_min && formData.salary_max
                  ? `${parseInt(formData.salary_min).toLocaleString()} € - ${parseInt(formData.salary_max).toLocaleString()} €`
                  : formData.salary_min
                  ? `À partir de ${parseInt(formData.salary_min).toLocaleString()} €`
                  : formData.salary_max
                  ? `Jusqu'à ${parseInt(formData.salary_max).toLocaleString()} €`
                  : 'Non spécifié'}
              </span>
            </div>
            <div className="flex items-center text-gray-500">
              <Calendar className="h-5 w-5 mr-2" />
              <span>Expire le {new Date(formData.expires_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Description du poste</h3>
            <div className="whitespace-pre-wrap text-gray-600">
              {formData.description}
            </div>

            <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">Prérequis</h3>
            <ul className="list-disc pl-5 space-y-2">
              {formData.requirements.filter(Boolean).map((requirement, index) => (
                <li key={index} className="text-gray-600">{requirement}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep('details')}
          className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Retour
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Publication...' : 'Publier l\'offre'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Créer une nouvelle offre d'emploi</h1>
          <p className="mt-2 text-sm text-gray-600">
            Remplissez les informations ci-dessous pour publier une nouvelle offre d'emploi
          </p>
        </div>

        {renderStepIndicator()}

        <form className="bg-white shadow-lg rounded-lg p-6 mb-8">
          {step === 'basics' && renderBasicsStep()}
          {step === 'details' && renderDetailsStep()}
          {step === 'preview' && renderPreviewStep()}
        </form>
      </div>
    </div>
  );
}