import { Route, Routes } from 'react-router-dom'
import FullWidthLayout from './components/layouts/FullWidthLayout'
import DashboardPage from './pages/DashboardPage'
import ProjectsPage from './pages/ProjectsPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'
import TeamsPage from './pages/TeamsPage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import OAuthSuccessPage from './pages/OAuthSuccessPage'
import SalonDiscoveryPage from './pages/SalonDiscoveryPage'
import SalonGuard from './components/guards/SalonGuard'

const App = () => {
  return (
    <Routes>
      <Route element={<FullWidthLayout />}>
        <Route index element={<SalonDiscoveryPage />} />
        <Route
          path="dashboard"
          element={
            <SalonGuard>
              <DashboardPage />
            </SalonGuard>
          }
        />
        <Route
          path="projects"
          element={
            <SalonGuard>
              <ProjectsPage />
            </SalonGuard>
          }
        />
        <Route
          path="teams"
          element={
            <SalonGuard>
              <TeamsPage />
            </SalonGuard>
          }
        />
        <Route
          path="reports"
          element={
            <SalonGuard>
              <ReportsPage />
            </SalonGuard>
          }
        />
        <Route
          path="settings"
          element={
            <SalonGuard>
              <SettingsPage />
            </SalonGuard>
          }
        />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="oauth/success" element={<OAuthSuccessPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
