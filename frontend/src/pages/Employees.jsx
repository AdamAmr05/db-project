import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import { employeeService } from '../services/employeeService';
import CyberCard from '../components/CyberCard';

const Employees = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        try {
            const response = await employeeService.getAll();
            setEmployees(response.data.data);
        } catch (error) {
            console.error('Failed to load employees', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('CONFIRM DELETION: This action cannot be undone.')) {
            try {
                await employeeService.delete(id);
                loadEmployees();
            } catch (error) {
                alert('DELETION FAILED: ' + error.message);
            }
        }
    };

    const filteredEmployees = employees.filter(emp =>
        emp.First_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.Last_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.Work_Email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                        <input
                            type="text"
                            placeholder="SEARCH_DATABASE..."
                            className="cyber-input pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="cyber-button-outline flex items-center gap-2">
                        <Filter className="w-4 h-4" /> FILTER
                    </button>
                </div>
                <button
                    onClick={() => navigate('/employees/new')}
                    className="cyber-button flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> NEW_ENTRY
                </button>
            </div>

            {/* Data Grid */}
            <CyberCard className="min-h-[500px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border text-xs font-mono text-muted uppercase tracking-wider">
                                <th className="p-4 font-normal">ID</th>
                                <th className="p-4 font-normal">Employee</th>
                                <th className="p-4 font-normal">Role</th>
                                <th className="p-4 font-normal">Department</th>
                                <th className="p-4 font-normal">Status</th>
                                <th className="p-4 font-normal text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-mono">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-muted animate-pulse">LOADING_DATA...</td>
                                </tr>
                            ) : filteredEmployees.map((emp) => (
                                <tr key={emp.Employee_ID} className="border-b border-border/50 hover:bg-surfaceHighlight transition-colors group">
                                    <td className="p-4 text-muted">#{String(emp.Employee_ID).padStart(4, '0')}</td>
                                    <td className="p-4">
                                        <div className="font-bold text-primary">{emp.First_Name} {emp.Last_Name}</div>
                                        <div className="text-xs text-muted">{emp.Work_Email}</div>
                                    </td>
                                    <td className="p-4 text-primary">{emp.Job_Title || 'N/A'}</td>
                                    <td className="p-4 text-primary">{emp.Department_Name || 'N/A'}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-[10px] border ${emp.Employment_Status === 'Active' ? 'border-green-500 text-green-500' :
                                            emp.Employment_Status === 'Probation' ? 'border-yellow-500 text-yellow-500' :
                                                'border-red-500 text-red-500'
                                            }`}>
                                            {emp.Employment_Status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => navigate(`/employees/${emp.Employee_ID}`)}
                                                className="p-2 hover:bg-primary hover:text-[var(--primary-inverted)] transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(emp.Employee_ID)}
                                                className="p-2 hover:bg-red-500 hover:text-primary transition-colors text-red-500"
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
    );
};

export default Employees;
