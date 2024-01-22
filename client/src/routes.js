import React from 'react'

const SanitaryPermit = React.lazy(() => import('./views/sanitary_permit/SanitaryPermit'))

const User = React.lazy(() => import('./views/user/User'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  // { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/sanitary_permit', name: 'Sanitary Permit', element: SanitaryPermit },

  { path: '/user', name: 'User', element: User },
]

export default routes
