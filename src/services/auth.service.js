import api from './api'

export const authService = {
    async signup(cred){
        const response = await api.post('auth/signup', cred)
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        return response.data
    },

    async login(cred){
        const response = await api.post('auth/login', cred)
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        return response.data
    }
}