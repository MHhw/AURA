import { useMemo, useState } from 'react'

type StaffRole = '디자이너' | '시니어 디자이너' | '원장' | '스태프'

type StaffMember = {
  id: number
  name: string
  role: StaffRole
  experienceYears: number
  specialties: string[]
  isWorkingToday: boolean
  todayAppointmentsCount: number
  profileImageUrl?: string
}

type WeeklySchedule = Record<number, Record<string, '근무' | '-'>>

const days = ['월', '화', '수', '목', '금', '토', '일']

const staffSeed: StaffMember[] = [
  {
    id: 1,
    name: '이민주',
    role: '원장',
    experienceYears: 12,
    specialties: ['레이어드 컷', '셋팅펌'],
    isWorkingToday: true,
    todayAppointmentsCount: 5,
  },
  {
    id: 2,
    name: '김유나',
    role: '시니어 디자이너',
    experienceYears: 8,
    specialties: ['염색', '클리닉'],
    isWorkingToday: true,
    todayAppointmentsCount: 4,
  },
  {
    id: 3,
    name: '최다온',
    role: '디자이너',
    experienceYears: 5,
    specialties: ['가르마 펌', '다운펌'],
    isWorkingToday: true,
    todayAppointmentsCount: 3,
  },
  {
    id: 4,
    name: '박주원',
    role: '디자이너',
    experienceYears: 4,
    specialties: ['클리닉', '단발 컷'],
    isWorkingToday: false,
    todayAppointmentsCount: 0,
  },
  {
    id: 5,
    name: '정수빈',
    role: '스태프',
    experienceYears: 2,
    specialties: ['샴푸', '케어 보조'],
    isWorkingToday: true,
    todayAppointmentsCount: 8,
  },
  {
    id: 6,
    name: '고은재',
    role: '시니어 디자이너',
    experienceYears: 9,
    specialties: ['볼륨매직', '크리닉 컬러'],
    isWorkingToday: false,
    todayAppointmentsCount: 0,
  },
]

const weeklySchedule: WeeklySchedule = {
  1: { 월: '근무', 화: '근무', 수: '근무', 목: '근무', 금: '근무', 토: '-', 일: '-' },
  2: { 월: '근무', 화: '-', 수: '근무', 목: '-', 금: '근무', 토: '근무', 일: '-' },
  3: { 월: '-', 화: '근무', 수: '근무', 목: '근무', 금: '-', 토: '근무', 일: '-' },
  4: { 월: '근무', 화: '근무', 수: '-', 목: '-', 금: '근무', 토: '-', 일: '-' },
  5: { 월: '근무', 화: '근무', 수: '근무', 목: '근무', 금: '근무', 토: '-', 일: '-' },
  6: { 월: '-', 화: '-', 수: '근무', 목: '근무', 금: '근무', 토: '근무', 일: '-' },
}

const TeamsPage = () => {
  const [staffMembers] = useState<StaffMember[]>(staffSeed)
  const [roleFilter, setRoleFilter] = useState<'전체' | StaffRole>('전체')

  const filteredStaff = useMemo(() => {
    if (roleFilter === '전체') return staffMembers
    return staffMembers.filter((member) => member.role === roleFilter)
  }, [staffMembers, roleFilter])

  return (
    <section className="page teams-page">
      <header className="page-header">
        <div>
          <h1 className="page__title">디자이너 & 스태프</h1>
          <p className="page__description">매장에서 근무하는 디자이너와 스태프의 정보를 관리합니다.</p>
        </div>
        <button className="primary-button" type="button" onClick={() => console.log('새 직원 추가')}>
          새 직원 추가
        </button>
      </header>

      <div className="filter-bar">
        <select
          value={roleFilter}
          onChange={(event) => {
            const value = event.target.value as '전체' | StaffRole
            setRoleFilter(value)
            console.log('직원 역할 필터:', value)
          }}
        >
          <option value="전체">전체</option>
          <option value="디자이너">디자이너</option>
          <option value="시니어 디자이너">시니어 디자이너</option>
          <option value="원장">원장</option>
          <option value="스태프">스태프</option>
        </select>
      </div>

      <div className="staff-grid">
        {filteredStaff.map((member) => (
          <article key={member.id} className="staff-card">
            <div className="staff-card__avatar">
              {member.profileImageUrl ? (
                <img src={member.profileImageUrl} alt={member.name} />
              ) : (
                <span>{member.name.slice(0, 2)}</span>
              )}
            </div>
            <div className="staff-card__body">
              <header>
                <div>
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
                <span className={member.isWorkingToday ? 'status-chip status-chip--active' : 'status-chip'}>
                  {member.isWorkingToday ? '오늘 근무 중' : '휴무'}
                </span>
              </header>
              <p className="staff-card__experience">경력 {member.experienceYears}년</p>
              <div className="specialty-tags">
                {member.specialties.map((specialty) => (
                  <span key={specialty}>{specialty}</span>
                ))}
              </div>
              <p className="staff-card__appointments">오늘 예약 {member.todayAppointmentsCount}건</p>
            </div>
          </article>
        ))}
      </div>

      <section className="schedule-section">
        <h2>주간 스케줄</h2>
        <div className="schedule-table">
          <div className="schedule-table__row schedule-table__row--header">
            <span>직원</span>
            {days.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          {staffMembers.map((member) => (
            <div key={member.id} className="schedule-table__row">
              <span className="schedule-name">{member.name}</span>
              {days.map((day) => (
                <span key={day} className={weeklySchedule[member.id]?.[day] === '근무' ? 'on-duty' : ''}>
                  {weeklySchedule[member.id]?.[day] ?? '-'}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}

export default TeamsPage
