import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext.jsx'
import TabHeader from '../common/TabHeader.jsx'
import '../../styles/components.css'

export default function HomePage() {
    const { userData } = useApp()
    const navigate = useNavigate()

    const handleInfoEdit = () => navigate('/info')
    const handleGoPolicy = () => navigate('/policy')
    const handleGoChatbot = () => navigate('/chatbot')

    // WelfarePage와 동일한 리스트/카테고리 구성
    const allPolicies = [
        { id: 1, title: '전북 구강보건사업', org: '구강건강관리', due: '25.12.31(수) 마감', category: '보건/의료' },
        { id: 2, title: '서울 청년월세 지원', org: '서울특별시',   due: '상시',              category: '생활/안전' },
        { id: 3, title: '부산 에너지 바우처', org: '부산광역시',   due: '25.10.15(수) 마감', category: '생활/안전' },
        { id: 4, title: '전남 장성 숙박할인', org: '장성군',       due: '25.12.31(수) 마감', category: '신규' },
    ]

    const morePolicies = [
        { id: 101, title: '경기 농촌일손 긴급지원', org: '경기도',       due: '25.09.30(화) 마감' },
        { id: 102, title: '대전 어르신 검진비 지원', org: '대전광역시', due: '25.12.31(수) 마감' },
        { id: 103, title: '전북 농가 재해보험',     org: '전라북도',     due: '상시' },
    ]

    const categories = ['전체', '생활/안전', '보건/의료', '신규', '인기']
    const [activeCategory, setActiveCategory] = useState('전체')
    const filtered = activeCategory === '전체' ? allPolicies : allPolicies.filter(p => p.category === activeCategory)

    return (
        <div className="home-page">
            <TabHeader />

            {/* ✅ WelfarePage 스타일/구조를 그대로 적용 */}
            <div className="page-content welfare-hero">
                <div
                    className="welfare-hero__panel"
                    onClick={handleGoPolicy}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleGoPolicy()
                        }
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="welfare-hero__head">
                        <span className="welfare-hero__title">추천 복지</span>
                        <button
                            type="button"
                            className="linklike"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleInfoEdit()
                            }}
                        >
                            정보수정 &gt;
                        </button>
                    </div>
                    <div className="welfare-hero__count">{userData?.recommendedCount ?? 2}건</div>
                </div>

                {/* 리스트 1: 카테고리 필터 대상 */}
                <section className="policy-list">
                    {/*<h4>많이 본 정책</h4>*/}
                    {filtered.map(p => (
                        <button key={p.id} className="policy-row" onClick={handleGoPolicy} type="button">
                            <img className="policy-row__logo" src="/images/govLogo.png" alt="보건복지부" />
                            <div className="policy-row__body">
                                <p className="policy-row__title">{p.title}</p>
                                <p className="policy-row__meta">
                                    {p.org} <span className="dot">•</span> {p.due}
                                </p>
                            </div>
                        </button>
                    ))}
                </section>

                {/* 카테고리 칩 */}
                <section className="filter-chips filter-chips--below">
                    {categories.map(c => (
                        <button
                            key={c}
                            className={`chip ${activeCategory === c ? 'chip--active' : ''}`}
                            onClick={() => setActiveCategory(c)}
                            type="button"
                        >
                            {c}
                        </button>
                    ))}
                </section>


                {/* 리스트 2: 추가 리스트 */}
                <section className="policy-list policy-list--more">
                    {/*<h4>신규 정책</h4>*/}
                    {morePolicies.map(p => (
                        <button key={p.id} className="policy-row" onClick={handleGoPolicy} type="button">
                            <img className="policy-row__logo" src="/images/govLogo.png" alt="보건복지부" />
                            <div className="policy-row__body">
                                <p className="policy-row__title">{p.title}</p>
                                <p className="policy-row__meta">
                                    {p.org} <span className="dot">•</span> {p.due}
                                </p>
                            </div>
                        </button>
                    ))}
                </section>
            </div>

            {/* 플로팅 챗봇 */}
            <button className="floating-chatbot" onClick={handleGoChatbot} aria-label="챗봇 열기">
                <img src="/images/chatbot.png" alt="챗봇" />
            </button>
        </div>
    )
}
