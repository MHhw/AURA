import { type ChangeEvent, type Dispatch, type SetStateAction, useEffect, useMemo, useState } from 'react'

type StyleCategory = '컷' | '펌' | '염색' | '클리닉'
type StyleGender = '남성' | '여성' | '공용'
type StyleLength = '쇼트' | '미디' | '롱' | '전체'

type StyleItem = {
  id: number
  name: string
  category: StyleCategory
  gender: StyleGender
  length: StyleLength
  price: number
  durationMinutes: number
  thumbnailUrl?: string
  isActive: boolean
  description?: string
}

const initialStyles: StyleItem[] = [
  {
    id: 1,
    name: '레이어드 컷',
    category: '컷',
    gender: '공용',
    length: '롱',
    price: 65000,
    durationMinutes: 60,
    isActive: true,
    description: '자연스러운 층과 볼륨감을 살리는 커트',
  },
  {
    id: 2,
    name: '보브 단발 컷',
    category: '컷',
    gender: '여성',
    length: '쇼트',
    price: 55000,
    durationMinutes: 45,
    isActive: true,
  },
  {
    id: 3,
    name: '스핀스왈로 펌',
    category: '펌',
    gender: '남성',
    length: '전체',
    price: 120000,
    durationMinutes: 110,
    isActive: true,
  },
  {
    id: 4,
    name: '셋팅펌',
    category: '펌',
    gender: '여성',
    length: '롱',
    price: 160000,
    durationMinutes: 150,
    isActive: true,
  },
  {
    id: 5,
    name: '크리닉 컬러',
    category: '염색',
    gender: '공용',
    length: '전체',
    price: 180000,
    durationMinutes: 140,
    isActive: false,
  },
  {
    id: 6,
    name: '톤다운 염색',
    category: '염색',
    gender: '공용',
    length: '미디',
    price: 140000,
    durationMinutes: 120,
    isActive: true,
  },
  {
    id: 7,
    name: '두피 케어 클리닉',
    category: '클리닉',
    gender: '공용',
    length: '전체',
    price: 90000,
    durationMinutes: 70,
    isActive: true,
  },
  {
    id: 8,
    name: '모발 복구 클리닉',
    category: '클리닉',
    gender: '공용',
    length: '전체',
    price: 130000,
    durationMinutes: 90,
    isActive: false,
  },
  {
    id: 9,
    name: '볼륨매직',
    category: '펌',
    gender: '공용',
    length: '롱',
    price: 190000,
    durationMinutes: 160,
    isActive: true,
  },
  {
    id: 10,
    name: '테이퍼 페이드 컷',
    category: '컷',
    gender: '남성',
    length: '쇼트',
    price: 45000,
    durationMinutes: 40,
    isActive: true,
  },
]

