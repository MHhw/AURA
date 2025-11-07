import { NavLink, Outlet } from 'react-router-dom'
import './FullWidthLayout.css'

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
      </header>
      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  )
}

export default FullWidthLayout
