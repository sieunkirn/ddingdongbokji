import { useApp } from '../../contexts/AppContext.jsx'
import { useNavigate } from 'react-router-dom'
import TabHeader from '../common/TabHeader.jsx'
import '../../styles/components.css'

export default function MyPage() {
    const { userData } = useApp()
    const navigate = useNavigate()

    const handleGoChatbot = () => navigate('/chatbot')
    const handleInfoEdit = () => navigate('/info')

    const hasUserInfo = Boolean(
        (userData?.name ?? '').trim() &&
        (userData?.birthYear ?? '').toString().trim() &&
        (userData?.address?.full ?? '').trim()
    )

    return (
        <div className="my-page">
            <TabHeader />

            {/* ✅ 공통 레이아웃 적용 */}
            <div className="page-content">
                {hasUserInfo ? (
                    <div className="user-info-card my-info-card">
                        <div>
                            <div className="my-name-line">
                                {userData.name} / {userData.birthYear}년생
                            </div>
                            <div className="my-address-line">{userData.address.full}</div>
                        </div>
                        <button className="my-edit-link" onClick={handleInfoEdit} type="button">
                            정보수정 &gt;
                        </button>
                    </div>
                ) : (
                    <div className="no-info-card my-info-card">
                        <div>
                            <div className="my-name-line">등록된 정보가 없습니다</div>
                            <div className="my-address-line">맞춤 추천을 위해 정보를 등록해 주세요.</div>
                        </div>
                        <button className="register-button" onClick={handleInfoEdit} type="button">
                            정보 등록하기
                        </button>
                    </div>
                )}
            </div>

            {/* 플로팅 챗봇 */}
            <button className="floating-chatbot" onClick={handleGoChatbot} type="button" aria-label="챗봇 열기">
                <img src="/images/chatbot.png" alt="챗봇" />
            </button>
        </div>
    )
}
