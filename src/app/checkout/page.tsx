'use client'

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Send, Phone } from 'lucide-react';
import { useContextCart } from './CartContext';
import Image from 'next/image';
import { PaymentMethodsOptions } from '../CommonVue/Payment';
import AddressSelectionUI from './AddressSectionUi';
import CheckoutProduct from './CheckoutProduct';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

const DeliverySection = () => {
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const { items, calculateSubtotal } = useContextCart();
  const subtotal = calculateSubtotal();
  const router = useRouter();

  const [openSections, setOpenSections] = useState({
    address: true,
    customer: false,
    paymentmethod: false,
  });
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [submittedvaluelist, setsubmittedvaluelist] = useState({
    paymentmethod: '',
    address: address,
    receiverNO: '',
    promoCode: '',
    products: items,
    totalpayment: subtotal,
    appliedPromo: null,
  });

  const handleMethodSelect = (method) => {
    setSelectedMethod(method.id);
    setsubmittedvaluelist((prev) => ({ ...prev, paymentmethod: method.name }));
    console.log('Selected payment method:', method);
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlesubmit = () => {
    try {
      setsubmittedvaluelist((prev) => ({ ...prev, products: items }));
      setTimeout(() => {
        router.push('/checkout/Successpage');
      }, 2000);
      console.log('product buy', submittedvaluelist);
    } catch (error) {
      console.log('eee', error);
    }
  };

  const isAddressComplete = address.street && address.city && address.state && address.zipCode;

  const sectionStatus = {
    address: isAddressComplete,
    customer: submittedvaluelist.receiverNO.trim() !== '',
    paymentmethod: submittedvaluelist.paymentmethod !== '',
  };

  const PaymentMethodsOption = [
    ...PaymentMethodsOptions,
    {
      name: 'Cash on Delivery',
      img: '/imgfile/handshakeIcon.webp',
      id: 6,
      description: 'Pay with cash upon delivery.',
    },
  ];

  const handleApplyPromo = () => {
    if (submittedvaluelist.promoCode.toUpperCase() === 'SAVE10') {
      setsubmittedvaluelist((prev) => ({ ...prev, appliedPromo: { code: 'SAVE10', discount: 10 } }));
    } else if (submittedvaluelist.promoCode) {
      alert('Invalid promo code');
    }
  };

  const handleRemovePromo = () => {
    setsubmittedvaluelist((prev) => ({ ...prev, promoCode: '', appliedPromo: null }));
  };

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 py-4 sm:py-6 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="sm:col-span-2">
          <CheckoutProduct
            setsubmittedvaluelist={setsubmittedvaluelist}
            submittedvaluelist={submittedvaluelist}
            handleApplyPromo={handleApplyPromo}
          />
        </div>
        <div className="sm:col-span-3 bg-white rounded-xl shadow-sm border border-blue-100 p-4 sm:p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-medium text-gray-700">Delivery Information</h3>
              <div className="text-xs text-gray-600 font-medium">
                {Object.values(sectionStatus).filter(Boolean).length}/3 completed
              </div>
            </div>

            <div className="space-y-4">
              <AddressSelectionUI setsubmittedvaluelist={setsubmittedvaluelist} />

              <div className="border-none">
                <button
                  onClick={() => toggleSection('customer')}
                  className="w-full py-2 flex items-center justify-between  cursor-pointer transition-all duration-150 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        sectionStatus.customer ? 'bg-green-100 text-green-600' : ' text-[var(--colour-fsP1)]'
                      }`}
                    >
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 text-sm">Customer Contact No</div>
                      {sectionStatus.customer && !openSections.customer && (
                        <div className="text-xs text-gray-600">{submittedvaluelist.receiverNO}</div>
                      )}
                    </div>
                  </div>
                  {openSections.customer ? (
                    <ChevronUp className="w-4 h-4 text-blue-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-blue-600" />
                  )}
                </button>

                {openSections.customer && (
                  <div className="mt-2 max-w-lg pl-2">
                    <Input
                      type="text"
                      placeholder="Enter Your Contact Information"
                      value={submittedvaluelist.receiverNO}
                      maxLength={10}
                      onChange={(e) =>
                        setsubmittedvaluelist((prev) => ({ ...prev, receiverNO: e.target.value }))
                      }
                      className="w-full text-sm bg-white border-blue-200 text-gray-700 placeholder-gray-400 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 px-1 mb-4">
            <h3 className="text-base font-medium text-gray-700">Payment Method</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              {PaymentMethodsOption.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center p-2 sm:p-3 rounded-lg border cursor-pointer transition-all duration-150 hover:bg-yellow-50 ${
                    selectedMethod === method.id ? 'border-blue-600 bg-blue-50' : 'border-blue-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={() => handleMethodSelect(method)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedMethod === method.id ? 'border-blue-600 bg-blue-600' : 'border-blue-200'
                    }`}
                  >
                    {selectedMethod === method.id && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                  <div className="relative w-9 h-5 sm:w-10 sm:h-6 flex-shrink-0  overflow-hidden">
                    <Image
                      src={method.img}
                      alt={method.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 10vw"
                      className="object-contain p-0.5 transition-transform duration-150 hover:scale-105"
                    />
                  </div>
                  <div className="flex-1 ml-3">
                    <div className="font-medium text-gray-900 text-sm">{method.name}</div>
                    <div className="text-xs text-gray-600">{method.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-blue-100 pt-3">
            <div className="flex sm:items-center flex-col sm:flex-row justify-start sm:justify-between">
              <div className="sm:flex hidden flex-row gap-3 items-center">
                <div className="text-base font-medium text-gray-700">Total:</div>
                <div className="text-base font-bold text-[var(--colour-fsP2)]">Rs. {subtotal.toFixed(2)}</div>
              </div>
              <div className="flex gap-2 justify-end mt-3 sm:mt-0 sm:gap-3">
                <Button
                  variant="outline"
                  className="px-3 py-1.5 text-sm border-blue-200 cursor-pointer text-blue-600  hover:border-blue-300 hover:text-blue-700 transition-all duration-150 focus:ring-1 focus:ring-blue-600"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlesubmit}
                  className="px-4 py-1.5 text-sm font-medium rounded-lg cursor-pointer flex items-center gap-1.5 bg-[var(--colour-fsP2)] text-white hover:bg-[var(--colour-fsP1)] transition-all duration-150 focus:ring-1 focus:ring-blue-600"
                >
                  Purchase Now
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliverySection;