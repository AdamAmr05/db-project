import api from './api';

export const trainingService = {
    getAll: () => api.get('/training'),
    getById: (id) => api.get(`/training/${id}`),
    create: (data) => api.post('/training', data),
    update: (id, data) => api.put(`/training/${id}`, data),
    delete: (id) => api.delete(`/training/${id}`),
    enrollEmployee: (id, employeeId) => api.post(`/training/${id}/enroll`, { Employee_ID: employeeId }),
    updateStatus: (id, employeeId, status, certificateFilePath) =>
        api.put(`/training/${id}/enroll/${employeeId}`, {
            status,
            ...(certificateFilePath ? { certificate_file_path: certificateFilePath } : {})
        }),
    unenroll: (id, employeeId) => api.delete(`/training/${id}/enroll/${employeeId}`)
};
