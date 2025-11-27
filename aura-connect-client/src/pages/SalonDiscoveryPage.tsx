import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSalon } from '../contexts/SalonContext'
import httpClient from '../lib/httpClient'

const SalonDiscoveryPage = () => {
  const navigate = useNavigate()
  const { salons, selectSalon } = useSalon()
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('all')
  const [isPinging, setIsPinging] = useState(false)
  const [pingStatus, setPingStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const filteredSalons = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return salons.filter((salon) => {
      const matchesCity = city === 'all' || salon.city === city
      const matchesKeyword =
        !normalizedQuery ||
        salon.name.toLowerCase().includes(normalizedQuery) ||
        salon.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)) ||
        salon.services.some((service) => service.toLowerCase().includes(normalizedQuery))

      return matchesCity && matchesKeyword
    })
  }, [city, query, salons])

  const handleSelectSalon = (id: string) => {
    selectSalon(id)
    navigate('/dashboard')
  }

  const handlePingBackend = async () => {
    setIsPinging(true)
    setPingStatus('idle')

    try {
      await httpClient.get('/api/v1/hi')
      setPingStatus('success')
    } catch (error) {
      console.error('백엔드 통신 중 오류가 발생했습니다.', error)
      setPingStatus('error')
    } finally {
      setIsPinging(false)
    }
  }

  return (
    <section className="page discovery-page">
      <div className="discovery-hero">
        <div>
          <p className="eyebrow">살롱 선택</p>
          <h1 className="page__title">브랜드별 살롱을 먼저 선택하고 운영 화면을 이어가세요.</h1>
          <p className="page__description">
            각 지점의 분위기와 서비스 특징을 빠르게 살펴보고 연결해둔 살롱으로 바로 이동할 수 있습니다.
          </p>
          <div className="discovery-hero__actions">
            <div className="discovery-hero__stats">
              <strong>3</strong>
              <span>연결된 살롱</span>
            </div>
            <div className="discovery-hero__stats">
              <strong>4.8★</strong>
              <span>평균 고객 평점</span>
            </div>
            <div className="discovery-hero__stats">
              <strong>브랜딩 커스터마이징</strong>
              <span>메뉴 이름 · 프레임 수정 가능</span>
            </div>
            <div className="discovery-hero__stats">
              <button className="primary-button" type="button" onClick={handlePingBackend} disabled={isPinging}>
                {isPinging ? '확인 중...' : '백엔드 인사 보내기'}
              </button>
              {pingStatus === 'success' && <span className="chip">콘솔에 hi 출력됨</span>}
              {pingStatus === 'error' && <span className="chip chip--error">요청 실패</span>}
            </div>
          </div>
        </div>
        <div className="discovery-hero__badge">
          <span className="badge badge--in-progress">NEW</span>
          <p>살롱을 먼저 선택해야 대시보드, 예약, 팀 메뉴를 이용할 수 있습니다.</p>
        </div>
      </div>

      <div className="discovery-filters">
        <input
          type="search"
          placeholder="지점명, 시술, 태그 검색..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select value={city} onChange={(event) => setCity(event.target.value)}>
          <option value="all">전체 지역</option>
          <option value="서울">서울</option>
          <option value="부산">부산</option>
          <option value="대구">대구</option>
        </select>
      </div>

      <div className="discovery-grid">
        {filteredSalons.map((salon) => (
          <article key={salon.id} className="salon-card">
            <div
              className="salon-card__visual"
              style={{
                backgroundImage: `linear-gradient(120deg, ${salon.theme.primaryColor}, ${salon.theme.accentColor})`,
              }}
            >
              <img src={salon.heroImage} alt={`${salon.name} 대표 이미지`} loading="lazy" />
              <span className="salon-card__chip">{salon.ownerName} 오너</span>
            </div>
            <div className="salon-card__body">
              <div className="salon-card__header">
                <div>
                  <h2>{salon.name}</h2>
                  <p>{salon.description}</p>
                </div>
                <div className="salon-card__rating">
                  <strong>{salon.rating.toFixed(1)}</strong>
                  <span>{salon.reviewCount}개의 리뷰</span>
                </div>
              </div>

              <div className="salon-card__meta">
                <span className="chip">{salon.city}</span>
                <span className="chip">{salon.address}</span>
              </div>

              <div className="salon-card__tags">
                {salon.tags.map((tag) => (
                  <span key={tag} className="chip chip--ghost">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="salon-card__services">
                {salon.services.map((service) => (
                  <span key={service}>{service}</span>
                ))}
              </div>

              <div className="salon-card__actions">
                <button type="button" className="primary-button" onClick={() => handleSelectSalon(salon.id)}>
                  이 살롱 연결하기
                </button>
                <button type="button" className="ghost-button" onClick={() => navigate('/dashboard')}>
                  기존 선택 유지
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredSalons.length === 0 && (
        <div className="empty-state">
          <p>조건에 맞는 살롱이 없습니다. 검색어 또는 지역을 변경해보세요.</p>
        </div>
      )}
    </section>
  )
}

export default SalonDiscoveryPage
