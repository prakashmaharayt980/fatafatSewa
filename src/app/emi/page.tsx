'use client'

import React, { useState, useEffect, useMemo, use } from 'react';
import { Calculator, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

import img2 from '../../../public/imgfile/banner2.jpeg'
import { useContextCart } from '../checkout/CartContext';
import ProductEMIUI from './EmiProduct';

import { Label } from '@/components/ui/label';
import { useContextEmi } from './emiContext';


const EMICalculator = () => {

    const { emicalclatorinfo, setemicalclatorinfo } = useContextCart();
    const { emiCalculation, AvailablebankProvider } = useContextEmi()
    const [downPaymentOption, setDownPaymentOption] = useState<number | string>(0)
    const [tenure, setTenure] = useState(3);
    const [selectedBank, setSelectedBank] = useState({
        id: 'global',
        name: 'Global IME Bank',
        rate: 12,
        img: '/imgfile/bankingPartners1.png',
        tenureOptions: [12, 24, 36]
    })

    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [productPrice, setProductPrice] = useState(0);


    // Memoize texts array
    const texts = useMemo(
        () => [
            'Available for Mobile Devices',
            'Enjoy your time',
            'Apply Now to Buy with EMI Services',
            'Check Out Our EMI Terms',
        ],
        []
    )


    const emiData = useMemo(() => emiCalculation(
        productPrice,
        tenure,
        downPaymentOption,
        selectedBank.id
    ), [productPrice, tenure, downPaymentOption, selectedBank.id, emiCalculation])


    useEffect(() => {
        const fullText = texts[currentTextIndex];
        const timeout = setTimeout(() => {
            if (!isDeleting) {
                if (currentText.length < fullText.length) {
                    setCurrentText(fullText.substring(0, currentText.length + 1));
                } else {
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            } else {
                if (currentText.length > 0) {
                    setCurrentText(fullText.substring(0, currentText.length - 1));
                } else {
                    setIsDeleting(false);
                    setCurrentTextIndex((prev) => (prev + 1) % texts.length);
                }
            }
        }, isDeleting ? 50 : 120);

        return () => clearTimeout(timeout);
    }, [currentText, isDeleting, currentTextIndex, texts]);


    const chooseProduct = (col: string) => {
        const selectedAttribute = emicalclatorinfo.productselected.variants?.filter((item) => item.attributes.Color === col) || [];

        const price = selectedAttribute.length > 0 ? selectedAttribute[0].price : emicalclatorinfo.productselected?.price || 0;
        setProductPrice(Number(price));

        return selectedAttribute;
    };




    return (
        <div className="max-w-6xl mx-auto py-3 sm:py-6 px-2 sm:px-4 bg-gray-50 min-h-screen">
            <Label className='w-full mx-auto items-center justify-center font-semibold flex text-base sm:text-xl text-[var(--colour-fsP2)]'>
                Calculate EMI OF Each Product
            </Label>
            <ProductEMIUI chooseProduct={chooseProduct} setProductPrice={setProductPrice} />
            {
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4">
                    {/* Left Panel - Calculator */}
                    <div className="bg-white rounded-lg p-2 sm:p-4">
                        <div className="space-y-4 sm:space-y-6">
                            {/* Product Price */}
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                    Product Price (Rs)
                                </label>
                                <input
                                    type="number"
                                    value={productPrice}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setProductPrice(Number(value));
                                    }}
                                    className="w-full px-2 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-blue-500"
                                    placeholder="Enter the Amount"
                                    min="0"
                                    step="1"
                                    disabled
                                />
                            </div>

                            {/* Down Payment Option */}
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                                    Down Payment Option
                                </label>
                                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                    <button
                                        onClick={() => setDownPaymentOption(0)}
                                        className={`py-3 px-4 rounded-lg font-medium ${downPaymentOption === 0
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        No Down Payment
                                    </button>
                                    <button
                                        onClick={() => setDownPaymentOption('40%')}
                                        className={`py-3 px-4 rounded-lg font-medium ${downPaymentOption === '40%'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        40% Down Payment
                                    </button>
                                </div>
                            </div>

                            {/* Select Bank */}
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                                    Select Bank
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                    {AvailablebankProvider.map((bank) => (
                                        <button
                                            key={bank.id}
                                            onClick={() => setSelectedBank(bank)}
                                            className={`p-2 sm:p-4 rounded-lg border-2 text-left ${selectedBank.id === bank.id
                                                ? 'border-blue-600 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-2 sm:space-x-3">
                                                <Image
                                                    src={bank.img}
                                                    alt='bank selected'
                                                    height={100}
                                                    width={80}
                                                    className='object-contain w-16 sm:w-20'
                                                    quality={100}
                                                />
                                                <div>
                                                    <div className="font-medium text-xs sm:text-sm text-gray-900/90">{bank.name}</div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Select Tenure */}
                            {
                                selectedBank && (
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                                            Select Tenure (Months)
                                        </label>
                                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
                                            {selectedBank?.tenureOptions.map((months) => (
                                                <button
                                                    key={months}
                                                    onClick={() => setTenure(months)}
                                                    className={`py-2 sm:py-3 px-2 sm:px-3 rounded-lg text-[10px] sm:text-xs gap-1 flex flex-row font-medium ${tenure === months
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    <span>{months} </span><span>Months</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )
                            }



                            {/* Action Buttons */}
                            <div className="space-y-1 flex flex-col sm:flex-row gap-2 sm:gap-3">
                                <button
                                    onClick={() => { }}
                                    className="w-full bg-blue-600 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-sm sm:text-base font-medium hover:bg-blue-700 flex items-center justify-center space-x-2"
                                >
                                    <Calculator size={16} className="sm:w-5 sm:h-5" />
                                    <span>Calculate EMI</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setProductPrice(emicalclatorinfo.productselected.price);
                                        setDownPaymentOption(0);
                                        setTenure(3);
                                        setSelectedBank({
                                            id: 'global',
                                            name: 'Global IME Bank',
                                            rate: 12,
                                            img: '/imgfile/bankingPartners1.png',
                                            tenureOptions: [12, 24, 36]
                                        });
                                    }}

                                    className="w-full bg-gray-200 text-gray-800 py-1 px-4 rounded-lg font-medium hover:bg-gray-200 flex items-center justify-center space-x-2"
                                >
                                    <Calculator size={20} />
                                    <span>   Reset</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - EMI Details */}
                    <div className="space-y-4 sm:space-y-6">
                        <div className="bg-white rounded-lg p-3 sm:p-6">
                            <div className="flex items-center bg-blue-300/40 rounded-lg px-2 sm:px-3 py-2 space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                                <Image
                                    src={selectedBank.img}
                                    alt='bank selected'
                                    height={100}
                                    width={80}
                                    className='object-contain w-16 sm:w-20'
                                    quality={100}
                                />
                                <div>
                                    <h3 className="font-medium text-sm sm:text-base text-blue-700/90">{selectedBank.name}</h3>
                                </div>
                            </div>

                            {/* EMI Details Grid */}
                            <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-6">
                                <div>
                                    <p className="text-sm sm:text-base text-gray-600">Down Payment</p>
                                    <p className="text-xl font-semibold text-gray-900">
                                        Rs {emiData ? emiData.downPayment : '0.00'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm sm:text-base text-gray-600">Finance Amount</p>
                                    <p className="text-xl font-semibold text-red-600">
                                        Rs {emiData ? emiData.financeAmount.toFixed(2) : '0.00'}
                                    </p>
                                </div>
                            </div>

                            {/* Monthly EMI Section */}
                            <div className="mb-4 sm:mb-6 bg-blue-300/40 rounded-lg px-2 sm:px-3 py-2">
                                <p className="text-xs sm:text-sm text-gray-600">Monthly EMI</p>
                                <p className="text-xl sm:text-2xl font-bold text-blue-600">
                                    Rs {emiData ? emiData.paymentpermonth.toFixed(2) : '0.00'}
                                </p>
                            </div>

                            {/* Total Amounts Grid */}
                            <div className="grid grid-cols-1 gap-3 sm:gap-6">
                                {
                                    downPaymentOption === '40%' ? (
                                        <div>
                                            <p className="text-sm sm:text-base text-green-600">No Additional Charge will be taken</p>

                                        </div>
                                    ) : (
                                        <p className="text-sm sm:text-base text-red-600">Additional Charge will be taken based on Bank interest</p>
                                    )
                                }



                            </div>
                        </div>

                        {/* EMI Eligibility Card */}
                        <div className="bg-green-300/40 rounded-lg px-2 sm:px-3 py-2 mx-2 sm:mx-4">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">EMI Eligibility</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="text-green-500" size={16} />
                                    <span className="text-gray-700">Age: 21-65 years</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="text-green-500" size={16} />
                                    <span className="text-gray-700">Minimum Income: Rs 25,000/month</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="text-green-500" size={16} />
                                    <span className="text-gray-700">Employment: 6+ months at current job</span>
                                </div>
                            </div>
                        </div>

                        {/* Partner Banks Card */}
                        <div className="flex flex-col sm:flex-row justify-between items-center py-2 sm:py-4 px-4 sm:px-8 border-b border-gray-300">
                            <div className="text-base sm:text-lg font-medium text-gray-800 mb-2 sm:mb-0">
                                {currentText}
                                <span className="text-blue-600 animate-pulse">|</span>
                            </div>
                            <Button className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-900 text-white text-sm sm:text-base">
                                Apply Now
                            </Button>
                        </div>

                        {/* Banner Image */}
                        <div className={cn(
                            'w-full relative overflow-hidden rounded-lg group cursor-pointer',
                            'transition-all duration-300 hover:shadow-lg'
                        )}>
                            <Image
                                src={img2}
                                alt={'img 2'}
                                width={600}
                                height={300}
                                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default EMICalculator;