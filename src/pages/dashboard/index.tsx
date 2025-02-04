import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import CandidateOverview from './candidate/Overview';
import CompanyOverview from './company/Overview';
import JobManagement from './JobManagement';
import CandidateApplications from './candidate/Applications';
import CompanyApplications from './company/Applications';
import CandidateProfiles from './company/CandidateProfiles';
import CompanyList from './candidate/CompanyList';
import Settings from './Settings';
import Messaging from '../messaging/Messaging';

export default function Dashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const isCompany = user?.role === 'company';

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
              <Route path="companies" element={<CompanyList />} />
            </>
          )}
          <Route path="settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}