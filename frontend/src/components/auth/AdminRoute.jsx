import { Navigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import React from "react"
import AdminLoader from "../common/AdminLoader"

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return <AdminLoader fullScreen={true} label="Authorizing access" />

  return (user?.role === "admin" || user?.role === "moderator" || user?.role === "superadmin")
    ? children
    : <Navigate to="/" replace />
}

export default AdminRoute
