import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

interface TopNavProps {
    title?: string;
    subtitle?: string;
    showProfile?: boolean;
    backLink?: string;
    customRightContent?: React.ReactNode;
}

const TopNav: React.FC<TopNavProps> = ({ title = "DataSense AI", showProfile = true, backLink, customRightContent }) => {
    const { user, logout } = useAuth();

    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-border-dark bg-surface-light dark:bg-background-dark px-6 py-4 lg:px-10 sticky top-0 z-50">
            <div className="flex items-center gap-3">
                {backLink ? (
                    <Link to={backLink} className="flex items-center justify-center size-8 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                ) : (
                    <Link to="/" className="flex items-center gap-3 no-underline text-inherit group">
                        <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                            <span className="material-symbols-outlined">analytics</span>
                        </div>
                        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-slate-900 dark:text-white">{title}</h2>
                    </Link>
                )}
            </div>

            <div className="flex flex-1 justify-end gap-6 items-center">
                {customRightContent ? customRightContent : (
                    <>
                        {showProfile && (
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-black text-slate-900 dark:text-white leading-none">{user?.name || user?.email}</p>
                                    <button
                                        onClick={logout}
                                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/70 transition-colors mt-1"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </div>
                                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 shadow-sm">
                                    {user?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </header>
    );
};

export default TopNav;