// app/components/AddressSelectionUI.jsx
"use client";

import { useState } from 'react';
import { Plus, MapPin, Check, X, Home, Briefcase, Heart, Loader2, AlertCircle, Edit2 } from 'lucide-react';

export default function AddressSelectionUI() {
  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: 1,
      label: 'Home',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      icon: Home
    },
    {
      id: 2,
      label: 'Work',
      street: '456 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      icon: Briefcase
    }
  ]);

  const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0]);
  const [showDialog, setShowDialog] = useState(false);
  const [showLabelDialog, setShowLabelDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [addressLabel, setAddressLabel] = useState('');
  const [selectedLabelIcon, setSelectedLabelIcon] = useState(Home);

  const labelOptions = [
    { name: 'Home', icon: Home },
    { name: 'Work', icon: Briefcase },
    { name: 'Other', icon: Heart }
  ];

  const isAddressComplete = newAddress.street && newAddress.city && newAddress.state && newAddress.zipCode;

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setShowDialog(false);
  };

  const openAddDialog = () => {
    setShowDialog(true);
    setNewAddress({ street: '', city: '', state: '', zipCode: '' });
    setIsEditing(false);
    setLocationError('');
  };

  const closeDialog = () => {
    setShowDialog(false);
    setIsEditing(false);
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
            zipCode: '10003'
          });
          setIsLoadingLocation(false);
          setShowLabelDialog(true);
          setShowDialog(false);
        }, 2000);
      },
      (error) => {
        setLocationError('Unable to retrieve your location. Please try manual entry.');
        setIsLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
    );
  };

  const handleSaveAddress = () => {
    if (isAddressComplete) {
      setShowDialog(false);
      setShowLabelDialog(true);
    }
  };

  const handleSaveWithLabel = () => {
    const newId = Math.max(...savedAddresses.map(a => a.id), 0) + 1;
    const savedAddress = {
      id: newId,
      label: addressLabel || 'Address',
      ...newAddress,
      icon: selectedLabelIcon
    };
    
    setSavedAddresses([...savedAddresses, savedAddress]);
    setSelectedAddress(savedAddress);
    setShowLabelDialog(false);
    setAddressLabel('');
    setNewAddress({ street: '', city: '', state: '', zipCode: '' });
  };

  const handleLabelSelect = (option) => {
    setAddressLabel(option.name);
    setSelectedLabelIcon(option.icon);
  };

  return (
    <div className="">
      {/* Selected Address Display */}
      <div className="space-y-3">

        
        {selectedAddress && (
          <div className="p-4 rounded-lg border border-blue-500 bg-blue-50 shadow-md flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-blue-100">
                <selectedAddress.icon className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-blue-900">{selectedAddress.label}</div>
                <div className="text-sm text-gray-600 mt-1">{selectedAddress.street}</div>
                <div className="text-sm text-gray-500">
                  {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
                </div>
              </div>
            </div>
            <Check className="w-5 h-5 text-blue-600 mt-1" />
          </div>
        )}

        {/* Edit Addresses Button */}
        <button
          onClick={openAddDialog}
          className="w-full p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
        >
          <Edit2 className="w-4 h-4 text-gray-600" />
          <span className="text-gray-700 font-medium">Edit or Add Addresses</span>
        </button>
      </div>

      {/* Address Management Dialog */}
      {showDialog && (
        <div className="fixed inset-0 ">
          <div className="bg-white rounded-xl p-6 w-full h-full ">
            <div className="flex items-center justify-between ">
              <h3 className="text-lg font-semibold text-gray-900">Manage Addresses</h3>
              <button
                onClick={closeDialog}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {!isEditing ? (
              <div className="space-y-4">
                {/* Saved Addresses List */}
                {savedAddresses.map((address) => (
                  <button
                    key={address.id}
                    onClick={() => handleAddressSelect(address)}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                      selectedAddress?.id === address.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        selectedAddress?.id === address.id ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <address.icon className={`w-4 h-4 ${
                          selectedAddress?.id === address.id ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <div className={`font-medium ${
                          selectedAddress?.id === address.id ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {address.label}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{address.street}</div>
                        <div className="text-sm text-gray-500">
                          {address.city}, {address.state} {address.zipCode}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}

                {/* Add New Address Button */}
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center gap-3"
                >
                  <div className="p-2 rounded-full bg-gray-100 group-hover:bg-blue-100 transition-colors">
                    <Plus className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                  </div>
                  <span className="text-gray-700 group-hover:text-blue-700 font-medium">
                    Add New Address
                  </span>
                </button>

                <button
                  onClick={getCurrentLocation}
                  disabled={isLoadingLocation}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {isLoadingLocation ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <MapPin className="w-5 h-5" />
                  )}
                  {isLoadingLocation ? 'Getting Location...' : 'Use My Location'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Street Address"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                    className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                    className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={newAddress.zipCode}
                  onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSaveAddress}
                    disabled={!isAddressComplete}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Address
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {locationError && (
              <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 rounded-lg text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {locationError}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Label Dialog */}
      {showLabelDialog && (
        <div className="fixed inset-0 ">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Label this address</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {labelOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={() => handleLabelSelect(option)}
                    className={`p-4 rounded-lg border text-center transition-colors ${
                      addressLabel === option.name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <option.icon className={`w-6 h-6 mx-auto mb-2 ${
                      addressLabel === option.name ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                    <div className={`text-sm font-medium ${
                      addressLabel === option.name ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {option.name}
                    </div>
                  </button>
                ))}
              </div>
              
              <input
                type="text"
                placeholder="Or enter custom label"
                value={addressLabel}
                onChange={(e) => setAddressLabel(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <div className="flex gap-3">
                <button
                  onClick={handleSaveWithLabel}
                  disabled={!addressLabel}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowLabelDialog(false)}
                  className="px-6 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}