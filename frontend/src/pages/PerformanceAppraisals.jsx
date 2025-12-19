import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Award, ChevronRight, User, CheckCircle, Clock } from 'lucide-react';
import { performanceService } from '../services/performanceService';
import { dashboardService } from '../services/dashboardService';
import CyberCard from '../components/CyberCard';
import clsx from 'clsx';

const PerformanceAppraisals = () => {
    const navigate = useNavigate();
    const [cycle, setCycle] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Get Active Cycle first
            const cycleResponse = await dashboardService.getActiveCycle();
            // Handle array or object
            let activeCycle = null;
            if (Array.isArray(cycleResponse.data.data)) {
                activeCycle = cycleResponse.data.data[0]; // Use first active cycle for now
            } else {
                activeCycle = cycleResponse.data.data;
            }

            setCycle(activeCycle);

            if (activeCycle) {
                const candidatesResponse = await performanceService.getCandidates(activeCycle.Cycle_ID);
                setCandidates(candidatesResponse.data.data);
            }
        } catch (error) {
            console.error('Failed to load appraisal data', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCandidates = candidates.filter(c =>
        c.First_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.Last_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.Job_Title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-xs font-mono animate-pulse">LOADING APPRAISAL DATA...</div>;
    if (!cycle) return <div className="text-xs font-mono text-red-500">NO ACTIVE PERFORMANCE CYCLE FOUND</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-wider flex items-center gap-2">
                        <Award className="w-6 h-6 text-white" />
                        APPRAISALS
                    </h1>
                    <div className="text-xs text-muted font-mono mt-1">
                        CYCLE: <span className="text-white">{cycle.Cycle_Name}</span> (Due: {new Date(cycle.Submission_Deadline).toLocaleDateString()})
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-surface border border-border pl-10 pr-4 py-2 text-sm text-white focus:border-green-500 focus:outline-none placeholder-muted/50"
                    />
                </div>
            </div>

            {/* Candidates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCandidates.map((employee, index) => (
                    <motion.div
                        key={employee.Assignment_ID}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <CyberCard className="h-full group hover:border-green-500/50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 border border-border">
                                    <User className="w-5 h-5 text-muted" />
                                </div>
                                <div className={clsx(
                                    "px-2 py-1 rounded text-[10px] font-mono border",
                                    employee.Overall_Score
                                        ? "bg-green-500/10 border-green-500/20 text-green-400"
                                        : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                                )}>
                                    {employee.Overall_Score ? 'COMPLETED' : 'PENDING'}
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="text-lg font-bold text-white">
                                    {employee.First_Name} {employee.Last_Name}
                                </div>
                                <div className="text-xs text-muted font-mono mt-1 flex items-center gap-2">
                                    <span className="bg-surface px-1.5 py-0.5 border border-border">{employee.Job_Title}</span>
                                    <span>•</span>
                                    <span>{employee.Department_Name}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-auto pt-4 border-t border-border">
                                <div>
                                    <div className="text-[10px] text-muted uppercase">Score</div>
                                    <div className="text-lg font-mono font-bold text-white">
                                        {employee.Overall_Score ? employee.Overall_Score : '-'} <span className="text-xs text-muted">/ 5.0</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate(`/performance/appraisals/${cycle.Cycle_ID}/${employee.Assignment_ID}`)}
                                    className="p-2 border border-border hover:border-green-500 hover:text-green-400 transition-all duration-300"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </CyberCard>
                    </motion.div>
                ))}
            </div>

            {filteredCandidates.length === 0 && (
                <div className="text-center py-20 text-muted font-mono">
                    NO EMPLOYEES FOUND FOR THIS CYCLE
                </div>
            )}
        </div>
    );
};

export default PerformanceAppraisals;
