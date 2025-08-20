// src/components/common/TabHeader.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext.jsx';
import farmer from '/assets/farmer.png';

export default function TabHeader() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setCurrentTab } = useApp();

    const path = location.pathname;

    const headerVariant = path.startsWith('/welfare')
        ? 'welfare'
        : path.startsWith('/my')
            ? 'my'
            : 'home';

    const activeTab = headerVariant; // home | welfare | my

    const handleTabClick = (tab) => {
        setCurrentTab?.(tab);
        navigate(`/${tab}`);
    };

    return (
        <div className={`expanded-header expanded-header--${headerVariant}`}>
            <div className="tab-navigation">
                <button
                    type="button"
                    className={`tab-item ${activeTab === 'home' ? 'active' : ''}`}
                    onClick={() => handleTabClick('home')}
                >
                    홈
                </button>
                <button
                    type="button"
                    className={`tab-item ${activeTab === 'welfare' ? 'active' : ''}`}
                    onClick={() => handleTabClick('welfare')}
                >
                    추천복지
                </button>
                <button
                    type="button"
                    className={`tab-item ${activeTab === 'my' ? 'active' : ''}`}
                    onClick={() => handleTabClick('my')}
                >
                    마이
                </button>
            </div>

            <img className="farmer-img-expanded" src={farmer} alt="" />
        </div>
    );
}
