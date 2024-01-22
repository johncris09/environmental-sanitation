import React, { useEffect, useState } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useNavigate } from 'react-router-dom'
import { Login } from '@mui/icons-material'
import { jwtDecode } from 'jwt-decode'

const DefaultLayout = () => {
  const [user, setUser] = useState(false)
  const [userInfo, setUserInfo] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const isTokenExist = localStorage.getItem('enviromentalSanitationToken') !== null

    if (!isTokenExist) {
      setUser(true)
      // If the token is set, navigate to the login
      navigate('/login', { replace: true })
    } else {
      setUserInfo(jwtDecode(localStorage.getItem('enviromentalSanitationToken')))
    }
  }, [user])

  return (
    <>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent userInfo={userInfo} />
        </div>
        <AppFooter />
      </div>
    </>
  )
}

export default DefaultLayout
