import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import CandidateProfile from './CandidateProfile';
import CompanyProfile from './CompanyProfile';

export default function Profile() {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return null;
  }

  return user.role === 'company' ? <CompanyProfile /> : <CandidateProfile />;
}