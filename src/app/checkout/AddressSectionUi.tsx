// app/components/AddressSelectionUI.jsx
"use client";

import { useState } from 'react';
import { MapPin,  X,  Loader2, AlertCircle, Edit2, Plus,  Navigation, Map, Building, Tag } from 'lucide-react';


interface Address {
    id: number;
    label: string;
    street: string;
    city: string;
    state: string;
    landmark: string;
}

export default function AddressSelectionUI() {
    const [savedAddresses, setSavedAddresses] = useState<Address[]>([])


    // ([
    //     {
    //         id: 1,
    //         label: "Home",
    //         street: "123 Main Street",
    //         city: "Kathmandu",
    //         state: "Bagmati",
    //         landmark: "Near Central Mall"
    //     },
    //     {
    //         id: 2,
    //         label: "Office",
    //         street: "456 Business Ave",
    //         city: "Lalitpur",
    //         state: "Bagmati",
    //         landmark: "Tech Park Building"
    //     },
    //     {
    //         id: 3,
    //         label: "Friend's Place",
    //         street: "789 Garden Road",
    //         city: "Bhaktapur",
    //         state: "Bagmati",
    //         landmark: "Near Temple Square"
    //     },
    //     {
    //         id: 4,
    //         label: "Gym",
    //         street: "321 Fitness Street",
    //         city: "Kathmandu",
    //         state: "Bagmati",
    //         landmark: "Sports Complex"
    //     },
    //     {
    //         id: 5,
    //         label: "Mall",
    //         street: "555 Shopping Center",
    //         city: "Lalitpur",
    //         state: "Bagmati",
    //         landmark: "City Mall"
    //     },
    //     {
    //         id: 6,
    //         label: "Restaurant",
    //         street: "777 Food Lane",
    //         city: "Kathmandu",
    //         state: "Bagmati",
    //         landmark: "Downtown Area"
    //     },
    //     {
    //         id: 7,
    //         label: "School",
    //         street: "888 Education Ave",
    //         city: "Bhaktapur",
    //         state: "Bagmati",
    //         landmark: "Academic Zone"
    //     },
    //     {
    //         id: 8,
    //         label: "Hospital",
    //         street: "999 Medical Street",
    //         city: "Kathmandu",
    //         state: "Bagmati",
    //         landmark: "Health District"
    //     }
    // ]);

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



    // Render dialog content based on dialogState
    const renderDialogContent = () => {
        switch (dialogState) {
            case 'addressList':
                return (
                    <div className=" flex flex-col justify-between  min-h-80  h-full ">


                        {savedAddresses.length > 0 &&
                            <div className=" max-h-96 overflow-y-auto scrollbar-thin  ">
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">Select an Address</h3>
                                <div className="grid grid-cols-2 gap-3 pr-2">
                                    {savedAddresses.map((address) => (
                                        <button
                                            key={address.id}
                                            onClick={() => handleAddressSelect(address)}
                                            className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${selectedAddress?.id === address.id
                                                ? 'border-blue-500 bg-blue-50 shadow-lg'
                                                : 'border-gray-200 hover:border-blue-300 hover:shadow-md hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="space-y-2">
                                                {/* Icon and Label */}
                                                <div className="flex items-center gap-2">
                                                    <div className={`p-1.5 rounded-full ${selectedAddress?.id === address.id ? 'bg-yellow-100 border border-yellow-300' : 'bg-gray-100'
                                                        }`}>
                                                        <MapPin className={`w-3 h-3 ${selectedAddress?.id === address.id ? 'text-blue-600' : 'text-gray-500'
                                                            }`} />
                                                    </div>

                                                    <div className={`font-semibold text-xs ${selectedAddress?.id === address.id ? 'text-blue-700' : 'text-gray-900'
                                                        }`}>
                                                        {address.label}
                                                    </div>

                                                    {/* Selected Indicator */}
                                                    {selectedAddress?.id === address.id && (
                                                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full ml-auto"></div>
                                                    )}
                                                </div>

                                                {/* Address Details */}
                                                <div className="space-y-1">
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
                        }

                        {/* Action Buttons */}
                        <div className="flex gap-3  border-t border-gray-100 pt-3">
                            {/* Add New Address - Compact */}
                            <button
                                onClick={() => openDialog('addEditAddress')}
                                className="flex-1 p-2 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2 group"
                            >
                                <div className="p-1 rounded-full bg-gray-100 group-hover:bg-blue-100 transition-colors">
                                    <Plus className="w-3 h-3 text-gray-600 group-hover:text-blue-600" />
                                </div>
                                <span className="text-xs text-gray-700 font-medium group-hover:text-blue-700">
                                    Add New
                                </span>
                            </button>

                            {/* Use Current Location - Compact */}
                            <button
                                onClick={getCurrentLocation}
                                disabled={isLoadingLocation}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
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

                    </div >
                );

            case 'addEditAddress':
                return (
                    <div className=" mx-auto p-6 bg-white">
                        <div className="space-y-4">
                            {/* Street Address */}
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Street Address"
                                    value={newAddress.street}
                                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400"
                                />
                            </div>

                            {/* City and State */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                        <Building className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="City"
                                        value={newAddress.city}
                                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400"
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                        <Map className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="State"
                                        value={newAddress.state}
                                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Landmark/ZIP */}
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <Navigation className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Landmark (Optional)"
                                    value={newAddress.landmark}
                                    onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <Tag className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder=" enter custom label"
                                    value={addressLabel}
                                    onChange={(e) => setAddressLabel(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400"
                                />
                            </div>



                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-4">
                                <button
                                    onClick={handleSaveWithLabel}
                                    disabled={!isAddressComplete}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
                                >
                                    Save Address
                                </button>

                                <button
                                    onClick={() => setDialogState('addressList')}
                                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 text-sm"
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
        <div className="relative">
            {/* Selected Address Display */}
            {selectedAddress && (
                <div className="px-4 py-1.5 rounded-2xl flex flex-row border-2 justify-between items-start border-gray-200  hover:bg-gray-50 ">
                    <div className="flex flex-col">
                        <div className="bg-blue-600/70 items-center text-white text-sm  px-3  rounded-full w-fit mb-1">
                            {selectedAddress.label}
                        </div>

                        <div className="flex items-start gap-3 mb-4">
                            <div className="p-2 rounded-full bg-blue-100 border border-gray-200 mt-1">
                                <MapPin className="w-4 h-4 bg-green-100 text-blue-700" />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-gray-800 mb-1">{selectedAddress.street}</div>
                                <div className="text-sm text-gray-600">
                                    {selectedAddress.city}, {selectedAddress.state}
                                </div>
                                {selectedAddress.landmark && (
                                    <div className="text-xs text-gray-500 mt-1">{selectedAddress.landmark}</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => openDialog('addressList')}
                        className="flex items-center mt-2 gap-2 text-blue-800/60 hover:underline transition-colors"
                    >
                        <Edit2 className="w-4 h-4 text-blue-800/60" />
                        <span className="text-sm font-medium text-blue-800/60 hover:text-blue-800">Edit Address</span>
                    </button>
                </div>
            )}

            {/* Edit/Add Addresses Button */}
            {!selectedAddress &&
                <button
                    onClick={() => openDialog('addressList')}
                    className="w-full p-4 rounded-xl border-2 min-h-[100px] overflow-hidden border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-3 mt-3"
                >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700 font-medium">Add Addresses</span>
                </button>}

            {/* Unified Dialog */}
            {dialogState !== 'closed' && (
                <div className="backdrop-blur-md  bg-opacity-60 fixed inset-0 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl  w-full max-w-4xl">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {dialogState === 'addressList' ? 'Manage Addresses' : dialogState === 'addEditAddress' ? 'Add Address' : 'Label Address'}
                                </h3>
                                <button onClick={closeDialog} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            {renderDialogContent()}
                            {locationError && (
                                <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 rounded-lg text-sm text-red-600">
                                    <AlertCircle className="w-4 h-4" />
                                    {locationError}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}