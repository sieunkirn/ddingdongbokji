

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext.jsx'
import TabHeader from '../common/TabHeader.jsx'
import "../../styles/wizard.css"

export default function UserInfoPage() {
    const { userData, setUserData } = useApp()
    const navigate = useNavigate()

    const [name, setName] = useState(userData?.name || '')
    const [gender, setGender] = useState(userData?.gender || '') // 'F' | 'M'
    const [birthYear, setBirthYear] = useState(userData?.birthYear || '')

    const years = useMemo(() => {
        const now = new Date().getFullYear()
        return Array.from({ length: 100 }, (_, i) => now - i) // 최근 100년
    }, [])

    const isValid = !!(name.trim() && (gender === 'F' || gender === 'M') && birthYear)

    const onSubmit = (e) => {
        e.preventDefault()
        if (!isValid) return
        setUserData(prev => ({
            ...prev,
            name: name.trim(),
            gender,
            birthYear: Number(birthYear),
        }))
        navigate('/address')
    }

    return (
        <div className="page">
            {/* 상단 헤더 (이전 버튼 포함) */}
            <div className="page-header">
                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                    aria-label="뒤로 가기"
                >
                    ←
                </button>
                <h2>고객님의 정보를 입력해 주세요.</h2>
            </div>

            <form onSubmit={onSubmit}>
                <label>이름</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름을 입력하세요"
                />

                <label>성별</label>
                <div className="btn-group">
                    <button type="button"
                            className={`btn ${gender === 'F' ? 'btn--primary' : 'btn--ghost'}`}
                            onClick={() => setGender('F')}
                    >여자</button>
                    <button type="button"
                            className={`btn ${gender === 'M' ? 'btn--primary' : 'btn--ghost'}`}
                            onClick={() => setGender('M')}
                    >남자</button>
                </div>

                <label>출생년도</label>
                <select value={birthYear} onChange={(e) => setBirthYear(e.target.value)}>
                    <option value="" disabled>출생년도를 선택하세요</option>
                    {years.map(y => <option key={y} value={y}>{y}년</option>)}
                </select>

                <button type="submit" className="btn btn--primary btn--large" disabled={!isValid}>
                    다음
                </button>
            </form>
        </div>
    )
}