const ProjectsPage = () => {
  const [styles, setStyles] = useState<StyleItem[]>(initialStyles)
  const [categoryFilter, setCategoryFilter] = useState<'전체' | StyleCategory>('전체')
  const [genderFilter, setGenderFilter] = useState<'전체' | StyleGender>('전체')
  const [lengthFilter, setLengthFilter] = useState<'전체' | Exclude<StyleLength, '전체'>>('전체')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [editingStyleId, setEditingStyleId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    durationMinutes: '',
    description: '',
  })

  const editingStyle = styles.find((style) => style.id === editingStyleId) ?? null

  useEffect(() => {
    if (editingStyle) {
      setEditForm({
        name: editingStyle.name,
        price: editingStyle.price.toString(),
        durationMinutes: editingStyle.durationMinutes.toString(),
        description: editingStyle.description ?? '',
      })
    }
  }, [editingStyle])

  const filteredStyles = useMemo(() => {
    return styles.filter((style) => {
      if (categoryFilter !== '전체' && style.category !== categoryFilter) return false
      if (genderFilter !== '전체' && style.gender !== genderFilter) return false
      if (lengthFilter !== '전체' && style.length !== lengthFilter) return false
      if (searchKeyword.trim()) {
        const keyword = searchKeyword.toLowerCase()
        return style.name.toLowerCase().includes(keyword)
      }
      return true
    })
  }, [styles, categoryFilter, genderFilter, lengthFilter, searchKeyword])

  const handleFilterChange = <T extends string>(
    label: string,
    setter: Dispatch<SetStateAction<T>>,
  ) => {
    return (event: ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value as T
      setter(value)
      console.log(`${label} 필터:`, value)
    }
  }

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value)
    console.log('검색어:', event.target.value)
  }

  const toggleActiveStatus = (id: number) => {
    setStyles((prev) =>
      prev.map((style) => (style.id === id ? { ...style, isActive: !style.isActive } : style)),
    )
  }

  const handleEditFieldChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    if (!editingStyle) return
    console.log('수정된 스타일 정보', { id: editingStyle.id, ...editForm })
    setEditingStyleId(null)
  }

  return (
    <section className="page projects-page">
      <header className="page-header">
        <div>
          <h1 className="page__title">스타일 & 메뉴 관리</h1>
          <p className="page__description">미용실에서 제공하는 시술 메뉴와 스타일을 관리합니다.</p>
        </div>
        <button className="primary-button" type="button" onClick={() => console.log('새 스타일 추가')}>
          새 스타일 추가
        </button>
      </header>

      <div className="filter-bar">
        <select value={categoryFilter} onChange={handleFilterChange('카테고리', setCategoryFilter)}>
          <option value="전체">전체</option>
          <option value="컷">컷</option>
          <option value="펌">펌</option>
          <option value="염색">염색</option>
          <option value="클리닉">클리닉</option>
        </select>
        <select value={genderFilter} onChange={handleFilterChange('성별', setGenderFilter)}>
          <option value="전체">전체</option>
          <option value="남성">남성</option>
          <option value="여성">여성</option>
          <option value="공용">공용</option>
        </select>
        <select value={lengthFilter} onChange={handleFilterChange('길이', setLengthFilter)}>
          <option value="전체">전체</option>
          <option value="쇼트">쇼트</option>
          <option value="미디">미디</option>
          <option value="롱">롱</option>
        </select>
        <input
          type="text"
          placeholder="스타일 이름 또는 키워드 검색"
          value={searchKeyword}
          onChange={handleSearchChange}
        />
      </div>

      <div className="style-grid">
        {filteredStyles.map((style) => (
          <article key={style.id} className="style-card">
            <div className="style-card__thumbnail">
              {style.thumbnailUrl ? <img src={style.thumbnailUrl} alt={style.name} /> : <span>No Image</span>}
            </div>
            <div className="style-card__body">
              <header>
                <div>
                  <h3>{style.name}</h3>
                  <div className="style-tags">
                    <span>{style.category}</span>
                    <span>{style.gender}</span>
                    <span>{style.length}</span>
                  </div>
                </div>
                <button type="button" className="ghost-button" onClick={() => setEditingStyleId(style.id)}>
                  수정
                </button>
              </header>
              <p className="style-card__price">{style.price.toLocaleString('ko-KR')}원 · 약 {style.durationMinutes}분</p>
              <div className="style-card__actions">
                <span className={style.isActive ? 'status-chip status-chip--active' : 'status-chip'}>
                  {style.isActive ? '판매 중' : '숨김'}
                </span>
                <button type="button" onClick={() => toggleActiveStatus(style.id)}>
                  {style.isActive ? '숨기기' : '판매 전환'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {editingStyle && (
        <div className="style-editor">
          <div className="style-editor__header">
            <div>
              <h2>스타일 정보 수정</h2>
              <p>{editingStyle.name}의 기본 정보를 수정합니다.</p>
            </div>
            <button type="button" className="ghost-button" onClick={() => setEditingStyleId(null)}>
              닫기
            </button>
          </div>
          <div className="style-editor__form">
            <label>
              스타일 이름
              <input name="name" value={editForm.name} onChange={handleEditFieldChange} />
            </label>
            <label>
              가격
              <input name="price" type="number" value={editForm.price} onChange={handleEditFieldChange} />
            </label>
            <label>
              소요시간(분)
              <input
                name="durationMinutes"
                type="number"
                value={editForm.durationMinutes}
                onChange={handleEditFieldChange}
              />
            </label>
            <label>
              설명
              <textarea name="description" rows={3} value={editForm.description} onChange={handleEditFieldChange} />
            </label>
          </div>
          <div className="style-editor__actions">
            <button type="button" className="ghost-button" onClick={() => setEditingStyleId(null)}>
              취소
            </button>
            <button type="button" onClick={handleSave}>
              저장
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProjectsPage
