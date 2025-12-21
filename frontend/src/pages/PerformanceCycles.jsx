import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Search, Trash2, Edit2, Clock, AlertCircle } from 'lucide-react';
import { performanceService } from '../services/performanceService';
import CyberCard from '../components/CyberCard';

const PerformanceCycles = () => {
    const [cycles, setCycles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingCycle, setEditingCycle] = useState(null);
    const [showCycleType, setShowCycleType] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        Cycle_Name: '',
        Cycle_Type: 'Annual',
        Start_Date: '',
        End_Date: '',
        Submission_Deadline: ''
    });

    useEffect(() => {
        loadCycles();
    }, []);

    const loadCycles = async () => {
        try {
            setLoading(true);
            const res = await performanceService.getAllCycles();
            setCycles(res.data.data);
        } catch (error) {
            console.error('Error loading cycles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (cycle) => {
        setEditingCycle(cycle);
        setFormData({
            Cycle_Name: cycle.Cycle_Name,
            Cycle_Type: cycle.Cycle_Type,
            Start_Date: cycle.Start_Date.split('T')[0],
            End_Date: cycle.End_Date.split('T')[0],
            Submission_Deadline: cycle.Submission_Deadline.split('T')[0]
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this cycle?')) {
            try {
                await performanceService.deleteCycle(id);
                loadCycles();
            } catch (err) {
                alert(err.response?.data?.error || 'Failed to delete cycle');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCycle) {
                await performanceService.updateCycle(editingCycle.Cycle_ID, formData);
            } else {
                await performanceService.createCycle(formData);
            }
            setShowForm(false);
            setEditingCycle(null);
            setFormData({ Cycle_Name: '', Cycle_Type: 'Annual', Start_Date: '', End_Date: '', Submission_Deadline: '' });
            loadCycles();
        } catch (err) {
            alert('Failed to save cycle');
        }
    };

    const filteredCycles = cycles.filter(c =>
        c.Cycle_Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-primary tracking-tight flex items-center gap-3">
                        <Clock className="w-8 h-8 text-primary" />
                        PERFORMANCE CYCLES
                    </h1>
                    <p className="text-muted font-mono text-sm mt-1">MANAGE REVIEW PERIODS</p>
                </div>
                <button
                    onClick={() => {
                        setEditingCycle(null);
                        setFormData({ Cycle_Name: '', Cycle_Type: 'Annual', Start_Date: '', End_Date: '', Submission_Deadline: '' });
                        setShowForm(true);
                    }}
                    className="bg-primary text-[var(--primary-inverted)] font-bold px-6 py-2 rounded hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> NEW CYCLE
                </button>
            </div>

            {/* Form Modal (Inline) */}
            {showForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <CyberCard className="w-full max-w-lg border-primary/50 relative">
                        <h2 className="text-xl font-bold text-primary mb-6">
                            {editingCycle ? 'EDIT CYCLE' : 'NEW PERFORMANCE CYCLE'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-mono text-muted">CYCLE NAME</label>
                                <input
                                    required
                                    value={formData.Cycle_Name}
                                    onChange={e => setFormData({ ...formData, Cycle_Name: e.target.value })}
                                    placeholder="e.g. Q4 2024 Review"
                                    className="w-full bg-surface border border-border rounded px-4 py-2 text-primary"
                                />
                            </div>
                            <div className="relative">
                                <label className="text-xs font-mono text-muted">TYPE</label>
                                <div
                                    onClick={() => setShowCycleType(!showCycleType)}
                                    className="w-full bg-surface border border-border rounded px-4 py-2 text-primary cursor-pointer flex justify-between items-center font-mono"
                                >
                                    <span>{formData.Cycle_Type || 'SELECT_TYPE'}</span>
                                    <span className="text-muted">▼</span>
                                </div>
                                {showCycleType && (
                                    <div className="absolute z-10 w-full mt-1 bg-surface border border-accent/30 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                        {['Annual', 'Probation', 'Quarterly'].map((opt) => (
                                            <div
                                                key={opt}
                                                className="px-4 py-2 text-xs font-mono text-primary hover:bg-accent/20 cursor-pointer"
                                                onClick={() => {
                                                    setFormData({ ...formData, Cycle_Type: opt });
                                                    setShowCycleType(false);
                                                }}
                                            >
                                                {opt}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-mono text-muted">START DATE</label>
                                    <input
                                        type="date" required
                                        value={formData.Start_Date}
                                        onChange={e => setFormData({ ...formData, Start_Date: e.target.value })}
                                        className="w-full bg-surface border border-border rounded px-4 py-2 text-primary"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-mono text-muted">END DATE</label>
                                    <input
                                        type="date" required
                                        value={formData.End_Date}
                                        onChange={e => setFormData({ ...formData, End_Date: e.target.value })}
                                        className="w-full bg-surface border border-border rounded px-4 py-2 text-primary"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-mono text-muted text-red-400">SUBMISSION DEADLINE</label>
                                <input
                                    type="date" required
                                    value={formData.Submission_Deadline}
                                    onChange={e => setFormData({ ...formData, Submission_Deadline: e.target.value })}
                                    className="w-full bg-surface border border-border rounded px-4 py-2 text-primary"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-surfaceHighlight text-primary py-2 rounded hover:bg-border">CANCEL</button>
                                <button type="submit" className="flex-1 bg-primary text-[var(--primary-inverted)] font-bold py-2 rounded hover:opacity-90">SAVE CYCLE</button>
                            </div>
                        </form>
                    </CyberCard>
                </div>
            )}

            {/* Search */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                        type="text"
                        placeholder="Search cycles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-3 text-primary focus:outline-none focus:border-accent font-mono"
                    />
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCycles.map(cycle => {
                    const isActive = new Date() >= new Date(cycle.Start_Date) && new Date() <= new Date(cycle.End_Date);
                    return (
                        <CyberCard key={cycle.Cycle_ID} className={`border-l-4 ${isActive ? 'border-l-primary' : 'border-l-muted'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-primary">{cycle.Cycle_Name}</h3>
                                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${isActive ? 'bg-primary/20 text-primary' : 'bg-surfaceHighlight text-muted'}`}>
                                        {isActive ? 'ACTIVE' : 'INACTIVE'}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(cycle)} className="p-2 hover:bg-surfaceHighlight rounded text-muted hover:text-primary"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(cycle.Cycle_ID)} className="p-2 hover:bg-surfaceHighlight rounded text-muted hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                                <div>
                                    <div className="text-muted text-xs font-mono">PERIOD</div>
                                    <div className="text-primary">{new Date(cycle.Start_Date).toLocaleDateString()} - {new Date(cycle.End_Date).toLocaleDateString()}</div>
                                </div>
                                <div>
                                    <div className="text-muted text-xs font-mono">DEADLINE</div>
                                    <div className="text-red-400 font-bold">{new Date(cycle.Submission_Deadline).toLocaleDateString()}</div>
                                </div>
                            </div>
                        </CyberCard>
                    );
                })}
            </div>
        </div>
    );
};

export default PerformanceCycles;
