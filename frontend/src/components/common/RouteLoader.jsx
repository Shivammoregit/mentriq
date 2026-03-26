import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import AdminLoader from './AdminLoader'
import Preloader from './Preloader'

const RouteLoader = () => {
  const location = useLocation()
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setShowLoader(true), 180)
    return () => window.clearTimeout(timer)
  }, [location.pathname])

  if (!showLoader) return null

  if (location.pathname.startsWith('/admin')) {
    return <AdminLoader label="Loading admin panel" />
  }

  return <Preloader />
}

export default RouteLoader
