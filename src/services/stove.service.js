import api from './api'

export const stoveService = {
    async pair(cred){
        const response = await api.post('stoves/pair', cred)
        return response.data
    },

    async login(cred){
        const response = await api.post('auth/login', cred)
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        return response.data
    }
}