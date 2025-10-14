'use client'

import { useState, useEffect } from 'react';
import { MapPin, X, Loader2, AlertCircle, Edit2, Plus, Trash2 } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    } else {
      localStorage.removeItem('savedAddresses');
    }
  }, [savedAddresses]);

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setDialogState('closed');
  };

  const handleDeleteAddress = (id: number) => {
    const updatedAddresses = savedAddresses.filter((address) => address.id !== id);
    setSavedAddresses(updatedAddresses);
    if (selectedAddress?.id === id) {
      setSelectedAddress(updatedAddresses.length > 0 ? updatedAddresses[0] : null);
    }
  };

  useEffect(() => {
    if (selectedAddress) {
      setsubmittedvaluelist((prev) => ({ ...prev, address: selectedAddress }));
    } else {
      setsubmittedvaluelist((prev) => ({ ...prev, address: null }));
    }
  }, [selectedAddress, setsubmittedvaluelist]);

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
    if (savedAddresses.length >= 4) {
      alert('Maximum of 4 addresses allowed. Delete an address to add a new one.');
      return;
    }
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
              <div ref={ref} className="max-h-[45vh] overflow-y-auto scrollbar-thin pr-2">
                {inView ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {savedAddresses.map((address) => (
                      <div key={address.id} className="relative">
                        <button
                          onClick={() => handleAddressSelect(address)}
                          className={`w-full p-3 rounded-lg bg-white border border-blue-100 shadow-sm text-left transition-all duration-150 hover:shadow-md hover:bg-yellow-50 ${
                            selectedAddress?.id === address.id ? 'border-blue-600 bg-blue-50' : ''
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div
                                className={`p-1 rounded-full ${
                                  selectedAddress?.id === address.id ? 'bg-blue-100' : 'bg-yellow-100'
                                }`}
                              >
                                <MapPin
                                  className={`w-4 h-4 ${
                                    selectedAddress?.id === address.id ? 'text-blue-600' : 'text-yellow-600'
                                  }`}
                                />
                              </div>
                              <div
                                className={`font-medium text-sm ${
                                  selectedAddress?.id === address.id ? 'text-blue-600' : 'text-gray-700'
                                }`}
                              >
                                {address.label}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-sm text-gray-700 font-medium line-clamp-1">{address.street}</div>
                              <div className="text-xs text-gray-600 line-clamp-1">
                                {address.city}, {address.state}
                              </div>
                              {address.landmark && (
                                <div className="text-xs text-gray-500 line-clamp-1">{address.landmark}</div>
                              )}
                            </div>
                          </div>
                        </button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAddress(address.id)}
                          className="absolute top-2 right-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-full transition-all duration-150 focus:ring-1 focus:ring-blue-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-20">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2 border-t border-blue-100 pt-3 mt-2">
              <Button
                onClick={() => openDialog('addEditAddress')}
                disabled={savedAddresses.length >= 4}
                className="flex-1 p-2 rounded-lg border border-blue-200 bg-yellow-50 text-blue-600 hover:bg-yellow-100 hover:border-blue-300 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 text-sm flex items-center justify-center gap-2 focus:ring-1 focus:ring-blue-600"
              >
                <div className="p-1 rounded-full bg-blue-100">
                  <Plus className="w-4 h-4 text-blue-600" />
                </div>
                <span>Add New</span>
              </Button>
              <Button
                onClick={getCurrentLocation}
                disabled={isLoadingLocation}
                className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 focus:ring-1 focus:ring-blue-600"
              >
                <div className="p-1 rounded-full bg-blue-700">
                  {isLoadingLocation ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                </div>
                <span>{isLoadingLocation ? 'Getting...' : 'My Location'}</span>
              </Button>
            </div>
          </div>
        );

      case 'addEditAddress':
        return (
          <div className="p-3 sm:p-4">
            {coordinates && (
              <div className="mb-4">
                <MapDisplay
                  position={[coordinates.lat, coordinates.lng]}
                  address={`${newAddress.street}, ${newAddress.city}, ${newAddress.state}`}
                />
              </div>
            )}
            <div className="space-y-3">
              <Input
                placeholder="Enter street address"
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                className="w-full text-sm bg-white border-blue-200 text-gray-700 placeholder-gray-400 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 rounded-lg"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <Input
                  placeholder="Enter city"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="w-full text-sm bg-white border-blue-200 text-gray-700 placeholder-gray-400 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 rounded-lg"
                />
                <Input
                  placeholder="Enter state"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  className="w-full text-sm bg-white border-blue-200 text-gray-700 placeholder-gray-400 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 rounded-lg"
                />
              </div>
              <Input
                placeholder="Enter landmark (optional)"
                value={newAddress.landmark}
                onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                className="w-full text-sm bg-white border-blue-200 text-gray-700 placeholder-gray-400 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 rounded-lg"
              />
              <Input
                placeholder="Enter custom label"
                value={addressLabel}
                onChange={(e) => setAddressLabel(e.target.value)}
                className="w-full text-sm bg-white border-blue-200 text-gray-700 placeholder-gray-400 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 rounded-lg"
              />
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleSaveWithLabel}
                  disabled={!isAddressComplete}
                  className="flex-1 p-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 focus:ring-1 focus:ring-blue-600"
                >
                  Save Address
                </Button>
                <Button
                  onClick={() => setDialogState('addressList')}
                  className="flex-1 p-2 text-sm font-medium rounded-lg border border-blue-200 text-blue-600 bg-white hover:bg-yellow-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-150 focus:ring-1 focus:ring-blue-600"
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
    <div
      className={`relative rounded-xl bg-white border-2 ${
        !selectedAddress ? 'border-dashed border-blue-200' : 'border-blue-100 shadow-sm'
      } p-2 sm:p-3 transition-all duration-150 hover:shadow-md`}
    >
      {selectedAddress && (
        <div className="flex flex-col sm:flex-row justify-between items-start transition-all duration-150 p-1 sm:p-2 rounded-lg">
          <div className="flex flex-col w-full">
            <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full w-fit mb-1">
              {selectedAddress.label}
            </div>
            <div className="flex items-start gap-2">
              <div className="p-1 rounded-full bg-blue-100">
                <MapPin className="w-3 h-3 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-700 mb-0.5">{selectedAddress.street}</div>
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
            className="flex items-center font-medium cursor-pointer gap-1 text-blue-600 hover:text-blue-700 hover:bg-yellow-50 rounded px-2 py-1 transition-all duration-150 text-xs mt-1 sm:mt-0 focus:ring-1 focus:ring-blue-600"
          >
            <Edit2 className="w-3 h-3" />
            Change
          </button>
        </div>
      )}

      {!selectedAddress && (
        <button
          onClick={() => openDialog('addressList')}
          className="w-full p-3 transition-all duration-150 flex items-center justify-center gap-2 text-sm"
        >
          <div className="relative w-5 h-5 sm:w-6 sm:h-6 bg-yellow-50 rounded overflow-hidden">
            <Image
              src={imglist.addresspin}
              alt="Add Address"
              fill
              sizes="(max-width: 768px) 100vw, 6vw"
              className="object-contain p-0.5 transition-transform duration-150 hover:scale-105"
            />
          </div>
          <span className="text-gray-700 font-medium">Add Address</span>
        </button>
      )}

      <Drawer open={dialogState !== 'closed'} onOpenChange={(open) => !open && closeDialog()}>
        <DrawerContent className="max-h-[50vh] max-w-[95%] sm:max-w-3xl mx-auto bg-white border border-blue-100 rounded-xl shadow-sm p-2 sm:p-3">
          <DrawerHeader className="py-1 flex flex-row justify-between items-center">
            <DrawerTitle className="text-base font-medium text-gray-700">
              {dialogState === 'addressList' ? (savedAddresses.length > 0 ? 'Choose Address' : 'Manage Addresses') : 'Add Address'}
            </DrawerTitle>
            <DrawerClose className="hover:bg-yellow-50 rounded-full p-1 transition-all duration-150 focus:ring-1 focus:ring-blue-600">
              <X className="w-4 h-4 text-blue-600 hover:text-blue-700" />
            </DrawerClose>
          </DrawerHeader>
          <div className="overflow-y-auto px-1">
            {renderDialogContent()}
            {locationError && (
              <div className="flex items-center gap-2 mt-2 p-2 bg-red-50 rounded-lg text-xs text-red-600">
                <AlertCircle className="w-4 h-4" />
                {locationError}
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}