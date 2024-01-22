import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilFile, cilUser } from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = (userInfo) => {
  let items = [
    {
      component: CNavItem,
      name: 'Sanitary Permit',
      to: '/sanitary_permit',
      icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
    },
  ]

  if (userInfo.role_type === 'Administrator') {
    items.push({
      component: CNavItem,
      name: 'User',
      to: '/user',
      icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    })
  }
  return items
}

export default _nav
