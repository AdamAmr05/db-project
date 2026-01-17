import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Activity,
    Clock,
    Award,
    Gavel,
    ChevronRight,
    Target,
    Users,
    AlertCircle,
    CheckCircle,
    Calendar
} from 'lucide-react';
import { performanceService } from '../services/performanceService';
import { dashboardService } from '../services/dashboardService';
import CyberCard from '../components/CyberCard';
import clsx from 'clsx';

const PerformanceHub = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeCycle, setActiveCycle] = useState(null);
    const [allCycles, setAllCycles] = useState([]);
    const [stats, setStats] = useState({
        pendingAppraisals: 0,
        completedAppraisals: 0,
        pendingAppeals: 0,
        avgScore: 0,
        kpiCompletion: 0
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [cycleRes, allCyclesRes, statsRes, appealsRes] = await Promise.all([
                dashboardService.getActiveCycle(),
                performanceService.getAllCycles(),
                dashboardService.getStats(),
                performanceService.getAppeals('Pending')
            ]);

            // Handle active cycle
            const cycleData = cycleRes.data.data;
            if (Array.isArray(cycleData)) {
                setActiveCycle(cycleData[0] || null);
            } else {
                setActiveCycle(cycleData || null);
            }

            setAllCycles(allCyclesRes.data.data || []);

            // Set stats
            const dashStats = statsRes.data.data;
            const pendingAppealsCount = appealsRes.data.data?.length || 0;

            setStats({
                pendingAppraisals: dashStats.pendingAppraisals || 0,
                completedAppraisals: dashStats.completedAppraisals || 0,
                pendingAppeals: pendingAppealsCount,
                avgScore: dashStats.avgAppraisalScore || 0,
                kpiCompletion: dashStats.kpiCompletionRate || 0
            });
        } catch (error) {
            console.error('Failed to load performance data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate days until deadline
    const getDaysUntilDeadline = (deadline) => {
        if (!deadline) return null;
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-xs font-mono animate-pulse text-muted">
                    LOADING PERFORMANCE DATA...
                </div>
            </div>
        );
    }

    const daysLeft = activeCycle ? getDaysUntilDeadline(activeCycle.Submission_Deadline) : null;

    const totalAppraisals = (stats?.pendingAppraisals || 0) + (stats?.completedAppraisals || 0);
    const progressPercent = totalAppraisals > 0
        ? ((stats?.completedAppraisals || 0) / totalAppraisals) * 100
        : 0;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-primary tracking-tight flex items-center gap-3">
                    <Activity className="w-8 h-8 text-primary" />
                    PERFORMANCE HUB
                </h1>
                <p className="text-muted font-mono text-sm mt-1">
                    MANAGE CYCLES, APPRAISALS & APPEALS
                </p>
            </div>

            {/* Active Cycle Hero Card */}
            {activeCycle ? (
                <div>
                    <CyberCard className="border-l-4 border-l-primary">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 bg-green-500 animate-pulse" />
                                    <span className="text-[10px] font-mono text-green-500 uppercase tracking-wider">
                                        ACTIVE CYCLE
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-primary mb-1">{activeCycle.Cycle_Name}</h2>
                                <p className="text-sm text-muted">{activeCycle.Description}</p>
                                <div className="flex items-center gap-4 mt-4 text-xs font-mono">
                                    <span className="text-muted">
                                        {new Date(activeCycle.Start_Date).toLocaleDateString()} - {new Date(activeCycle.End_Date).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {/* Countdown */}
                            <div className="lg:text-right">
                                <div className="text-[10px] font-mono text-muted uppercase mb-1">DEADLINE</div>
                                <div className="text-4xl font-bold text-primary font-mono">
                                    {daysLeft}
                                    <span className="text-lg text-muted ml-1">DAYS</span>
                                </div>
                                <div className="text-xs text-muted mt-1">
                                    {new Date(activeCycle.Submission_Deadline).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-6 pt-4 border-t border-border">
                            <div className="flex justify-between text-[10px] font-mono text-muted mb-2">
                                <span>CYCLE PROGRESS</span>
                                <span>{Math.round(progressPercent)}%</span>
                            </div>
                            <div className="h-1 bg-surface rounded overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-6 flex flex-wrap gap-3">
                            <button
                                onClick={() => navigate(`/performance/cycles/${activeCycle.Cycle_ID}`)}
                                className="flex items-center gap-2 bg-primary text-[var(--primary-inverted)] font-bold px-4 py-2 text-xs"
                            >
                                <Award className="w-3 h-3" />
                                VIEW APPRAISALS
                            </button>
                            <button
                                onClick={() => navigate(`/performance/cycles`)}
                                className="flex items-center gap-2 border border-border text-primary font-mono px-4 py-2 hover:bg-surfaceHighlight transition-all text-xs"
                            >
                                VIEW ALL CYCLES
                                <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    </CyberCard>
                </div>
            ) : (
                <CyberCard className="border-l-4 border-l-yellow-500">
                    <div className="flex items-start gap-4">
                        <div className="p-2 border border-yellow-500/30">
                            <AlertCircle className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-primary">No Active Performance Cycle</h3>
                            <p className="text-sm text-muted mt-2">
                                There is currently no active performance cycle. Create a new cycle to start collecting appraisals.
                            </p>
                            <button
                                onClick={() => navigate('/performance/cycles')}
                                className="mt-4 flex items-center gap-2 bg-primary text-[var(--primary-inverted)] font-bold px-4 py-2 text-sm"
                            >
                                <Clock className="w-4 h-4" />
                                MANAGE CYCLES
                            </button>
                        </div>
                    </div>
                </CyberCard>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <CyberCard className="text-center">
                        <div className="text-3xl font-bold text-primary font-mono">{stats.pendingAppraisals}</div>
                        <div className="text-[10px] font-mono text-yellow-500 uppercase mt-1">PENDING APPRAISALS</div>
                    </CyberCard>
                </div>

                <div>
                    <CyberCard className="text-center">
                        <div className="text-3xl font-bold text-primary font-mono">{stats.completedAppraisals}</div>
                        <div className="text-[10px] font-mono text-green-500 uppercase mt-1">COMPLETED</div>
                    </CyberCard>
                </div>

                <div>
                    <CyberCard className="text-center">
                        <div className="text-3xl font-bold text-primary font-mono">{stats.pendingAppeals}</div>
                        <div className="text-[10px] font-mono text-red-400 uppercase mt-1">APPEALS PENDING</div>
                    </CyberCard>
                </div>

                <div>
                    <CyberCard className="text-center">
                        <div className="text-3xl font-bold text-primary font-mono">{Number(stats.avgScore).toFixed(1)}<span className="text-lg text-muted">/5</span></div>
                        <div className="text-[10px] font-mono text-muted uppercase mt-1">AVG SCORE</div>
                    </CyberCard>
                </div>
            </div>

            {/* Quick Navigation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Cycles */}
                <div className="h-full">
                    <Link to="/performance/cycles" className="block group h-full">
                        <CyberCard className="h-full hover:border-primary transition-colors flex flex-col min-h-[180px]">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 border border-border group-hover:border-primary transition-colors">
                                    <Clock className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
                            </div>
                            <h3 className="text-lg font-bold text-primary mb-1">Performance Cycles</h3>
                            <p className="text-xs text-muted flex-1">
                                Create and manage review periods. {allCycles.length} total cycles.
                            </p>
                            <div className="h-6 mt-2" /> {/* Spacer for consistency */}
                        </CyberCard>
                    </Link>
                </div>

                {/* Appraisals */}
                <div className="h-full">
                    <Link to="/performance/appraisals" className="block group h-full">
                        <CyberCard className="h-full hover:border-primary transition-colors flex flex-col min-h-[180px]">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 border border-border group-hover:border-primary transition-colors">
                                    <Award className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
                            </div>
                            <h3 className="text-lg font-bold text-primary mb-1">Appraisals</h3>
                            <p className="text-xs text-muted flex-1">
                                Score employee KPIs and submit reviews.
                            </p>
                            <div className="h-6 mt-2">
                                {stats.pendingAppraisals > 0 && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-yellow-500 bg-yellow-500/10 px-2 py-0.5">
                                        <AlertCircle className="w-3 h-3" />
                                        {stats.pendingAppraisals} PENDING
                                    </span>
                                )}
                            </div>
                        </CyberCard>
                    </Link>
                </div>

                {/* Appeals */}
                <div className="h-full">
                    <Link to="/appeals" className="block group h-full">
                        <CyberCard className="h-full hover:border-primary transition-colors flex flex-col min-h-[180px]">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 border border-border group-hover:border-primary transition-colors">
                                    <Gavel className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
                            </div>
                            <h3 className="text-lg font-bold text-primary mb-1">Appeals Board</h3>
                            <p className="text-xs text-muted flex-1">
                                Review and resolve score disputes.
                            </p>
                            <div className="h-6 mt-2">
                                {stats.pendingAppeals > 0 && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5">
                                        <AlertCircle className="w-3 h-3" />
                                        {stats.pendingAppeals} AWAITING REVIEW
                                    </span>
                                )}
                            </div>
                        </CyberCard>
                    </Link>
                </div>
            </div>

            {/* KPI Configuration Callout */}
            <CyberCard className="bg-surfaceHighlight">
                <div className="flex items-start gap-4">
                    <div className="p-2 border border-border">
                        <Target className="w-5 h-5 text-muted" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-primary mb-1">Configure Job Objectives & KPIs</h3>
                        <p className="text-xs text-muted">
                            To score employee performance, each job role needs objectives and KPIs defined.
                            Go to <Link to="/jobs" className="text-primary hover:underline">Jobs</Link> → Edit a job → Add Objectives & KPIs.
                        </p>
                    </div>
                    <Link
                        to="/jobs"
                        className="text-xs font-mono text-primary hover:text-primary/80 flex items-center gap-1"
                    >
                        GO TO JOBS
                        <ChevronRight className="w-3 h-3" />
                    </Link>
                </div>
            </CyberCard>
        </div>
    );
};

export default PerformanceHub;
