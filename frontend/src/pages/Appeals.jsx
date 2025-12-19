import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, XCircle, Gavel, FileText } from 'lucide-react';
import { performanceService } from '../services/performanceService';
import CyberCard from '../components/CyberCard';
import clsx from 'clsx';

const Appeals = () => {
    const [appeals, setAppeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppeal, setSelectedAppeal] = useState(null); // For review modal
    const [reviewForm, setReviewForm] = useState({ status: 'Approved', outcomeScore: '' });

    useEffect(() => {
        loadAppeals();
    }, []);

    const loadAppeals = async () => {
        try {
            const response = await performanceService.getAppeals();
            setAppeals(response.data.data);
        } catch (error) {
            console.error('Failed to load appeals', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSubmit = async () => {
        try {
            await performanceService.reviewAppeal(selectedAppeal.Appeal_ID, reviewForm);
            setSelectedAppeal(null);
            loadAppeals(); // Refresh
        } catch (error) {
            console.error('Failed to review appeal', error);
            alert('Error: ' + error.response?.data?.error || error.message);
        }
    };

    if (loading) return <div className="text-xs font-mono animate-pulse">LOADING APPEALS...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white tracking-wider flex items-center gap-2">
                <Gavel className="w-6 h-6 text-white" />
                APPEALS BOARD
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {appeals.map((appeal) => (
                    <motion.div key={appeal.Appeal_ID} layout>
                        <CyberCard className="h-full group hover:border-white/30 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="font-bold text-white">{appeal.First_Name} {appeal.Last_Name}</div>
                                    <div className="text-xs text-muted font-mono">{appeal.Job_Title}</div>
                                    <div className="text-[10px] text-muted font-mono mt-1 opacity-50">{appeal.Cycle_Name}</div>
                                </div>
                                <div className={clsx(
                                    "px-2 py-1 rounded text-[10px] font-mono border",
                                    appeal.Approval_Status === 'Pending' ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" :
                                        appeal.Approval_Status === 'Approved' ? "bg-green-500/10 border-green-500/20 text-green-400" :
                                            "bg-red-500/10 border-red-500/20 text-red-400"
                                )}>
                                    {appeal.Approval_Status.toUpperCase()}
                                </div>
                            </div>

                            <div className="bg-black/40 p-3 mb-4 border border-border">
                                <div className="flex items-center gap-2 text-xs text-muted mb-1 font-mono uppercase">
                                    <FileText className="w-3 h-3" /> Reason for Appeal
                                </div>
                                <p className="text-sm text-gray-300 italic">"{appeal.Reason}"</p>
                            </div>

                            <div className="flex justify-between items-end mt-auto pt-4 border-t border-border">
                                <div>
                                    <div className="text-[10px] text-muted">Original Score</div>
                                    <div className="font-mono text-white">{appeal.Original_Score}</div>
                                </div>
                                {appeal.appeal_outcome_Score && (
                                    <div className="text-right">
                                        <div className="text-[10px] text-muted">New Score</div>
                                        <div className="font-mono text-green-400 font-bold">{appeal.appeal_outcome_Score}</div>
                                    </div>
                                )}
                                {appeal.Approval_Status === 'Pending' && (
                                    <button
                                        onClick={() => {
                                            setSelectedAppeal(appeal);
                                            // Don't pre-fill with original score, force user to enter new one or leave empty
                                            setReviewForm({ status: 'Approved', outcomeScore: '' });
                                        }}
                                        className="bg-white/10 text-white border border-white/20 px-4 py-1.5 text-xs font-bold hover:bg-white hover:text-black transition-all"
                                    >
                                        REVIEW
                                    </button>
                                )}
                            </div>
                        </CyberCard>
                    </motion.div>
                ))}
            </div>

            {/* Review Modal */}
            <AnimatePresence>
                {selectedAppeal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            className="bg-background border border-border p-6 w-full max-w-md shadow-2xl"
                        >
                            <h2 className="text-xl font-bold text-white mb-4">Review Appeal</h2>

                            <div className="mb-6">
                                <label className="block text-xs font-mono text-muted mb-2">DECISION</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setReviewForm(prev => ({ ...prev, status: 'Approved' }))}
                                        className={clsx(
                                            "p-3 border text-center transition-all",
                                            reviewForm.status === 'Approved'
                                                ? "bg-green-500/20 border-green-500 text-green-400"
                                                : "border-border text-muted hover:border-white"
                                        )}
                                    >
                                        APPROVE
                                    </button>
                                    <button
                                        onClick={() => setReviewForm(prev => ({ ...prev, status: 'Rejected' }))}
                                        className={clsx(
                                            "p-3 border text-center transition-all",
                                            reviewForm.status === 'Rejected'
                                                ? "bg-red-500/20 border-red-500 text-red-400"
                                                : "border-border text-muted hover:border-white"
                                        )}
                                    >
                                        REJECT
                                    </button>
                                </div>
                            </div>

                            {reviewForm.status === 'Approved' && (
                                <div className="mb-6">
                                    <label className="block text-xs font-mono text-muted mb-1">
                                        ADJUSTED SCORE (Original: <span className="text-white">{selectedAppeal.Original_Score}</span>)
                                    </label>
                                    <input
                                        type="number" step="0.1" max="5"
                                        placeholder="Enter new score..."
                                        value={reviewForm.outcomeScore}
                                        onChange={e => setReviewForm(prev => ({ ...prev, outcomeScore: e.target.value }))}
                                        className="w-full bg-black/50 border border-white px-4 py-2 text-white font-mono focus:border-green-500 focus:outline-none"
                                        autoFocus
                                    />
                                    {reviewForm.outcomeScore && parseFloat(reviewForm.outcomeScore) === parseFloat(selectedAppeal.Original_Score) && (
                                        <div className="text-[10px] text-yellow-500 mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> Score is unchanged.
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-end gap-3">
                                <button onClick={() => setSelectedAppeal(null)} className="text-muted text-sm hover:text-white">CANCEL</button>
                                <button onClick={handleReviewSubmit} className="bg-white text-black px-4 py-2 font-bold hover:bg-gray-200 transition-colors">
                                    SUBMIT DECISION
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Appeals;
