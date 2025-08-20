import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext.jsx'
import "../../styles/wizard.css"

export default function FamilyInfoPage() {
    const { userData, setUserData } = useApp()
    const navigate = useNavigate()

    // 초기값 반영
    const [isSingle, setIsSingle] = useState(userData?.family?.isSingle ?? null)
    const [hasDependants, setHasDependants] = useState(userData?.family?.hasDependants ?? null)
    const [isLowIncome, setIsLowIncome] = useState(userData?.family?.isLowIncome ?? null)

    const isValid = [isSingle, hasDependants, isLowIncome].every(v => v !== null)

    const onSubmit = (e) => {
        e.preventDefault()
        if (!isValid) return

        setUserData(prev => ({
            ...prev,
            family: { isSingle, hasDependants, isLowIncome },
            isComplete: true
        }))

        // 온보딩 완료 후 추천복지로 이동
        navigate('/home')
    }

    const Toggle = ({ label, value, on }) => (
        <div className="block">
            <label>{label}</label>
            <div className="btn-group">
                <button
                    type="button"
                    className={`btn ${value === true ? 'btn--primary' : 'btn--ghost'}`}
                    onClick={() => on(true)}
                >
                    네
                </button>
                <button
                    type="button"
                    className={`btn ${value === false ? 'btn--primary' : 'btn--ghost'}`}
                    onClick={() => on(false)}
                >
                    아니오
                </button>
            </div>
        </div>
    )

    return (
        <div className="page">
            {/* 상단 헤더: 이전 버튼 */}
            <div className="page-header">
                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                    aria-label="뒤로 가기"
                >
                    ←
                </button>
                <h2>가족구성을 입력해 주세요.</h2>
            </div>

            <form onSubmit={onSubmit}>
                <Toggle label="1인 가구 이신가요?" value={isSingle} on={setIsSingle} />
                <Toggle label="부양 가족이 있으신가요?" value={hasDependants} on={setHasDependants} />
                <Toggle label="저소득층에 해당 하시나요?" value={isLowIncome} on={setIsLowIncome} />

                <button
                    type="submit"
                    className="btn btn--primary btn--large"
                    disabled={!isValid}
                >
                    다음
                </button>
            </form>
        </div>
    )
}
