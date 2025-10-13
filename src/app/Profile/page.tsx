'use client'

import { useState } from 'react';
import { User, Bell, Settings, MapPin, Phone, Mail, Ban, ShoppingBasket, LockKeyhole, Loader, Check, PackageCheck, Undo, Trash, ThumbsUp, CreditCard } from 'lucide-react';

import { AvatarFallback, Avatar } from '@/components/ui/avatar';
import OrderHistory from './OrderHistory';
import Profile from './Profile';
import Notifications from './Notifications';
import ReturnCancel from './ReturnCancel';
import ChangePassword from './ChangePassword';



export default function UserDashboard() {
    const [activeTab, setActiveTab] = useState('profile');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'orders', label: 'Orders HIstory', icon: ShoppingBasket },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'returnAndCancel', label: 'Return & Cancel', icon: Ban },
        { id: 'changepassword', label: 'Change Password', icon: LockKeyhole }
    ];







 



    return (
        <div className="min-h-screen bg-gray-50">


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white/80 backdrop-blur-xs rounded-2xl shadow-xl">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Sidebar - Desktop */}
                    <aside className="hidden md:block w-64">
                        <nav className="bg-white  border-gray-200 p-4 space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center space-x-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id
                                            ? 'bg-gray-500 text-white '
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Mobile menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden bg-white border border-gray-200 mb-4">
                            <nav className="p-4 space-y-1">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => {
                                                setActiveTab(tab.id);
                                                setMobileMenuOpen(false);
                                            }}
                                            className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id
                                                ? 'bg-gray-900 text-white'
                                                : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span>{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    )}


                    {/* Main Content */}
                    <main className="flex-1 sm:min-h-[500px]">
                        <div className='border-l-2 border-[var(--colour-fsP2)] p-2'>
                            {activeTab === 'profile' && <Profile/>}
                            {activeTab === 'orders' && <OrderHistory/>}
                            {activeTab === 'notifications' && <Notifications/>}
                            {activeTab === 'returnAndCancel' && <ReturnCancel/>}
                            {activeTab === 'changepassword' && <ChangePassword/>}
                        </div>
                    </main>

            
                </div>
            </div>
        </div>
    );
}