import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
    idInstance: string
    apiTokenInstance: string
    isAuthenticated: boolean
}

const initialState: AuthState = {
    idInstance: '',
    apiTokenInstance: '',
    isAuthenticated: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ idInstance: string; apiTokenInstance: string }>
        ) => {
            state.idInstance = action.payload.idInstance
            state.apiTokenInstance = action.payload.apiTokenInstance
            state.isAuthenticated = true

            // Сохраняем в localStorage, чтобы после перезагрузки не терять авторизацию
            localStorage.setItem('idInstance', state.idInstance)
            localStorage.setItem('apiTokenInstance', state.apiTokenInstance)
        },

        logout: (state) => {
            state.idInstance = ''
            state.apiTokenInstance = ''
            state.isAuthenticated = false

            localStorage.removeItem('idInstance')
            localStorage.removeItem('apiTokenInstance')
        }
    }
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer