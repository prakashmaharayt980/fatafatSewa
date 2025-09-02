"use client";

import React from 'react';
import { CheckCircle, Package, MapPin, Clock, Phone, Star, X, ShoppingBag } from 'lucide-react';
import { useContextCart } from './CartContext';

const CheckoutSuccess = () => {
  const {orderSuccess, setOrderSuccess} = useContextCart()

  const orderDetails = {
    orderId: "#ELEC-2025-001234",
    amount: "Rs. 45,999",
    paymentMethod: "Khalti",
    estimatedDelivery: "2-3 Business Days",
    deliveryAddress: {
      label: "Home",
      street: "123 Tech Street",
      city: "Kathmandu",
      state: "Bagmati",
    },
    items: [
      {
        name: "Samsung Galaxy S23 (8GB RAM, 256GB)",
        price: "Rs. 35,999",
        qty: 1,
        image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&h=600&fit=crop"
      },
      {
        name: "JBL Wireless Earbuds",
        price: "Rs. 7,499",
        qty: 1,
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop"
      },
      {
        name: "USB-C Charger (65W)",
        price: "Rs. 2,499",
        qty: 1,
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop"
      },
    ],
  };

  const handleClose = () => {
    setOrderSuccess(false);
  };

  const handleTrackOrder = () => {
    console.log('Track order clicked');
  };

  const handleContinueShopping = () => {
    console.log('Continue shopping clicked');
    setOrderSuccess(false);
  };

  const handleRateOrder = () => {
    console.log('Rate order clicked');
  };

  if (!orderSuccess) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">

        {/* Header Section */}
        <div className="relative bg-[var(--colour-fsP2)] px-6 py-8 text-center">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Order Confirmed!
          </h2>
          <p className="text-emerald-100 text-sm">
            Thank you for shopping with Fatafatsewa
          </p>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">

          {/* Order Summary Card */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-semibold text-gray-900">{orderDetails.orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900">{orderDetails.amount}</p>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">Payment via <span className="font-medium text-gray-900">{orderDetails.paymentMethod}</span></p>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-700" />
              Delivery Information
            </h3>

            <div className="space-y-3 pl-7">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Estimated Delivery</p>
                  <p className="text-sm text-gray-600">{orderDetails.estimatedDelivery}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{orderDetails.deliveryAddress.label}</p>
                  <p className="text-sm text-gray-600">
                    {orderDetails.deliveryAddress.street}<br />
                    {orderDetails.deliveryAddress.city}, {orderDetails.deliveryAddress.state}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Items Ordered</h3>
            <div className="space-y-3">
              {orderDetails.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-md border"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 leading-tight">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Qty: {item.qty}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{item.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="gap-3 justify-end flex flex-row">
            <button
              onClick={handleTrackOrder}
              className=" bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-full font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              Track Your Order
            </button>

            <button
              onClick={handleContinueShopping}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-full font-medium transition-colors duration-200 flex items-center gap-2 text-sm"
            >
              <ShoppingBag className="w-3 h-3" />
              Continue Shopping
            </button>
            <button
              onClick={handleRateOrder}
              className="bg-yellow-200 hover:bg-yellow-300 text-yellow-800 py-2 px-4 rounded-full font-medium transition-colors duration-200 flex items-center gap-2 text-sm"
            // className=" py-2 px-4 rounded-full font-medium transition-colors duration-200 flex items-center gap-2 text-sm"
            >
              <Star className="w-3 h-3" />
              Rate Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;