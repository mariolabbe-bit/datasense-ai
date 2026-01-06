import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_USER } from '../types';

interface TopNavProps {
    title?: string;
    subtitle?: string;
    showProfile?: boolean;
    backLink?: string;
    customRightContent?: React.ReactNode;
}

const TopNav: React.FC<TopNavProps> = ({ title = "DataSense AI", showProfile = true, backLink, customRightContent }) => {
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
                        <div className="flex gap-2">
                            <Link to="/mobile-preview" title="Mobile View" className="flex size-10 cursor-pointer items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
                                <span className="material-symbols-outlined">smartphone</span>
                            </Link>
                            <button className="flex size-10 cursor-pointer items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
                                <span className="material-symbols-outlined">notifications</span>
                            </button>
                        </div>
                        {showProfile && (
                            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold leading-none text-slate-900 dark:text-white">{MOCK_USER.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-none mt-1">{MOCK_USER.role}</p>
                                </div>
                                <div 
                                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-slate-200 dark:ring-slate-700" 
                                    style={{backgroundImage: `url("${MOCK_USER.avatarUrl}")`}}
                                ></div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </header>
    );
};

export default TopNav;