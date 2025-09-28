'use client';
import React, { useState, useEffect } from 'react';
import { MapPin, User, Clock, Edit3, Check, AlertCircle, Loader2, ChevronDown, ChevronUp, ArrowRight, Send } from 'lucide-react';
import { useContextCart } from './CartContext';
import Image from 'next/image';
import { PaymentMethodsOptions } from '../CommonVue/Payment';
import AddressSelectionUI from './AddressSectionUi';
import CheckoutProduct from './CheckoutProduct';
import { Button } from '@/components/ui/button';

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
    const [promoCode, setPromoCode] = useState('');
    const [promoError, setPromoError] = useState('');
    const [promoSuccess, setPromoSuccess] = useState('');
    const {
        calculateSubtotal,
        finalCheckout,
        setFinalCheckout,
        handlesubmit
    } = useContextCart();

    const processedToCheckout = () => {
        setFinalCheckout((prev) => !prev);
    };

    const subtotal = calculateSubtotal();

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
            setOpenSections(prev => ({ ...prev, customer: true }));
        }
    };

    const handleApplyPromo = () => {
        setPromoError('');
        setPromoSuccess('');
        if (!promoCode.trim()) {
            setPromoError('Please enter a promo code.');
            return;
        }
        // Simulate promo code validation (replace with actual API call in production)
        if (promoCode.toUpperCase() === 'SAVE10') {
            setPromoSuccess('Promo code applied! 10% discount added.');
        } else {
            setPromoError('Invalid promo code.');
        }
    };

    const isAddressComplete = address.street && address.city && address.state && address.zipCode;

    const sectionStatus = {
        address: isAddressComplete,
        customer: customerName.trim() !== '',
        delivery: deliveryOption !== ''
    };

    const PaymentMethodsOption = [
        ...PaymentMethodsOptions,
        { name: "Cash on Delivery", img: "/imgfile/handshakeIcon.webp", id: 6, description: "Pay with cash upon delivery." },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-6 justify-between gap-3 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-gray-50 min-h-screen">
            <div className="sm:col-span-2">
                <CheckoutProduct />
            </div>
            <div className="sm:col-span-4 bg-white rounded-xl max-h-fit shadow-sm border border-gray-200 p-4">
                <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 text-lg">Delivery Information</h3>
                        <div className="text-sm text-gray-500 font-medium">
                            {Object.values(sectionStatus).filter(Boolean).length}/3 completed
                        </div>
                    </div>

                    <div className="space-y-1">
                        <AddressSelectionUI />

                        <div className="border-none">
                            <button
                                onClick={() => toggleSection('customer')}
                                className="w-full  py-2 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${sectionStatus.customer ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}>
                                        <User className="w-4 h-4" />
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
                                <div className="mx-2 max-w-xl pb-1">
                                    <input
                                        type="text"
                                        placeholder="Enter Your Contact Information"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-2 my-2">
                    <h3 className="text-lg px-1 font-semibold text-gray-900">Promo Code</h3>
                    <div className="flex items-center gap-3">

                        <input
                            type="text"
                            placeholder="Enter Your Contact Information"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="w-full max-w-xl mx-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
                        />
            
                             <Button onClick={handleApplyPromo} className="w-full sm:w-auto px-4 m-0 hover:bg-[var(--colour-fsP1)] py-5 bg-[var(--colour-fsP2)] text-white text-sm sm:text-base">
                                Apply Now
                            </Button>
                    </div>
                    {promoError && (
                        <div className="text-sm text-red-500 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {promoError}
                        </div>
                    )}
                    {promoSuccess && (
                        <div className="text-sm text-green-500 flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            {promoSuccess}
                        </div>
                    )}
                </div>

                <div className="space-y-2 px-1">
                    <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        {PaymentMethodsOption.map((method) => (
                            <label
                                key={method.id}
                                className={`flex items-center p-2 rounded-lg border cursor-pointer transition-all hover:bg-gray-50 ${selectedMethod === method.id
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
                                    <div className="text-xs text-gray-500">{method.description}</div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>



                <div className="border-t border-gray-200 px-1 py-3 bg-white ">
                    <div className="flex items-center justify-between">
                        <div className="text-left flex flex-row gap-4 items-center">
                            <div className="text-xl text-[var(--colour-fsP1)] font-medium">Total:</div>
                            <div className="text-xl font-bold text-[var(--colour-fsP2)]">Rs. {subtotal.toFixed(2)}</div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlesubmit}
                                className="px-6 py-2 font-medium rounded-lg flex items-center gap-2 transition-colors bg-green-700 text-white hover:bg-blue-700"
                            >
                                Purchase Now
                                <Send className="w-4 h-4" />
                                {/* <Loader2 className="w-4 h-4 animate-spin" /> */}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliverySection;