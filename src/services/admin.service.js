import api from "./api";

export const adminService = {
    async registerStove(data){
        const response = await api.post('admin/stoves/register', data)
        return response.data
    },
    async getAllUsage(){
        const response = await api.get('/admin/usage')
        return response.data
    },
    async getStats(){
        const response = await api.get('/admin/stats')
        return response.data
    },
    async getAllUsers(){
        const response = await api.get('/admin/users')
        return response.data
    },
    async getAllStoves(){
        const response = await api.get('/admin/stoves')
        return response.data
    }
}