import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Provider} from 'react-redux';
import { Toaster } from 'react-hot-toast';
import {store} from './store';
import Layout from './components/Layout';
import Home from './pages/Home';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/dashboard';
import JobList from './pages/jobs/JobList';
import JobDetails from './pages/jobs/JobDetails';
import CreateJob from './pages/jobs/CreateJob';
import Companies from './pages/companies';
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
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Routes with layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/companies" element={<Companies />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="/jobs/create" element={<CreateJob />} />
              <Route path="/profile" element={<Profile />} />
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