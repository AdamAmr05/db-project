import api from './api';

export const performanceService = {
    // Cycles
    getAllCycles: () => api.get('/cycles'),
    getCycleById: (id) => api.get(`/cycles/${id}`),
    createCycle: (data) => api.post('/cycles', data),
    updateCycle: (id, data) => api.put(`/cycles/${id}`, data),
    deleteCycle: (id) => api.delete(`/cycles/${id}`),

    // Appraisals
    getCandidates: (cycleId) => api.get(`/appraisals/candidates/${cycleId}`),
    getAppraisalDetails: (cycleId, assignmentId) => api.get(`/appraisals/${cycleId}/${assignmentId}`),
    saveScore: (data) => api.post('/appraisals/score', data),
    finalizeAppraisal: (data) => api.post('/appraisals/finalize', data),

    // Appeals
    getAppeals: (status) => api.get('/appeals', { params: { status } }),
    submitAppeal: (data) => api.post('/appeals', data),
    reviewAppeal: (id, data) => api.put(`/appeals/${id}`, data),
};
