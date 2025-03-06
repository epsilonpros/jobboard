import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {fetchProfile, updateCandidateProfile} from '../../store/slices/profileSlice';
import { Briefcase, GraduationCap, Award, MapPin, Mail, Globe, Github, Linkedin, User, Building2, Calendar } from 'lucide-react';
import { Field } from '../../components/ui/Field';

export default function CandidateProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, data } = useSelector((state: RootState) => state.profile);

  const [experiences, setExperiences] = React.useState([
    { id: '', company: '', title: '', startDate: '', endDate: '', current: false, description: '' }
  ]);

  const [education, setEducation] = React.useState([
    { id: '', school: '', degree: '', field: '', startDate: '', endDate: '' }
  ]);

  const [skills, setSkills] = React.useState([{id: '', name: ''}]);

  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    title: '',
    bio: '',
    location: '',
    portfolio_url: '',
    github_url: '',
    linkedin_url: '',
    available_for_hire: true,
    willing_to_relocate: false,
  });

  useEffect(() => {
    dispatch(fetchProfile())
  }, []);

  useEffect(() => {
    setFormData(data);
    setExperiences(data?.experiences ?? [{ id: '', company: '', title: '', startDate: '', endDate: '', current: false, description: '' }])
    setEducation(data?.education ?? [{ id: '', school: '', degree: '', field: '', startDate: '', endDate: '' }])
    setSkills(data?.skills ?? [{id: '', name: ''}])
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(updateCandidateProfile({
      ...formData,
      experiences: experiences.filter(exp => exp.company && exp.title),
      education: education.filter(edu => edu.school && edu.degree),
      skills: skills.filter(Boolean),
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      { id: '', company: '', title: '', startDate: '', endDate: '', current: false, description: '' }
    ]);
  };

  const addEducation = () => {
    setEducation([
      ...education,
      { id: '', school: '', degree: '', field: '', startDate: '', endDate: '' }
    ]);
  };

  const addSkill = () => {
    setSkills([...skills, {id: '', name: ''}]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Informations de base</h3>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <Field
                  label="Prénom"
                  name="firstName"
                  type="text"
                  value={formData?.firstName}
                  onChange={handleChange}
                  icon={User}
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <Field
                  label="Nom"
                  name="lastName"
                  type="text"
                  value={formData?.lastName}
                  onChange={handleChange}
                  icon={User}
                  required
                />
              </div>

              <div className="sm:col-span-6">
                <Field
                  label="Titre professionnel"
                  name="title"
                  type="text"
                  value={formData?.title}
                  onChange={handleChange}
                  icon={Briefcase}
                  placeholder="ex: Développeur Full Stack Senior"
                  helperText="Votre poste actuel ou le titre qui décrit le mieux votre profil"
                />
              </div>

              <div className="sm:col-span-6">
                <Field
                  label="Bio"
                  name="bio"
                  type="textarea"
                  value={formData?.bio}
                  onChange={handleChange}
                  placeholder="Présentez-vous en quelques lignes..."
                  helperText="Une brève description de votre parcours, vos compétences et vos objectifs"
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Expérience professionnelle</h3>
              <button
                type="button"
                onClick={addExperience}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                Ajouter une expérience
              </button>
            </div>
            <div className="mt-6 space-y-6">
              {experiences.map((experience, index) => (
                <div key={index} className="border-b border-gray-200 pb-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <Field
                        label="Entreprise"
                        name={`experiences.${index}.company`}
                        type="text"
                        value={experience.company}
                        onChange={(e) => {
                          const newExperiences = [...experiences];
                          newExperiences[index].company = e.target.value;
                          setExperiences(newExperiences);
                        }}
                        icon={Building2}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <Field
                        label="Poste"
                        name={`experiences.${index}.title`}
                        type="text"
                        value={experience.title}
                        onChange={(e) => {
                          const newExperiences = [...experiences];
                          newExperiences[index].title = e.target.value;
                          setExperiences(newExperiences);
                        }}
                        icon={Briefcase}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <Field
                        label="Date de début"
                        name={`experiences.${index}.startDate`}
                        type="date"
                        value={experience.startDate}
                        onChange={(e) => {
                          const newExperiences = [...experiences];
                          newExperiences[index].startDate = e.target.value;
                          setExperiences(newExperiences);
                        }}
                        icon={Calendar}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <Field
                        label="Date de fin"
                        name={`experiences.${index}.endDate`}
                        type="date"
                        value={experience.endDate}
                        onChange={(e) => {
                          const newExperiences = [...experiences];
                          newExperiences[index].endDate = e.target.value;
                          setExperiences(newExperiences);
                        }}
                        icon={Calendar}
                        disabled={experience.current}
                      />
                    </div>

                    <div className="sm:col-span-6">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={experience.current}
                          onChange={(e) => {
                            const newExperiences = [...experiences];
                            newExperiences[index].current = e.target.checked;
                            if (e.target.checked) {
                              newExperiences[index].endDate = '';
                            }
                            setExperiences(newExperiences);
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                          Je travaille actuellement ici
                        </label>
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <Field
                        label="Description"
                        name={`experiences.${index}.description`}
                        type="textarea"
                        value={experience.description}
                        onChange={(e) => {
                          const newExperiences = [...experiences];
                          newExperiences[index].description = e.target.value;
                          setExperiences(newExperiences);
                        }}
                        rows={3}
                        placeholder="Décrivez vos responsabilités et réalisations..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Formation</h3>
              <button
                type="button"
                onClick={addEducation}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                Ajouter une formation
              </button>
            </div>
            <div className="mt-6 space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="border-b border-gray-200 pb-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <Field
                        label="École / Université"
                        name={`education.${index}.school`}
                        type="text"
                        value={edu.school}
                        onChange={(e) => {
                          const newEducation = [...education];
                          newEducation[index].school = e.target.value;
                          setEducation(newEducation);
                        }}
                        icon={GraduationCap}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <Field
                        label="Diplôme"
                        name={`education.${index}.degree`}
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const newEducation = [...education];
                          newEducation[index].degree = e.target.value;
                          setEducation(newEducation);
                        }}
                        icon={Award}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <Field
                        label="Domaine d'études"
                        name={`education.${index}.field`}
                        type="text"
                        value={edu.field}
                        onChange={(e) => {
                          const newEducation = [...education];
                          newEducation[index].field = e.target.value;
                          setEducation(newEducation);
                        }}
                        icon={GraduationCap}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <Field
                        label="Date de début"
                        name={`education.${index}.startDate`}
                        type="date"
                        value={edu.startDate}
                        onChange={(e) => {
                          const newEducation = [...education];
                          newEducation[index].startDate = e.target.value;
                          setEducation(newEducation);
                        }}
                        icon={Calendar}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <Field
                        label="Date de fin"
                        name={`education.${index}.endDate`}
                        type="date"
                        value={edu.endDate}
                        onChange={(e) => {
                          const newEducation = [...education];
                          newEducation[index].endDate = e.target.value;
                          setEducation(newEducation);
                        }}
                        icon={Calendar}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Compétences</h3>
              <button
                type="button"
                onClick={addSkill}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                Ajouter une compétence
              </button>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              {skills.map((skill, index) => (
                <Field
                  key={index}
                  label={index === 0 ? "Compétence" : ""}
                  name={`skills.${index}.name`}
                  type="text"
                  value={skill.name}
                  onChange={(e) => {
                    const newSkills = [...skills];
                    newSkills[index].name = e.target.value;
                    setSkills(newSkills);
                  }}
                  placeholder="ex: JavaScript"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Links and Preferences */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Liens et préférences</h3>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <Field
                  label="Portfolio URL"
                  name="portfolio_url"
                  type="url"
                  value={formData?.portfolio_url}
                  onChange={handleChange}
                  icon={Globe}
                  placeholder="https://portfolio.com"
                />
              </div>

              <div className="sm:col-span-3">
                <Field
                  label="LinkedIn URL"
                  name="linkedin_url"
                  type="url"
                  value={formData?.linkedin_url}
                  onChange={handleChange}
                  icon={Linkedin}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="sm:col-span-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="available_for_hire"
                      name="available_for_hire"
                      type="checkbox"
                      checked={formData?.available_for_hire}
                      onChange={(e) => setFormData({ ...formData, available_for_hire: e.target.checked })}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="available_for_hire" className="font-medium text-gray-700">
                      Disponible pour un emploi
                    </label>
                    <p className="text-gray-500">Indiquez aux recruteurs que vous êtes ouvert aux opportunités</p>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="willing_to_relocate"
                      name="willing_to_relocate"
                      type="checkbox"
                      checked={formData?.willing_to_relocate}
                      onChange={(e) => setFormData({ ...formData, willing_to_relocate: e.target.checked })}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="willing_to_relocate" className="font-medium text-gray-700">
                      Prêt à déménager
                    </label>
                    <p className="text-gray-500">Indiquez si vous êtes ouvert aux opportunités dans d'autres villes</p>
                  </div>
                </div>
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
            {loading ? 'Enregistrement...' : 'Enregistrer le profil'}
          </button>
        </div>
      </form>
    </div>
  );
}