import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    Clock,
    Calendar,
    User,
    CheckCircle,
    AlertCircle,
    ChevronRight,
    Target
} from 'lucide-react';
import { performanceService } from '../services/performanceService';
import CyberCard from '../components/CyberCard';
import clsx from 'clsx';

const CycleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cycle, setCycle] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const [cycleRes, candidatesRes] = await Promise.all([
                performanceService.getCycleById(id),
                performanceService.getCandidates(id)
            ]);
            setCycle(cycleRes.data.data);
            setCandidates(candidatesRes.data.data || []);
        } catch (error) {
            console.error('Failed to load cycle details:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate stats
    const completedCount = candidates.filter(c => c.Overall_Score).length;
    const pendingCount = candidates.filter(c => !c.Overall_Score).length;
    const completionPercentage = candidates.length > 0
        ? Math.round((completedCount / candidates.length) * 100)
        : 0;

    // Calculate days until deadline
    const getDaysUntilDeadline = (deadline) => {
        if (!deadline) return null;
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - now;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-xs font-mono animate-pulse text-muted">
                    LOADING CYCLE DATA...
                </div>
            </div>
        );
    }

    if (!cycle) {
        return (
            <div className="text-center py-20">
                <div className="text-xs font-mono text-red-500">CYCLE NOT FOUND</div>
                <button
                    onClick={() => navigate('/performance/cycles')}
                    className="mt-4 text-sm text-primary underline"
                >
                    Back to Cycles
                </button>
            </div>
        );
    }

    const daysLeft = getDaysUntilDeadline(cycle.Submission_Deadline);
    const isActive = new Date() >= new Date(cycle.Start_Date) && new Date() <= new Date(cycle.End_Date);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/performance/cycles')}
                    className="p-2 hover:bg-surfaceHighlight border border-transparent hover:border-border transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-muted" />
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-primary">{cycle.Cycle_Name}</h1>
                        <div className={clsx(
                            "px-2 py-0.5 text-[10px] font-mono uppercase",
                            isActive
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : "bg-surfaceHighlight text-muted border border-border"
                        )}>
                            {isActive ? 'ACTIVE' : 'INACTIVE'}
                        </div>
                    </div>
                    <div className="text-xs text-muted font-mono mt-1">
                        {cycle.Cycle_Type} • {new Date(cycle.Start_Date).toLocaleDateString()} - {new Date(cycle.End_Date).toLocaleDateString()}
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <CyberCard className="text-center">
                    <div className="text-3xl font-bold text-primary font-mono">{candidates.length}</div>
                    <div className="text-[10px] font-mono text-muted uppercase mt-1">TOTAL EMPLOYEES</div>
                </CyberCard>

                <CyberCard className="text-center">
                    <div className="text-3xl font-bold text-green-500 font-mono">{completedCount}</div>
                    <div className="text-[10px] font-mono text-green-500 uppercase mt-1">COMPLETED</div>
                </CyberCard>

                <CyberCard className="text-center">
                    <div className="text-3xl font-bold text-yellow-500 font-mono">{pendingCount}</div>
                    <div className="text-[10px] font-mono text-yellow-500 uppercase mt-1">PENDING</div>
                </CyberCard>

                <CyberCard className="text-center">
                    <div className={clsx(
                        "text-3xl font-bold font-mono",
                        daysLeft <= 7 ? "text-red-500" : daysLeft <= 14 ? "text-yellow-500" : "text-primary"
                    )}>
                        {daysLeft > 0 ? daysLeft : 0}
                    </div>
                    <div className="text-[10px] font-mono text-muted uppercase mt-1">DAYS LEFT</div>
                </CyberCard>
            </div>

            {/* Progress Bar */}
            <CyberCard>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono text-muted">COMPLETION PROGRESS</span>
                    <span className="text-xs font-mono text-primary">{completionPercentage}%</span>
                </div>
                <div className="h-3 bg-surfaceHighlight overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${completionPercentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-primary"
                    />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-muted mt-2">
                    <span>{completedCount} COMPLETED</span>
                    <span>{pendingCount} REMAINING</span>
                </div>
            </CyberCard>

            {/* Employees List */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-mono text-muted uppercase tracking-wider">
                        EMPLOYEES IN THIS CYCLE
                    </h2>
                </div>

                {candidates.length === 0 ? (
                    <CyberCard className="text-center py-10">
                        <div className="text-muted text-sm font-mono">NO EMPLOYEES FOUND FOR THIS CYCLE</div>
                        <p className="text-xs text-muted mt-2">
                            Employees with active job assignments will appear here.
                        </p>
                    </CyberCard>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {candidates.map((employee, index) => (
                            <motion.div
                                key={employee.Assignment_ID}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                            >
                                <CyberCard className="h-full group hover:border-muted transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="p-2 border border-border">
                                            <User className="w-4 h-4 text-muted" />
                                        </div>
                                        <div className={clsx(
                                            "px-2 py-0.5 text-[10px] font-mono border",
                                            employee.Overall_Score
                                                ? "bg-green-500/10 border-green-500/30 text-green-400"
                                                : "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                                        )}>
                                            {employee.Overall_Score ? 'COMPLETED' : 'PENDING'}
                                        </div>
                                    </div>

                                    <h3 className="text-primary font-bold">
                                        {employee.First_Name} {employee.Last_Name}
                                    </h3>
                                    <div className="text-xs text-muted font-mono mt-1">
                                        {employee.Job_Title}
                                    </div>
                                    <div className="text-[10px] text-muted mt-0.5">
                                        {employee.Department_Name}
                                    </div>

                                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                                        <div>
                                            <div className="text-[10px] text-muted uppercase">SCORE</div>
                                            <div className="text-lg font-mono font-bold text-primary">
                                                {employee.Overall_Score || '-'}
                                                <span className="text-xs text-muted font-normal"> / 5.0</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/performance/appraisals/${id}/${employee.Assignment_ID}`)}
                                            className="p-2 border border-border hover:border-primary hover:text-primary transition-colors"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </CyberCard>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* KPI Configuration Callout */}
            <CyberCard className="bg-surfaceHighlight">
                <div className="flex items-start gap-4">
                    <div className="p-2 border border-border">
                        <Target className="w-5 h-5 text-muted" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-primary mb-1">Missing KPIs?</h3>
                        <p className="text-xs text-muted">
                            If employees show "No Objectives Configured", their job roles need KPIs defined.
                            Go to <Link to="/jobs" className="text-primary hover:underline">Jobs</Link> → Edit job → Add Objectives & KPIs.
                        </p>
                    </div>
                </div>
            </CyberCard>
        </div>
    );
};

export default CycleDetail;
