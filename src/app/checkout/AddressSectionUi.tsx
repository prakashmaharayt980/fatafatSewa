"use client";

import { useState } from 'react';
import { MapPin, X, Loader2, AlertCircle, Edit2, Plus, Navigation, Map, Building, Tag } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';

interface Address {
    id: number;
    label: string;
    street: string;
    city: string;
    state: string;
    landmark: string;
}

export default function AddressSelectionUI() {
    const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(savedAddresses[0]);
    const [dialogState, setDialogState] = useState<'closed' | 'addressList' | 'addEditAddress' | 'labelSelection'>('closed');
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [newAddress, setNewAddress] = useState({
        street: '',
        city: '',
        state: '',
        landmark: '',
    });
    const [addressLabel, setAddressLabel] = useState('');

    const isAddressComplete = newAddress.street && newAddress.city && newAddress.state && newAddress.landmark;

    const handleAddressSelect = (address: Address) => {
        setSelectedAddress(address);
        setDialogState('closed');
    };

    const openDialog = (state: 'addressList' | 'addEditAddress' | 'labelSelection') => {
        setDialogState(state);
        setLocationError('');
        if (state === 'addEditAddress') {
            setNewAddress({ street: '', city: '', state: '', landmark: '' });
        }
    };

    const closeDialog = () => {
        setDialogState('closed');
        setLocationError('');
    };

    const getCurrentLocation = () => {
        setIsLoadingLocation(true);
        setLocationError('');

        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by this browser.');
            setIsLoadingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setTimeout(() => {
                    setNewAddress({
                        street: '789 Current Location St',
                        city: 'New York',
                        state: 'NY',
                        landmark: '10003',
                    });
                    setIsLoadingLocation(false);
                    setDialogState('addEditAddress');
                }, 2000);
            },
            (error) => {
                setLocationError('Unable to retrieve your location. Please try manual entry.');
                setIsLoadingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
        );
    };

    const handleSaveWithLabel = () => {
        const newId = Math.max(...savedAddresses.map((a) => a.id), 0) + 1;
        const savedAddress: Address = {
            id: newId,
            label: addressLabel || 'Address',
            ...newAddress,
        };

        setSavedAddresses([...savedAddresses, savedAddress]);
        setSelectedAddress(savedAddress);
        setDialogState('closed');
        setAddressLabel('');
        setNewAddress({ street: '', city: '', state: '', landmark: '' });
    };

    const renderDialogContent = (overrideState?: string) => {
        const state = overrideState || dialogState;
        switch (state) {
            case 'addressList':
                return (
                    <div className="flex flex-col justify-between min-h-[50vh] h-full">
                        {savedAddresses.length > 0 && (
                            <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select an Address</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-1">
                                    {savedAddresses.map((address) => (
                                        <button
                                            key={address.id}
                                            onClick={() => handleAddressSelect(address)}
                                            className={`p-2 rounded-lg border text-left transition-all duration-200 ${selectedAddress?.id === address.id
                                                ? 'border-blue-500 bg-blue-50 shadow-sm'
                                                : 'border-gray-200 hover:border-blue-300 hover:shadow-sm hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <div className={`p-1 rounded-full ${selectedAddress?.id === address.id ? 'bg-yellow-100 border border-yellow-300' : 'bg-gray-100'
                                                        }`}>
                                                        <MapPin className={`w-3 h-3 ${selectedAddress?.id === address.id ? 'text-blue-600' : 'text-gray-500'
                                                            }`} />
                                                    </div>
                                                    <div className={`font-semibold text-xs ${selectedAddress?.id === address.id ? 'text-blue-700' : 'text-gray-900'
                                                        }`}>
                                                        {address.label}
                                                    </div>
                                                    {selectedAddress?.id === address.id && (
                                                        <div className="w-1 h-1 bg-blue-600 rounded-full ml-auto"></div>
                                                    )}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <div className="text-xs text-gray-700 font-medium line-clamp-1">
                                                        {address.street}
                                                    </div>
                                                    <div className="text-xs text-gray-500 line-clamp-1">
                                                        {address.city}, {address.state}
                                                    </div>
                                                    {address.landmark && (
                                                        <div className="text-xs text-gray-400 line-clamp-1">
                                                            {address.landmark}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2 border-t border-gray-100 pt-2 mt-2">
                            <button
                                onClick={() => openDialog('addEditAddress')}
                                className="flex-1 p-2 rounded-lg border border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-1 group text-sm"
                            >
                                <div className="p-0.5 rounded-full bg-gray-100 group-hover:bg-blue-100 transition-colors">
                                    <Plus className="w-3 h-3 text-gray-600 group-hover:text-blue-600" />
                                </div>
                                <span className="text-xs text-gray-700 font-medium group-hover:text-blue-700">
                                    Add New
                                </span>
                            </button>
                            <button
                                onClick={getCurrentLocation}
                                disabled={isLoadingLocation}
                                className="flex-1 flex items-center justify-center gap-1 p-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                            >
                                <div className="p-0.5 rounded-full bg-blue-700">
                                    {isLoadingLocation ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                        <MapPin className="w-3 h-3" />
                                    )}
                                </div>
                                <span className="text-xs">
                                    {isLoadingLocation ? 'Getting...' : 'My Location'}
                                </span>
                            </button>
                        </div>
                    </div>
                );

            case 'addEditAddress':
                return (
                    <div className="p-4 bg-white">
                        <div className="space-y-2">
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Street Address"
                                    value={newAddress.street}
                                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all placeholder-gray-400 text-sm"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                        <Building className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="City"
                                        value={newAddress.city}
                                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all placeholder-gray-400 text-sm"
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                        <Map className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="State"
                                        value={newAddress.state}
                                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all placeholder-gray-400 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                    <Navigation className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Landmark (Optional)"
                                    value={newAddress.landmark}
                                    onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all placeholder-gray-400 text-sm"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                    <Tag className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter custom label"
                                    value={addressLabel}
                                    onChange={(e) => setAddressLabel(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all placeholder-gray-400 text-sm"
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={handleSaveWithLabel}
                                    disabled={!isAddressComplete}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                                >
                                    Save Address
                                </button>
                                <button
                                    onClick={() => setDialogState('addressList')}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all text-sm"
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className={`relative rounded-xl shadow-sm border ${!selectedAddress ? 'border-dashed':'' } border-gray-200 p-2`}>
            {selectedAddress && (
                <div className="px-1 flex flex-col sm:flex-row justify-between items-start  hover:bg-gray-50 transition-all">
                    <div className="flex flex-col w-full">
                        <div className="bg-[var(--colour-fsP2)] text-white text-xs px-2 py-0.5 rounded-full w-fit mb-2 ">
                            {selectedAddress.label}
                        </div>
                        <div className="flex items-start gap-2 mb-1">
                            <div className="p-1 rounded-full bg-blue-100 mt-1">
                                <MapPin className="w-4 h-4 text-blue-700" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-gray-800 mb-0.5">{selectedAddress.street}</div>
                                <div className="text-xs text-gray-600">
                                    {selectedAddress.city}, {selectedAddress.state}
                                </div>
                                {selectedAddress.landmark && (
                                    <div className="text-xs text-gray-500">{selectedAddress.landmark}</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => openDialog('addressList')}
                        className="flex items-center font-semibold cursor-pointer gap-1 text-[var(--colour-fsP2)] hover:text-[var(--colour-fsP1)] transition-colors text-sm mt-1 sm:mt-0"
                    >
                        <Edit2 className="w-3 h-3" />
                        Edit
                    </button>
                </div>
            )}

            {!selectedAddress && (
                <button
                    onClick={() => openDialog('addressList')}
                    className="w-full p-3  hover:bg-blue-50 transition-all flex items-center justify-center gap-2 mt-2 text-sm"
                >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700 font-medium">Add Address</span>
                </button>
            )}

            <Drawer open={dialogState !== 'closed'} onOpenChange={(open) => !open && closeDialog()}>
                <DrawerContent className="max-h-[40vh] max-w-5xl mx-auto border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm p-4">
                    <DrawerHeader className=" py-1 flex flex-row  justify-between items-center">
                        <DrawerTitle className="text-base font-semibold">
                            {dialogState === 'addressList' ? 'Manage Addresses' : dialogState === 'addEditAddress' ? 'Add Address' : 'Label Address'}
                        </DrawerTitle>
                        <DrawerClose className=" hover:bg-gray-100 rounded-full">
                            <X className="w-4 h-4 text-gray-500" />
                        </DrawerClose>
                    </DrawerHeader>
                    <div className="overflow-y-auto px-2">
                        {renderDialogContent()}
                        {locationError && (
                            <div className="flex items-center gap-1 mt-2 p-2 bg-red-50 rounded-lg text-xs text-red-600">
                                <AlertCircle className="w-3 h-3" />
                                {locationError}
                            </div>
                        )}
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}