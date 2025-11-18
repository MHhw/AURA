import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import './FullWidthLayout.css'
import { useAuth } from '../../contexts/AuthContext'

type MenuItem = {
  label: string
  path: string
}

const menuItems: MenuItem[] = [
  { label: 'Dashboard', path: '/' },
  { label: 'Projects', path: '/projects' },
  { label: 'Teams', path: '/teams' },
  { label: 'Reports', path: '/reports' },
  { label: 'Settings', path: '/settings' },
]

const FullWidthLayout = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="full-width-layout">
      <header className="layout-header">
        <div className="layout-logo">Project AURA</div>
        <nav className="layout-nav" aria-label="Primary">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }: { isActive: boolean }) =>
                ['layout-nav__link', isActive ? 'layout-nav__link--active' : '']
                  .filter(Boolean)
                  .join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="layout-actions" aria-live="polite">
          {isAuthenticated && user ? (
            <>
              <div className="layout-user">
                {user.profileImageUrl ? (
                  <img
                    className="layout-user__avatar"
                    src={user.profileImageUrl}
                    alt={`${user.name} 프로필 이미지`}
                  />
                ) : (
                  <span className="layout-user__avatar" aria-hidden="true">
                    {user.name.charAt(0)}
                  </span>
                )}
                <div className="layout-user__details">
                  <span className="layout-user__name">{user.name}</span>
                  <span className="layout-user__email">{user.email}</span>
                </div>
              </div>
              <NavLink className="layout-action-button" to="/settings">
                정보수정
              </NavLink>
              <button type="button" className="layout-action-button layout-action-button--secondary" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <NavLink className="layout-action-button" to="/login">
                로그인
              </NavLink>
              <NavLink className="layout-action-button layout-action-button--secondary" to="/register">
                회원가입
              </NavLink>
            </>
          )}
        </div>
      </header>
      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  )
}

export default FullWidthLayout
