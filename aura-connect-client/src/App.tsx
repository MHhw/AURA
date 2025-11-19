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

const App = () => {
  return (
    <Routes>
      <Route element={<FullWidthLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="teams" element={<TeamsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="oauth/success" element={<OAuthSuccessPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
