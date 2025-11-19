import { useMemo, useState } from 'react'

type SalesPoint = {
  label: string
  amount: number
}

type PopularService = {
  rank: number
  name: string
  count: number
  revenue: number
}

type ReservationStat = {
  label: string
  value: number
}

const ReportsPage = () => {
  const [period, setPeriod] = useState<'최근 7일' | '최근 30일' | '최근 6개월'>('최근 7일')

  const salesPoints: SalesPoint[] = [
    { label: '11/01', amount: 820000 },
    { label: '11/02', amount: 910000 },
    { label: '11/03', amount: 650000 },
    { label: '11/04', amount: 1020000 },
    { label: '11/05', amount: 980000 },
    { label: '11/06', amount: 1120000 },
    { label: '11/07', amount: 790000 },
  ]

  const popularServices: PopularService[] = [
    { rank: 1, name: '셋팅펌', count: 37, revenue: 2200000 },
    { rank: 2, name: '레이어드 컷', count: 30, revenue: 1180000 },
    { rank: 3, name: '전체 염색', count: 26, revenue: 3120000 },
    { rank: 4, name: '두피 케어', count: 22, revenue: 1430000 },
    { rank: 5, name: '볼륨매직', count: 18, revenue: 2560000 },
  ]

  const reservationStats: ReservationStat[] = [
    { label: '총 예약', value: 142 },
    { label: '방문 완료', value: 129 },
    { label: '취소', value: 8 },
    { label: '노쇼', value: 5 },
  ]

  const maxSales = useMemo(() => Math.max(...salesPoints.map((point) => point.amount)), [salesPoints])

  return (
    <section className="page reports-page">
      <header className="page-header">
        <div>
          <h1 className="page__title">리포트</h1>
          <p className="page__description">매출과 예약 데이터를 그래프로 확인합니다.</p>
        </div>
        <select value={period} onChange={(event) => setPeriod(event.target.value as typeof period)}>
          <option value="최근 7일">최근 7일</option>
          <option value="최근 30일">최근 30일</option>
          <option value="최근 6개월">최근 6개월</option>
        </select>
      </header>

      <section className="summary-card-row">
        <article className="summary-card">
          <p className="summary-card__title">이번 달 매출</p>
          <strong className="summary-card__value">9,860,000원</strong>
          <span className="summary-card__subtext">일 목표 대비 76%</span>
        </article>
        <article className="summary-card">
          <p className="summary-card__title">지난 달 대비 증감률</p>
          <strong className="summary-card__value positive">+10%</strong>
          <span className="summary-card__subtext">상승 추세 유지</span>
        </article>
        <article className="summary-card">
          <p className="summary-card__title">이번 달 신규 고객</p>
          <strong className="summary-card__value">42명</strong>
          <span className="summary-card__subtext">평균 재방문율 62%</span>
        </article>
      </section>

      <div className="reports-layout">
        <section className="dashboard-card sales-card">
          <div className="section-header">
            <div>
              <h2>매출 추이</h2>
              <p>선택한 기간 동안 일별 매출을 확인합니다.</p>
            </div>
            <span className="period-label">{period}</span>
          </div>
          <div className="sales-chart">
            {salesPoints.map((point) => (
              <div key={point.label} className="sales-bar">
                <div
                  className="sales-bar__value"
                  style={{ height: `${(point.amount / maxSales) * 100}%` }}
                  title={`${point.amount.toLocaleString('ko-KR')}원`}
                />
                <span>{point.label}</span>
              </div>
            ))}
          </div>
        </section>

        <aside className="dashboard-card popular-card">
          <h2>인기 시술 TOP 5</h2>
          <ul>
            {popularServices.map((service) => (
              <li key={service.rank}>
                <div>
                  <strong>{service.rank}. {service.name}</strong>
                  <span>{service.count}건</span>
                </div>
                <span className="revenue">{service.revenue.toLocaleString('ko-KR')}원</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <section className="dashboard-card reservation-card">
        <h2>예약 통계</h2>
        <div className="reservation-stats">
          {reservationStats.map((stat) => (
            <div key={stat.label}>
              <p>{stat.label}</p>
              <strong>{stat.value}건</strong>
              <span>{Math.round((stat.value / reservationStats[0].value) * 100)}%</span>
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}

export default ReportsPage
