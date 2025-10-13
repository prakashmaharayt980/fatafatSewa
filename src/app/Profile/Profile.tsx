import React, { useState } from 'react'
import { AvatarFallback, Avatar } from '@/components/ui/avatar';
import { Mail, MapPin, Phone, Settings, User, Save } from 'lucide-react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';

function Profile() {
    const initialUserData = {
        name: 'Alex Thompson',
        email: 'alex.thompson@email.com',
        phone: '+1 (555) 123-4567',
        joinDate: 'January 2024',
        address: '123 Main Street, Apt 4B, New York, NY 10001',
    };

    const [userDataState, setUserDataState] = useState({
        dialogopen: false,
        name: initialUserData.name,
        email: initialUserData.email,
        phone: initialUserData.phone,
        joinDate: initialUserData.joinDate,
        address: initialUserData.address
    });

    const [formData, setFormData] = useState({
        name: initialUserData.name,
        phone: initialUserData.phone,
        address: initialUserData.address
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleOpenDialog = () => {
        setFormData({
            name: userDataState.name,
            phone: userDataState.phone,
            address: userDataState.address
        });
        setUserDataState(prev => ({
            ...prev,
            dialogopen: true
        }));
    };

    const handleCloseDialog = () => {
        setFormData({
            name: userDataState.name,
            phone: userDataState.phone,
            address: userDataState.address
        });
        setUserDataState(prev => ({
            ...prev,
            dialogopen: false
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            // In a real app, you would make an API call here to save the data
            console.log('Saving user data:', {
                name: formData.name,
                phone: formData.phone,
                address: formData.address
            });
            // Update userDataState only on successful save
            setUserDataState(prev => ({
                ...prev,
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
                dialogopen: false
            }));
        } catch (error) {
            console.error('Error saving user data:', error);
            // Form data remains unchanged, no update to userDataState
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <div className="space-y-4 ">
                {/* Profile Header */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-row justify-between">
                    <div className="flex items-center space-x-4">
                        <Avatar className='bg-gray-700 text-white text-xl w-14 h-14' >
                            <AvatarFallback>{userDataState.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-xl font-semibold text-[var(--colour-fsP2)]">{userDataState.name}</h2>
                            <p className="text-gray-500 text-sm mt-0.5">Member since {userDataState.joinDate}</p>
                        </div>
                    </div>

                    <div 
                        className="flex items-center gap-1.5 text-sm cursor-pointer hover:text-[var(--colour-fsP2)]"
                        onClick={handleOpenDialog}
                    >
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
                                <p className="text-gray-900 text-sm">{userDataState.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Phone className="w-5 h-5 text-[var(--colour-fsP1)] " />
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Phone</p>
                                <p className="text-gray-900 text-sm">{userDataState.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <MapPin className="w-5 h-5 text-[var(--colour-fsP1)] mt-1" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase">Address</p>
                                <p className="text-gray-900 text-sm">{userDataState.address}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={userDataState.dialogopen} onOpenChange={handleCloseDialog}>
                <DialogContent className='border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm'>
                    <DialogHeader>
                        <DialogTitle className='text-[var(--colour-fsP2)] text-center'>Update Your Profile Details</DialogTitle>
                    </DialogHeader>
                    <div className="relative bg-white ">
                        <div className="p-4 space-y-4">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <User className="w-4 h-4 text-[var(--colour-fsP2)]" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        name: e.target.value
                                    }))}
                                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-[var(--colour-fsP2)] focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                                />
                            </div>

                            {/* Email Field (Disabled) */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-[var(--colour-fsP2)]" />
                                    Email Address
                                    <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">Not Changeable</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={userDataState.email}
                                    disabled
                                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                                />
                            </div>

                            {/* Phone Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-[var(--colour-fsP2)]" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        phone: e.target.value
                                    }))}
                                    maxLength={10}
                                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-[var(--colour-fsP2)] focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                                />
                            </div>

                            {/* Location Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-[var(--colour-fsP2)]" />
                                    Address
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        address: e.target.value
                                    }))}
                                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-[var(--colour-fsP2)] focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose className='cursor-pointer bg-red-600 text-white rounded-3xl' asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                          className='flex flex-row gap-1 items-center cursor-pointer bg-[var(--colour-fsP2)] rounded-3xl  px-4 hover:bg-[var(--colour-fsP1)] text-white'
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Profile