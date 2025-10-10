'use client';
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Send, Phone } from 'lucide-react';
import { useContextCart } from './CartContext';
import Image from 'next/image';
import { PaymentMethodsOptions } from '../CommonVue/Payment';
import AddressSelectionUI from './AddressSectionUi';
import CheckoutProduct from './CheckoutProduct';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';


const DeliverySection = () => {
  
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const {
    calculateSubtotal,

    items

  } = useContextCart();
   const subtotal = calculateSubtotal();
const router = useRouter()

  const [openSections, setOpenSections] = useState({
    address: true,
    customer: false,
    paymentmethod: false
  });
  const [selectedMethod, setSelectedMethod] = useState(null);



  const [submittedvaluelist, setsubmittedvaluelist] = useState({
    paymentmethod: '',
    address: address,
    receiverNO: '',
    promoCode: '',
    products: items,
    totalpayment: subtotal,
    appliedPromo:null

  })




 

  const handleMethodSelect = (method) => {
    setSelectedMethod(method.id);
    setsubmittedvaluelist(pev => ({ ...pev, paymentmethod: method.name }))

    console.log('Selected payment method:', method);
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };






  const handlesubmit = () => {
    try {
      setsubmittedvaluelist(pev => ({ ...pev, products: items }))
      setTimeout(() => {
        router.push('/checkout/Successpage')
      }, 2000);
      console.log('product buy', submittedvaluelist)


    } catch (error) {
      console.log('eee', error)
    }
  }

  const isAddressComplete = address.street && address.city && address.state && address.zipCode;

  const sectionStatus = {
    address: isAddressComplete,
    customer: submittedvaluelist.receiverNO.trim() !== '',
    paymentmethod: submittedvaluelist.paymentmethod !== ''
  };

  const PaymentMethodsOption = [
    ...PaymentMethodsOptions,
    { name: "Cash on Delivery", img: "/imgfile/handshakeIcon.webp", id: 6, description: "Pay with cash upon delivery." },
  ];

  const handleApplyPromo = () => {
    if (submittedvaluelist.promoCode.toUpperCase() === 'SAVE10') {

      setsubmittedvaluelist(pev => ({ ...pev,  appliedPromo: { code: 'SAVE10', discount: 10 } }))
    } else if (submittedvaluelist.promoCode) {
      alert('Invalid promo code');
    }
  };

  const handleRemovePromo = () => {
    setsubmittedvaluelist(pev => ({ ...pev, promoCode: '', appliedPromo: null }))

  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 max-w-6xl mx-auto px-4 py-3 bg-gray-50 min-h-screen">
      <div className="sm:col-span-2">
        <CheckoutProduct setsubmittedvaluelist={setsubmittedvaluelist} submittedvaluelist={submittedvaluelist} handleApplyPromo={handleApplyPromo} />
      </div>
      <div className="sm:col-span-3 bg-white rounded-lg shadow-sm border h-fit border-gray-100 p-3">
        <div className="mb-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900 text-base ">Delivery Information</h3>
            <div className="text-xs text-gray-500 font-medium">
              {Object.values(sectionStatus).filter(Boolean).length}/3 completed
            </div>
          </div>

          <div className="space-y-3">
            <AddressSelectionUI setsubmittedvaluelist={setsubmittedvaluelist} />

            <div className="border-none mb-2">
              <button
                onClick={() => toggleSection('customer')}
                className="w-full py-1.5 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-md"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${sectionStatus.customer ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}>
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
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {openSections.customer && (
                <div className="mx-1 max-w-lg pb-1 pl-5">
                  <input
                    type="text"
                    placeholder="Enter Your Contact Information"
                    value={submittedvaluelist.receiverNO}
                    maxLength={10}
                    onChange={(e) => setsubmittedvaluelist(pev => ({ ...pev, receiverNO: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent text-sm"
                  />
                </div>
              )}
            </div>


          </div>
        </div>

        <div className="space-y-3 px-1 mb-3">
          <h3 className="text-base font-semibold text-gray-900">Payment Method</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PaymentMethodsOption.map((method) => (
              <label
                key={method.id}
                className={`flex items-center p-2 rounded-md border cursor-pointer transition-all hover:bg-gray-50 ${selectedMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
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
                  className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${selectedMethod === method.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}
                >
                  {selectedMethod === method.id && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <Image src={method.img} alt={method.name} width={36} height={20} className="object-contain mr-3" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">{method.name}</div>
                  <div className="text-xs text-gray-500">{method.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 px-1 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-row gap-3 items-center">
              <div className="text-lg text-[var(--colour-fsP1)] font-medium">Total:</div>
              <div className="text-lg font-bold text-[var(--colour-fsP2)]">Rs. {subtotal.toFixed(2)}</div>
            </div>
            <div className="flex gap-2">
              <Button
                className="px-3 py-1.5 text-gray-600 hover:text-gray-800 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Button>
              <Button
                onClick={handlesubmit}
                className="px-4 py-1.5 font-medium rounded-md flex items-center gap-1.5 bg-green-700 text-white hover:bg-blue-700 transition-colors"
              >
                Purchase Now
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliverySection;