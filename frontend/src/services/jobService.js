import api from './api';

export const jobService = {
    getAll: () => api.get('/jobs'),
    getById: (id) => api.get(`/jobs/${id}`),
    create: (data) => api.post('/jobs', data),
    update: (id, data) => api.put(`/jobs/${id}`, data),
    delete: (id) => api.delete(`/jobs/${id}`),

    // Objectives & KPIs
    getObjectives: (jobId) => api.get(`/jobs/${jobId}/objectives`),
    addObjective: (jobId, data) => api.post(`/jobs/${jobId}/objectives`, data),
    deleteObjective: (objId) => api.delete(`/objectives/${objId}`),
    addKPI: (objId, data) => api.post(`/objectives/${objId}/kpis`, data),
    deleteKPI: (kpiId) => api.delete(`/kpis/${kpiId}`)
};
