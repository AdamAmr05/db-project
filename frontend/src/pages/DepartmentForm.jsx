import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Building2, MapPin, Mail } from 'lucide-react';
import { departmentService } from '../services/departmentService';
import { facultyService } from '../services/facultyService';
import api from '../services/api'; // Direct API access for universities
import CyberCard from '../components/CyberCard';

const DepartmentForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        Department_Name: '',
        Department_Type: 'Academic', // Default
        Location: '',
        Contact_Email: '',
        Faculty_ID: '',
        University_ID: ''
    });

    const [faculties, setFaculties] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Dropdown visibility states
    const [showType, setShowType] = useState(false);
    const [showFaculty, setShowFaculty] = useState(false);
    const [showUniversity, setShowUniversity] = useState(false);

    useEffect(() => {
        loadMetadata();
        if (isEdit) {
            loadDepartment();
        }
    }, [id]);

    const loadMetadata = async () => {
        try {
            const [facultiesRes, universitiesRes] = await Promise.all([
                facultyService.getAll(),
                api.get('/universities')
            ]);
            setFaculties(facultiesRes.data.data);
            setUniversities(universitiesRes.data.data);
        } catch (err) {
            console.error('Error loading metadata:', err);
            setError('Failed to load form options');
        }
    };

    const loadDepartment = async () => {
        try {
            setLoading(true);
            const response = await departmentService.getById(id);
            const dept = response.data.data;
            setFormData({
                Department_Name: dept.Department_Name,
                Department_Type: dept.Department_Type,
                Location: dept.Location || '',
                Contact_Email: dept.Contact_Email || '',
                Faculty_ID: dept.Faculty_ID || '',
                University_ID: dept.University_ID || ''
            });
        } catch (err) {
            console.error('Error loading department:', err);
            setError('Failed to load department details');
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
                await departmentService.update(id, formData);
            } else {
                await departmentService.create(formData);
            }
            navigate('/departments');
        } catch (err) {
            console.error('Error saving department:', err);
            setError(err.response?.data?.error || 'Failed to save department');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEdit && !formData.Department_Name) {
        return <div className="text-center text-muted font-mono py-12">LOADING DEPARTMENT...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/departments')}
                    className="p-2 hover:bg-surfaceHighlight rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-primary" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-primary tracking-tight">
                        {isEdit ? 'EDIT DEPARTMENT' : 'NEW DEPARTMENT'}
                    </h1>
                    <p className="text-muted font-mono text-sm mt-1">
                        {isEdit ? 'UPDATE DEPARTMENT DETAILS' : 'REGISTER A NEW ORGANIZATIONAL UNIT'}
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
                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-mono text-muted mb-1">DEPARTMENT NAME</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <input
                                    type="text"
                                    name="Department_Name"
                                    value={formData.Department_Name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-surface border border-border rounded pl-10 pr-4 py-2 text-primary focus:outline-none focus:border-primary font-mono"
                                    placeholder="e.g. Computer Science"
                                />
                            </div>
                        </div>

                        {/* Type */}
                        <div className="relative">
                            <label className="block text-xs font-mono text-muted mb-1">DEPARTMENT TYPE</label>
                            <div
                                onClick={() => setShowType(!showType)}
                                className="w-full bg-surface border border-border rounded px-4 py-2 text-primary cursor-pointer flex justify-between items-center font-mono"
                            >
                                <span>{formData.Department_Type || 'SELECT_TYPE'}</span>
                                <span className="text-muted">▼</span>
                            </div>
                            {showType && (
                                <div className="absolute z-10 w-full mt-1 bg-surface border border-primary/30 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                    {['Academic', 'Administrative'].map((opt) => (
                                        <div
                                            key={opt}
                                            className="px-4 py-2 text-xs font-mono text-primary hover:bg-primary/20 cursor-pointer"
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, Department_Type: opt }));
                                                setShowType(false);
                                            }}
                                        >
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Conditional Dropdowns */}
                        {formData.Department_Type === 'Academic' ? (
                            <div className="relative">
                                <label className="block text-xs font-mono text-muted mb-1">FACULTY</label>
                                <div
                                    onClick={() => setShowFaculty(!showFaculty)}
                                    className="w-full bg-surface border border-border rounded px-4 py-2 text-primary cursor-pointer flex justify-between items-center font-mono"
                                >
                                    <span className={formData.Faculty_ID ? 'text-primary' : 'text-muted'}>
                                        {faculties.find(f => f.Faculty_ID === Number(formData.Faculty_ID))?.Faculty_Name || 'SELECT FACULTY'}
                                    </span>
                                    <span className="text-muted">▼</span>
                                </div>
                                {showFaculty && (
                                    <div className="absolute z-10 w-full mt-1 bg-surface border border-primary/30 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                        {faculties.map(f => (
                                            <div
                                                key={f.Faculty_ID}
                                                className="px-4 py-2 text-xs font-mono text-primary hover:bg-primary/20 cursor-pointer"
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, Faculty_ID: f.Faculty_ID }));
                                                    setShowFaculty(false);
                                                }}
                                            >
                                                {f.Faculty_Name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="relative">
                                <label className="block text-xs font-mono text-muted mb-1">UNIVERSITY</label>
                                <div
                                    onClick={() => setShowUniversity(!showUniversity)}
                                    className="w-full bg-surface border border-border rounded px-4 py-2 text-primary cursor-pointer flex justify-between items-center font-mono"
                                >
                                    <span className={formData.University_ID ? 'text-primary' : 'text-muted'}>
                                        {universities.find(u => u.University_ID === Number(formData.University_ID))?.University_Name || 'SELECT UNIVERSITY'}
                                    </span>
                                    <span className="text-muted">▼</span>
                                </div>
                                {showUniversity && (
                                    <div className="absolute z-10 w-full mt-1 bg-surface border border-primary/30 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                        {universities.map(u => (
                                            <div
                                                key={u.University_ID}
                                                className="px-4 py-2 text-xs font-mono text-primary hover:bg-primary/20 cursor-pointer"
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, University_ID: u.University_ID }));
                                                    setShowUniversity(false);
                                                }}
                                            >
                                                {u.University_Name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Location */}
                        <div>
                            <label className="block text-xs font-mono text-muted mb-1">LOCATION</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <input
                                    type="text"
                                    name="Location"
                                    value={formData.Location}
                                    onChange={handleChange}
                                    className="w-full bg-surface border border-border rounded pl-10 pr-4 py-2 text-primary focus:outline-none focus:border-primary font-mono"
                                    placeholder="e.g. Building C, Floor 2"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-mono text-muted mb-1">CONTACT EMAIL</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <input
                                    type="email"
                                    name="Contact_Email"
                                    value={formData.Contact_Email}
                                    onChange={handleChange}
                                    className="w-full bg-surface border border-border rounded pl-10 pr-4 py-2 text-primary focus:outline-none focus:border-primary font-mono"
                                    placeholder="e.g. cs@university.edu"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 bg-primary text-[var(--primary-inverted)] font-bold py-3 rounded hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        {loading ? 'SAVING...' : (isEdit ? 'UPDATE DEPARTMENT' : 'CREATE DEPARTMENT')}
                    </button>
                </CyberCard>
            </form>
        </div>
    );
};

export default DepartmentForm;
