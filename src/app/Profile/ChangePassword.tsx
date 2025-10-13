import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Send, ThumbsUp, Trash } from 'lucide-react'
import React, { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

function ChangePassword() {
    const initialFormValues = {
        current_password: '',
        new_password1: '',
        new_password2: '',
    };

    const [formValues, setFormValues] = useState({
        ...initialFormValues,
        conformDailog: false
    });

    const [showPasswords, setShowPasswords] = useState({
        current_password: false,
        new_password1: false,
        new_password2: false
    });

    const [errors, setErrors] = useState({
        current_password: '',
        new_password1: '',
        new_password2: '',
        general:''
    });

    const inputFields = [
        { name: 'current_password', label: 'Current Password', id: 1, errormsg: 'Current password must be entered' },
        { name: 'new_password1', label: 'New Password', id: 2, errormsg: 'New password must be entered' },
        { name: 'new_password2', label: 'Confirm New Password', id: 3, errormsg: 'Passwords must match' },
    ];

    const handleTogglePassword = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {
            current_password: '',
            new_password1: '',
            new_password2: '',
            general:''
        };
        if (!formValues.current_password) {
            newErrors.current_password = 'Current password must be entered';
        }
        if (!formValues.new_password1) {
            newErrors.new_password1 = 'New password must be entered';
        }
        if (formValues.new_password1 !== formValues.new_password2) {
            newErrors.new_password2 = 'Passwords must match';
        }
        setErrors(newErrors);
        return Object.values(newErrors).every(error => error === '');
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                console.log('Password changed successfully:', {
                    current_password: formValues.current_password,
                    new_password: formValues.new_password1
                });
                setFormValues({
                    ...initialFormValues,
                    conformDailog: false
                });
            } catch (error) {
                console.error('Error changing password:', error);
                setErrors(prev => ({
                    ...prev,
                    general: 'Failed to change password. Please try again.'
                }));
            }
        }
    };

    return (
        <div className="">
            <div className="bg-white max-w-md w-full px-3 ">
                <h2 className="text-2xl font-bold text-[var(--colour-fsP1)] mb-6 text-center">Change Your Password</h2>
                <form className="space-y-4">
                    {inputFields.map((field) => (
                        <div key={field.id} className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                {field.label}
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords[field.name] ? 'text' : 'password'}
                                    name={field.name}
                                    value={formValues[field.name]}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                                    placeholder={`Enter ${field.label.toLowerCase()}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleTogglePassword(field.name)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-violet-600"
                                >
                                    {showPasswords[field.name] ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {errors[field.name] && (
                                <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>
                            )}
                        </div>
                    ))}
                    {errors.general && (
                        <p className="text-xs text-red-500 text-center">{errors.general}</p>
                    )}
                    <div className="w-full flex justify-end">
                        <div className="flex items-center gap-1 flex-row w-fit rounded-2xl px-4 py-2 cursor-pointer bg-[var(--colour-fsP2)] hover:bg-[var(--colour-fsP1)] text-white">
                            <Send className="w-4 h-4" />
                            <button
                                type="button"
                                onClick={() => setFormValues(prev => ({
                                    ...prev,
                                    conformDailog: true
                                }))}
                                className="m-0 p-0 bg-transparent hover:bg-transparent text-white hover:text-white"
                            >
                                Update Password
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <AlertDialog open={formValues.conformDailog} onOpenChange={() => setFormValues(prev => ({
                ...prev,
                conformDailog: false
            }))}>
                <AlertDialogContent className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-[var(--colour-fsP2)]">Are you sure you want to change your password?</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm px-3">
                            This action will update your password. Make sure your new password is secure.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer bg-red-600 text-white rounded-3xl flex items-center gap-2 px-4 py-2">
                            <Trash className="w-4 h-4" />
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleSubmit}
                            className="cursor-pointer bg-[var(--colour-fsP2)] rounded-3xl hover:bg-[var(--colour-fsP1)] text-white flex items-center gap-2 px-4 py-2"
                        >
                            <ThumbsUp className="w-4 h-4" />
                            Sure
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default ChangePassword