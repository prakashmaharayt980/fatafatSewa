
'use client';
import { useState, useEffect } from 'react';
import { MapPin, X, Loader2, AlertCircle, Edit2, Plus } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { TextField } from '@mui/material';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { imglist } from '../CommonVue/Image';
import { useInView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';

interface Address {
    id: number;
    label: string;
    street: string;
    city: string;
    state: string;
    landmark: string;
}

// Dynamically import MapDisplay to avoid SSR issues
const MapDisplay = dynamic(() => import('./MapAddress'), { ssr: false });

export default function AddressSelectionUI({ setsubmittedvaluelist }) {
    const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [dialogState, setDialogState] = useState<'closed' | 'addressList' | 'addEditAddress'>('closed');
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [newAddress, setNewAddress] = useState({
        street: '',
        city: '',
        state: '',
        landmark: '',
    });
    const [addressLabel, setAddressLabel] = useState('');
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
    const { ref, inView } = useInView({
        triggerOnce: false,
        threshold: 0.1,
    });

    const isAddressComplete = newAddress.street && newAddress.city && newAddress.state && newAddress.landmark;

    // Load saved addresses from localStorage on mount
    useEffect(() => {
        const storedAddresses = localStorage.getItem('savedAddresses');
        if (storedAddresses) {
            const parsedAddresses: Address[] = JSON.parse(storedAddresses);
            setSavedAddresses(parsedAddresses);
            if (parsedAddresses.length > 0) {
                setSelectedAddress(parsedAddresses[0]);
            }
        }
    }, []);

    // Save addresses to localStorage whenever savedAddresses changes
    useEffect(() => {
        if (savedAddresses.length > 0) {
            localStorage.setItem('savedAddresses', JSON.stringify(savedAddresses));
        }
    }, [savedAddresses]);

    const handleAddressSelect = (address: Address) => {
        setSelectedAddress(address);

        setDialogState('closed');
    };

    useEffect(() => {
        if (selectedAddress) {
            setsubmittedvaluelist(pre => ({ ...pre, address: selectedAddress }))
        }
    }, [selectedAddress, setsubmittedvaluelist])

    const openDialog = (state: 'addressList' | 'addEditAddress') => {
        setDialogState(state);
        setLocationError('');
        if (state === 'addEditAddress') {
            setNewAddress({ street: '', city: '', state: '', landmark: '' });
            setAddressLabel('');
            setCoordinates(null);
        }
    };

    const closeDialog = () => {
        setDialogState('closed');
        setLocationError('');
        setCoordinates(null);
    };

    const getCurrentLocation = async () => {
        setIsLoadingLocation(true);
        setLocationError('');

        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by this browser.');
            setIsLoadingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    setCoordinates({ lat: latitude, lng: longitude });
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
                    );
                    const data = await response.json();

                    if (data && data.address) {
                        setNewAddress({
                            street: data.address.road || 'Unknown Street',
                            city: data.address.city || data.address.town || data.address.village || 'Unknown City',
                            state: data.address.state || 'Unknown State',
                            landmark: data.address.postcode || '',
                        });
                        setAddressLabel('Current Location');
                    } else {
                        setLocationError('Unable to retrieve address details.');
                    }
                } catch (error) {
                    setLocationError('Failed to fetch address. Please try manual entry.');
                } finally {
                    setIsLoadingLocation(false);
                    setDialogState('addEditAddress');
                }
            },
            (error) => {
                let errorMessage = 'Unable to retrieve your location.';
                if (error.code === error.PERMISSION_DENIED) {
                    errorMessage = 'Location access denied. Please allow location permissions.';
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    errorMessage = 'Location information is unavailable.';
                } else if (error.code === error.TIMEOUT) {
                    errorMessage = 'Location request timed out.';
                }
                setLocationError(errorMessage);
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
        setCoordinates(null);
    };

    const renderDialogContent = () => {
        switch (dialogState) {
            case 'addressList':
                return (
                    <div className="flex flex-col justify-between min-h-[35vh]">
                        {savedAddresses.length > 0 && (
                            <div ref={ref} className="max-h-[45vh] overflow-y-auto scrollbar-thin pr-1">
                                {inView ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                        {savedAddresses.map((address) => (
                                            <button
                                                key={address.id}
                                                onClick={() => handleAddressSelect(address)}
                                                className={`p-2 rounded-lg bg-white border border-gray-100 shadow-sm text-left transition-all duration-200 hover:shadow-md hover:bg-teal-50 ${selectedAddress?.id === address.id ? 'border-teal-400 bg-teal-50 shadow-md' : ''}`}
                                            >
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className={`p-1 rounded-full ${selectedAddress?.id === address.id ? 'bg-teal-100' : 'bg-gray-100'}`}
                                                        >
                                                            <MapPin
                                                                className={`w-4 h-4 ${selectedAddress?.id === address.id ? 'text-blue-600' : 'text-gray-500'}`}
                                                            />
                                                        </div>
                                                        <div
                                                            className={`font-medium text-xs ${selectedAddress?.id === address.id ? 'text-blue-700' : 'text-gray-800'}`}
                                                        >
                                                            {address.label}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="text-xs text-gray-700 font-medium line-clamp-1">
                                                            {address.street}
                                                        </div>
                                                        <div className="text-xs text-gray-500 line-clamp-1">
                                                            {address.city}, {address.state}
                                                        </div>
                                                        {address.landmark && (
                                                            <div className="text-xs text-gray-400 line-clamp-1">{address.landmark}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex justify-center items-center h-20">
                                        <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex gap-1.5 border-t border-gray-100 pt-2 mt-1">
                            <button
                                onClick={() => openDialog('addEditAddress')}
                                className="flex-1 p-2 rounded-lg border bg-gray-100 border-gray-200 hover:border-blue-400 hover:bg-teal-50 transition-all duration-200 flex items-center justify-center gap-1 group text-xs"
                            >
                                <div className="p-1 items-center rounded-full bg-gray-100 group-hover:bg-teal-100 transition-colors">
                                    <Plus className="w-4 h-4 text-gray-600 group-hover:text-teal-600" />
                                </div>
                                <span className="text-gray-700 font-medium group-hover:text-teal-700">Add New</span>
                            </button>
                            <button
                                onClick={getCurrentLocation}
                                disabled={isLoadingLocation}
                                className="flex-1 flex items-center justify-center gap-1 p-1.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs"
                            >
                                <div className="p-1 rounded-full bg-teal-700">
                                    {isLoadingLocation ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <MapPin className="w-4 h-4" />
                                    )}
                                </div>
                                <span>{isLoadingLocation ? 'Getting...' : 'My Location'}</span>
                            </button>
                        </div>
                    </div>
                );

            case 'addEditAddress':
                return (
                    <div className="p-2">
                        {coordinates && (
                            <div className="mb-3">
                                <MapDisplay
                                    position={[coordinates.lat, coordinates.lng]}
                                    address={`${newAddress.street}, ${newAddress.city}, ${newAddress.state}`}
                                />
                            </div>
                        )}
                        <div className="space-y-3">
                            <TextField
                                fullWidth
                                size="small"
                                label="Street Address"
                                placeholder="Enter street address"
                                value={newAddress.street}
                                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                variant="outlined"
                                className="bg-white"
                                style={{ marginBottom: '12px' }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        '&:hover fieldset': { borderColor: '#1967b3' },
                                        '&.Mui-focused fieldset': { borderColor: '#1967b3' },
                                    },
                                    '& .MuiInputLabel-root': { fontSize: '1rem', color: '#1967b3' },
                                    '& .MuiInputLabel-root.Mui-focused': { fontSize: '1rem', color: '#1967b3' },
                                }}
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="City"
                                    placeholder="Enter city"
                                    value={newAddress.city}
                                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                    variant="outlined"
                                    className="bg-white"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '8px',
                                            '&:hover fieldset': { borderColor: '#1967b3' },
                                            '&.Mui-focused fieldset': { borderColor: '#1967b3' },
                                        },
                                        '& .MuiInputLabel-root': { fontSize: '0.85rem', color: '#1967b3' },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#1967b3' },
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="State"
                                    placeholder="Enter state"
                                    value={newAddress.state}
                                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                    variant="outlined"
                                    className="bg-white"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '8px',
                                            '&:hover fieldset': { borderColor: '#1967b3' },
                                            '&.Mui-focused fieldset': { borderColor: '#1967b3' },
                                        },
                                        '& .MuiInputLabel-root': { fontSize: '0.85rem', color: '#1967b3' },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#1967b3' },
                                    }}
                                />
                            </div>
                            <TextField
                                fullWidth
                                size="small"
                                label="Landmark (Optional)"
                                placeholder="Enter landmark"
                                value={newAddress.landmark}
                                onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                                variant="outlined"
                                className="bg-white"
                                style={{ marginBottom: '12px' }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        '&:hover fieldset': { borderColor: '#1967b3' },
                                        '&.Mui-focused fieldset': { borderColor: '#1967b3' },
                                    },
                                    '& .MuiInputLabel-root': { fontSize: '1rem', color: '#1967b3' },
                                    '& .MuiInputLabel-root.Mui-focused': { fontSize: '1rem', color: '#1967b3' },
                                }}
                            />
                            <TextField
                                fullWidth
                                size="small"
                                label="Custom Label"
                                placeholder="Enter custom label"
                                value={addressLabel}
                                onChange={(e) => setAddressLabel(e.target.value)}
                                variant="outlined"
                                className="bg-white"
                                style={{ marginBottom: '8px' }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        '&:hover fieldset': { borderColor: '#1967b3' },
                                        '&.Mui-focused fieldset': { borderColor: '#1967b3' },
                                    },
                                    '& .MuiInputLabel-root': { fontSize: '1rem', color: '#1967b3' },
                                    '& .MuiInputLabel-root.Mui-focused': { fontSize: '1rem', color: '#1967b3' },
                                }}
                            />
                            <div className="flex gap-1.5 pt-1">
                                <Button
                                    onClick={handleSaveWithLabel}
                                    disabled={!isAddressComplete}
                                    className="px-4 py-1.5 font-medium rounded-md flex items-center gap-1.5 bg-green-700 text-white hover:bg-blue-700 transition-colors"
                                >
                                    Save Address
                                </Button>
                                <Button
                                    onClick={() => setDialogState('addressList')}
                                    className="px-4 py-1.5 font-medium rounded-md flex items-center gap-1.5 bg-red-700 text-white hover:bg-blue-700 transition-colors"
                                >
                                    Back
                                </Button>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className={`relative rounded-lg bg-white border-2 ${!selectedAddress ? 'border-dashed border-gray-200' : 'border-gray-100 shadow-sm'} p-2 transition-all hover:shadow-md`}>
            {selectedAddress && (
                <div className="flex flex-col sm:flex-row justify-between items-start hover:bg-teal-50/50 transition-all p-1">
                    <div className="flex flex-col w-full">
                        <div className="bg-teal-600 text-white text-xs px-1.5 py-0.5 rounded-full w-fit mb-1">
                            {selectedAddress.label}
                        </div>
                        <div className="flex items-start gap-1.5">
                            <div className="p-0.5 rounded-full bg-teal-100 mt-0.5">
                                <MapPin className="w-3 h-3 text-teal-600" />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs font-medium text-gray-800 mb-0.5">{selectedAddress.street}</div>
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
                        className="flex items-center font-medium cursor-pointer gap-1 text-teal-600 hover:text-teal-700 transition-colors text-xs mt-1 sm:mt-0"
                    >
                        <Edit2 className="w-3 h-3" />
                        Change
                    </button>
                </div>
            )}

            {!selectedAddress && (
                <button
                    onClick={() => openDialog('addressList')}
                    className="w-full p-3 transition-all flex items-center justify-center gap-1 text-xs"
                >
                    <Image
                        src={imglist.addresspin}
                        className="h-5 w-5 text-[var(--colour-fsP2)]/60"
                        alt="add Address"
                        height={20}
                        width={20}
                    />
                    <span className="text-gray-700 font-medium">Add Address</span>
                </button>
            )}

            <Drawer open={dialogState !== 'closed'} onOpenChange={(open) => !open && closeDialog()}>
                <DrawerContent className="max-h-[50vh] max-w-3xl mx-auto bg-white backdrop-blur-sm border border-gray-100 rounded-lg shadow-lg p-2">
                    <DrawerHeader className="py-0.5 flex flex-row justify-between items-center">
                        <DrawerTitle className="text-sm font-medium text-gray-800">
                            {dialogState === 'addressList' ? (savedAddresses.length > 0 ? 'Choose Address' : 'Manage Addresses') : 'Add Address'}
                        </DrawerTitle>
                        <DrawerClose className="hover:bg-gray-100/50 rounded-full p-0.5">
                            <X className="w-3 h-3 text-gray-500" />
                        </DrawerClose>
                    </DrawerHeader>
                    <div className="overflow-y-auto px-1">
                        {renderDialogContent()}
                        {locationError && (
                            <div className="flex items-center gap-1 mt-1 p-1 bg-red-50/80 rounded-md text-xs text-red-600">
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
