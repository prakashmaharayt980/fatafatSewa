'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

import img2 from '../../../public/imgfile/banner2.jpeg'
import { useContextCart } from '../checkout/CartContext';
import ProductEMIUI from './EmiProduct';

import { Label } from '@/components/ui/label';


const EMICalculator = () => {

    const { emicalclatorinfo, setemicalclatorinfo } = useContextCart();
    const [downPaymentOption, setDownPaymentOption] = useState('none');
    const [tenure, setTenure] = useState(3);
    const [selectedBank, setSelectedBank] = useState('global');
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
    );

    // Memoize banks array
    const banks = useMemo(
        () => [
            { id: 'nabil', name: 'Nabil Bank', rate: 11.5, img: '/imgfile/bankingPartners7.png' },
            { id: 'global', name: 'Global IME Bank', rate: 12, img: '/imgfile/bankingPartners1.png' },
            { id: 'nmb', name: 'NMB Bank', rate: 11.75, img: '/imgfile/bankingPartners3.png' },
            { id: 'siddhartha', name: 'Siddhartha Bank', rate: 12.25, img: '/imgfile/bankingPartners9.png' },
            { id: 'NicAsia', name: 'Nic Asia Bank', rate: 12.25, img: '/imgfile/bankingPartners11.png' },
            { id: 'hbl', name: 'Himalayan Bank', rate: 12.25, img: '/imgfile/bankingPartners10.png' },
            { id: 'sanimabank', name: 'Sanima Bank', rate: 12.25, img: '/imgfile/bankingPartners8.png' },
            { id: 'kumari', name: 'Kumari Bank', rate: 12.25, img: '/imgfile/bankingPartners6.png' },
        ],
        []
    );

    const tenureOptions = [ 9, 12, 18, 24, 36];



    // Memoize EMI calculation with error handling
    const emiData = useMemo(() => {
        if (!productPrice || productPrice <= 0) {
            return {
                downPayment: 0,
                loanAmount: 0,
                monthlyEMI: 0,
                totalInterest: 0,
                totalPayment: 0,
                bank: banks.find((b) => b.id === selectedBank) || banks[0],
            };
        }

        const downPaymentAmount = downPaymentOption === '40%' ? productPrice * 0.4 : 0;
        const loanAmount = productPrice - downPaymentAmount;
        const bank = banks.find((b) => b.id === selectedBank) || banks[0];
        const monthlyRate = bank.rate / 100 / 12;
        const numberOfPayments = tenure;

        const emi =
            (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

        const totalPayment = emi * numberOfPayments;
        const totalInterest = totalPayment - loanAmount;

        return {
            downPayment: downPaymentAmount,
            loanAmount,
            monthlyEMI: emi,
            totalInterest,
            totalPayment,
            bank,
        };
    }, [productPrice, downPaymentOption, tenure, selectedBank, banks]);

    // Typing effect for animated text
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
        console.log('Selected Variants:', selectedAttribute);
        const price = selectedAttribute.length > 0 ? selectedAttribute[0].price : emicalclatorinfo.productselected?.price || 0;
        setProductPrice(Number(price));

        return selectedAttribute;
    };




    return (
        <div className="max-w-6xl mx-auto py-6 bg-gray-50 min-h-screen">
            <Label className='w-full mx-auto items-center justify-center font-semibold flex text-xl text-[var(--colour-fsP2)] '>
                Calculate EmI OF Each Product
            </Label>
            <ProductEMIUI
                chooseProduct={chooseProduct}
            />
            {
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Left Panel - Calculator */}
                    <div className="bg-white rounded-lg p-2">

                        <div className="space-y-6">
                            {/* Product Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Price (Rs)
                                </label>
                                <input
                                    type="number"
                                    value={productPrice }
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setProductPrice(Number(value));
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-blue-500"
                                    placeholder="Enter the Amount"
                                    min="0"
                                    step="1"
                                    disabled
                                />
                            </div>

                            {/* Down Payment Option */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Down Payment Option
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setDownPaymentOption('none')}
                                        className={`py-3 px-4 rounded-lg font-medium ${downPaymentOption === 'none'
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

                            {/* Select Tenure */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Select Tenure (Months)
                                </label>
                                <div className=" grid grid-cols-5 gap-3">
                                    {tenureOptions.map((months) => (
                                        <button
                                            key={months}
                                            onClick={() => setTenure(months)}
                                            className={`py-3 px-3 rounded-lg text-xs gap-1 flex flex-row font-medium ${tenure === months
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            <span>{months} </span><span>Months</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Select Bank */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Select Bank
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {banks.map((bank) => (
                                        <button
                                            key={bank.id}
                                            onClick={() => setSelectedBank(bank.id)}
                                            className={`p-4 rounded-lg border-2 text-left ${selectedBank === bank.id
                                                ? 'border-blue-600 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Image
                                                    src={bank.img}
                                                    alt='bank selected'
                                                    height={100}
                                                    width={80}
                                                    className='object-contain'
                                                    quality={100}
                                                />
                                                <div>
                                                    <div className="font-medium text-gray-900/90">{bank.name}</div>
                                                    {/* <div className="text-sm text-gray-500">{bank.rate}% p.a.</div> */}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-1 flex flex-row gap-3">
                                <button
                                    onClick={() => { }} // No need for manual calculateEMI call
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center space-x-2"
                                >
                                    <Calculator size={20} />
                                    <span>Calculate EMI</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setProductPrice(emicalclatorinfo.productselected.price);
                                        setDownPaymentOption('none');
                                        setTenure(3);
                                        setSelectedBank('global');
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
                    <div className="space-y-6">
                        {/* EMI Details Card */}

                        {/* <label className="block text-lg px-5 font-medium text-[var(--colour-fsP2)] mb-2">
                      EmI Result
                  </label> */}
                        <div className="bg-white rounded-lg p-6">
                            <div className="flex items-center bg-blue-300/40 rounded-lg px-3 py-2 space-x-3 mb-6">
                                <Image
                                    src={emiData?.bank.img}
                                    alt='bank selected'
                                    height={100}
                                    width={80}
                                    className='object-contain'
                                    quality={100}
                                />
                                <div>
                                    <h3 className="font-medium text-blue-700/90">{emiData?.bank.name}</h3>
                                    {/* <p className="text-sm text-gray-600">{emiData?.bank.rate}% Interest Rate</p> */}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <p className="text-sm text-gray-600">Down Payment</p>
                                    <p className="text-xl font-semibold text-gray-900">
                                        Rs {emiData ? emiData.downPayment.toFixed(2) : '0.00'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Loan Amount</p>
                                    <p className="text-xl font-semibold text-gray-900">
                                        Rs {emiData ? emiData.loanAmount.toFixed(2) : '0.00'}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-6 bg-blue-300/40 rounded-lg px-3 py-2">
                                <p className="text-sm text-gray-600">Monthly EMI</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    Rs {emiData ? emiData.monthlyEMI.toFixed(2) : '0.00'}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-600">Total Interest</p>
                                    <p className="text-xl font-semibold text-gray-900">
                                        Rs {emiData ? emiData.totalInterest.toFixed(2) : '0.00'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Payment</p>
                                    <p className="text-xl font-semibold text-gray-900">
                                        Rs {emiData ? emiData.totalPayment.toFixed(2) : '0.00'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* EMI Eligibility Card */}
                        <div className="bg-green-300/40 rounded-lg px-3 py-2 mx-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">EMI Eligibility</h3>
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
                        <div className="flex justify-between items-center py-4 px-8  border-b border-gray-300 ">
                            <div className="text-lg font-medium text-gray-800">
                                {currentText}
                                <span className="text-blue-600 animate-pulse">|</span>
                            </div>
                            <Button className="px-6 bg-blue-900 text-white" >
                                Apply Now
                            </Button>
                        </div>
                        <div
                            className={cn(
                                'w-full  relative overflow-hidden rounded-lg group cursor-pointer',
                                'transition-all duration-300 hover:shadow-lg'
                            )}
                        // onClick={() => router.push(image1Link)}
                        >
                            <Image
                                src={img2}
                                alt={'img 2'}
                                width={600}
                                height={300}
                                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                                priority
                            />
                        </div>
                    </div>
                </div>
            }


        </div>
    );
};

export default EMICalculator;