import React, { useState } from 'react'
import { useAppDispatch } from '../store/hooks'
import { setCredentials } from '../features/auth/authSlice'
import '../styles/loginForm.css'

const LoginForm: React.FC = () => {
    const dispatch = useAppDispatch()
    const [idInstance, setIdInstance] = useState('')
    const [apiTokenInstance, setApiTokenInstance] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        dispatch(setCredentials({ idInstance, apiTokenInstance }))
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Вход в Green Api Chat чат</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>idInstance</label>
                        <input
                            type="text"
                            value={idInstance}
                            onChange={(e) => setIdInstance(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>apiTokenInstance</label>
                        <input
                            type="text"
                            value={apiTokenInstance}
                            onChange={(e) => setApiTokenInstance(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">
                        Войти
                    </button>
                </form>
            </div>
        </div>
    )
}

export default LoginForm