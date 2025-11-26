import { type ChangeEvent, useState } from 'react'
import { useSalon } from '../contexts/SalonContext'

type BusinessHour = {
  day: string
  open: string
  close: string
  isClosed: boolean
}

const initialBusinessHours: BusinessHour[] = [
  { day: '월', open: '10:00', close: '20:00', isClosed: false },
  { day: '화', open: '10:00', close: '20:00', isClosed: false },
  { day: '수', open: '10:00', close: '20:00', isClosed: false },
  { day: '목', open: '10:00', close: '20:00', isClosed: false },
  { day: '금', open: '10:00', close: '21:00', isClosed: false },
  { day: '토', open: '09:00', close: '19:00', isClosed: false },
  { day: '일', open: '00:00', close: '00:00', isClosed: true },
]

const SettingsPage = () => {
  const { menuLabels, updateMenuLabel, appearance, updateAppearance, selectedSalon } = useSalon()
  const [basicInfo, setBasicInfo] = useState({
    storeName: 'AURA 헤어살롱',
    ownerName: '김아라',
    phone: '02-1234-5678',
    address: '서울특별시 강남구 테헤란로 123',
  })

  const [businessHours, setBusinessHours] = useState<BusinessHour[]>(initialBusinessHours)

  const [policy, setPolicy] = useState({
    minReservationMinutes: 30,
    bookingWindowStart: 1,
    bookingWindowEnd: 30,
    noShowPolicy: '노쇼 발생 시 이후 예약 제한 및 위약금 부과 예정',
  })

  const [systemSettings, setSystemSettings] = useState({
    timezone: 'Asia/Seoul',
    currency: 'KRW',
    language: 'ko',
  })

  const handleBasicInfoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setBasicInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleHourChange = (
    index: number,
    field: keyof Omit<BusinessHour, 'day'>,
    value: string | boolean,
  ) => {
    setBusinessHours((prev) =>
      prev.map((hour, i) => (i === index ? { ...hour, [field]: value } : hour)),
    )
  }

  const handlePolicyChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setPolicy((prev) => ({ ...prev, [name]: value }))
  }

  const handleSystemChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target
    setSystemSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveBasicInfo = () => {
    console.log('기본 정보 저장', basicInfo)
  }

  const handleSavePolicy = () => {
    console.log('예약 정책 저장', policy)
  }

  const handleMenuLabelChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    updateMenuLabel(name as keyof typeof menuLabels, value)
  }

  const handleAppearanceChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    updateAppearance({ [name]: value } as Partial<typeof appearance>)
  }

  return (
    <section className="page settings-page">
      <div>
        <h1 className="page__title">매장 설정</h1>
        <p className="page__description">매장 정보, 영업시간, 예약 정책을 설정합니다.</p>
        {selectedSalon && <p className="page__status">현재 연결된 살롱: {selectedSalon.name}</p>}
      </div>

      <section className="settings-card">
        <h2>기본 정보</h2>
        <div className="form-grid">
          <label>
            매장명
            <input name="storeName" value={basicInfo.storeName} onChange={handleBasicInfoChange} />
          </label>
          <label>
            대표자명
            <input name="ownerName" value={basicInfo.ownerName} onChange={handleBasicInfoChange} />
          </label>
          <label>
            연락처
            <input name="phone" value={basicInfo.phone} onChange={handleBasicInfoChange} />
          </label>
          <label className="full-width">
            주소
            <input name="address" value={basicInfo.address} onChange={handleBasicInfoChange} />
          </label>
        </div>
        <div className="settings-actions">
          <button type="button" onClick={handleSaveBasicInfo}>
            변경 내용 저장
          </button>
        </div>
      </section>

      <section className="settings-card">
        <h2>영업시간 & 휴무</h2>
        <div className="hours-table">
          <div className="hours-row hours-row--header">
            <span>요일</span>
            <span>시작</span>
            <span>종료</span>
            <span>휴무</span>
          </div>
          {businessHours.map((hour, index) => (
            <div key={hour.day} className="hours-row">
              <span>{hour.day}</span>
              <input
                type="time"
                value={hour.open}
                disabled={hour.isClosed}
                onChange={(event) => handleHourChange(index, 'open', event.target.value)}
              />
              <input
                type="time"
                value={hour.close}
                disabled={hour.isClosed}
                onChange={(event) => handleHourChange(index, 'close', event.target.value)}
              />
              <input
                type="checkbox"
                checked={hour.isClosed}
                onChange={(event) => handleHourChange(index, 'isClosed', event.target.checked)}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="settings-card">
        <h2>예약 정책</h2>
        <div className="form-grid">
          <label>
            최소 예약 단위 (분)
            <input
              type="number"
              name="minReservationMinutes"
              value={policy.minReservationMinutes}
              onChange={handlePolicyChange}
            />
          </label>
          <label>
            예약 가능 (며칠 전부터)
            <input
              type="number"
              name="bookingWindowStart"
              value={policy.bookingWindowStart}
              onChange={handlePolicyChange}
            />
          </label>
          <label>
            예약 가능 (며칠 후까지)
            <input
              type="number"
              name="bookingWindowEnd"
              value={policy.bookingWindowEnd}
              onChange={handlePolicyChange}
            />
          </label>
          <label className="full-width">
            노쇼 처리 기준
            <textarea
              name="noShowPolicy"
              rows={3}
              value={policy.noShowPolicy}
              onChange={handlePolicyChange}
            />
          </label>
        </div>
        <div className="settings-actions">
          <button type="button" onClick={handleSavePolicy}>
            정책 저장
          </button>
        </div>
      </section>

      <section className="settings-card">
        <h2>오너 커스터마이징</h2>
        <p className="page__status">메뉴명과 헤더 프레임 색상을 살롱 브랜드에 맞게 조정합니다.</p>
        <div className="form-grid">
          <label>
            Dashboard 라벨
            <input name="dashboard" value={menuLabels.dashboard} onChange={handleMenuLabelChange} />
          </label>
          <label>
            Projects 라벨
            <input name="projects" value={menuLabels.projects} onChange={handleMenuLabelChange} />
          </label>
          <label>
            Teams 라벨
            <input name="teams" value={menuLabels.teams} onChange={handleMenuLabelChange} />
          </label>
          <label>
            Reports 라벨
            <input name="reports" value={menuLabels.reports} onChange={handleMenuLabelChange} />
          </label>
          <label>
            Settings 라벨
            <input name="settings" value={menuLabels.settings} onChange={handleMenuLabelChange} />
          </label>
        </div>

        <div className="form-grid">
          <label>
            프레임 스타일
            <select name="frameStyle" value={appearance.frameStyle} onChange={handleAppearanceChange}>
              <option value="gradient">그라데이션</option>
              <option value="glass">유리질감</option>
            </select>
          </label>
          <label>
            주요 색상
            <input name="primaryColor" value={appearance.primaryColor} onChange={handleAppearanceChange} />
          </label>
          <label>
            포인트 색상
            <input name="accentColor" value={appearance.accentColor} onChange={handleAppearanceChange} />
          </label>
          <label>
            배경 질감
            <select
              name="backgroundTexture"
              value={appearance.backgroundTexture}
              onChange={handleAppearanceChange}
            >
              <option value="mesh">Mesh</option>
              <option value="waves">Waves</option>
              <option value="dots">Dots</option>
            </select>
          </label>
        </div>

        <div className="settings-actions">
          <div className="layout-salon-pill">
            <p>헤더 미리보기</p>
            <strong>{menuLabels.dashboard} · {menuLabels.projects} · {menuLabels.teams}</strong>
            <span>
              {appearance.frameStyle} / {appearance.backgroundTexture}
            </span>
          </div>
        </div>
      </section>

      <section className="settings-card">
        <h2>시스템 설정</h2>
        <div className="form-grid">
          <label>
            타임존
            <select name="timezone" value={systemSettings.timezone} onChange={handleSystemChange}>
              <option value="Asia/Seoul">Asia/Seoul</option>
              <option value="Asia/Tokyo">Asia/Tokyo</option>
              <option value="UTC">UTC</option>
            </select>
          </label>
          <label>
            통화 단위
            <select name="currency" value={systemSettings.currency} onChange={handleSystemChange}>
              <option value="KRW">KRW</option>
              <option value="USD">USD</option>
            </select>
          </label>
          <label>
            언어
            <select name="language" value={systemSettings.language} onChange={handleSystemChange}>
              <option value="ko">한국어</option>
              <option value="en">영어</option>
            </select>
          </label>
        </div>
      </section>
    </section>
  )
}

export default SettingsPage
