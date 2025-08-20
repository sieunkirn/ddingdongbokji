// src/components/pages/StartPage.jsx
import { useNavigate } from 'react-router-dom'
import '../../styles/components.css';



export default function StartPage() {
    const navigate = useNavigate()

    return (
        <div className="start-page">
            <div className="start-image-wrapper">

                <img
                    src="/images/dingdong-splash.png"
                    alt="띵동복지 시작화면 - 나만의 농촌복지알림이"
                    className="start-splash-image cover"
                />
            </div>

            {/* 기존 버튼 스펙 유지 */}
            <button
                className="start-button-custom"
                onClick={() => navigate('/home')}
            >
                시작하기
            </button>
        </div>
    )
}

