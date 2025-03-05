import React, {useEffect} from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../store';
import {ApiGeneric} from "../api";
import {setUser} from "../store/slices/authSlice.ts";

export default function ProtectedRoute() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}