import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StartPage from './components/pages/StartPage.jsx';
import UserInfoPage from './components/pages/UserInfoPage.jsx';
import AddressPage from './components/pages/AddressPage.jsx';
import FamilyInfoPage from './components/pages/FamilyInfoPage.jsx';
import HomePage from './components/pages/HomePage.jsx';
import MyPage from './components/pages/MyPage.jsx';
import WelfarePage from './components/pages/WelfarePage.jsx';
import ChatbotPage from "./components/pages/ChatbotPage.jsx";
import PolicyDetailPage from "./components/pages/PolicyDetailPage.jsx";
import './styles/components.css';

// ✅ 진단용 API
import { ping } from './services/health';

function App() {
    // ✅ 진단 버튼 상태
    const [loading, setLoading] = useState(false);
    const [ok, setOk] = useState('');
    const [err, setErr] = useState('');

    const handlePing = async () => {
        setLoading(true);
        setOk('');
        setErr('');
        try {
            const data = await ping();
            setOk(JSON.stringify(data));
        } catch (e) {
            setErr(e?.message || '요청 실패');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            {/* ✅ 화면 어디서든 눌러볼 수 있는 고정 진단 버튼 */}
            <div style={{
                position: 'fixed', right: 12, bottom: 12, zIndex: 9999,
                display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 280
            }}>
                <button
                    onClick={handlePing}
                    style={{
                        padding: '10px 14px',
                        borderRadius: 10,
                        border: '1px solid #ddd',
                        background: '#fff',
                        cursor: 'pointer'
                    }}
                    title="백엔드 연결 확인"
                >
                    🔌 백엔드 헬스체크
                </button>
                {loading && <div style={{background:'#fff', padding:'8px 10px', borderRadius:8, border:'1px solid #eee'}}>요청 중…</div>}
                {ok && <pre style={{background:'#f6ffed', padding:'8px 10px', borderRadius:8, border:'1px solid #b7eb8f', whiteSpace:'pre-wrap'}}>{ok}</pre>}
                {err && <pre style={{background:'#fff2f0', padding:'8px 10px', borderRadius:8, border:'1px solid #ffccc7', whiteSpace:'pre-wrap'}}>{err}</pre>}
            </div>

            {/* 기존 라우팅 */}
            <Routes>
                <Route path="/" element={<StartPage />} />
                <Route path="/info" element={<UserInfoPage />} />
                <Route path="/address" element={<AddressPage />} />
                <Route path="/family" element={<FamilyInfoPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/my" element={<MyPage />} />
                <Route path="/welfare" element={<WelfarePage />} />
                <Route path="/chatbot" element={<ChatbotPage />} />
                <Route path="/policy" element={<PolicyDetailPage />} />  {/* :id 가능 */}
                <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
        </div>
    );
}

export default App;

// import {Routes, Route, Navigate} from 'react-router-dom'
// import StartPage from './components/pages/StartPage.jsx'
// import UserInfoPage from './components/pages/UserInfoPage.jsx'
// import AddressPage from './components/pages/AddressPage.jsx'
// import FamilyInfoPage from './components/pages/FamilyInfoPage.jsx'
// import HomePage from './components/pages/HomePage.jsx'
// import MyPage from './components/pages/MyPage.jsx'
// import WelfarePage from './components/pages/WelfarePage.jsx'
// import ChatbotPage from "./components/pages/ChatbotPage.jsx";
// import './styles/components.css'
// import PolicyDetailPage from "./components/pages/PolicyDetailPage.jsx";
//
// function App() {
//     return (
//         <div className="app-container">
//             <Routes>
//                 <Route path="/" element={<StartPage />} />
//                 <Route path="/info" element={<UserInfoPage />} />
//                 <Route path="/address" element={<AddressPage />} />
//                 <Route path="/family" element={<FamilyInfoPage />} />
//                 <Route path="/home" element={<HomePage />} />
//                 <Route path="/my" element={<MyPage />} />
//                 <Route path="/welfare" element={<WelfarePage />} />
//                 <Route path="/chatbot" element={<ChatbotPage />} />
//                 <Route path="/policy" element={<PolicyDetailPage />} />  {/*:id*/}
//                 <Route path="*" element={<Navigate to="/home" replace />} />
//             </Routes>
//         </div>
//     )
// }
//
// export default App
