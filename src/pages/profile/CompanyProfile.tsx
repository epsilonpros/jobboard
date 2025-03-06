import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {fetchProfile, updateCompanyProfile} from '../../store/slices/profileSlice';
import { Building2, MapPin, Globe, Users, Briefcase } from 'lucide-react';
import { Field } from '../../components/ui/Field';

export default function CompanyProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, data } = useSelector((state: RootState) => state.profile);
  const [formData, setFormData] = React.useState(data);

  useEffect(() => {
    dispatch(fetchProfile())
  }, []);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(updateCompanyProfile(formData));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Informations de l'entreprise</h3>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Logo Upload */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">Logo de l'entreprise</label>
                <div className="mt-1 flex items-center">
                  <div className="h-32 w-32 rounded-lg overflow-hidden bg-gray-100">
                    {formData?.logo_url ? (
                      <img
                        src={formData?.logo_url}
                        alt="Company logo"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Building2 className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="logo-upload"
                    className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    Changer le logo
                    <input
                      id="logo-upload"
                      name="logo"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              <div className="sm:col-span-4">
                <Field
                  label="Nom de l'entreprise"
                  name="name"
                  type="text"
                  value={formData?.name || ''}
                  onChange={handleChange}
                  icon={Building2}
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <Field
                  label="Secteur d'activité"
                  name="industry"
                  type="select"
                  value={formData?.industry || ''}
                  onChange={handleChange}
                  icon={Briefcase}
                  options={[
                    { value: '', label: 'Sélectionnez un secteur' },
                    { value: 'technology', label: 'Technologie' },
                    { value: 'healthcare', label: 'Santé' },
                    { value: 'finance', label: 'Finance' },
                    { value: 'education', label: 'Éducation' },
                    { value: 'retail', label: 'Commerce' },
                    { value: 'manufacturing', label: 'Industrie' },
                    { value: 'other', label: 'Autre' }
                  ]}
                />
              </div>

              <div className="sm:col-span-3">
                <Field
                  label="Taille de l'entreprise"
                  name="size"
                  type="select"
                  value={formData?.size || ''}
                  onChange={handleChange}
                  icon={Users}
                  options={[
                    { value: '', label: 'Sélectionnez une taille' },
                    { value: '1-10', label: '1-10 employés' },
                    { value: '11-50', label: '11-50 employés' },
                    { value: '51-200', label: '51-200 employés' },
                    { value: '201-500', label: '201-500 employés' },
                    { value: '501-1000', label: '501-1000 employés' },
                    { value: '1000+', label: '1000+ employés' }
                  ]}
                />
              </div>

              <div className="sm:col-span-6">
                <Field
                  label="Description de l'entreprise"
                  name="description"
                  type="textarea"
                  value={formData?.description || ''}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Décrivez votre entreprise, sa mission, ses valeurs et sa culture..."
                />
              </div>

              <div className="sm:col-span-3">
                <Field
                  label="Site web"
                  name="website"
                  type="url"
                  value={formData?.website || ''}
                  onChange={handleChange}
                  icon={Globe}
                  placeholder="https://www.example.com"
                />
              </div>

              <div className="sm:col-span-3">
                <Field
                  label="Localisation"
                  name="location"
                  type="text"
                  value={formData?.location || ''}
                  onChange={handleChange}
                  icon={MapPin}
                  placeholder="ex: Kinshasa, RDC"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  );
}