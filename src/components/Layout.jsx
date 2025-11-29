import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Layout = () => {
    const location = useLocation();
    const { t } = useTranslation();

    const navItems = [
        { path: '/', label: t('dashboard'), icon: LayoutDashboard },
        { path: '/employees', label: t('employees'), icon: Users },
        { path: '/attendance', label: t('attendance'), icon: Calendar },
        { path: '/payments', label: t('payments'), icon: DollarSign },
    ];

    return (
        <div className="min-h-screen bg-gray-50 bg-dot-pattern flex font-sans text-gray-900">
            {/* Sidebar */}
            <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-sm hidden md:flex flex-col z-20 sticky top-0 h-screen">
                <div className="p-8 border-b border-gray-100">
                    <div className="flex items-center gap-3 text-blue-600">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <LayoutDashboard className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Mason<span className="text-gray-900">Manager</span></h1>
                    </div>
                </div>
                <div className="px-4 pt-4">
                    <LanguageSwitcher />
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 mr-3 transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-xs text-blue-600 font-medium uppercase tracking-wider mb-1">Current Session</p>
                        <p className="text-sm text-gray-700 font-semibold">Admin User</p>
                    </div>
                </div>
            </aside>

            {/* Mobile Header & Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm md:hidden p-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-600 rounded-md">
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-lg font-bold text-gray-900">Mason Manager</h1>
                    </div>
                    <LanguageSwitcher />
                </header>

                <main className="flex-1 p-6 md:p-10 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 w-full bg-white/90 backdrop-blur-lg border-t border-gray-200 flex justify-around py-3 pb-safe z-30">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <Icon className={`w-6 h-6 ${isActive ? 'fill-current opacity-20' : ''}`} />
                            <Icon className="w-6 h-6 absolute" />
                            <span className="text-[10px] font-medium mt-1">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default Layout;
