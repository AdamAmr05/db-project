import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, AlertTriangle, CheckCircle, Target } from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import CyberCard from './CyberCard';

const PerformanceCycleTracker = () => {
    const [cycles, setCycles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCycles();
    }, []);

    const loadCycles = async () => {
        try {
            const response = await dashboardService.getActiveCycle();
            // Ensure data is always an array
            const data = Array.isArray(response.data.data) ? response.data.data : (response.data.data ? [response.data.data] : []);
            setCycles(data);
        } catch (error) {
            console.error('Failed to load cycles', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % cycles.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + cycles.length) % cycles.length);
    };

    if (loading) return <div className="h-48 flex items-center justify-center text-xs font-mono animate-pulse">SCANNING CYCLE DATA...</div>;

    if (cycles.length === 0) return (
        <CyberCard title="PERFORMANCE_CYCLE_STATUS" className="w-full opacity-75">
            <div className="h-32 flex flex-col items-center justify-center text-muted">
                <AlertTriangle className="w-8 h-8 mb-2 opacity-50" />
                <div className="text-sm font-mono">NO ACTIVE PERFORMANCE CYCLE DETECTED</div>
                <div className="text-[10px] mt-1">INITIATE NEW CYCLE IN ADMIN CONSOLE</div>
            </div>
        </CyberCard>
    );

    const cycle = cycles[currentIndex];

    // Calculate progress (Non-linear to match evenly spaced visual icons)
    const start = new Date(cycle.Start_Date).getTime();
    const end = new Date(cycle.End_Date).getTime();
    const deadline = new Date(cycle.Submission_Deadline).getTime();
    const now = new Date().getTime();

    let progress = 0;

    // Total visual range is 0-100%
    // We have 4 icons: Start(0%), Objectives(33%), Deadline(66%), End(100%)
    // Segment 1: Start -> Deadline (0% to 66.66%)
    // Segment 2: Deadline -> End (66.66% to 100%)

    if (now < start) {
        progress = 0;
    } else if (now < deadline) {
        const totalSegmentTime = deadline - start;
        const elapsedSegmentTime = now - start;
        progress = (elapsedSegmentTime / totalSegmentTime) * 66.66;
    } else if (now < end) {
        const totalSegmentTime = end - deadline;
        const elapsedSegmentTime = now - deadline;
        progress = 66.66 + (elapsedSegmentTime / totalSegmentTime) * 33.33;
    } else {
        progress = 100;
    }

    // Calculate days remaining with context
    const daysRemaining = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    const daysToStart = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
    const daysToDeadline = Math.ceil((new Date(cycle.Submission_Deadline).getTime() - now) / (1000 * 60 * 60 * 24));

    // Determine cycle status
    const isUpcoming = now < start;
    const isActive = now >= start && now <= end;
    const isPast = now > end;

    const stages = [
        { label: 'Start', date: cycle.Start_Date, icon: Calendar },
        { label: 'Objectives', date: null, icon: Target }, // Implicit stage
        { label: 'Deadline', date: cycle.Submission_Deadline, icon: AlertTriangle },
        { label: 'End', date: cycle.End_Date, icon: CheckCircle },
    ];

    return (
        <CyberCard
            title={
                <div className="flex justify-between items-center w-full gap-4">
                    <span className="truncate flex-1 min-w-0">ACTIVE_CYCLE: {cycle.Cycle_Name.toUpperCase()}</span>
                    {cycles.length > 1 && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={handlePrev} className="p-1 hover:bg-white/10 rounded text-muted hover:text-white transition-colors">
                                <span className="text-xs">◀</span>
                            </button>
                            <span className="text-[10px] text-muted font-mono">{currentIndex + 1}/{cycles.length}</span>
                            <button onClick={handleNext} className="p-1 hover:bg-white/10 rounded text-muted hover:text-white transition-colors">
                                <span className="text-xs">▶</span>
                            </button>
                        </div>
                    )}
                </div>
            }
            className="w-full"
        >
            <div className="relative py-8 px-4">
                {/* Header Stats */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <div className="text-xs text-muted font-mono mb-1">CURRENT PHASE</div>
                        <div className="text-xl text-white font-bold tracking-wider flex items-center gap-2">
                            {isUpcoming ? 'UPCOMING' : isPast ? 'COMPLETED' : (progress < 66 ? 'OBJECTIVE SETTING' : 'PERFORMANCE REVIEW')}
                            <span className={`animate-pulse w-2 h-2 rounded-full ${isUpcoming ? 'bg-yellow-500' : isPast ? 'bg-gray-500' : 'bg-green-500'}`} />
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-muted font-mono mb-1">
                            {isUpcoming ? 'STARTS IN' : isPast ? 'ENDED' : 'TIME REMAINING'}
                        </div>
                        <div className={`text-2xl font-mono font-bold ${isPast ? 'text-gray-500' : 'text-white'}`}>
                            {isUpcoming ? daysToStart : isPast ? Math.abs(daysRemaining) : daysRemaining} <span className="text-sm text-muted">{isPast ? 'DAYS AGO' : 'DAYS'}</span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar Container */}
                <div className="relative h-2 bg-gray-800 rounded-full mb-12 overflow-hidden">
                    {/* Animated Progress Fill */}
                    <motion.div
                        key={cycle.Cycle_ID} // Reset animation on cycle change
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-cyan-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />

                    {/* Scanning Line Effect */}
                    <motion.div
                        className="absolute top-0 h-full w-20 bg-white opacity-20 blur-md"
                        animate={{ x: ['-100%', '500%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                {/* Timeline Nodes */}
                <div className="flex justify-between relative">
                    {/* Connecting Line */}
                    <div className="absolute top-3 left-0 w-full h-px bg-gray-800 -z-10" />

                    {stages.map((stage, index) => {
                        const isPast = stage.date && new Date(stage.date) < new Date();
                        const isNext = !isPast && (index === 0 || (stages[index - 1].date && new Date(stages[index - 1].date) < new Date()));

                        return (
                            <div key={index} className="flex flex-col items-center group cursor-default">
                                <motion.div
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center bg-black z-10 transition-colors duration-300
                                        ${isPast ? 'border-green-500 text-green-500' :
                                            isNext ? 'border-white text-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' :
                                                'border-gray-700 text-gray-700'}`}
                                    whileHover={{ scale: 1.2 }}
                                >
                                    <stage.icon className="w-3 h-3" />
                                </motion.div>
                                <div className={`mt-3 text-[10px] font-mono uppercase tracking-wider transition-colors duration-300 whitespace-nowrap
                                    ${isPast ? 'text-green-500' : isNext ? 'text-white' : 'text-gray-600'}`}>
                                    {stage.label}
                                </div>
                                {stage.date && (
                                    <div className="text-[10px] text-gray-600 font-mono mt-1 whitespace-nowrap">
                                        {new Date(stage.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Footer Info */}
                <div className="mt-8 grid grid-cols-3 gap-4 border-t border-gray-800 pt-4">
                    <div className="text-center">
                        <div className="text-[10px] text-muted uppercase">Submission Deadline</div>
                        <div className="text-sm text-white font-mono mt-1">
                            {new Date(cycle.Submission_Deadline).toLocaleDateString()}
                        </div>
                    </div>
                    <div className="text-center border-l border-gray-800">
                        <div className="text-[10px] text-muted uppercase">Cycle Type</div>
                        <div className="text-sm text-white font-mono mt-1">{cycle.Cycle_Type}</div>
                    </div>
                    <div className="text-center border-l border-gray-800">
                        <div className="text-[10px] text-muted uppercase">Status</div>
                        <div className="text-sm text-green-400 font-mono mt-1">ACTIVE</div>
                    </div>
                </div>
            </div>
        </CyberCard>
    );
};

export default PerformanceCycleTracker;
