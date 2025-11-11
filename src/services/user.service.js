import api from "./api";

export const userService = {
    async getStats(){
        const response = await api.get('/usage/stats')
        return response.data
    },
    async getAllUsers(){
        const response = await api.get('/admin/users')
        return response.data
    },
    async changeRole(userId, role){
        const response = await api.patch(`/admin/users/${userId}/role`, { newRole: role })
        return response.data
    },
    async getAllStoves(){
        const response = await api.get('/admin/stoves')
        return response.data
    }
}