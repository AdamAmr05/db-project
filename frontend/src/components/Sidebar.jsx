import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    GraduationCap,
    Building2,
    Briefcase,
    Clock,
    Activity,
    Award,
    Gavel,
    BarChart3,
    ChevronDown
} from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
    const location = useLocation();
    const path = location.pathname;

    // Expanded state for Performance section
    const [performanceExpanded, setPerformanceExpanded] = useState(
        path.startsWith('/performance') || path === '/appeals'
    );

    // Check if any performance route is active
    const isPerformanceActive = path.startsWith('/performance') || path === '/appeals';

    const mainNavItems = [
        { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
        { icon: Users, label: 'Employees', to: '/employees' },
        { icon: Building2, label: 'Departments', to: '/departments' },
        { icon: BookOpen, label: 'Faculties', to: '/faculties' },
        { icon: Briefcase, label: 'Jobs', to: '/jobs' },
        { icon: GraduationCap, label: 'Training', to: '/training' },
    ];

    const performanceNavItems = [
        { icon: Activity, label: 'Overview', to: '/performance' },
        { icon: Clock, label: 'Cycles', to: '/performance/cycles' },
        { icon: Award, label: 'Appraisals', to: '/performance/appraisals' },
        { icon: Gavel, label: 'Appeals', to: '/appeals' },
    ];

    const NavItem = ({ item, indent = false }) => (
        <NavLink
            to={item.to}
            className={({ isActive }) =>
                clsx(
                    'flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 border border-transparent',
                    indent && 'pl-10',
                    isActive
                        ? 'bg-surface border-primary text-primary shadow-[0_0_10px_rgba(128,128,128,0.1)]'
                        : 'text-muted hover:text-accent hover:bg-surfaceHighlight hover:border-border'
                )
            }
        >
            <item.icon className="w-4 h-4" />
            {item.label}
        </NavLink>
    );

    return (
        <aside className="w-64 bg-background border-r border-border flex flex-col h-screen fixed left-0 top-0 z-50">
            <div className="p-6 border-b border-border flex items-center gap-3">
                <div>
                    <div>
                        <h1 className="text-lg font-bold tracking-wider text-primary">HR <span className="text-muted">PORTAL</span></h1>
                        <p className="text-[10px] text-muted uppercase tracking-widest">Management System</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {/* Main Nav Items */}
                {mainNavItems.map((item) => (
                    <NavItem key={item.to} item={item} />
                ))}

                {/* Performance Section Header */}
                <div className="pt-4">
                    <button
                        onClick={() => setPerformanceExpanded(!performanceExpanded)}
                        className={clsx(
                            'w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-all duration-200 border border-transparent',
                            isPerformanceActive
                                ? 'text-primary'
                                : 'text-muted hover:text-accent hover:bg-surfaceHighlight hover:border-border'
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <Activity className="w-4 h-4" />
                            <span>Performance</span>
                        </div>
                        <ChevronDown
                            className={clsx(
                                'w-4 h-4 transition-transform duration-200',
                                performanceExpanded && 'rotate-180'
                            )}
                        />
                    </button>

                    {/* Collapsible Performance Items */}
                    <div className={clsx(
                        'overflow-hidden transition-all duration-200',
                        performanceExpanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                    )}>
                        <div className="ml-2 border-l border-border/50 mt-1 space-y-0.5">
                            {performanceNavItems.map((item) => (
                                <NavItem key={item.to} item={item} indent />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Analytics */}
                <div className="pt-2">
                    <NavItem item={{ icon: BarChart3, label: 'Analytics', to: '/analytics/powerbi' }} />
                </div>
            </nav>

            <div className="p-4 border-t border-border">
                <div className="bg-surface border border-border p-4 relative overflow-hidden group">
                    <div className="absolute inset-0 dither-bg opacity-20 pointer-events-none" />
                    <p className="text-xs text-muted relative z-10">System Status</p>
                    <div className="flex items-center gap-2 mt-2 relative z-10">
                        <div className="w-2 h-2 bg-green-500 animate-pulse" />
                        <span className="text-xs text-primary font-mono">ONLINE</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
