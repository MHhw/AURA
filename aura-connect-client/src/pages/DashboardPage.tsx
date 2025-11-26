import { useMemo } from 'react'
import { useSalon } from '../contexts/SalonContext'

type SummaryCard = {
  id: string
  title: string
  value: string
  subtext: string
}

type AppointmentStatus = '예약완료' | '시술중' | '완료' | '취소'

type Appointment = {
  id: number
  time: string
  customerName: string
  designerName: string
  serviceName: string
  status: AppointmentStatus
}

const DashboardPage = () => {
  const { selectedSalon } = useSalon()
  const todayLabel = useMemo(() => {
    const today = new Date()
    return today.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })
  }, [])

  const summaryCards: SummaryCard[] = [
    { id: 'bookings', title: '오늘 예약 수', value: '12건', subtext: '전일 대비 +3건' },
    { id: 'cancellations', title: '오늘 취소 수', value: '1건', subtext: '전일 대비 -1건' },
    { id: 'designers', title: '근무 중 디자이너', value: '4명', subtext: '배정 완료 100%' },
    { id: 'revenue', title: '이번 달 누적 매출', value: '7,230,000원', subtext: '목표 대비 82% 달성' },
  ]

  const appointments: Appointment[] = [
    {
      id: 1,
      time: '09:30',
      customerName: '김서연',
      designerName: '이민주',
      serviceName: '컷 + 드라이',
      status: '예약완료',
    },
    {
      id: 2,
      time: '10:30',
      customerName: '박지훈',
      designerName: '최다온',
      serviceName: '시스루뱅 컷',
      status: '시술중',
    },
    {
      id: 3,
      time: '11:00',
      customerName: '이수아',
      designerName: '이민주',
      serviceName: '레이어드 컷',
      status: '완료',
    },
    {
      id: 4,
      time: '13:00',
      customerName: '정하윤',
      designerName: '김유나',
      serviceName: '셋팅펌',
      status: '예약완료',
    },
    {
      id: 5,
      time: '14:30',
      customerName: '강민석',
      designerName: '박주원',
      serviceName: '다운펌',
      status: '예약완료',
    },
    {
      id: 6,
      time: '16:00',
      customerName: '이수호',
      designerName: '김유나',
      serviceName: '전체 염색',
      status: '취소',
    },
    {
      id: 7,
      time: '17:30',
      customerName: '김은지',
      designerName: '박주원',
      serviceName: '클리닉',
      status: '예약완료',
    },
    {
      id: 8,
      time: '19:00',
      customerName: '문지호',
      designerName: '최다온',
      serviceName: '가르마 펌',
      status: '예약완료',
    },
  ]

  const quickActions = ['새 예약 등록', '즉시 시술 시작', '휴무/영업시간 변경']
  const isServerDown = false

  const renderStatusBadge = (status: AppointmentStatus) => {
    const badgeClass = {
      예약완료: 'badge--scheduled',
      시술중: 'badge--in-progress',
      완료: 'badge--done',
      취소: 'badge--cancelled',
    }[status]

    return <span className={`badge ${badgeClass}`}>{status}</span>
  }

  return (
    <section className="page dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1 className="page__title">{selectedSalon?.name ?? '선택된 살롱'} 대시보드</h1>
          <p className="page__description">
            오늘 예약 현황과 매장 지표를 한눈에 확인하세요. 살롱별 커스텀 메뉴명과 브랜딩 테마는 설정에서
            바로 수정할 수 있습니다.
          </p>
        </div>
        <span className="dashboard-date">{todayLabel}</span>
      </header>

      <section className="dashboard-summary-grid">
        {summaryCards.map((card) => (
          <article key={card.id} className="summary-card">
            <p className="summary-card__title">{card.title}</p>
            <strong className="summary-card__value">{card.value}</strong>
            <span className="summary-card__subtext">{card.subtext}</span>
          </article>
        ))}
      </section>

      <div className="dashboard-content">
        <section className="dashboard-card appointment-card">
          <div className="section-header">
            <div>
              <h2>오늘 예약 일정</h2>
              <p>상세 예약 정보와 디자이너 배정을 확인하세요.</p>
            </div>
          </div>
          <div className="appointment-table">
            <div className="appointment-table__header">
              <span>시간</span>
              <span>고객명</span>
              <span>디자이너</span>
              <span>서비스</span>
              <span>상태</span>
            </div>
            {appointments.map((item) => (
              <div key={item.id} className="appointment-table__row">
                <span className="appointment-table__time">{item.time}</span>
                <span>{item.customerName}</span>
                <span>{item.designerName}</span>
                <span>{item.serviceName}</span>
                <span>{renderStatusBadge(item.status)}</span>
              </div>
            ))}
          </div>
        </section>

        <aside className="quick-actions">
          <h3>빠른 작업</h3>
          <p>자주 사용하는 작업을 바로 실행하세요.</p>
          <div className="quick-actions__buttons">
            {quickActions.map((action) => (
              <button key={action} type="button" onClick={() => console.log(action)}>
                {action}
              </button>
            ))}
          </div>
        </aside>
      </div>

      {isServerDown && (
        <div className="error-card">
          <div>
            <h3>서버 연결 실패</h3>
            <p>Spring Boot 서버와 통신할 수 없습니다. 서버 상태를 확인한 뒤 다시 시도해주세요.</p>
          </div>
          <button type="button" onClick={() => console.log('retry server connection')}>
            다시 시도
          </button>
        </div>
      )}
    </section>
  )
}

export default DashboardPage
