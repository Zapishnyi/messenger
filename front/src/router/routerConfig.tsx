import React from 'react'
import { createHashRouter, Navigate } from 'react-router-dom'

import AuthLayout from '../layouts/AuthLayout'
import MainLayout from '../layouts/MainLayout'
import Chat from '../pages/Chat'
import ErrorPage from '../pages/ErrorPage'
import SignIn from '../pages/SignIn'
import SingUp from '../pages/SingUp'

export const routerConfig = createHashRouter([
  {
    index: true,
    element: <Navigate to={'/chat'} />,
  },
  {
    path: 'auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'sign-in',
        element: <SignIn />,
      },
      {
        path: 'sign-up',
        element: <SingUp />,
      },
    ],
  },
  {
    path: '',
    element: <MainLayout />,
    children: [
      {
        path: 'chat',
        element: <Chat />,
      },
    ],
  },
  {
    path: 'error',
    element: <ErrorPage />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
])
