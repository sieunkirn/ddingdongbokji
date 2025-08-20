import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'
import Input from '../common/Input'
import RadioGroup from '../common/RadioGroup'
import Select from '../common/Select'
import Button from '../common/Button'

export default function UserInfoPage() {
    const { userData, updateUserData } = useApp()
    const navigate = useNavigate()

    const [name, setName] = useState(userData.name || '')
    const [gender, setGender] = useState(userData.gender || '')
    const [birthYear, setBirthYear] = useState(userData.birthYear || '')

    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 80 }, (_, i) => `${currentYear - i}년`)

    const handleNext = () => {
        updateUserData({ name, gender, birthYear })
        navigate('/address')
    }

    const isValid = name && gender && birthYear

    return (
        <div className="page">
            <div className="page-header">
                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                    aria-label="뒤로 가기"
                >
                    ←
                </button>
                <h1 className="page-title">고객님의 정보를 입력해 주세요.</h1>
            </div>

            <div className="page-content">
                <Input
                    label="이름"
                    value={name}
                    onChange={setName}
                    placeholder="김은희"
                    required
                />

                <RadioGroup
                    label="성별"
                    name="gender"
                    options={[
                        { label: '여자', value: '여자' },
                        { label: '남자', value: '남자' }
                    ]}
                    value={gender}
                    onChange={setGender}
                    required
                />

                <Select
                    label="출생년도"
                    options={years}
                    value={birthYear}
                    onChange={setBirthYear}
                    placeholder="1956년"
                    required
                />
            </div>

            <div className="page-footer">
                <Button
                    onClick={handleNext}
                    disabled={!isValid}
                >
                    다음
                </Button>
            </div>
        </div>
    )
}
