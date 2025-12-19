import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, GraduationCap, CheckCircle, Clock, XCircle, Trash2, Plus } from 'lucide-react';
import { trainingService } from '../services/trainingService';
import api from '../services/api'; // For fetching employees
import CyberCard from '../components/CyberCard';

const TrainingProgramForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    // --- Form State ---
    const [formData, setFormData] = useState({
        Program_Code: '',
        Title: '',
        Objectives: '',
        Type: 'Technical',
        Subtype: '',
        Delivery_Method: 'Online',
        Approval_Status: 'Pending'
    });

    // --- Enrollment State ---
    const [enrollments, setEnrollments] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');

    // Subtype suggestions
    const [existingSubtypes, setExistingSubtypes] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Dropdown visibility states
    const [showStatus, setShowStatus] = useState(false);
    const [showType, setShowType] = useState(false);
    const [showDelivery, setShowDelivery] = useState(false);

    // Certificate modal state
    const [showCertModal, setShowCertModal] = useState(false);
    const [certPath, setCertPath] = useState('');
    const [pendingEmployeeId, setPendingEmployeeId] = useState(null);

    useEffect(() => {
        if (isEdit) {
            loadProgram();
        }
        loadMetadata(); // Always load employees and subtypes
    }, [id]);

    const loadProgram = async () => {
        try {
            setLoading(true);
            const response = await trainingService.getById(id);
            const program = response.data.data;

            // Separate enrollments from program data
            setEnrollments(program.enrollments || []);

            setFormData({
                Program_Code: program.Program_Code,
                Title: program.Title,
                Objectives: program.Objectives || '',
                Type: program.Type || 'Technical',
                Subtype: program.Subtype || '',
                Delivery_Method: program.Delivery_Method || 'Online',
                Approval_Status: program.Approval_Status || 'Pending'
            });
        } catch (err) {
            console.error('Error loading program:', err);
            setError('Failed to load program details');
        } finally {
            setLoading(false);
        }
    };

    const loadMetadata = async () => {
        try {
            // Load employees
            const empRes = await api.get('/employees');
            setAllEmployees(empRes.data.data);

            // Load existing programs to extract subtypes
            const progRes = await trainingService.getAll();
            const subtypes = [...new Set(progRes.data.data.map(p => p.Subtype).filter(Boolean))];
            setExistingSubtypes(subtypes.sort());
        } catch (err) {
            console.error('Error loading metadata:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEdit) {
                await trainingService.update(id, formData);
            } else {
                await trainingService.create(formData);
            }
            navigate('/training');
        } catch (err) {
            console.error('Error saving program:', err);
            setError(err.response?.data?.error || 'Failed to save program');
            setLoading(false);
        }
    };

    // --- Enrollment Handlers ---
    const handleEnroll = async () => {
        if (!selectedEmployee) return;
        try {
            await trainingService.enrollEmployee(id, selectedEmployee);
            loadProgram(); // Reload to refresh list
            setSelectedEmployee('');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to enroll employee');
        }
    };

    const handleUpdateStatus = async (employeeId, status, certificatePath) => {
        try {
            await trainingService.updateStatus(
                id,
                employeeId,
                status,
                certificatePath || undefined
            );
            loadProgram();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleStatusClick = (employeeId, status) => {
        if (status === 'Completed') {
            setPendingEmployeeId(employeeId);
            setCertPath('');
            setShowCertModal(true);
            return;
        }
        handleUpdateStatus(employeeId, status);
    };

    const handleCertConfirm = async () => {
        if (!pendingEmployeeId) return;
        await handleUpdateStatus(pendingEmployeeId, 'Completed', certPath);
        setShowCertModal(false);
        setPendingEmployeeId(null);
        setCertPath('');
    };

    const handleCertCancel = () => {
        setShowCertModal(false);
        setPendingEmployeeId(null);
        setCertPath('');
    };

    const handleUnenroll = async (employeeId) => {
        if (window.confirm('Are you sure you want to remove this employee from the program?')) {
            try {
                await trainingService.unenroll(id, employeeId);
                loadProgram();
            } catch (err) {
                alert('Failed to unenroll employee');
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/training')}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        {isEdit ? 'MANAGE PROGRAM' : 'NEW PROGRAM'}
                    </h1>
                    <p className="text-muted font-mono text-sm mt-1">
                        {isEdit ? 'UPDATE DETAILS & ENROLLMENTS' : 'CREATE TRAINING MODULE'}
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded font-mono text-sm">
                    {error}
                </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit}>
                <CyberCard>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-mono text-muted mb-1">PROGRAM TITLE</label>
                            <input
                                type="text"
                                name="Title"
                                value={formData.Title}
                                onChange={handleChange}
                                required
                                className="w-full bg-black/50 border border-border rounded px-4 py-2 text-white focus:outline-none focus:border-primary font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-muted mb-1">PROGRAM CODE</label>
                            <input
                                type="text"
                                name="Program_Code"
                                value={formData.Program_Code}
                                onChange={handleChange}
                                required
                                className="w-full bg-black/50 border border-border rounded px-4 py-2 text-white focus:outline-none focus:border-primary font-mono"
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-xs font-mono text-muted mb-1">STATUS</label>
                            <div
                                onClick={() => setShowStatus(!showStatus)}
                                className="w-full bg-black/50 border border-border rounded px-4 py-2 text-white cursor-pointer flex justify-between items-center font-mono"
                            >
                                <span>{formData.Approval_Status || 'SELECT_STATUS'}</span>
                                <span className="text-muted">▼</span>
                            </div>
                            {showStatus && (
                                <div className="absolute z-10 w-full mt-1 bg-black border border-primary/30 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                    {['Pending', 'Approved', 'Rejected'].map((opt) => (
                                        <div
                                            key={opt}
                                            className="px-4 py-2 text-xs font-mono text-white hover:bg-primary/20 cursor-pointer"
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, Approval_Status: opt }));
                                                setShowStatus(false);
                                            }}
                                        >
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <label className="block text-xs font-mono text-muted mb-1">TYPE</label>
                            <div
                                onClick={() => setShowType(!showType)}
                                className="w-full bg-black/50 border border-border rounded px-4 py-2 text-white cursor-pointer flex justify-between items-center font-mono"
                            >
                                <span>{formData.Type || 'SELECT_TYPE'}</span>
                                <span className="text-muted">▼</span>
                            </div>
                            {showType && (
                                <div className="absolute z-10 w-full mt-1 bg-black border border-primary/30 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                    {['Technical', 'Soft Skills', 'Compliance', 'Leadership'].map((opt) => (
                                        <div
                                            key={opt}
                                            className="px-4 py-2 text-xs font-mono text-white hover:bg-primary/20 cursor-pointer"
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, Type: opt }));
                                                setShowType(false);
                                            }}
                                        >
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <label className="block text-xs font-mono text-muted mb-1">SUBTYPE</label>
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    name="Subtype"
                                    value={formData.Subtype}
                                    onChange={handleChange}
                                    onFocus={() => setShowSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    placeholder="e.g. Cloud, Security, Coaching"
                                    className="w-full bg-black/50 border border-border rounded px-4 py-2 pr-8 text-white focus:outline-none focus:border-primary font-mono"
                                    autoComplete="off"
                                />
                                <span className="absolute right-3 text-muted pointer-events-none">▼</span>
                            </div>
                            {showSuggestions && existingSubtypes.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-black border border-primary/30 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                    {existingSubtypes
                                        .filter(s => s.toLowerCase().includes(formData.Subtype.toLowerCase()))
                                        .map((s, i) => (
                                            <div
                                                key={i}
                                                className="px-4 py-2 text-xs font-mono text-white hover:bg-primary/20 cursor-pointer"
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, Subtype: s }));
                                                    setShowSuggestions(false);
                                                }}
                                            >
                                                {s}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <label className="block text-xs font-mono text-muted mb-1">DELIVERY METHOD</label>
                            <div
                                onClick={() => setShowDelivery(!showDelivery)}
                                className="w-full bg-black/50 border border-border rounded px-4 py-2 text-white cursor-pointer flex justify-between items-center font-mono"
                            >
                                <span>{formData.Delivery_Method || 'SELECT_METHOD'}</span>
                                <span className="text-muted">▼</span>
                            </div>
                            {showDelivery && (
                                <div className="absolute z-10 w-full mt-1 bg-black border border-primary/30 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                    {['Online', 'In-Person', 'Hybrid'].map((opt) => (
                                        <div
                                            key={opt}
                                            className="px-4 py-2 text-xs font-mono text-white hover:bg-primary/20 cursor-pointer"
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, Delivery_Method: opt }));
                                                setShowDelivery(false);
                                            }}
                                        >
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-mono text-muted mb-1">OBJECTIVES</label>
                            <textarea
                                name="Objectives"
                                value={formData.Objectives}
                                onChange={handleChange}
                                rows={3}
                                className="w-full bg-black/50 border border-border rounded px-4 py-2 text-white focus:outline-none focus:border-primary font-mono"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 bg-primary text-black font-bold py-3 rounded hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        {loading ? 'SAVING...' : (isEdit ? 'UPDATE PROGRAM' : 'CREATE PROGRAM')}
                    </button>
                </CyberCard >
            </form >

            {/* Enrollment Section (Only visible in Edit Mode) */}
            {
                isEdit && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-primary" />
                            ENROLLMENT MANAGEMENT
                        </h2>

                        <CyberCard>
                            {/* Enroll New Employee */}
                            <div className="bg-white/5 p-4 rounded border border-white/10 mb-6">
                                <label className="block text-xs font-mono text-muted mb-2">ENROLL EMPLOYEE</label>
                                <div className="flex gap-2">
                                    <select
                                        value={selectedEmployee}
                                        onChange={(e) => setSelectedEmployee(e.target.value)}
                                        className="flex-1 bg-black/50 border border-border rounded px-4 py-2 text-white focus:outline-none focus:border-primary font-mono appearance-none"
                                    >
                                        <option value="">SELECT EMPLOYEE TO ENROLL</option>
                                        {allEmployees
                                            .filter(emp => !enrollments.some(enr => enr.Employee_ID === emp.Employee_ID))
                                            .map(emp => (
                                                <option key={emp.Employee_ID} value={emp.Employee_ID}>
                                                    {emp.First_Name} {emp.Last_Name} ({emp.Job_Title || 'No Job'})
                                                </option>
                                            ))}
                                    </select>
                                    <button
                                        onClick={handleEnroll}
                                        disabled={!selectedEmployee}
                                        className="bg-primary text-black px-4 py-2 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                                    >
                                        ENROLL
                                    </button>
                                </div>
                            </div>

                            {/* List Enrollments */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/10 text-xs font-mono text-muted uppercase">
                                            <th className="p-4">Employee</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4">Certificate</th>
                                            <th className="p-4 text-right">Update Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {enrollments.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="p-8 text-center text-muted font-mono text-sm">
                                                    NO EMPLOYEES ENROLLED
                                                </td>
                                            </tr>
                                        )}
                                        {enrollments.map((enr) => (
                                            <tr key={enr.ET_ID} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-4">
                                                    <div className="font-bold text-white">{enr.First_Name} {enr.Last_Name}</div>
                                                    <div className="text-xs text-muted">{enr.Email}</div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${enr.Completion_Status === 'Completed' ? 'bg-green-500/20 text-green-500' :
                                                        enr.Completion_Status === 'Enrolled' ? 'bg-blue-500/20 text-blue-500' :
                                                            'bg-red-500/20 text-red-500'
                                                        }`}>
                                                        {enr.Completion_Status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm text-muted">
                                                    {enr.certificates && enr.certificates.length > 0 ? (
                                                        <div className="space-y-1">
                                                            {enr.certificates.map(cert => (
                                                                <div key={cert.Certificate_ID} className="flex items-center gap-2">
                                                                    <span className="text-[10px] font-mono bg-white/10 text-white px-2 py-0.5 rounded">
                                                                        {cert.certificate_file_path || 'No path'}
                                                                    </span>
                                                                    {cert.Issue_Date && (
                                                                        <span className="text-[10px] text-muted">
                                                                            {new Date(cert.Issue_Date).toLocaleDateString()}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-muted">—</span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {enr.Completion_Status !== 'Completed' && (
                                                            <button
                                                                onClick={() => handleStatusClick(enr.Employee_ID, 'Completed')}
                                                                title="Mark as Completed"
                                                                className="p-1.5 hover:bg-green-500/20 rounded text-muted hover:text-green-500 transition-colors"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        {enr.Completion_Status !== 'Failed' && (
                                                            <button
                                                                onClick={() => handleStatusClick(enr.Employee_ID, 'Failed')}
                                                                title="Mark as Failed"
                                                                className="p-1.5 hover:bg-red-500/20 rounded text-muted hover:text-red-500 transition-colors"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleUnenroll(enr.Employee_ID)}
                                                            title="Remove from Program"
                                                            className="p-1.5 hover:bg-white/10 rounded text-muted hover:text-white transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CyberCard>
                    </div>
                )
            }

            {/* Certificate Modal */}
            {
                showCertModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <CyberCard className="w-full max-w-md border border-primary/50">
                            <h3 className="text-lg font-bold text-white mb-4">Issue Certificate</h3>
                            <p className="text-sm text-muted mb-3">
                                Mark enrollment as completed and optionally attach a certificate file path.
                            </p>
                            <input
                                type="text"
                                value={certPath}
                                onChange={(e) => setCertPath(e.target.value)}
                                placeholder="e.g. /certs/et-16.pdf"
                                className="w-full bg-black/50 border border-border rounded px-4 py-2 text-white focus:border-primary focus:outline-none font-mono mb-4"
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={handleCertCancel}
                                    className="text-muted text-sm hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCertConfirm}
                                    className="bg-primary text-black px-4 py-2 rounded font-bold hover:bg-primary/90"
                                >
                                    Confirm
                                </button>
                            </div>
                        </CyberCard>
                    </div>
                )
            }
        </div >
    );
};

export default TrainingProgramForm;
