import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Briefcase, DollarSign, Building2, Code, Activity, Trash2, Plus } from 'lucide-react';
import { jobService } from '../services/jobService';
import { departmentService } from '../services/departmentService';
import { employeeService } from '../services/employeeService'; // Using direct API for employees list if needed
import { facultyService } from '../services/facultyService'; // Not needed, but good reference
import CyberCard from '../components/CyberCard';
import api from '../services/api';

const JobForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        Job_Code: '',
        Job_Title: '',
        Job_Level: 'Entry',
        Job_Category: 'Calculated',
        Job_Grade: 'Grade C',
        Min_Salary: '',
        Max_Salary: '',
        Job_Description: '',
        Department_ID: '',
        Reports_To: '',
        Status: 'Active'
    });

    const [departments, setDepartments] = useState([]);
    const [potentialManagers, setPotentialManagers] = useState([]); // Potential managers (other jobs)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Objectives State
    const [objectives, setObjectives] = useState([]);
    const [showObjForm, setShowObjForm] = useState(false);
    const [activeObjId, setActiveObjId] = useState(null); // For adding KPI to specific objective

    const [newObj, setNewObj] = useState({ Objective_Title: '', Description: '', Weight: '' });
    const [newKPI, setNewKPI] = useState({ KPI_Name: '', Description: '', Measurement_Unit: '', Target_Value: '', Weight: '' });

    const loadObjectives = async () => {
        try {
            const res = await jobService.getObjectives(id);
            setObjectives(res.data.data);
        } catch (err) {
            console.error('Error loading objectives:', err);
        }
    };

    const handleAddObjective = async () => {
        try {
            await jobService.addObjective(id, newObj);
            setNewObj({ Objective_Title: '', Description: '', Weight: '' });
            setShowObjForm(false);
            loadObjectives();
        } catch (err) {
            alert('Failed to add objective');
        }
    };

    const handleDeleteObjective = async (objId) => {
        if (!window.confirm('Delete objective and all its KPIs?')) return;
        try {
            await jobService.deleteObjective(objId);
            loadObjectives();
        } catch (err) {
            alert('Failed to delete objective');
        }
    };

    const handleAddKPI = async (objId) => {
        try {
            await jobService.addKPI(objId, newKPI);
            setNewKPI({ KPI_Name: '', Description: '', Measurement_Unit: '', Target_Value: '', Weight: '' });
            setActiveObjId(null);
            loadObjectives();
        } catch (err) {
            alert('Failed to add KPI');
        }
    };

    const handleDeleteKPI = async (kpiId) => {
        try {
            await jobService.deleteKPI(kpiId);
            loadObjectives();
        } catch (err) {
            alert('Failed to delete KPI');
        }
    };

    useEffect(() => {
        loadMetadata();
        if (isEdit) {
            loadJob();
            loadObjectives();
        }
    }, [id]);

    const loadMetadata = async () => {
        try {
            const [deptRes, jobRes] = await Promise.all([
                departmentService.getAll(),
                jobService.getAll()
            ]);
            setDepartments(deptRes.data.data);
            setPotentialManagers(jobRes.data.data);
        } catch (err) {
            console.error('Error loading options:', err);
        }
    };

    const loadJob = async () => {
        try {
            setLoading(true);
            const response = await jobService.getById(id);
            const job = response.data.data;
            setFormData({
                Job_Code: job.Job_Code,
                Job_Title: job.Job_Title,
                Job_Level: job.Job_Level || 'Entry',
                Job_Category: job.Job_Category || '',
                Job_Grade: job.Job_Grade || 'Grade C',
                Min_Salary: job.Min_Salary || '',
                Max_Salary: job.Max_Salary || '',
                Job_Description: job.Job_Description || '',
                Department_ID: job.Department_ID || '',
                Reports_To: job.Reports_To || '',
                Status: job.Status || 'Active'
            });
        } catch (err) {
            console.error('Error loading job:', err);
            setError('Failed to load job details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEdit) {
                await jobService.update(id, formData);
            } else {
                await jobService.create(formData);
            }
            navigate('/jobs');
        } catch (err) {
            console.error('Error saving job:', err);
            setError(err.response?.data?.error || 'Failed to save job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/jobs')}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        {isEdit ? 'EDIT JOB' : 'NEW JOB'}
                    </h1>
                    <p className="text-muted font-mono text-sm mt-1">
                        {isEdit ? 'UPDATE POSITION DETAILS' : 'CREATE A NEW ROLE'}
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded font-mono text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <CyberCard>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-mono text-muted mb-1">JOB TITLE</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <input
                                    type="text"
                                    name="Job_Title"
                                    value={formData.Job_Title}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black/50 border border-border rounded pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary font-mono"
                                    placeholder="e.g. Senior Backend Engineer"
                                />
                            </div>
                        </div>

                        {/* Code */}
                        <div>
                            <label className="block text-xs font-mono text-muted mb-1">JOB CODE</label>
                            <div className="relative">
                                <Code className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <input
                                    type="text"
                                    name="Job_Code"
                                    value={formData.Job_Code}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black/50 border border-border rounded pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary font-mono"
                                    placeholder="e.g. ENG-001"
                                />
                            </div>
                        </div>

                        {/* Department */}
                        <div>
                            <label className="block text-xs font-mono text-muted mb-1">DEPARTMENT</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <select
                                    name="Department_ID"
                                    value={formData.Department_ID}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black/50 border border-border rounded pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary font-mono appearance-none"
                                >
                                    <option value="">SELECT DEPARTMENT</option>
                                    {departments.map(d => (
                                        <option key={d.Department_ID} value={d.Department_ID}>
                                            {d.Department_Name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Level */}
                        <div>
                            <label className="block text-xs font-mono text-muted mb-1">LEVEL</label>
                            <select
                                name="Job_Level"
                                value={formData.Job_Level}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-border rounded px-4 py-2 text-white focus:outline-none focus:border-primary font-mono"
                            >
                                <option value="Entry">Entry</option>
                                <option value="Mid">Mid</option>
                                <option value="Senior">Senior</option>
                                <option value="Executive">Executive</option>
                            </select>
                        </div>

                        {/* Grade */}
                        <div>
                            <label className="block text-xs font-mono text-muted mb-1">GRADE</label>
                            <select
                                name="Job_Grade"
                                value={formData.Job_Grade}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-border rounded px-4 py-2 text-white focus:outline-none focus:border-primary font-mono"
                            >
                                <option value="Grade A">Grade A</option>
                                <option value="Grade B">Grade B</option>
                                <option value="Grade C">Grade C</option>
                            </select>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-xs font-mono text-muted mb-1">CATEGORY</label>
                            <input
                                type="text"
                                name="Job_Category"
                                value={formData.Job_Category}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-border rounded px-4 py-2 text-white focus:outline-none focus:border-primary font-mono"
                                placeholder="e.g. IT, Finance"
                            />
                        </div>

                        {/* Reports To */}
                        <div>
                            <label className="block text-xs font-mono text-muted mb-1">REPORTS TO (SUPERIOR JOB)</label>
                            <select
                                name="Reports_To"
                                value={formData.Reports_To}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-border rounded px-4 py-2 text-white focus:outline-none focus:border-primary font-mono appearance-none"
                            >
                                <option value="">NO SUPERIOR</option>
                                {potentialManagers
                                    .filter(j => j.Job_ID !== parseInt(id)) // Prevent self-reference
                                    .map(job => (
                                        <option key={job.Job_ID} value={job.Job_ID}>
                                            {job.Job_Title} ({job.Job_Code})
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    {/* Correction: Reports_To references JOB table, not EMPLOYEE. So I should use the jobs list for managers if it refers to "Reports to Job X". 
                       Checking schema: Reports_To INT REFERENCES JOB(Job_ID). 
                       So I need to fetch JOBS for this dropdown, not employees.
                   */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {/* Salary Range */}
                        <div>
                            <label className="block text-xs font-mono text-muted mb-1">MIN SALARY</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <input
                                    type="number"
                                    name="Min_Salary"
                                    value={formData.Min_Salary}
                                    onChange={handleChange}
                                    className="w-full bg-black/50 border border-border rounded pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary font-mono"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-muted mb-1">MAX SALARY</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <input
                                    type="number"
                                    name="Max_Salary"
                                    value={formData.Max_Salary}
                                    onChange={handleChange}
                                    className="w-full bg-black/50 border border-border rounded pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-xs font-mono text-muted mb-1">DESCRIPTION</label>
                        <textarea
                            name="Job_Description"
                            value={formData.Job_Description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full bg-black/50 border border-border rounded px-4 py-2 text-white focus:outline-none focus:border-primary font-mono"
                            placeholder="Detailed job description..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 bg-primary text-black font-bold py-3 rounded hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        {loading ? 'SAVING...' : (isEdit ? 'UPDATE JOB' : 'CREATE JOB')}
                    </button>
                </CyberCard>
            </form>

            {/* Objectives & KPIs Section (Edit Mode Only) */}
            {isEdit && (
                <div className="space-y-6 pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary" />
                            PERFORMANCE OBJECTIVES
                        </h2>
                        <button
                            onClick={() => setShowObjForm(!showObjForm)}
                            className="bg-primary/10 text-primary border border-primary/50 px-3 py-1 rounded text-xs font-bold hover:bg-primary hover:text-black transition-all"
                        >
                            + ADD OBJECTIVE
                        </button>
                    </div>

                    {/* Add Objective Form */}
                    {showObjForm && (
                        <CyberCard className="border border-primary/50">
                            <h3 className="text-sm font-bold text-white mb-4">NEW OBJECTIVE</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    placeholder="Title (e.g., Code Quality)"
                                    value={newObj.Objective_Title}
                                    onChange={e => setNewObj({ ...newObj, Objective_Title: e.target.value })}
                                    className="bg-black/50 border border-border rounded px-4 py-2 text-white font-mono text-sm"
                                />
                                <input
                                    type="number"
                                    placeholder="Weight % (0-100)"
                                    value={newObj.Weight}
                                    onChange={e => setNewObj({ ...newObj, Weight: e.target.value })}
                                    className="bg-black/50 border border-border rounded px-4 py-2 text-white font-mono text-sm"
                                />
                                <textarea
                                    placeholder="Description..."
                                    value={newObj.Description}
                                    onChange={e => setNewObj({ ...newObj, Description: e.target.value })}
                                    className="md:col-span-2 bg-black/50 border border-border rounded px-4 py-2 text-white font-mono text-sm"
                                    rows={2}
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button onClick={() => setShowObjForm(false)} className="text-muted text-xs hover:text-white">CANCEL</button>
                                <button onClick={handleAddObjective} className="bg-primary text-black text-xs font-bold px-4 py-2 rounded">SAVE OBJECTIVE</button>
                            </div>
                        </CyberCard>
                    )}

                    {/* Objectives List */}
                    <div className="space-y-4">
                        {objectives.map(obj => (
                            <div key={obj.Objective_ID} className="bg-white/5 border border-white/10 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{obj.Objective_Title}</h3>
                                        <p className="text-muted text-sm">{obj.Description}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-mono bg-primary/20 text-primary px-2 py-1 rounded">
                                            WEIGHT: {obj.Weight}%
                                        </span>
                                        <button onClick={() => handleDeleteObjective(obj.Objective_ID)} className="text-muted hover:text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* KPIs */}
                                <div className="ml-4 pl-4 border-l-2 border-white/10 space-y-3">
                                    {obj.KPIs && obj.KPIs.map(kpi => (
                                        <div key={kpi.KPI_ID} className="bg-black/30 p-3 rounded flex justify-between items-center">
                                            <div>
                                                <div className="text-white font-mono text-sm font-bold">{kpi.KPI_Name}</div>
                                                <div className="text-muted text-xs">Target: {kpi.Target_Value} {kpi.Measurement_Unit}</div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-mono bg-white/10 text-white px-2 py-0.5 rounded">
                                                    W: {kpi.Weight}%
                                                </span>
                                                <button onClick={() => handleDeleteKPI(kpi.KPI_ID)} className="text-muted hover:text-red-500">
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add KPI Button/Form */}
                                    {activeObjId === obj.Objective_ID ? (
                                        <div className="bg-black/50 p-3 rounded border border-white/10 mt-2">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                                                <input placeholder="KPI Name" value={newKPI.KPI_Name} onChange={e => setNewKPI({ ...newKPI, KPI_Name: e.target.value })} className="col-span-2 bg-black border border-border rounded px-2 py-1 text-white text-xs" />
                                                <input placeholder="Target" value={newKPI.Target_Value} onChange={e => setNewKPI({ ...newKPI, Target_Value: e.target.value })} className="bg-black border border-border rounded px-2 py-1 text-white text-xs" />
                                                <input placeholder="Unit" value={newKPI.Measurement_Unit} onChange={e => setNewKPI({ ...newKPI, Measurement_Unit: e.target.value })} className="bg-black border border-border rounded px-2 py-1 text-white text-xs" />
                                                <input type="number" placeholder="Weight" value={newKPI.Weight} onChange={e => setNewKPI({ ...newKPI, Weight: e.target.value })} className="bg-black border border-border rounded px-2 py-1 text-white text-xs" />
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => setActiveObjId(null)} className="text-[10px] text-muted hover:text-white">CANCEL</button>
                                                <button onClick={() => handleAddKPI(obj.Objective_ID)} className="bg-white/20 text-white text-[10px] font-bold px-3 py-1 rounded hover:bg-white/30">ADD KPI</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setActiveObjId(obj.Objective_ID)}
                                            className="text-xs text-muted hover:text-primary flex items-center gap-1 mt-2"
                                        >
                                            <Plus className="w-3 h-3" /> ADD KPI
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobForm;
