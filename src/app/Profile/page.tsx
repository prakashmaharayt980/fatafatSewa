'use client'

import { useState } from 'react';
import { User, Package, Bell, Settings, MapPin, Phone, Mail, Menu, X, ChevronRight, Ban, ShoppingBag, ShoppingBasket, LockKeyhole, Loader, Check } from 'lucide-react';
import { Divider } from '@mui/material';
import { AvatarFallback, Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function UserDashboard() {
    const [activeTab, setActiveTab] = useState('profile');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Sample user data
    const userData = {
        name: 'Alex Thompson',
        email: 'alex.thompson@email.com',
        phone: '+1 (555) 123-4567',
        joinDate: 'January 2024',
        address: '123 Main Street, Apt 4B, New York, NY 10001'
    };

    // Sample orders data
    const orders = [
        {
            id: 'ORD-2024-001',
            date: 'Oct 5, 2024',
            status: 'Delivered',
            total: 299.99,
            items: 3
        },
        {
            id: 'ORD-2024-002',
            date: 'Oct 8, 2024',
            status: 'In Transit',
            total: 149.50,
            items: 2
        },
        {
            id: 'ORD-2024-003',
            date: 'Oct 10, 2024',
            status: 'Processing',
            total: 89.99,
            items: 1
        }
    ];

    // Sample notifications
    const notifications = [
        {
            id: 1,
            title: 'Order Delivered',
            message: 'Your order #ORD-2024-001 has been delivered successfully',
            time: '2 hours ago',
            read: false
        },
        {
            id: 2,
            title: 'Special Offer',
            message: '30% off on all electronics. Limited time offer!',
            time: '5 hours ago',
            read: false
        },
        {
            id: 3,
            title: 'Order Shipped',
            message: 'Your order #ORD-2024-002 is on its way',
            time: '1 day ago',
            read: true
        },
        {
            id: 4,
            title: 'Password Changed',
            message: 'Your password was successfully updated',
            time: '3 days ago',
            read: true
        }
    ];

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'orders', label: 'Orders HIstory', icon: ShoppingBasket },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'returnAndCancel', label: 'Return & Cancel', icon: Ban },
        { id: 'changepassword', label: 'Chnage Password', icon: LockKeyhole }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered':
                return 'text-green-600 bg-green-50';
            case 'In Transit':
                return 'text-blue-600 bg-blue-50';
            case 'Processing':
                return 'text-amber-600 bg-amber-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    const renderProfile = () => (
        <div className="space-y-4 min-h-[500px]">
            {/* Profile Header */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-row justify-between">
                <div className="flex items-center space-x-4">

                    <Avatar className='bg-gray-700 text-white text-xl w-14 h-14' >
                        <AvatarFallback >       {userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>

                    </Avatar>
                    <div>
                        <h2 className="text-xl font-semibold text-[var(--colour-fsP2)]">{userData.name}</h2>
                        <p className="text-gray-500 text-sm mt-0.5">Member since {userData.joinDate}</p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 text-sm cursor-pointer hover:text-[var(--colour-fsP2)]">
                    <Settings className="w-4 h-4 " />
                    <span>Edit Profile</span>
                </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white border rounded-xl border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-[var(--colour-fsP2)] mb-2">Contact Information</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Mail className="w-5 h-5 text-[var(--colour-fsP1)] " />
                        <div>
                            <p className="text-xs text-gray-500 uppercase">Email</p>
                            <p className="text-gray-900 text-sm">{userData.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Phone className="w-5 h-5 text-[var(--colour-fsP1)] " />
                        <div>
                            <p className="text-xs text-gray-500 uppercase">Phone</p>
                            <p className="text-gray-900 text-sm">{userData.phone}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <MapPin className="w-5 h-5 text-[var(--colour-fsP1)]  mt-1" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase">Address</p>
                            <p className="text-gray-900 text-sm">{userData.address}</p>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );

    const renderOrders = () => (
        <div className="space-y-4">
            <div className="bg-white border border-gray-200 p-4 rounded-xl flex flex-row justify-between">
                <div  >
                    <div className='flex flex-row items-center gap-2'>
                        <ShoppingBasket className="w-5 h-5" />
                        <h2 className="text-xl font-semibold text-[var(--colour-fsP2)]">Order History</h2>
                    </div>
                    <p className="text-sm text-gray-500 ml-1">{orders.length} total orders</p>
                </div>

                <div className='flex felx-row items-center gap-1.5'>
                    <button className=' rounded-xl flex flex-row h-7 gap-2 items-center bg-gray-300  text-white px-4 text-sm ' >
                        <Loader className="w-5 h-5" />
                        <span>  Pending</span></button>
                    <button className=' rounded-xl flex flex-row h-7 gap-2 items-center bg-green-500  text-white px-4 text-sm ' >
                        <Check className="w-5 h-5" />
                        <span>  Completed</span></button>
                    <button className=' rounded-xl flex flex-row h-7 gap-2 items-center bg-red-500  text-white px-4 text-sm ' >
                        <Ban className="w-5 h-5" />
                        <span>  Canceled</span></button>

                </div>
            </div>

            {orders.map((order) => (
                <div key={order.id} className="bg-white border border-gray-200 p-6 hover:border-gray-300 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <div>
                            <h3 className="font-semibold text-gray-900">{order.id}</h3>
                            <p className="text-sm text-gray-500 mt-1">{order.date}</p>
                        </div>
                        <span className={`mt-2 sm:mt-0 px-3 py-1 text-sm font-medium w-fit ${getStatusColor(order.status)}`}>
                            {order.status}
                        </span>
                    </div>

                    <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                        <span className="text-gray-600 text-sm">{order.items} items</span>
                        <span className="text-lg font-semibold text-gray-900">${order.total.toFixed(2)}</span>
                    </div>

                    <div className="mt-4 flex gap-3">
                        <button className="flex-1 px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm font-medium">
                            View Details
                        </button>
                        <button className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium">
                            Track Order
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderNotifications = () => (
        <div className="space-y-4">
            <div className="bg-white border border-gray-200 p-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                    <p className="text-sm text-gray-500 mt-1">{notifications.filter(n => !n.read).length} unread</p>
                </div>
                <button className="text-sm text-gray-600 hover:text-gray-900">
                    Mark all read
                </button>
            </div>

            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`bg-white border p-6 hover:border-gray-300 transition-colors ${notification.read ? 'border-gray-200' : 'border-gray-900'
                        }`}
                >
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                                {!notification.read && (
                                    <span className="w-2 h-2 bg-gray-900 rounded-full"></span>
                                )}
                            </div>
                            <p className="text-gray-600 mt-2 text-sm">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

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
                    <main className="flex-1 ">
                        <div className='border-l-2 border-[var(--colour-fsP2)] p-2'>
                            {activeTab === 'profile' && renderProfile()}
                            {activeTab === 'orders' && renderOrders()}
                            {activeTab === 'notifications' && renderNotifications()}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}