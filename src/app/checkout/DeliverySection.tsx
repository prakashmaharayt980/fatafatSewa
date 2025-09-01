'use client';
import React, { useState, useEffect } from 'react';
import { MapPin, User, Clock, Edit3, Check, AlertCircle, Loader2, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useContextCart } from './CartContext';
import Image from 'next/image';
import { PaymentMethodsOptions } from '../CommonVue/Payment';
import AddressSelectionUI from './AddressSectionUi';

const DeliverySection = () => {
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [customerName, setCustomerName] = useState('9866666666');
    const [deliveryOption, setDeliveryOption] = useState('standard');
    const [openSections, setOpenSections] = useState({
        address: true,
        customer: false,
        delivery: false
    });
    const [selectedMethod, setSelectedMethod] = useState(null);


    const handleMethodSelect = (methodId) => {
        setSelectedMethod(methodId);
        console.log('Selected payment method:', methodId);
    };

    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Simulate getting location
    const getCurrentLocation = async () => {
        setIsLoadingLocation(true);
        setLocationError('');

        try {
            if (!navigator.geolocation) {
                throw new Error('Geolocation is not supported');
            }

            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    timeout: 10000,
                    enableHighAccuracy: true
                });
            });

            setTimeout(() => {
                setAddress({
                    street: '123 Main Street',
                    city: 'New York',
                    state: 'NY',
                    zipCode: '10001',
                    country: 'USA'
                });
                setIsLoadingLocation(false);
            }, 1500);

        } catch (error) {
            setLocationError('Unable to get your location. Please enter manually.');
            setIsLoadingLocation(false);
            setIsEditing(true);
        }
    };

    const handleSaveAddress = () => {
        if (address.street && address.city && address.state && address.zipCode) {
            setIsEditing(false);
            // Auto expand next section
            setOpenSections(prev => ({ ...prev, customer: true }));
        }
    };

 

    const isAddressComplete = address.street && address.city && address.state && address.zipCode;

    // Check completion status for each section
    const sectionStatus = {
        address: isAddressComplete,
        customer: customerName.trim() !== '',
        delivery: deliveryOption !== ''
    };

    const { FinalCheckout, ProcessedToCheckout, } = useContextCart()

    const PaymentMethodsOption = [
        ...PaymentMethodsOptions,
        { name: "Cash on Delivery", img: "/imgfile/handshakeIcon.webp", id: 6, description: "Pay with cash upon delivery." },
    ]
    return (
        <Drawer open={FinalCheckout} onOpenChange={ProcessedToCheckout} >
            <DrawerContent className="max-h-[40vh] max-w-5xl h-full mx-auto border px-2 border-gray-200 rounded-xl  bg-white shadow-sm ">
                <div className='overflow-y-auto h-[80vh] space-y-6 py-4 px-2'>
                    <div className="mb-6 ">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900 text-lg">Delivery Information</h3>
                            <div className="text-xs text-gray-500">
                                {Object.values(sectionStatus).filter(Boolean).length}/3 completed
                            </div>
                        </div>

                        <div className=" overflow-hidden  bg-white shadow-sm">

                            {/* Address Section */}
                            {/* <div className=" mx-auto bg-white border-b border-gray-200 ">
                                <div className="border-b border-gray-100 last:border-b-0">
                                    <button
                                        onClick={() => toggleSection('address')}
                                        className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${sectionStatus.address ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                                }`}>
                                                {sectionStatus.address ? (
                                                    <Check className="w-4 h-4" />
                                                ) : (
                                                    <MapPin className="w-4 h-4" />
                                                )}
                                            </div>
                                            <div className="text-left">
                                                <div className="font-medium text-gray-900">Delivery Address</div>
                                                {sectionStatus.address && !openSections.address && (
                                                    <div className="text-sm text-gray-600">
                                                        {address.street}, {address.city}, {address.state}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {openSections.address ? (
                                            <ChevronUp className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        )}
                                    </button>

                                    {openSections.address && (
                                        <div className="px-4">
                                            {isEditing ? (
                                                <div className="space-y-3">
                                                    <input
                                                        type="text"
                                                        placeholder="Street Address"
                                                        value={address.street}
                                                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <input
                                                            type="text"
                                                            placeholder="City"
                                                            value={address.city}
                                                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                                            className="px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="State"
                                                            value={address.state}
                                                            onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                                            className="px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="ZIP Code"
                                                        value={address.zipCode}
                                                        onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                    <div className="flex gap-2 pt-2 mb-1">
                                                        <button
                                                            onClick={handleSaveAddress}
                                                            disabled={!isAddressComplete}
                                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                            Save Address
                                                        </button>
                                                        <button
                                                            onClick={() => setIsEditing(false)}
                                                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    {isAddressComplete ? (
                                                        <div className="flex items-start justify-between">
                                                            <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-4 flex-1">
                                                                <div className="font-medium text-gray-900">{address.street}</div>
                                                                <div className="text-gray-600">{address.city}, {address.state} {address.zipCode}</div>
                                                            </div>
                                                            <button
                                                                onClick={() => setIsEditing(true)}
                                                                className="ml-3 flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                            >
                                                                <Edit3 className="w-3 h-3" />
                                                                Edit
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="w-full bg-white  ">
                                                            <div className="flex items-center py-2 justify-center gap-6">
                                                                <button
                                                                    onClick={getCurrentLocation}
                                                                    disabled={isLoadingLocation}
                                                                    className="flex items-center gap-2   text-blue-700  font-medium disabled:opacity-50 transition-colors "
                                                                >
                                                                    {isLoadingLocation ? (
                                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                                    ) : (
                                                                        <MapPin className="w-5 h-5" />
                                                                    )}
                                                                    {isLoadingLocation ? 'Getting Location...' : 'Use My Location'}
                                                                </button>

                                                                <div className="text-sm text-gray-500">
                                                                    Or{' '}
                                                                    <button
                                                                        onClick={() => setIsEditing(true)}
                                                                        className="text-blue-600 hover:underline font-medium transition-colors"
                                                                    >
                                                                        enter address manually
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {locationError && (
                                                <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 rounded-lg text-sm text-red-600">
                                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                    {locationError}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div> */}
                            <AddressSelectionUI/>

                            {/* Customer Section */}
                            <div className="border-b border-gray-100 last:border-b-0">
                                <button
                                    onClick={() => toggleSection('customer')}
                                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${sectionStatus.customer ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                                            }`}>
                                            {sectionStatus.customer ? (
                                                <Check className="w-4 h-4" />
                                            ) : (
                                                <User className="w-4 h-4" />
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <div className="font-medium text-gray-900">Customer Contact No</div>
                                            {sectionStatus.customer && !openSections.customer && (
                                                <div className="text-sm text-gray-600">{customerName}</div>
                                            )}
                                        </div>
                                    </div>
                                    {openSections.customer ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>

                                {openSections.customer && (
                                    <div className="px-5 pb-5">
                                        <input
                                            type="text"
                                            placeholder=" Enter Your Contact Information"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    </div>
                                )}
                            </div>

                    
                        </div>


                    </div>
                    <div className="space-y-4 ">
                        <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
                        <div className="space-y-3 h-full ">
                            {PaymentMethodsOption.map((method) => {

                                return (
                                    <label
                                        key={method.id}
                                        className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all hover:bg-gray-50 ${selectedMethod === method.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            value={method.id}
                                            checked={selectedMethod === method.id}
                                            onChange={() => handleMethodSelect(method.id)}
                                            className="sr-only"
                                        />
                                        <div className={`w-4 h-4 rounded-full border-2 mr-4 flex items-center justify-center ${selectedMethod === method.id
                                            ? 'border-blue-500 bg-blue-500'
                                            : 'border-gray-300'
                                            }`}>
                                            {selectedMethod === method.id && (
                                                <div className="w-2 h-2 rounded-full bg-white"></div>
                                            )}
                                        </div>
                                        <Image src={method.img} alt={method.name} width={40} height={24} className="object-contain mr-4" />
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">{method.name}</div>
                                            <div className="text-sm text-gray-500">{method.description}</div>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                </div>
                <div className="w-full  border-t border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="text-left">
                            <div className="text-sm text-gray-500">Total</div>
                            <div className="text-xl font-bold text-gray-900">Rsv 22222</div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                // onClick={handleContinueShopping}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                // onClick={handleCompletePurchase}
                                // disabled={items.length === 0 || isPurchasing}
                                className={`px-6 py-2 font-medium rounded-lg flex items-center gap-2 transition-colors bg-gray-300 text-gray-500 cursor-not-allowed `}
                            >
                                Checkout
                                <Loader2 className="w-4 h-4 animate-spin" />
                            </button>
                        </div>
                    </div>
                </div>
            </DrawerContent>


        </Drawer>

    );
};

export default DeliverySection;