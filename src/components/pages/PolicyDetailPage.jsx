// src/pages/PolicyDetailPage.jsx
import { useNavigate } from 'react-router-dom'

export default function PolicyDetailPage() {
    const navigate = useNavigate()

    return (
        <div className="policy-detail-page">
            <header className="detail-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    ←
                </button>
                <h1 className="detail-title">2025 전남 장성 숙박할인 지원사업</h1>
                <div className="header-spacer" />
            </header>

            <div className="badge-row">
                <span className="pill pill--danger">D-144</span>
                <span className="pill pill--info">지원 대상</span>
            </div>

            <section className="summary-card">
                <div className="summary-row">
                    <span className="summary-key">지원혜택</span>
                    <span className="summary-val">최대 5만원 할인</span>
                </div>
                <div className="summary-row">
                    <span className="summary-key">신청기간</span>
                    <span className="summary-val">25.05.01(목)~25.12.31(수)</span>
                </div>
                <div className="summary-row">
                    <span className="summary-key">정책기관</span>
                    <span className="summary-val">전라남도 장성군</span>
                </div>
                <div className="summary-row">
                    <span className="summary-key">담당부서</span>
                    <a className="summary-val" href="tel:0421234586">
                        042-123-4586
                    </a>
                </div>
            </section>

            <section className="detail-section">
                <h2>지원내용</h2>
                <ul className="bullet-list">
                    <li>대상업소: 전남관광플랫폼(JNTOUR)에 등록된 장성군 숙박업소</li>
                    <li>
                        할인구간:
                        <ul className="bullet-list nested">
                            <li>10만원 이상 결제 시 → 4만원 할인</li>
                            <li>7만원 이상 결제 시 → 3만원 할인</li>
                            <li>5만원 이상 결제 시 → 2만원 할인</li>
                        </ul>
                    </li>
                    <li>현장 결제 기준, 타 할인과 중복 적용 불가</li>
                </ul>
            </section>
        </div>
    )
}
