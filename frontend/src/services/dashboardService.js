import api from './api';

export const dashboardService = {
    getStats: () => api.get('/dashboard/stats'),
    getEmployeeCountByDept: () => api.get('/dashboard/employee-count-by-dept'),
    getGenderDistribution: () => api.get('/dashboard/gender-distribution'),
    getStatusDistribution: () => api.get('/dashboard/status-distribution'),
    getJobsByLevel: () => api.get('/dashboard/jobs-by-level'),
    getSalaryStats: () => api.get('/dashboard/salary-stats'),
    getTrainingCompletion: () => api.get('/dashboard/training-completion'),
    getAppraisalsPerCycle: () => api.get('/dashboard/appraisals-per-cycle'),
    getActiveCycle: () => api.get('/dashboard/active-cycle'),
};
