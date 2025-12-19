import api from './api';

export const employeeService = {
    getAll: (params) => api.get('/employees', { params }),
    getById: (id) => api.get(`/employees/${id}`),
    getStats: (id) => api.get(`/employees/${id}/stats`),
    create: (data) => api.post('/employees', data),
    update: (id, data) => api.put(`/employees/${id}`, data),
    updateContact: (id, data) => api.put(`/employees/${id}/contact`, data),
    delete: (id) => api.delete(`/employees/${id}`),
    getJobs: () => api.get('/jobs'),
    getDepartments: () => api.get('/departments'),
    getContracts: () => api.get('/contracts'),
    assignJob: (id, data) => api.post(`/employees/${id}/assign-job`, data),
};
