import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {fetchProfile, updateCandidateProfile} from '../../store/slices/profileSlice';
import { Briefcase, GraduationCap, Award, MapPin, Mail, Globe, Github, Linkedin } from 'lucide-react';

export default function CandidateProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { loading,data } = useSelector((state: RootState) => state.profile);

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
    setExperiences(data?.experiences ?? [{ id: '', school: '', degree: '', field: '', startDate: '', endDate: '' }])
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
            <h3 className="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  value={formData?.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  value={formData?.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Professional Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData?.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData?.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Experience</h3>
              <button
                type="button"
                onClick={addExperience}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                Add Experience
              </button>
            </div>
            <div className="mt-6 space-y-6">
              {experiences.map((experience, index) => (
                <div key={index} className="border-b border-gray-200 pb-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">Company</label>
                      <input
                        type="text"
                        value={experience.company}
                        onChange={(e) => {
                          const newExperiences = [...experiences];
                          newExperiences[index].company = e.target.value;
                          setExperiences(newExperiences);
                        }}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        value={experience.title}
                        onChange={(e) => {
                          const newExperiences = [...experiences];
                          newExperiences[index].title = e.target.value;
                          setExperiences(newExperiences);
                        }}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">Start Date</label>
                      <input
                        type="date"
                        value={experience.startDate}
                        onChange={(e) => {
                          const newExperiences = [...experiences];
                          newExperiences[index].startDate = e.target.value;
                          setExperiences(newExperiences);
                        }}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">End Date</label>
                      <input
                        type="date"
                        value={experience.endDate}
                        disabled={experience.current}
                        onChange={(e) => {
                          const newExperiences = [...experiences];
                          newExperiences[index].endDate = e.target.value;
                          setExperiences(newExperiences);
                        }}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                          I currently work here
                        </label>
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        rows={3}
                        value={experience.description}
                        onChange={(e) => {
                          const newExperiences = [...experiences];
                          newExperiences[index].description = e.target.value;
                          setExperiences(newExperiences);
                        }}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              <h3 className="text-lg font-medium leading-6 text-gray-900">Education</h3>
              <button
                type="button"
                onClick={addEducation}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                Add Education
              </button>
            </div>
            <div className="mt-6 space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="border-b border-gray-200 pb-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">School</label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => {
                          const newEducation = [...education];
                          newEducation[index].school = e.target.value;
                          setEducation(newEducation);
                        }}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">Degree</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const newEducation = [...education];
                          newEducation[index].degree = e.target.value;
                          setEducation(newEducation);
                        }}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">Field of Study</label>
                      <input
                        type="text"
                        value={edu.field}
                        onChange={(e) => {
                          const newEducation = [...education];
                          newEducation[index].field = e.target.value;
                          setEducation(newEducation);
                        }}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">Start Date</label>
                      <input
                        type="date"
                        value={edu.startDate}
                        onChange={(e) => {
                          const newEducation = [...education];
                          newEducation[index].startDate = e.target.value;
                          setEducation(newEducation);
                        }}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">End Date</label>
                      <input
                        type="date"
                        value={edu.endDate}
                        onChange={(e) => {
                          const newEducation = [...education];
                          newEducation[index].endDate = e.target.value;
                          setEducation(newEducation);
                        }}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              <h3 className="text-lg font-medium leading-6 text-gray-900">Skills</h3>
              <button
                type="button"
                onClick={addSkill}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                Add Skill
              </button>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              {skills.map((skill, index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => {
                      const newSkills = [...skills];
                      newSkills[index].name = e.target.value;
                      setSkills(newSkills);
                    }}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g., JavaScript"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Links and Preferences */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Links and Preferences</h3>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="portfolio_url" className="block text-sm font-medium text-gray-700">
                  Portfolio URL
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    name="portfolio_url"
                    id="portfolio_url"
                    value={formData?.portfolioUrl}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700">
                  LinkedIn URL
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Linkedin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    name="linkedin_url"
                    id="linkedin_url"
                    value={formData?.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="available_for_hire"
                      name="available_for_hire"
                      type="checkbox"
                      checked={formData?.availableForHire}
                      onChange={(e) => setFormData({ ...formData, availableForHire: e.target.checked })}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="available_for_hire" className="font-medium text-gray-700">
                      Available for hire
                    </label>
                    <p className="text-gray-500">Let employers know you're open to new opportunities</p>
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
                      checked={formData?.willingToRelocate}
                      onChange={(e) => setFormData({ ...formData, willingToRelocate: e.target.checked })}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="willing_to_relocate" className="font-medium text-gray-700">
                      Willing to relocate
                    </label>
                    <p className="text-gray-500">Indicate if you're open to job opportunities in other locations</p>
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
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}