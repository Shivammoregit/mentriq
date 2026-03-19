import React from 'react'
import { useLocation } from 'react-router-dom'
import AdminLoader from './AdminLoader'
import Preloader from './Preloader'

const RouteLoader = () => {
  const location = useLocation()

  if (location.pathname.startsWith('/admin')) {
    return <AdminLoader label="Loading admin panel" />
  }

  return <Preloader />
}

export default RouteLoader
