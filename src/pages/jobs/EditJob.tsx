import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchJobDetails, updateJob } from '../../store/slices/jobsSlice';
import { Briefcase, MapPin, DollarSign, Calendar, Clock, Globe, Building2, Trash2, Plus, AlertCircle, Info } from 'lucide-react';
import { Company, Job } from "../../types";
import { Field } from '../../components/ui/Field';
import { jobSchema } from '../../lib/validations/job';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { JobFormData } from '../../lib/validations/job';

export default function EditJob() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedJob: job, loading } = useSelector((state: RootState) => state.jobs);
  const { user } = useSelector((state: RootState) => state.auth);

  const [step, setStep] = React.useState<'basics' | 'details' | 'preview'>('basics');
  const [requirements, setRequirements] = React.useState<string[]>(['']);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue,
    reset
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'full-time',
      location: '',
      remote: false,
      salaryMin: '',
      salaryMax: '',
      expiresAt: '',
      status: 'draft',
      featured: false,
      requirements: ['']
    }
  });

  React.useEffect(() => {
    if (id) {
      dispatch(fetchJobDetails(id));
    }
  }, [dispatch, id]);

  React.useEffect(() => {
    if (job) {
      reset({
        title: job.title,
        description: job.description,
        type: job.type,
        location: job.location,
        remote: job.remote,
        salaryMin: job.salaryMin?.toString() || '',
        salaryMax: job.salaryMax?.toString() || '',
        expiresAt: new Date(job.expiresAt).toISOString().split('T')[0],
        status: job.status,
        featured: job.featured,
        requirements: job.requirements.length > 0 ? job.requirements : ['']
      });
      setRequirements(job.requirements.length > 0 ? job.requirements : ['']);
    }
  }, [job, reset]);

  const formData = watch();

  const onSubmit = async (data: JobFormData) => {
    if (!user || !id) return;

    try {
      await dispatch(updateJob({
        id,
        ...data,
        company: '/api/companies/'+(user as Company).company as any,
        requirements: data.requirements.filter(Boolean),
        salaryMin: data.salaryMin ? parseInt(data.salaryMin as string) : undefined,
        salaryMax: data.salaryMax ? parseInt(data.salaryMax as string) : undefined,
      }));

      navigate('/dashboard/jobs');
    } catch (e) {}
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    if (index === newRequirements.length - 1 && value) {
      newRequirements.push('');
    }
    setRequirements(newRequirements);
    setValue('requirements', newRequirements);
  };

  const removeRequirement = (index: number) => {
    const newRequirements = requirements.filter((_, i) => i !== index);
    setRequirements(newRequirements);
    setValue('requirements', newRequirements);
  };

  const validateStep = async (nextStep: typeof step) => {
    let fieldsToValidate: (keyof JobFormData)[] = [];

    if (nextStep === 'details' && step === 'basics') {
      fieldsToValidate = ['title', 'type', 'location', 'salaryMin', 'salaryMax', 'expiresAt'];
    } else if (nextStep === 'preview' && step === 'details') {
      fieldsToValidate = ['description', 'requirements'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(nextStep);
    }
    return isValid;
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-4">
        {['basics', 'details', 'preview'].map((s, index) => (
          <React.Fragment key={s}>
            <button
              type="button"
              onClick={async () => {
                if (await validateStep(s as typeof step)) {
                  setStep(s as typeof step);
                }
              }}
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
      <Field
        label="Titre du poste"
        {...register('title')}
        type="text"
        required
        error={errors.title?.message}
        icon={Briefcase}
        placeholder="ex: Développeur Full Stack Senior React/Node.js"
        helperText="Choisissez un titre clair et précis qui reflète le poste. Incluez le niveau d'expérience et les technologies principales."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field
          label="Type de contrat"
          {...register('type')}
          type="select"
          required
          error={errors.type?.message}
          icon={Clock}
          options={[
            { value: 'full-time', label: 'CDI - Temps plein' },
            { value: 'part-time', label: 'CDD - Temps partiel' },
            { value: 'contract', label: 'Freelance / Consultant' },
            { value: 'internship', label: 'Stage' }
          ]}
          helperText="Le type de contrat détermine la nature de la relation de travail."
        />

        <Field
          label="Localisation"
          {...register('location')}
          type="text"
          required
          error={errors.location?.message}
          icon={MapPin}
          placeholder="ex: Kinshasa, RDC"
          helperText="Indiquez la ville et le pays où le poste est basé."
        />
      </div>

      <div className="flex items-center">
        <input
          {...register('remote')}
          type="checkbox"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="remote" className="ml-2 block text-sm text-gray-700">
          Télétravail possible
        </label>
        <Info className="h-4 w-4 ml-2 text-gray-400 cursor-help" title="Cochez cette case si le poste peut être exercé en télétravail" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field
          label="Salaire minimum (annuel)"
          {...register('salaryMin')}
          type="number"
          error={errors.salaryMin?.message}
          icon={DollarSign}
          placeholder="ex: 45000"
          min={0}
        />

        <Field
          label="Salaire maximum (annuel)"
          {...register('salaryMax')}
          type="number"
          error={errors.salaryMax?.message}
          icon={DollarSign}
          placeholder="ex: 65000"
          min={0}
        />
      </div>

      <Field
        label="Date d'expiration"
        {...register('expiresAt')}
        type="date"
        required
        error={errors.expiresAt?.message}
        icon={Calendar}
        min={new Date().toISOString().split('T')[0]}
        helperText="L'offre sera automatiquement désactivée après cette date."
      />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={async () => {
            if (await validateStep('details')) {
              setStep('details');
            }
          }}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Suivant
        </button>
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <Field
        label="Description du poste"
        {...register('description')}
        type="textarea"
        required
        error={errors.description?.message}
        placeholder={`Décrivez le poste en détail, incluant :
- Les responsabilités principales
- L'environnement de travail
- Les technologies utilisées
- Les opportunités d'évolution
- Les avantages proposés`}
        helperText="Une description détaillée et structurée augmente la qualité des candidatures reçues."
        rows={8}
      />

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Prérequis <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => {
              const newRequirements = [...requirements, ''];
              setRequirements(newRequirements);
              setValue('requirements', newRequirements);
            }}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </button>
        </div>
        <div className="space-y-2">
          {requirements.map((requirement, index) => (
            <div key={index} className="flex items-center gap-2">
              <Field
                label=""
                name={`requirements.${index}`}
                value={requirement}
                onChange={(e) => handleRequirementChange(index, e.target.value)}
                error={index === 0 ? errors.requirements?.message : undefined}
                placeholder={`ex: ${
                  index === 0 ? "5 ans d'expérience en développement web" :
                  index === 1 ? "Maîtrise de React.js et Node.js" :
                  index === 2 ? "Excellentes capacités de communication" :
                  "Autre prérequis"
                }`}
              />
              {index !== requirements.length - 1 && (
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
        <Field
          label="Statut de l'offre"
          {...register('status')}
          type="select"
          options={[
            { value: 'draft', label: 'Brouillon - Enregistrer pour plus tard' },
            { value: 'published', label: 'Publier - Visible immédiatement' }
          ]}
          helperText="En brouillon, l'offre ne sera visible que par vous jusqu'à sa publication."
        />

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
          onClick={async () => {
            if (await validateStep('preview')) {
              setStep('preview');
            }
          }}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Aperçu
        </button>
      </div>
    </div>
  );

  const displaySalary = () => {
    if(formData.salaryMin && formData.salaryMax){
      return `${parseInt(formData.salaryMin as string).toLocaleString()} $ - ${parseInt(formData.salaryMax as string).toLocaleString()} $`
    }else if(formData.salaryMin){
      return `À partir de ${parseInt(formData.salaryMin as string).toLocaleString()} $`
    }else if(formData.salaryMax){
      return `Jusqu'à ${parseInt(formData.salaryMax as string).toLocaleString()} $`
    }

    return 'Non spécifié'
  }

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
              <span>{formData.type === 'full-time' ? 'CDI - Temps plein' : formData.type === 'part-time' ? 'CDD - Temps partiel' : formData.type === 'contract' ? 'Freelance' : 'Stage'}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{formData.location} {formData.remote && '(Télétravail possible)'}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <DollarSign className="h-5 w-5 mr-2" />
              <span>{displaySalary()}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Calendar className="h-5 w-5 mr-2" />
              <span>Expire le {new Date(formData.expiresAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Description du poste</h3>
            <div className="whitespace-pre-wrap text-gray-600">
              {formData.description}
            </div>

            <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">Prérequis</h3>
            <ul className="list-disc pl-5 space-y-2">
              {requirements.filter(Boolean).map((requirement, index) => (
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
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Modifier l'offre d'emploi</h1>
          <p className="mt-2 text-sm text-gray-600">
            Modifiez les informations de votre offre d'emploi
          </p>
        </div>

        {renderStepIndicator()}

        <form className="bg-white shadow-lg rounded-lg p-6 mb-8" onSubmit={handleSubmit(onSubmit)}>
          {step === 'basics' && renderBasicsStep()}
          {step === 'details' && renderDetailsStep()}
          {step === 'preview' && renderPreviewStep()}
        </form>
      </div>
    </div>
  );
}