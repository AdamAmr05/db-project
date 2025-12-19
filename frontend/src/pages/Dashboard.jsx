import React, { useEffect, useState } from 'react';
import { Users, Briefcase, GraduationCap, Activity, TrendingUp, Award, Building2 } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
    PieChart, Pie, Treemap
} from 'recharts';
import { dashboardService } from '../services/dashboardService';
import CyberCard from '../components/CyberCard';
import PerformanceCycleTracker from '../components/PerformanceCycleTracker';

// Dark Cyber Palette (matches Power BI dashboard)
const TREEMAP_PALETTE = [
    '#06b6d4', // cyan-500
    '#3b82f6', // blue-500
    '#8b5cf6', // violet-500
    '#14b8a6', // teal-500
    '#0891b2', // cyan-600
    '#2563eb', // blue-600
    '#7c3aed', // violet-600
    '#0d9488', // teal-600
];

const CustomTreemapContent = ({ x, y, width, height, index, name, value }) => {
    if (width < 40 || height < 25) return null;

    const color = TREEMAP_PALETTE[index % TREEMAP_PALETTE.length];
    const displayName = name?.length > 14 ? name.slice(0, 14) + '…' : name;

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={color}
                stroke="#000"
                strokeWidth={1}
            />
            <text
                x={x + width / 2}
                y={y + height / 2 - 6}
                textAnchor="middle"
                fill="#fff"
                fontSize={10}
                fontFamily="monospace"
                fontWeight="600"
                stroke="none"
                style={{ paintOrder: 'fill' }}
            >
                {displayName}
            </text>
            <text
                x={x + width / 2}
                y={y + height / 2 + 10}
                textAnchor="middle"
                fill="#000"
                fontSize={14}
                fontWeight="bold"
                fontFamily="monospace"
                stroke="none"
                style={{ paintOrder: 'fill' }}
            >
                {value}
            </text>
        </g>
    );
};

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [deptData, setDeptData] = useState([]);
    const [statusData, setStatusData] = useState([]);
    const [trainingData, setTrainingData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        try {
            const [statsRes, deptRes, statusRes, trainingRes] = await Promise.all([
                dashboardService.getStats(),
                dashboardService.getEmployeeCountByDept(),
                dashboardService.getStatusDistribution(),
                dashboardService.getTrainingCompletion()
            ]);
            setStats(statsRes.data.data);
            setDeptData(deptRes.data.data || []);
            setStatusData(statusRes.data.data || []);
            setTrainingData(trainingRes.data.data || []);
        } catch (error) {
            console.error('Failed to load dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-xs font-mono animate-pulse">INITIALIZING SYSTEM...</div>;
    if (!stats) return <div className="text-xs font-mono text-red-500">SYSTEM ERROR: DATA UNREACHABLE</div>;

    // Treemap data
    const treemapData = deptData.map(d => ({
        name: d.Department_Name,
        size: Number(d.EmployeeCount) || 0
    }));

    // Donut data with colors (Power BI style)
    const donutColors = {
        'Active': '#06b6d4',    // Cyan
        'Probation': '#8b5cf6', // Purple
        'Leave': '#ec4899',     // Pink
        'Retired': '#6b7280'    // Gray
    };
    const donutData = statusData.map(d => ({
        name: d.Employment_Status,
        value: Number(d.CountPerStatus) || 0,
        fill: donutColors[d.Employment_Status] || '#fff'
    }));

    // Training data for grouped bar
    const trainingChartData = trainingData.slice(0, 6).map(d => ({
        name: d.Title?.length > 15 ? d.Title.slice(0, 15) + '...' : d.Title,
        Assigned: Number(d.TotalAssigned) || 0,
        Completed: Number(d.CompletedCount) || 0
    }));

    return (
        <div className="space-y-6">
            {/* Hero Section - Key Metrics (3x2 Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CyberCard title="Total Employees" icon={Users} className="md:col-span-1">
                    <div className="text-4xl font-bold text-white mt-2">{stats.totalEmployees}</div>
                    <div className="text-xs text-green-500 mt-2 font-mono flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        ACTIVE WORKFORCE
                    </div>
                </CyberCard>

                <CyberCard title="Active Jobs" icon={Briefcase} className="md:col-span-1">
                    <div className="text-4xl font-bold text-white mt-2">{stats.activeJobs}</div>
                    <div className="text-xs text-muted mt-2 font-mono">OPEN POSITIONS</div>
                </CyberCard>

                <CyberCard title="Training Programs" icon={GraduationCap} className="md:col-span-1">
                    <div className="text-4xl font-bold text-white mt-2">{stats.totalTrainingPrograms}</div>
                    <div className="text-xs text-muted mt-2 font-mono">ACTIVE MODULES</div>
                </CyberCard>

                <CyberCard title="Appraisals" icon={Award} className="md:col-span-1">
                    <div className="text-4xl font-bold text-white mt-2">{stats.pendingAppraisals || 0}</div>
                    <div className="text-xs text-yellow-500 mt-2 font-mono">PENDING REVIEWS</div>
                </CyberCard>

                <CyberCard title="Departments" icon={Building2} className="md:col-span-1">
                    <div className="text-4xl font-bold text-white mt-2">{stats.totalDepartments || 0}</div>
                    <div className="text-xs text-muted mt-2 font-mono">OPERATIONAL UNITS</div>
                </CyberCard>

                <CyberCard title="Avg. Performance" icon={Activity} className="md:col-span-1">
                    <div className="text-4xl font-bold text-white mt-2">
                        {Number(stats.avgAppraisalScore || 0).toFixed(1)}/5
                    </div>
                    <div className="text-xs text-green-500 mt-2 font-mono flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        OVERALL SCORE
                    </div>
                </CyberCard>
            </div>

            {/* Charts Row 1: Treemap + Donut */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Treemap - Employee Distribution by Department */}
                <CyberCard title="Employee Distribution" className="lg:col-span-2 min-h-[350px]">
                    <div className="text-[10px] text-muted font-mono mb-4 uppercase">By Department</div>
                    {treemapData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <Treemap
                                data={treemapData}
                                dataKey="size"
                                aspectRatio={4 / 3}
                                stroke="#000"
                                content={<CustomTreemapContent />}
                            />
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-xs text-muted font-mono text-center py-20">NO DEPARTMENT DATA</div>
                    )}
                </CyberCard>

                {/* Donut Chart - Employment Status */}
                <CyberCard title="Status Distribution" className="min-h-[350px]">
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={donutData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                strokeWidth={0}
                            >
                                {donutData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Legend */}
                    <div className="flex flex-wrap justify-center gap-3 mt-2">
                        {donutData.map((item, i) => (
                            <div key={i} className="flex items-center gap-1">
                                <div className="w-2 h-2" style={{ backgroundColor: item.fill }} />
                                <span className="text-[10px] text-muted font-mono uppercase">{item.name} ({item.value})</span>
                            </div>
                        ))}
                    </div>
                </CyberCard>
            </div>

            {/* Charts Row 2: Training Completion + Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Grouped Bar - Training Completion */}
                <CyberCard title="Training Completion" className="lg:col-span-2 min-h-[350px]">
                    <div className="text-[10px] text-muted font-mono mb-4 uppercase">Assigned vs Completed</div>
                    {trainingChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={trainingChartData} layout="vertical">
                                <XAxis type="number" stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                                <YAxis type="category" dataKey="name" stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 10 }} width={100} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="Assigned" fill="#06b6d4" barSize={12} />
                                <Bar dataKey="Completed" fill="#3b82f6" barSize={12} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-xs text-muted font-mono text-center py-20">NO TRAINING DATA</div>
                    )}
                    {/* Legend */}
                    <div className="flex justify-center gap-6 mt-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-cyan-500" />
                            <span className="text-[10px] text-muted font-mono">ASSIGNED</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500" />
                            <span className="text-[10px] text-muted font-mono">COMPLETED</span>
                        </div>
                    </div>
                </CyberCard>

                {/* Side Panel */}
                <div className="space-y-6">
                    <CyberCard title="Performance Metrics">
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs font-mono text-muted mb-2">
                                    <span>AVG PERFORMANCE</span>
                                    <span>{Number(stats.avgAppraisalScore).toFixed(1)}/5.0</span>
                                </div>
                                <div className="h-2 bg-secondary/20 overflow-hidden">
                                    <div
                                        className="h-full bg-white transition-all duration-1000"
                                        style={{ width: `${(stats.avgAppraisalScore / 5) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-mono text-muted mb-2">
                                    <span>KPI COMPLETION</span>
                                    <span>{stats.kpiCompletionRate}%</span>
                                </div>
                                <div className="h-2 bg-secondary/20 overflow-hidden">
                                    <div
                                        className="h-full bg-white transition-all duration-1000"
                                        style={{ width: `${stats.kpiCompletionRate}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </CyberCard>

                    <CyberCard title="Upcoming Deadlines">
                        {stats.upcomingDeadline ? (
                            <div className="p-3 border border-border bg-secondary/5">
                                <div className="text-sm font-bold text-white">{stats.upcomingDeadline.Cycle_Name}</div>
                                <div className="text-xs text-muted font-mono mt-1">
                                    DUE: {new Date(stats.upcomingDeadline.Submission_Deadline).toLocaleDateString()}
                                </div>
                            </div>
                        ) : (
                            <div className="text-xs text-muted font-mono text-center py-4">NO PENDING DEADLINES</div>
                        )}
                    </CyberCard>

                    <CyberCard title="Recent Activity">
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-xs text-muted">
                                <div className="w-1.5 h-1.5 bg-green-500" />
                                <span>System Audit Complete</span>
                            </li>
                            <li className="flex items-center gap-2 text-xs text-muted">
                                <div className="w-1.5 h-1.5 bg-white" />
                                <span>New Employee Registered</span>
                            </li>
                        </ul>
                    </CyberCard>
                </div>
            </div>

            {/* Performance Cycle Tracker */}
            <PerformanceCycleTracker />
        </div>
    );
};

export default Dashboard;
