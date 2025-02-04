import React, { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from './store/hooks'
import { setCredentials } from './features/auth/authSlice'
import LoginForm from './components/loginForm'
import ChatPage from './pages/chatPage'

function App() {
    const dispatch = useAppDispatch()
    const { isAuthenticated } = useAppSelector((state) => state.auth)

    useEffect(() => {
        const storedId = localStorage.getItem('idInstance')
        const storedToken = localStorage.getItem('apiTokenInstance')
        if (storedId && storedToken) {
            dispatch(setCredentials({ idInstance: storedId, apiTokenInstance: storedToken }))
        }
    }, [dispatch])

    return (
        <div className="app">
            {isAuthenticated ? <ChatPage /> : <LoginForm />}
        </div>
    )
}

export default App