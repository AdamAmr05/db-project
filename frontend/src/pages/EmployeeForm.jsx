import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { employeeService } from '../services/employeeService';
import CyberCard from '../components/CyberCard';

const EmployeeForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [contracts, setContracts] = useState([]);

    const [formData, setFormData] = useState({
        First_Name: '',
        Middle_Name: '',
        Last_Name: '',
        Gender: '',
        DOB: '',
        Nationality: '',
        Work_Email: '',
        Mobile_Phone: '',
        Employment_Status: 'Active',
        Insurance_Number: '',
        Insurance_Start: '',
        // Job Assignment Fields
        Department_ID: '',
        Job_ID: '',
        Contract_ID: '',
        Salary: ''
    });

    useEffect(() => {
        loadMetadata();
        if (isEdit) {
            loadEmployee();
        }
    }, [id]);

    const loadMetadata = async () => {
        try {
            const [jobsRes, deptsRes, contractsRes] = await Promise.all([
                employeeService.getJobs(),
                employeeService.getDepartments(),
                employeeService.getContracts()
            ]);
            setJobs(jobsRes.data.data);
            setDepartments(deptsRes.data.data);
            setContracts(contractsRes.data.data);
        } catch (error) {
            console.error('Failed to load metadata', error);
        }
    };

    const loadEmployee = async () => {
        try {
            const response = await employeeService.getById(id);
            // API returns { success: true, data: [...] }
            let data = response.data.data;

            // Handle stored procedure result (array of result sets)
            if (Array.isArray(data) && Array.isArray(data[0])) {
                data = data[0][0]; // First row of first result set
            } else if (Array.isArray(data)) {
                data = data[0]; // First row if just an array of rows
            }

            if (!data) {
                console.error('No employee data found');
                return;
            }

            // Format date for input
            if (data.DOB) data.DOB = new Date(data.DOB).toISOString().split('T')[0];
            if (data.Insurance_Start) data.Insurance_Start = new Date(data.Insurance_Start).toISOString().split('T')[0];

            setFormData(prev => ({
                ...prev,
                ...data,
                Department_ID: data.Department_ID || '',
                Job_ID: data.Job_ID || '',
                Salary: data.Assigned_Salary || '',
                // Contract ID is not returned by SP, default to empty
                Contract_ID: ''
            }));
        } catch (error) {
            console.error('Failed to load employee', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let employeeId = id;
            if (isEdit) {
                await employeeService.update(id, formData);
            } else {
                const res = await employeeService.create(formData);
                employeeId = res.data.id;
            }

            // Handle Job Assignment if details provided
            if (formData.Job_ID && formData.Contract_ID && formData.Salary && employeeId) {
                await employeeService.assignJob(employeeId, {
                    Job_ID: formData.Job_ID,
                    Contract_ID: formData.Contract_ID,
                    Salary: formData.Salary,
                    Start_Date: new Date().toISOString().split('T')[0]
                });
            }

            navigate('/employees');
        } catch (error) {
            alert('OPERATION FAILED: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Filter jobs by selected department
    const filteredJobs = formData.Department_ID
        ? jobs.filter(job => job.Department_ID === Number(formData.Department_ID)) // Assuming job has Department_ID, need to verify if getAllJobs returns it. 
        // Wait, getAllJobs query was 'SELECT Job_ID, Job_Title FROM JOB'. It didn't include Department_ID.
        // I need to update getAllJobs to include Department_ID.
        : jobs;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/employees')} className="hover:text-white transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-white tracking-wider">
                    {isEdit ? 'EDIT_PERSONNEL_FILE' : 'NEW_PERSONNEL_ENTRY'}
                </h1>
            </div>

            <form onSubmit={handleSubmit}>
                <CyberCard title="Personal Information" className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-muted uppercase">First Name</label>
                            <input
                                name="First_Name"
                                value={formData.First_Name}
                                onChange={handleChange}
                                className="cyber-input"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-muted uppercase">Middle Name</label>
                            <input
                                name="Middle_Name"
                                value={formData.Middle_Name || ''}
                                onChange={handleChange}
                                className="cyber-input"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-muted uppercase">Last Name</label>
                            <input
                                name="Last_Name"
                                value={formData.Last_Name}
                                onChange={handleChange}
                                className="cyber-input"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-muted uppercase">Gender</label>
                            <select
                                name="Gender"
                                value={formData.Gender}
                                onChange={handleChange}
                                className="cyber-input"
                                required
                            >
                                <option value="">SELECT_GENDER</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-muted uppercase">Date of Birth</label>
                            <input
                                type="date"
                                name="DOB"
                                value={formData.DOB}
                                onChange={handleChange}
                                className="cyber-input"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-muted uppercase">Nationality</label>
                            <input
                                name="Nationality"
                                value={formData.Nationality || ''}
                                onChange={handleChange}
                                className="cyber-input"
                            />
                        </div>
                    </div>
                </CyberCard>

                <CyberCard title="Contact & Employment" className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-muted uppercase">Work Email</label>
                            <input
                                type="email"
                                name="Work_Email"
                                value={formData.Work_Email}
                                onChange={handleChange}
                                className="cyber-input"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-muted uppercase">Mobile Phone</label>
                            <input
                                type="tel"
                                name="Mobile_Phone"
                                value={formData.Mobile_Phone}
                                onChange={handleChange}
                                className="cyber-input"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-muted uppercase">Employment Status</label>
                            <select
                                name="Employment_Status"
                                value={formData.Employment_Status}
                                onChange={handleChange}
                                className="cyber-input"
                            >
                                <option value="Active">Active</option>
                                <option value="Probation">Probation</option>
                                <option value="Leave">Leave</option>
                                <option value="Retired">Retired</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-muted uppercase">Insurance Number</label>
                            <input
                                name="Insurance_Number"
                                value={formData.Insurance_Number || ''}
                                onChange={handleChange}
                                className="cyber-input"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-muted uppercase">Insurance Start Date</label>
                            <input
                                type="date"
                                name="Insurance_Start"
                                value={formData.Insurance_Start || ''}
                                onChange={handleChange}
                                className="cyber-input"
                                required
                            />
                        </div>
                    </div>
                </CyberCard>

                <CyberCard title="Job Assignment" className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-muted uppercase">Department</label>
                            <select
                                name="Department_ID"
                                value={formData.Department_ID}
                                onChange={handleChange}
                                className="cyber-input"
                            >
                                <option value="">SELECT_DEPARTMENT</option>
                                {departments.map(dept => (
                                    <option key={dept.Department_ID} value={dept.Department_ID}>
                                        {dept.Department_Name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-muted uppercase">Job Role</label>
                            <select
                                name="Job_ID"
                                value={formData.Job_ID}
                                onChange={handleChange}
                                className="cyber-input"
                            >
                                <option value="">SELECT_JOB</option>
                                {filteredJobs.map(job => (
                                    <option key={job.Job_ID} value={job.Job_ID}>
                                        {job.Job_Title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-muted uppercase">Contract Type</label>
                            <select
                                name="Contract_ID"
                                value={formData.Contract_ID}
                                onChange={handleChange}
                                className="cyber-input"
                            >
                                <option value="">SELECT_CONTRACT</option>
                                {contracts.map(contract => (
                                    <option key={contract.Contract_ID} value={contract.Contract_ID}>
                                        {contract.Contract_Name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-muted uppercase">Salary</label>
                            <input
                                type="number"
                                name="Salary"
                                value={formData.Salary}
                                onChange={handleChange}
                                className="cyber-input"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                </CyberCard>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/employees')}
                        className="cyber-button-outline"
                    >
                        CANCEL
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="cyber-button flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? 'PROCESSING...' : 'SAVE_RECORD'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EmployeeForm;
