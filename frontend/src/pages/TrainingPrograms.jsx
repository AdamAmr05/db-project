import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Plus, Search, Edit, Trash2, Users } from 'lucide-react';
import { trainingService } from '../services/trainingService';
import CyberCard from '../components/CyberCard';

const TrainingPrograms = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadPrograms();
    }, []);

    const loadPrograms = async () => {
        try {
            const response = await trainingService.getAll();
            setPrograms(response.data.data);
        } catch (error) {
            console.error('Error loading programs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this program?')) {
            try {
                await trainingService.delete(id);
                loadPrograms();
            } catch (error) {
                alert(error.response?.data?.error || 'Failed to delete program');
            }
        }
    };

    const filteredPrograms = programs.filter(p =>
        p.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.Program_Code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-primary tracking-tight">TRAINING PROGRAMS</h1>
                    <p className="text-muted font-mono text-sm mt-1">DEVELOP WORKFORCE SKILLS</p>
                </div>
                <Link
                    to="/training/new"
                    className="flex items-center gap-2 bg-primary text-[var(--primary-inverted)] px-4 py-2 rounded font-bold hover:opacity-90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    NEW PROGRAM
                </Link>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                    type="text"
                    placeholder="SEARCH PROGRAMS..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-surface border border-border rounded pl-10 pr-4 py-2 text-primary focus:outline-none focus:border-accent font-mono text-sm"
                />
            </div>

            {loading ? (
                <div className="text-center text-muted font-mono py-12">LOADING PROGRAMS...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPrograms.map((program) => (
                        <CyberCard key={program.Program_ID} className="group hover:border-primary/50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <GraduationCap className="w-6 h-6" />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/training/${program.Program_ID}`)}
                                        className="p-1.5 hover:bg-surfaceHighlight rounded text-muted hover:text-primary transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(program.Program_ID)}
                                        className="p-1.5 hover:bg-red-500/20 rounded text-muted hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-primary mb-1 group-hover:text-accent transition-colors">
                                    {program.Title}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-muted">
                                    <span className="font-mono text-xs bg-surfaceHighlight px-2 py-0.5 rounded">
                                        {program.Program_Code}
                                    </span>
                                    <span>•</span>
                                    <span>{program.Delivery_Method}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted">Type</span>
                                    <span className="text-primary">{program.Type}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted">Status</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${program.Approval_Status === 'Approved' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                                        }`}>
                                        {program.Approval_Status}
                                    </span>
                                </div>
                                <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted text-sm">
                                        <Users className="w-4 h-4" />
                                        <span>{program.Enrolled_Count} Enrolled</span>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/training/${program.Program_ID}`)}
                                        className="text-primary text-xs font-bold hover:underline"
                                    >
                                        MANAGE
                                    </button>
                                </div>
                            </div>
                        </CyberCard>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TrainingPrograms;
