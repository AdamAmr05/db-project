import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, GraduationCap, Building2, Briefcase, Clock, Activity, Award, Gavel, BarChart3 } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
    const location = useLocation();
    const path = location.pathname;

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
        { icon: Users, label: 'Employees', to: '/employees' },
        { icon: Building2, label: 'Departments', to: '/departments' },
        { icon: BookOpen, label: 'Faculties', to: '/faculties' },
        { icon: Briefcase, label: 'Jobs', to: '/jobs' },
        { icon: GraduationCap, label: 'Training', to: '/training' },
        { group: 'Performance', icon: Clock, label: 'H.R. Cycles', to: '/performance/cycles' },
        { group: 'Performance', icon: Award, label: 'Appraisals', to: '/performance/appraisals' },
        { group: 'Performance', icon: Gavel, label: 'Appeals', to: '/appeals' },
        // { icon: BarChart3, label: 'Analytics', to: '/analytics/powerbi' },
    ];

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

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            clsx(
                                'flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 border border-transparent',
                                isActive
                                    ? 'bg-surface border-primary text-primary shadow-[0_0_10px_rgba(128,128,128,0.1)]'
                                    : 'text-muted hover:text-accent hover:bg-surfaceHighlight hover:border-border'
                            )
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </NavLink>
                ))}
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

