import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Plus, Search, Edit, Trash2, MapPin, Mail } from 'lucide-react';
import { departmentService } from '../services/departmentService';
import CyberCard from '../components/CyberCard';

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            const response = await departmentService.getAll();
            setDepartments(response.data.data);
        } catch (error) {
            console.error('Error loading departments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            try {
                await departmentService.delete(id);
                loadDepartments();
            } catch (error) {
                console.error('Error deleting department:', error);
            }
        }
    };

    const filteredDepartments = departments.filter(dept =>
        dept.Department_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.Department_Type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-primary tracking-tight">DEPARTMENTS</h1>
                    <p className="text-muted font-mono text-sm mt-1">MANAGE ORGANIZATIONAL UNITS</p>
                </div>
                {/* <Link
                    to="/departments/new"
                    className="flex items-center gap-2 bg-primary text-[var(--primary-inverted)] px-4 py-2 rounded font-bold hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    ADD DEPARTMENT
                </Link> */}
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                    type="text"
                    placeholder="SEARCH DEPARTMENTS..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-surface border border-border rounded pl-10 pr-4 py-2 text-primary focus:outline-none focus:border-primary font-mono text-sm"
                />
            </div>

            {loading ? (
                <div className="text-center text-muted font-mono py-12">LOADING DEPARTMENTS...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDepartments.map((dept) => (
                        <CyberCard key={dept.Department_ID} className="group relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-secondary/10 rounded">
                                    <Building2 className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => navigate(`/departments/${dept.Department_ID}`)}
                                        className="p-1 hover:text-primary transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(dept.Department_ID)}
                                        className="p-1 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-primary mb-1">{dept.Department_Name}</h3>
                            <div className="inline-block px-2 py-0.5 bg-secondary/20 rounded text-[10px] font-mono text-secondary mb-4">
                                {(dept.Department_Type || 'N/A').toUpperCase()}
                            </div>

                            <div className="space-y-2 text-sm text-muted">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{dept.Location || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    <span className="truncate">{dept.Contact_Email || 'N/A'}</span>
                                </div>
                            </div>
                        </CyberCard>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Departments;
