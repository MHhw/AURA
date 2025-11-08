import { useEffect, useState } from 'react'
import httpClient from '../lib/httpClient'

type MainPageHighlight = {
  id: string
  label: string
  value: string
}

type MainPageData = {
  title: string
  message: string
  timestamp: string
  metrics: Record<string, number | string>
  highlights: MainPageHighlight[]
}

type ApiResponse<T> = {
  code: string
  message: string
  data: T
}

const fallbackDescription =
  'This workspace is ready for building the Aura Connect experience. Use the navigation tabs above to explore different areas of the application.'

const DashboardPage = () => {
  const [mainData, setMainData] = useState<MainPageData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMainPage = async () => {
      try {
        const { data: response } = await httpClient.get<ApiResponse<MainPageData>>('/api/v1/main')
        setMainData(response.data)
        setError(null)
      } catch {
        setError('Failed to load the main dashboard data. Please confirm the Spring Boot server is running.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMainPage()
  }, [])

  return (
    <section className="page">
      <h1 className="page__title">{mainData?.title ?? 'Welcome to Project AURA'}</h1>
      <p className="page__description">{mainData?.message ?? fallbackDescription}</p>
      {mainData?.timestamp && (
        <p className="page__status">Last synced: {new Date(mainData.timestamp).toLocaleString()}</p>
      )}

      {isLoading && <p className="page__status">Loading main dashboard data...</p>}

      {error && !isLoading && <p className="page__status page__status--error">{error}</p>}

      {!isLoading && !error && mainData && (
        <div className="dashboard-panels">
          <section className="dashboard-card">
            <h2 className="dashboard-card__title">Today&apos;s metrics</h2>
            <div className="dashboard-metrics">
              {Object.entries(mainData.metrics ?? {}).map(([key, value]) => (
                <article key={key} className="dashboard-metrics__item">
                  <span className="dashboard-metrics__label">{key}</span>
                  <strong className="dashboard-metrics__value">{value}</strong>
                </article>
              ))}
            </div>
          </section>

          <section className="dashboard-card">
            <h2 className="dashboard-card__title">Highlights</h2>
            <ul className="dashboard-highlights">
              {(mainData.highlights ?? []).map((highlight) => (
                <li key={highlight.id} className="dashboard-highlights__item">
                  <span className="dashboard-highlights__label">{highlight.label}</span>
                  <span className="dashboard-highlights__value">{highlight.value}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </section>
  )
}

export default DashboardPage
