import { createHashRouter, Navigate } from 'react-router-dom'

import SocketProvider from '../components/SocketProvider'
import AuthLayout from '../layouts/AuthLayout'
import MainLayout from '../layouts/MainLayout'
import Contacts from '../pages/Contacts'
import ErrorPage from '../pages/ErrorPage'
import SignIn from '../pages/SignIn'
import SingUp from '../pages/SingUp'
import Users from '../pages/Users'

export const routerConfig = createHashRouter([
  {
    index: true,
    element: <Navigate to={'/contacts'} />,
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
    element: (
      <SocketProvider>
        <MainLayout />
      </SocketProvider>
    ),
    children: [
      {
        path: 'contacts',
        element: <Contacts />,
      },
      {
        path: 'users',
        element: <Users />,
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
