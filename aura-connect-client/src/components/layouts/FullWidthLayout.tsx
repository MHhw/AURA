import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import './FullWidthLayout.css'
import { useAuth } from '../../contexts/AuthContext'
import { useSalon } from '../../contexts/SalonContext'
import auraWordmark from '../../assets/aura-wordmark.svg'

type MenuItem = {
  key: 'dashboard' | 'projects' | 'teams' | 'reports' | 'settings'
  path: string
  requireAuth?: boolean
}

type RenderMenuItem = MenuItem & { label: string }

const baseMenuItems: MenuItem[] = [
  { key: 'dashboard', path: '/dashboard' },
  { key: 'projects', path: '/projects' },
  { key: 'teams', path: '/teams' },
  { key: 'reports', path: '/reports' },
  { key: 'settings', path: '/settings', requireAuth: true },
]

const FullWidthLayout = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout, isLoading } = useAuth()
  const { selectedSalon, menuLabels, appearance } = useSalon()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  const menuItems: RenderMenuItem[] = useMemo(
    () =>
      baseMenuItems
        .filter((item) => !(item.requireAuth && !isAuthenticated))
        .map((item) => ({ ...item, label: menuLabels[item.key] })),
    [isAuthenticated, menuLabels],
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    setIsMenuOpen(false)
    navigate('/')
  }

  return (
    <div
      className="full-width-layout"
      style={{
        ['--layout-primary' as string]: appearance.primaryColor,
        ['--layout-accent' as string]: appearance.accentColor,
      }}
    >
      <header
        className={`layout-header layout-header--${appearance.frameStyle}`}
        data-texture={appearance.backgroundTexture}
      >
        <Link
          to={selectedSalon ? '/dashboard' : '/'}
          className="layout-logo"
          aria-label="AURA 대시보드로 이동"
        >
          <img src={auraWordmark} alt="AURA" />
        </Link>
        <nav className="layout-nav" aria-label="Primary">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
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
        <div className="layout-salon-meta">
          {selectedSalon ? (
            <div className="layout-salon-pill">
              <p>선택된 살롱</p>
              <strong>{selectedSalon.name}</strong>
              <span>
                {selectedSalon.city} · {selectedSalon.address}
              </span>
            </div>
          ) : (
            <div className="layout-salon-pill layout-salon-pill--empty">
              아직 살롱이 연결되지 않았습니다.
            </div>
          )}
        </div>
        <div className="layout-actions" aria-live="polite">
          {isLoading ? (
            <span className="layout-auth-loading">인증 상태 확인 중...</span>
          ) : isAuthenticated && user ? (
            <div className="layout-user-menu" ref={menuRef}>
              <button
                type="button"
                className="layout-user-trigger"
                aria-haspopup="true"
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((prev) => !prev)}
              >
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
                <span className="layout-user__chevron" aria-hidden="true">
                  {isMenuOpen ? '▲' : '▼'}
                </span>
              </button>
              {isMenuOpen && (
                <div className="layout-user-dropdown" role="menu">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsMenuOpen(false)
                      navigate('/settings')
                    }}
                  >
                    마이페이지
                  </button>
                  <button type="button" role="menuitem" onClick={handleLogout}>
                    로그아웃
                  </button>
                </div>
              )}
            </div>
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
