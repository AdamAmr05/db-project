import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Save, Send, Target, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { performanceService } from '../services/performanceService';
import CyberCard from '../components/CyberCard';
import Tooltip from '../components/Tooltip';
import clsx from 'clsx';

const EmployeeAppraisal = () => {
    const { cycleId, assignmentId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [scores, setScores] = useState({}); // Local state for inputs { kpiId: { score: val, actual: val, comments: val } }
    const [managerComments, setManagerComments] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showAppealModal, setShowAppealModal] = useState(false);
    const [appealReason, setAppealReason] = useState('');

    const handleSubmitAppeal = async () => {
        if (!appealReason.trim()) return;

        try {
            await performanceService.submitAppeal({ appraisalId: data.appraisal.Appraisal_ID, reason: appealReason });
            alert('Appeal submitted successfully! Check the Appeals Board.');
            setShowAppealModal(false);
            setAppealReason('');
        } catch (err) {
            alert('Failed to submit appeal: ' + (err.response?.data?.error || err.message));
        }
    };

    useEffect(() => {
        loadData();
    }, [cycleId, assignmentId]);

    const loadData = async () => {
        try {
            const response = await performanceService.getAppraisalDetails(cycleId, assignmentId);
            setData(response.data.data);

            // Initialize local state from fetched data
            const initialScores = {};
            response.data.data.objectives.forEach(obj => {
                obj.KPIs.forEach(kpi => {
                    initialScores[kpi.KPI_ID] = {
                        score: kpi.Score || '',
                        actual: kpi.Actual_Value || '',
                        comments: kpi.Comments || ''
                    };
                });
            });
            setScores(initialScores);
            setManagerComments(response.data.data.appraisal?.Manager_Comments || '');

        } catch (error) {
            console.error('Failed to load appraisal details', error);
        } finally {
            setLoading(false);
        }
    };

    const handleScoreChange = (kpiId, field, value) => {
        setScores(prev => ({
            ...prev,
            [kpiId]: {
                ...prev[kpiId],
                [field]: value
            }
        }));
    };

    const handleFinalize = async () => {
        if (!window.confirm('Are you sure you want to finalize this appraisal? This will save all current scores and submit.')) return;

        setSubmitting(true);
        try {
            // 1. Save all KPI scores first
            const savePromises = Object.keys(scores).map(kpiId => {
                const kpiData = scores[kpiId];
                // Only save if there is data to save (optional optimization, but user said "whatever they have")
                // We'll save everything in state to be safe.
                return performanceService.saveScore({
                    assignmentId,
                    cycleId,
                    kpiId,
                    score: kpiData.score,
                    actualValue: kpiData.actual,
                    comments: kpiData.comments
                });
            });

            await Promise.all(savePromises);

            // 2. Finalize
            await performanceService.finalizeAppraisal({
                assignmentId,
                cycleId,
                managerComments
            });
            navigate('/performance/appraisals');
        } catch (error) {
            console.error('Failed to finalize', error);
            alert('Error submitting appraisal: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-xs font-mono animate-pulse">LOADING APPRAISAL FORM...</div>;
    if (!data) return <div className="text-xs font-mono text-red-500">DATA NOT FOUND</div>;

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-surfaceHighlight border border-transparent hover:border-border transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-muted" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-primary">Employee Appraisal</h1>
                    <div className="text-xs text-muted font-mono">
                        APPRAISAL ID: {data.appraisal?.Appraisal_ID || 'NEW'} • CYCLE ID: {cycleId}
                    </div>
                </div>
            </div>

            {/* Wizard Progress Indicator */}
            <div className="bg-surface border border-border p-4">
                <div className="flex items-center justify-between">
                    {/* Step 1: Employee Info */}
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 flex items-center justify-center border-2 border-primary bg-primary text-[var(--primary-inverted)] font-mono text-sm font-bold">
                            1
                        </div>
                        <div>
                            <div className="text-xs font-mono text-primary font-bold">EMPLOYEE</div>
                            <div className="text-[10px] text-muted">
                                {data.employee?.First_Name} {data.employee?.Last_Name}
                            </div>
                        </div>
                    </div>

                    {/* Connector */}
                    <div className="w-12 h-0.5 bg-primary/50 hidden md:block" />

                    {/* Step 2: KPI Scoring */}
                    <div className="flex items-center gap-3 flex-1">
                        <div className={clsx(
                            "w-8 h-8 flex items-center justify-center border-2 font-mono text-sm font-bold",
                            data.objectives?.length > 0
                                ? "border-primary bg-primary text-[var(--primary-inverted)]"
                                : "border-muted text-muted"
                        )}>
                            2
                        </div>
                        <div>
                            <div className={clsx(
                                "text-xs font-mono font-bold",
                                data.objectives?.length > 0 ? "text-primary" : "text-muted"
                            )}>KPI SCORING</div>
                            <div className="text-[10px] text-muted">
                                {data.objectives?.length || 0} objectives
                            </div>
                        </div>
                    </div>

                    {/* Connector */}
                    <div className={clsx(
                        "w-12 h-0.5 hidden md:block",
                        data.appraisal?.Overall_Score ? "bg-primary/50" : "bg-muted/30"
                    )} />

                    {/* Step 3: Review & Submit */}
                    <div className="flex items-center gap-3 flex-1">
                        <div className={clsx(
                            "w-8 h-8 flex items-center justify-center border-2 font-mono text-sm font-bold",
                            data.appraisal?.Overall_Score
                                ? "border-green-500 bg-green-500 text-white"
                                : "border-muted text-muted"
                        )}>
                            {data.appraisal?.Overall_Score ? <CheckCircle className="w-4 h-4" /> : '3'}
                        </div>
                        <div>
                            <div className={clsx(
                                "text-xs font-mono font-bold",
                                data.appraisal?.Overall_Score ? "text-green-500" : "text-muted"
                            )}>
                                {data.appraisal?.Overall_Score ? 'COMPLETED' : 'REVIEW'}
                            </div>
                            <div className="text-[10px] text-muted">
                                {data.appraisal?.Overall_Score ? `Score: ${data.appraisal.Overall_Score}` : 'Finalize'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Objectives Loop */}
            {data.objectives.length === 0 ? (
                <CyberCard className="border-l-4 border-l-yellow-500">
                    <div className="flex items-start gap-4">
                        <div className="p-2 border border-yellow-500/30">
                            <AlertCircle className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-primary">No Objectives Configured</h3>
                            <p className="text-sm text-muted mt-2">
                                This employee's job role does not have any objectives or KPIs assigned yet.
                            </p>
                            <p className="text-xs text-muted mt-2 font-mono">
                                To score this employee, first configure objectives and KPIs for their job role.
                            </p>
                            {data.employee?.Job_ID && (
                                <button
                                    onClick={() => navigate(`/jobs/${data.employee.Job_ID}`)}
                                    className="mt-4 flex items-center gap-2 bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 px-4 py-2 text-xs font-bold hover:bg-yellow-500 hover:text-black transition-all"
                                >
                                    <Target className="w-4 h-4" />
                                    CONFIGURE JOB KPIs
                                </button>
                            )}
                        </div>
                    </div>
                </CyberCard>
            ) : (
                data.objectives.map((obj, index) => (
                    <CyberCard key={obj.Objective_ID} className="group border-l-4 border-l-white/20">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-start gap-4">
                                <div className="p-2 border border-border">
                                    <Target className="w-5 h-5 text-muted" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-primary">{obj.Title}</h3>
                                    <p className="text-sm text-muted mt-1">{obj.Description}</p>
                                </div>
                            </div>
                            <div className="text-xs font-mono px-2 py-1 bg-surface border border-border">
                                WEIGHT: {obj.Weight}%
                            </div>
                        </div>

                        {/* KPIs Table */}
                        <div className="overflow-visible">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-surface text-muted text-xs uppercase font-mono">
                                    <tr>
                                        <th className="px-4 py-3 min-w-[200px]">KPI Metric</th>
                                        <th className="px-4 py-3">Target</th>
                                        <th className="px-4 py-3">
                                            <span className="flex items-center gap-1">
                                                Actual
                                                <Tooltip text="What the employee actually achieved for this KPI (e.g., if target is 5 bugs/month, enter how many bugs they actually had).">
                                                    <Info className="w-3 h-3" />
                                                </Tooltip>
                                            </span>
                                        </th>
                                        <th className="px-4 py-3">
                                            <span className="flex items-center gap-1">
                                                Score (1-5)
                                                <Tooltip text="Rate 1-5 based on how well they met the target. 1=Poor, 2=Below Expectations, 3=Meets Expectations, 4=Exceeds, 5=Outstanding.">
                                                    <Info className="w-3 h-3" />
                                                </Tooltip>
                                            </span>
                                        </th>
                                        <th className="px-4 py-3 min-w-[200px]">Comments</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {obj.KPIs.map(kpi => (
                                        <tr key={kpi.KPI_ID} className="hover:bg-surfaceHighlight transition-colors">
                                            <td className="px-4 py-3 align-top">
                                                <div className="font-medium text-primary">{kpi.KPI_Name}</div>
                                                <div className="text-xs text-muted mt-1">{kpi.Description}</div>
                                                <div className="text-[10px] text-muted mt-1 font-mono">WEIGHT: {kpi.Weight}%</div>
                                            </td>
                                            <td className="px-4 py-3 align-top font-mono">
                                                {kpi.Target} <span className="text-[10px] text-muted">{kpi.Unit}</span>
                                            </td>
                                            <td className="px-4 py-3 align-top">
                                                <input
                                                    type="number"
                                                    className="bg-surface border border-border rounded px-2 py-1 w-24 text-primary focus:border-primary focus:outline-none font-mono"
                                                    placeholder="Value"
                                                    value={scores[kpi.KPI_ID]?.actual}
                                                    onChange={(e) => handleScoreChange(kpi.KPI_ID, 'actual', e.target.value)}
                                                />
                                            </td>
                                            <td className="px-4 py-3 align-top">
                                                <input
                                                    type="number"
                                                    min="1" max="5" step="0.1"
                                                    className="bg-surface border border-border rounded px-2 py-1 w-20 text-primary focus:border-primary focus:outline-none font-mono"
                                                    placeholder="1-5"
                                                    value={scores[kpi.KPI_ID]?.score}
                                                    onChange={(e) => handleScoreChange(kpi.KPI_ID, 'score', e.target.value)}
                                                />
                                            </td>
                                            <td className="px-4 py-3 align-top">
                                                <textarea
                                                    className="bg-surface border border-border rounded px-2 py-1 w-full text-primary focus:border-primary focus:outline-none text-xs resize-none h-16"
                                                    placeholder="Optional comments..."
                                                    value={scores[kpi.KPI_ID]?.comments}
                                                    onChange={(e) => handleScoreChange(kpi.KPI_ID, 'comments', e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CyberCard>
                ))
            )}

            {/* Manager Comments Section */}
            <CyberCard className="mt-6">
                <h3 className="text-lg font-bold text-primary mb-4">Overall Assessment</h3>
                <textarea
                    className="w-full bg-surface border border-border rounded p-4 text-primary focus:border-accent focus:outline-none h-32"
                    placeholder="Enter overall manager comments and feedback..."
                    value={managerComments}
                    onChange={(e) => setManagerComments(e.target.value)}
                />
            </CyberCard>

            {/* Footer Actions */}
            <div className="mt-8 flex justify-between pb-10">
                {/* IDK if we should show this for everyone, but for demo purposes allowing appeal creation here */}
                {data.appraisal?.Overall_Score && (
                    <button
                        onClick={() => setShowAppealModal(true)}
                        className="flex items-center gap-2 border border-red-500/50 text-red-400 px-4 py-2 rounded hover:bg-red-500/10 transition-colors text-xs font-bold font-mono tracking-wider"
                    >
                        <AlertCircle className="w-4 h-4" />
                        DISPUTE / APPEAL SCORE
                    </button>
                )}

                <button
                    onClick={handleFinalize}
                    disabled={submitting}
                    className="flex items-center gap-2 bg-primary text-[var(--primary-inverted)] font-bold px-8 py-3 hover:bg-primary/90 transition-all ml-auto"
                >
                    {submitting ? 'PROCESSING...' : (
                        <>
                            <CheckCircle className="w-5 h-5" />
                            FINALIZE APPRAISAL
                        </>
                    )}
                </button>
            </div>

            {/* Appeal Modal */}
            <AnimatePresence>
                {showAppealModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            className="bg-surface border border-border p-6 w-full max-w-md shadow-2xl"
                        >
                            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                                <AlertCircle className="w-6 h-6 text-red-500" />
                                File an Appeal
                            </h2>
                            <p className="text-xs text-muted mb-4">
                                Please describe why you are disputing this appraisal score.
                            </p>

                            <textarea
                                value={appealReason}
                                onChange={(e) => setAppealReason(e.target.value)}
                                className="w-full bg-surface border border-border px-4 py-3 text-primary focus:outline-none focus:border-red-500 font-mono text-sm h-32 resize-none mb-6"
                                placeholder="Enter your reason here..."
                                autoFocus
                            />

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowAppealModal(false)}
                                    className="text-muted text-sm hover:text-primary px-4 py-2"
                                >
                                    CANCEL
                                </button>
                                <button
                                    onClick={handleSubmitAppeal}
                                    className="bg-red-500/20 text-red-400 border border-red-500/50 px-6 py-2 text-sm font-bold hover:bg-red-500 hover:text-[var(--primary-inverted)] transition-all"
                                >
                                    SUBMIT APPEAL
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EmployeeAppraisal;
