// import { create } from 'zustand';
//
// export const useUserStore = create((set) => ({
//     userInfo: {
//         name: '',
//         gender: '',
//         birthYear: '',
//         address: '',
//         region: '',
//         isSingleHousehold: null,
//         hasDependents: null,
//         isLowIncome: null,
//     },
//
//     setUserInfo: (info) => set((state) => ({
//         userInfo: { ...state.userInfo, ...info }
//     })),
//
//     resetUserInfo: () => set({
//         userInfo: {
//             name: '',
//             gender: '',
//             birthYear: '',
//             address: '',
//             region: '',
//             isSingleHousehold: null,
//             hasDependents: null,
//             isLowIncome: null,
//         }
//     }),
//
//     getRecommendations: (state) => {
//         const { userInfo } = state;
//         const recommendations = [];
//         const currentYear = new Date().getFullYear();
//         const age = currentYear - parseInt(userInfo.birthYear);
//
//         // 기본 농촌 복지 혜택
//         recommendations.push({
//             id: 1,
//             title: '전북 구강보건사업',
//             agency: '구강건강과',
//             period: '25.05.01(목)~25.12.31(수)',
//             contact: '042-123-4586',
//             description: '농촌 지역 주민 대상 구강건강 검진 및 치료 지원',
//             eligible: true
//         });
//
//         // 연령별 혜택
//         if (age >= 65) {
//             recommendations.push({
//                 id: 2,
//                 title: '농촌 노인 건강관리 지원사업',
//                 agency: '농촌진흥청',
//                 period: '25.01.01(수)~25.12.31(수)',
//                 contact: '042-456-7890',
//                 description: '65세 이상 농촌 거주 노인 대상 건강검진 및 의료비 지원',
//                 eligible: true
//             });
//         }
//
//         // 1인 가구 혜택
//         if (userInfo.isSingleHousehold) {
//             recommendations.push({
//                 id: 3,
//                 title: '농촌 1인 가구 생활안전 지원',
//                 agency: '농림축산식품부',
//                 period: '25.03.01(토)~25.11.30(토)',
//                 contact: '042-789-0123',
//                 description: '농촌 지역 1인 가구 대상 생활안전용품 지원 및 안전점검 서비스',
//                 eligible: true
//             });
//         }
//
//         // 부양가족이 있는 경우
//         if (userInfo.hasDependents) {
//             recommendations.push({
//                 id: 4,
//                 title: '농가 육아 돌봄 지원사업',
//                 agency: '농촌진흥청',
//                 period: '25.01.01(수)~25.12.31(수)',
//                 contact: '042-234-5678',
//                 description: '농업에 종사하는 가정의 육아 및 돌봄 서비스 지원',
//                 eligible: true
//             });
//         }
//
//         // 저소득층 혜택
//         if (userInfo.isLowIncome) {
//             recommendations.push({
//                 id: 5,
//                 title: '농촌 저소득층 주거환경 개선',
//                 agency: '국토교통부',
//                 period: '25.02.01(토)~25.10.31(금)',
//                 contact: '042-345-6789',
//                 description: '농촌 지역 저소득층 대상 주택 개보수 및 생활환경 개선 지원',
//                 eligible: true
//             });
//         }
//
//         return recommendations;
//     }
// }));

import { create } from 'zustand';

export const useUserStore = create((set) => ({
    userInfo: {
        name: '',
        gender: '',
        birthYear: '',
        address: '',
        region: '',
        isSingleHousehold: null,
        hasDependents: null,
        isLowIncome: null,
    },

    setUserInfo: (info) => set((state) => ({
        userInfo: { ...state.userInfo, ...info }
    })),

    resetUserInfo: () => set({
        userInfo: {
            name: '',
            gender: '',
            birthYear: '',
            address: '',
            region: '',
            isSingleHousehold: null,
            hasDependents: null,
            isLowIncome: null,
        }
    }),

    getRecommendations: (state) => {
        const { userInfo } = state;
        const recommendations = [];
        const currentYear = new Date().getFullYear();
        const age = currentYear - parseInt(userInfo.birthYear);

        // 기본 농촌 복지 혜택
        recommendations.push({
            id: 1,
            title: '전북 구강보건사업',
            agency: '구강건강과',
            period: '25.05.01(목)~25.12.31(수)',
            contact: '042-123-4586',
            description: '농촌 지역 주민 대상 구강건강 검진 및 치료 지원',
            eligible: true
        });

        // 연령별 혜택
        if (age >= 65) {
            recommendations.push({
                id: 2,
                title: '농촌 노인 건강관리 지원사업',
                agency: '농촌진흥청',
                period: '25.01.01(수)~25.12.31(수)',
                contact: '042-456-7890',
                description: '65세 이상 농촌 거주 노인 대상 건강검진 및 의료비 지원',
                eligible: true
            });
        }

        // 1인 가구 혜택
        if (userInfo.isSingleHousehold) {
            recommendations.push({
                id: 3,
                title: '농촌 1인 가구 생활안전 지원',
                agency: '농림축산식품부',
                period: '25.03.01(토)~25.11.30(토)',
                contact: '042-789-0123',
                description: '농촌 지역 1인 가구 대상 생활안전용품 지원 및 안전점검 서비스',
                eligible: true
            });
        }

        // 부양가족이 있는 경우
        if (userInfo.hasDependents) {
            recommendations.push({
                id: 4,
                title: '농가 육아 돌봄 지원사업',
                agency: '농촌진흥청',
                period: '25.01.01(수)~25.12.31(수)',
                contact: '042-234-5678',
                description: '농업에 종사하는 가정의 육아 및 돌봄 서비스 지원',
                eligible: true
            });
        }

        // 저소득층 혜택
        if (userInfo.isLowIncome) {
            recommendations.push({
                id: 5,
                title: '농촌 저소득층 주거환경 개선',
                agency: '국토교통부',
                period: '25.02.01(토)~25.10.31(금)',
                contact: '042-345-6789',
                description: '농촌 지역 저소득층 대상 주택 개보수 및 생활환경 개선 지원',
                eligible: true
            });
        }

        return recommendations;
    }
}));

