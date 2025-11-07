import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <section className="page">
      <h1 className="page__title">Page not found</h1>
      <p className="page__description">
        The page you are looking for does not exist. Return to the dashboard to keep
        building your integrations.
      </p>
      <Link className="page__cta" to="/">
        Go back home
      </Link>
    </section>
  )
}

export default NotFoundPage
