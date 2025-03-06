import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import CandidateOverview from './candidate/Overview';
import CompanyOverview from './company/Overview';
import AdminOverview from '../admin/Overview';
import JobManagement from './JobManagement';
import CandidateApplications from './candidate/Applications';
import CompanyApplications from './company/Applications';
import CandidateProfiles from './company/CandidateProfiles';
import Settings from './Settings';

export default function Dashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  
  if (!user) return null;

  if (user.role === 'admin') {
    return <AdminOverview />;
  }

  const isCompany = user.role === 'company';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route index element={isCompany ? <CompanyOverview /> : <CandidateOverview />} />
          {isCompany ? (
            <>
              <Route path="jobs/*" element={<JobManagement />} />
              <Route path="applications" element={<CompanyApplications />} />
              <Route path="candidates" element={<CandidateProfiles />} />
            </>
          ) : (
            <>
              <Route path="applications" element={<CandidateApplications />} />
            </>
          )}
          <Route path="settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}