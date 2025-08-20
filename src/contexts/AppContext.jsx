// // import { createContext, useContext, useEffect, useMemo, useState } from 'react'
// //
// // const AppContext = createContext(null)
// // const LS_KEY = 'app:userData'
// //
// // const defaultUserData = {
// //     name: '',
// //     birthYear: '',
// //     address: { full: '' },
// // }
// //
// // export function AppProvider({ children }) {
// //     const [userData, setUserData] = useState(() => {
// //         try {
// //             const saved = localStorage.getItem(LS_KEY)
// //             return saved ? JSON.parse(saved) : defaultUserData
// //         } catch {
// //             return defaultUserData
// //         }
// //     })
// //
// //     // 변경 시 로컬스토리지에 저장
// //     useEffect(() => {
// //         try {
// //             localStorage.setItem(LS_KEY, JSON.stringify(userData))
// //         } catch {}
// //     }, [userData])
// //
// //     const value = useMemo(() => ({
// //         userData,
// //         setUserData,
// //         resetUserData: () => setUserData(defaultUserData),
// //     }), [userData])
// //
// //     return <AppContext.Provider value={value}>{children}</AppContext.Provider>
// // }
// //
// // export const useApp = () => useContext(AppContext)
// import { createContext, useContext, useEffect, useMemo, useState } from 'react'
//
// const AppContext = createContext(null)
// const LS_KEY = 'app:userData'
//
// const defaultUserData = {
//     name: '',
//     gender: '',
//     birthYear: '',
//     address: { full: '', detail: '', regionConfirmed: null },
//     family: { householdSize: '', dependents: '' },
// }
//
// export function AppProvider({ children }) {
//     const [userData, setUserData] = useState(() => {
//         try {
//             const saved = localStorage.getItem(LS_KEY)
//             return saved ? JSON.parse(saved) : defaultUserData
//         } catch {
//             return defaultUserData
//         }
//     })
//
//     useEffect(() => {
//         try {
//             localStorage.setItem(LS_KEY, JSON.stringify(userData))
//         } catch {}
//     }, [userData])
//
//     const value = useMemo(() => ({
//         userData,
//         setUserData,
//         resetUserData: () => setUserData(defaultUserData),
//     }), [userData])
//
//     return <AppContext.Provider value={value}>{children}</AppContext.Provider>
// }
//
// export const useApp = () => useContext(AppContext)


// contexts/AppContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AppContext = createContext(null)

const STORAGE_KEY = 'app:userData:v1'

export function AppProvider({ children }) {
    const [userData, setUserData] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            return saved ? JSON.parse(saved) : {}
        } catch {
            return {}
        }
    })

    const [currentTab, setCurrentTab] = useState('home')

    // 로컬스토리지 동기화
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userData || {}))
        } catch {}
    }, [userData])

    const value = useMemo(() => ({
        userData,
        setUserData,
        currentTab,
        setCurrentTab,
    }), [userData, currentTab])

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
