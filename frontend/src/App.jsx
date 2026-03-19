import { Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import RouteLoader from './components/common/RouteLoader';
import AppErrorBoundary from './components/common/AppErrorBoundary';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const MyEnrollmentsPage = lazy(() => import('./pages/MyEnrollmentsPage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const AdminLogin = lazy(() => import('./pages/Admin/AdminLogin'));
const Dashboard = lazy(() => import('./pages/Admin/Dashboard'));
const CourseManagement = lazy(() => import('./pages/Admin/CourseManagement'));
const EnrollmentManagement = lazy(() => import('./pages/Admin/EnrollmentManagement'));
const MentorManagement = lazy(() => import('./pages/Admin/MentorManagement'));
const FeedbackManagement = lazy(() => import('./pages/Admin/FeedbackManagement'));
const PartnerManagement = lazy(() => import('./pages/Admin/PartnerManagement'));
const UserManagement = lazy(() => import('./pages/Admin/UserManagement'));
const InternshipManagement = lazy(() => import('./pages/Admin/InternshipManagement'));
const JourneyManagement = lazy(() => import('./pages/Admin/JourneyManagement'));
const CertificateManagement = lazy(() => import('./pages/Admin/CertificateManagement'));
const ServiceManagement = lazy(() => import('./pages/Admin/ServiceManagement'));
const CityManagement = lazy(() => import('./pages/Admin/CityManagement'));
const JobPostManagement = lazy(() => import('./pages/Admin/JobPostManagement'));
const EnquiryManagement = lazy(() => import('./pages/Admin/EnquiryManagement'));
const StaffManagement = lazy(() => import('./pages/Admin/StaffManagement'));
const SettingsManagement = lazy(() => import('./pages/Admin/SettingsManagement'));
const TechnologyManagement = lazy(() => import('./pages/Admin/TechnologyManagement'));
const InternshipApplicationPage = lazy(() => import('./pages/InternshipApplicationPage'));
const UserAuthPage = lazy(() => import('./pages/UserAuthPage'));
const TrainingPage = lazy(() => import('./pages/TrainingPage'));
const TrainingDetailPage = lazy(() => import('./pages/TrainingDetailPage'));
const EnrollmentFormPage = lazy(() => import('./pages/EnrollmentFormPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const TrainingEnrollmentFormPage = lazy(() => import('./pages/TrainingEnrollmentFormPage'));
const VerifyCertificatePage = lazy(() => import('./pages/VerifyCertificatePage'));
const RecruitPage = lazy(() => import('./pages/RecruitPage'));

import AdminRoute from './components/auth/AdminRoute';
import EnrollmentSuccessWrapper from './pages/EnrollmentSuccessWrapper';
import { useAuth } from './context/AuthContext';
import { useVisitorTracking } from './hooks/useVisitorTracking';
import ScrollToTop from './pages/ScrollToTop';

function App() {
  const { isAuthenticated } = useAuth();

  // Global Visitor Intel tracking
  useVisitorTracking();

  return (
    <Suspense fallback={<RouteLoader />}>
      <ScrollToTop />
      <Routes>
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/courses" element={<Layout><CoursesPage /></Layout>} />
            <Route path="/courses/:id" element={<Layout><CourseDetailPage /></Layout>} />
            <Route path="/about" element={<Layout><AboutPage /></Layout>} />
            <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
            <Route path="/training" element={<Layout><TrainingPage /></Layout>} />
            <Route path="/training/:id" element={<Layout><TrainingDetailPage /></Layout>} />
            {/* <Route path='/test' element={<Layout><Test/></Layout>}/> */}
            <Route path="/enroll/:courseId" element={<Layout><EnrollmentFormPage /></Layout>} />
            <Route path="/enrollf/:courseId" element={<Layout><TrainingEnrollmentFormPage /></Layout>} />

            <Route path="/enrollment-success" element={<EnrollmentSuccessWrapper />} />

            <Route
              path="/my-enrollments"
              element={
                isAuthenticated ? (
                  <Layout>
                    <MyEnrollmentsPage />
                  </Layout>
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
            <Route path="/verify-certificate" element={<Layout><VerifyCertificatePage /></Layout>} />
            <Route path="/recruit" element={<Layout><RecruitPage /></Layout>} />
            <Route path="/internship/apply/:internshipId" element={<Layout><InternshipApplicationPage /></Layout>} />
            <Route path="/login" element={<UserAuthPage />} />
            <Route path="/register" element={<UserAuthPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/courses"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <CourseManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/enrollments"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <EnrollmentManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/mentors"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <MentorManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/feedback"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <FeedbackManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/jobs"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <JobPostManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/staff"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <StaffManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/enquiries"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <EnquiryManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/partners"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <PartnerManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <UserManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/internships"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <InternshipManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/journey"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <JourneyManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/certificates"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <CertificateManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route path="/admin/services"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <ServiceManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route path="/admin/cities"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <CityManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route path="/admin/technologies"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <TechnologyManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route path="/admin/settings"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <SettingsManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
    </Suspense>
  );
}

export default App;
