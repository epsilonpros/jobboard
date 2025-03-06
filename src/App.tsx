import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import Layout from './components/Layout';
import Home from './pages/Home';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import EmailVerification from './pages/auth/EmailVerification';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/dashboard';
import JobList from './pages/jobs/JobList';
import JobDetails from './pages/jobs/JobDetails';
import CreateJob from './pages/jobs/CreateJob';
import EditJob from './pages/jobs/EditJob';
import Companies from './pages/companies';
import CompanyDetails from './pages/companies/CompanyDetails';
import AdminCompanies from './pages/admin/Companies';
import AdminJobs from './pages/admin/Jobs';
import AdminCandidates from './pages/admin/Candidates';
import Profile from './pages/profile';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Auth routes without layout */}
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Routes with layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/companies/:id" element={<CompanyDetails />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="/jobs/create" element={<CreateJob />} />
              <Route path="/jobs/:id/edit" element={<EditJob />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Admin Routes */}
              <Route path="/admin/companies" element={<AdminCompanies />} />
              <Route path="/admin/jobs" element={<AdminJobs />} />
              <Route path="/admin/candidates" element={<AdminCandidates />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </Provider>
  );
}

export default App;