import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type MenuLabels = {
  dashboard: string
  projects: string
  teams: string
  reports: string
  settings: string
}

export type SalonAppearance = {
  primaryColor: string
  accentColor: string
  frameStyle: 'gradient' | 'glass'
  backgroundTexture: 'dots' | 'mesh' | 'waves'
}

export type Salon = {
  id: string
  name: string
  description: string
  address: string
  city: string
  tags: string[]
  heroImage: string
  rating: number
  reviewCount: number
  services: string[]
  ownerName: string
  menuOverrides?: Partial<MenuLabels>
  theme: SalonAppearance
}

type SalonContextValue = {
  salons: Salon[]
  selectedSalon: Salon | null
  menuLabels: MenuLabels
  appearance: SalonAppearance
  selectSalon: (id: string) => void
  clearSalon: () => void
  updateMenuLabel: (key: keyof MenuLabels, value: string) => void
  updateAppearance: (appearance: Partial<SalonAppearance>) => void
}

const defaultMenuLabels: MenuLabels = {
  dashboard: 'Dashboard',
  projects: 'Projects',
  teams: 'Teams',
  reports: 'Reports',
  settings: 'Settings',
}

const defaultAppearance: SalonAppearance = {
  primaryColor: '#0ea5e9',
  accentColor: '#818cf8',
  frameStyle: 'gradient',
  backgroundTexture: 'mesh',
}

const salonSeeds: Salon[] = [
  {
    id: 'aura-seongsu',
    name: 'AURA 성수 플래그십',
    description: '트렌디한 감성과 자연스러운 결을 살리는 시그니처 디자인을 만나보세요.',
    address: '서울 성동구 연무장길 64',
    city: '서울',
    tags: ['레이어드컷', '염색', '헤드스파'],
    heroImage:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    reviewCount: 182,
    services: ['시그니처 커트', '톤온톤 염색', '두피 스파'],
    ownerName: '김아라',
    menuOverrides: {
      dashboard: '살롱 홈',
      projects: '예약 관리',
      teams: '스태프',
      reports: '매출 리포트',
      settings: '브랜딩 설정',
    },
    theme: {
      primaryColor: '#38bdf8',
      accentColor: '#818cf8',
      frameStyle: 'gradient',
      backgroundTexture: 'mesh',
    },
  },
  {
    id: 'aura-busan',
    name: 'AURA 부산 광안',
    description: '바다처럼 편안한 무드와 탄탄한 기술로 웰니스 헤어 케어를 제공합니다.',
    address: '부산 수영구 광안해변로 203',
    city: '부산',
    tags: ['클리닉', '열펌', '맨즈컷'],
    heroImage:
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    reviewCount: 126,
    services: ['모발 복구 클리닉', '볼륨 매직', '버즈컷'],
    ownerName: '박지훈',
    theme: {
      primaryColor: '#22d3ee',
      accentColor: '#0ea5e9',
      frameStyle: 'glass',
      backgroundTexture: 'waves',
    },
  },
  {
    id: 'aura-daegu',
    name: 'AURA 대구 센트럴',
    description: '비건 케어 라인과 맞춤 진단으로 모발 본연의 힘을 살립니다.',
    address: '대구 중구 동성로4길 78',
    city: '대구',
    tags: ['비건 케어', '복구펌', '웨딩'],
    heroImage:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    reviewCount: 98,
    services: ['비건 케어 패키지', '레이어드 C컬', '웨딩 시뮬레이션'],
    ownerName: '최다온',
    theme: {
      primaryColor: '#a855f7',
      accentColor: '#6366f1',
      frameStyle: 'gradient',
      backgroundTexture: 'dots',
    },
  },
]

const SalonContext = createContext<SalonContextValue | undefined>(undefined)

export const SalonProvider = ({ children }: { children: ReactNode }) => {
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null)
  const [menuLabels, setMenuLabels] = useState<MenuLabels>(defaultMenuLabels)
  const [appearance, setAppearance] = useState<SalonAppearance>(defaultAppearance)

  const selectSalon = useCallback((id: string) => {
    const salon = salonSeeds.find((item) => item.id === id) || null
    setSelectedSalon(salon)
    if (salon?.menuOverrides) {
      setMenuLabels({ ...defaultMenuLabels, ...salon.menuOverrides })
    } else {
      setMenuLabels(defaultMenuLabels)
    }
    if (salon) {
      setAppearance(salon.theme)
    }
  }, [])

  const clearSalon = useCallback(() => {
    setSelectedSalon(null)
    setMenuLabels(defaultMenuLabels)
    setAppearance(defaultAppearance)
  }, [])

  const updateMenuLabel = useCallback((key: keyof MenuLabels, value: string) => {
    setMenuLabels((prev) => ({ ...prev, [key]: value }))
  }, [])

  const updateAppearance = useCallback((nextAppearance: Partial<SalonAppearance>) => {
    setAppearance((prev) => ({ ...prev, ...nextAppearance }))
  }, [])

  const value = useMemo(
    () => ({
      salons: salonSeeds,
      selectedSalon,
      menuLabels,
      appearance,
      selectSalon,
      clearSalon,
      updateMenuLabel,
      updateAppearance,
    }),
    [appearance, menuLabels, selectedSalon, selectSalon, updateAppearance, updateMenuLabel],
  )

  return <SalonContext.Provider value={value}>{children}</SalonContext.Provider>
}

export const useSalon = () => {
  const context = useContext(SalonContext)
  if (!context) {
    throw new Error('useSalon must be used within a SalonProvider')
  }

  return context
}
