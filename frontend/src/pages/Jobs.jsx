import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Plus, Search, Edit, Trash2, MapPin } from 'lucide-react';
import { jobService } from '../services/jobService';
import CyberCard from '../components/CyberCard';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            const response = await jobService.getAll();
            setJobs(response.data.data);
        } catch (error) {
            console.error('Error loading jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await jobService.delete(id);
                loadJobs();
            } catch (error) {
                alert(error.response?.data?.error || 'Failed to delete job');
            }
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.Job_Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.Job_Code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">JOB POSITIONS</h1>
                    <p className="text-muted font-mono text-sm mt-1">MANAGE ROLES AND RESPONSIBILITIES</p>
                </div>
                <Link
                    to="/jobs/new"
                    className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded font-bold hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    ADD JOB
                </Link>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                    type="text"
                    placeholder="SEARCH JOBS..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-surface border border-border rounded pl-10 pr-4 py-2 text-white focus:outline-none focus:border-primary font-mono text-sm"
                />
            </div>

            {loading ? (
                <div className="text-center text-muted font-mono py-12">LOADING JOBS...</div>
            ) : (
                <CyberCard>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-xs font-mono text-muted uppercase">
                                    <th className="p-4">Job Title</th>
                                    <th className="p-4">Code</th>
                                    <th className="p-4">Department</th>
                                    <th className="p-4">Level</th>
                                    <th className="p-4">Salary Range</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredJobs.map((job) => (
                                    <tr key={job.Job_ID} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-white">{job.Job_Title}</div>
                                            <div className="text-xs text-muted">{job.Job_Category}</div>
                                        </td>
                                        <td className="p-4 font-mono text-sm text-primary">{job.Job_Code}</td>
                                        <td className="p-4 text-sm text-white">{job.Department_Name || 'N/A'}</td>
                                        <td className="p-4">
                                            <span className="inline-block px-2 py-0.5 bg-secondary/20 rounded text-[10px] font-mono text-secondary">
                                                {job.Job_Level}
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono text-sm text-muted">
                                            ${job.Min_Salary?.toLocaleString()} - ${job.Max_Salary?.toLocaleString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/jobs/${job.Job_ID}`)}
                                                    className="p-1.5 hover:bg-white/10 rounded text-muted hover:text-white transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(job.Job_ID)}
                                                    className="p-1.5 hover:bg-red-500/20 rounded text-muted hover:text-red-500 transition-colors"
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
            )}
        </div>
    );
};

export default Jobs;
