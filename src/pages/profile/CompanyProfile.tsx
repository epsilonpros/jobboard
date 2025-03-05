import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {fetchProfile, updateCompanyProfile} from '../../store/slices/profileSlice';
import { Building2, MapPin, Globe, Users, Briefcase } from 'lucide-react';

export default function CompanyProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading ,data} = useSelector((state: RootState) => state.profile);
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle logo upload to Supabase storage
      // Update logo_url in formData
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Company Information</h3>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Logo Upload */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">Company Logo</label>
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
                    Change Logo
                    <input
                      id="logo-upload"
                      name="logo"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData?.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                  Industry
                </label>
                <select
                  id="industry"
                  name="industry"
                  value={formData?.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">Select Industry</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="education">Education</option>
                  <option value="retail">Retail</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                  Company Size
                </label>
                <select
                  id="size"
                  name="size"
                  value={formData?.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">Select Size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Company Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData?.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    name="website"
                    id="website"
                    value={formData?.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={formData?.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        {/*<div className="bg-white shadow rounded-lg mb-6">*/}
        {/*  <div className="px-4 py-5 sm:p-6">*/}
        {/*    <h3 className="text-lg font-medium leading-6 text-gray-900">Social Media</h3>*/}
        {/*    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">*/}
        {/*      <div className="sm:col-span-6">*/}
        {/*        <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">*/}
        {/*          LinkedIn*/}
        {/*        </label>*/}
        {/*        <input*/}
        {/*          type="url"*/}
        {/*          name="linkedin"*/}
        {/*          id="linkedin"*/}
        {/*          value={formData.social_media.linkedin}*/}
        {/*          onChange={(e) => setFormData({*/}
        {/*            ...formData,*/}
        {/*            social_media: { ...formData.social_media, linkedin: e.target.value }*/}
        {/*          })}*/}
        {/*          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"*/}
        {/*        />*/}
        {/*      </div>*/}

        {/*      <div className="sm:col-span-6">*/}
        {/*        <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">*/}
        {/*          Twitter*/}
        {/*        </label>*/}
        {/*        <input*/}
        {/*          type="url"*/}
        {/*          name="twitter"*/}
        {/*          id="twitter"*/}
        {/*          value={formData.social_media.twitter}*/}
        {/*          onChange={(e) => setFormData({*/}
        {/*            ...formData,*/}
        {/*            social_media: { ...formData.social_media, twitter: e.target.value }*/}
        {/*          })}*/}
        {/*          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"*/}
        {/*        />*/}
        {/*      </div>*/}

        {/*      <div className="sm:col-span-6">*/}
        {/*        <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">*/}
        {/*          Facebook*/}
        {/*        </label>*/}
        {/*        <input*/}
        {/*          type="url"*/}
        {/*          name="facebook"*/}
        {/*          id="facebook"*/}
        {/*          value={formData.social_media.facebook}*/}
        {/*          onChange={(e) => setFormData({*/}
        {/*            ...formData,*/}
        {/*            social_media: { ...formData.social_media, facebook: e.target.value }*/}
        {/*          })}*/}
        {/*          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"*/}
        {/*        />*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}

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