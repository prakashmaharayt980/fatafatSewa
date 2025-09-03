'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Search, ArrowLeft, Calculator, DollarSign, Calendar, Percent, ArrowRight } from 'lucide-react';
import { useContextCart } from './CartContext';
import RemoteServices from '../api/remoteservice';
import Image from 'next/image';

export default function EMICalculator() {
  const { emicalclatorinfo, setemicalclatorinfo,setEmiContextInfo } = useContextCart();
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(10);
  const [tenure, setTenure] = useState(12);
  const [showSchedule, setShowSchedule] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedBank, setSelectedBank] = useState(emicalclatorinfo.emirequiredinfo.bank || '');

  // Mock bank list (replace with your actual bank data)
  const banks = [
    { id: '1', name: 'Nepal Bank Limited', rate: 10 },
    { id: '2', name: 'Himalayan Bank', rate: 9.5 },
    { id: '3', name: 'Nabil Bank', rate: 10.2 },
  ];

  // Update loan amount and interest rate when product or bank is selected
  useEffect(() => {
    if (emicalclatorinfo.productselected) {
      setLoanAmount(emicalclatorinfo.productselected.price - emicalclatorinfo.emirequiredinfo.Downpayment);
    }
    if (selectedBank) {
      const bank = banks.find((b) => b.id === selectedBank);
      if (bank) {
        setInterestRate(bank.rate);
        setemicalclatorinfo((prev) => ({
          ...prev,
          emirequiredinfo: { ...prev.emirequiredinfo, bank: bank.name },
        }));
      }
    }
  }, [emicalclatorinfo.productselected, emicalclatorinfo.emirequiredinfo.Downpayment, selectedBank]);

  // Search and filter products
  useEffect(() => {
    if (searchQuery.trim()) {
      RemoteServices.SerachProducts(searchQuery.trim()).then(res => {
        setFilteredProducts(res.data);
      }).catch(e => console.log('error', e));
    } else {
      setFilteredProducts([]);
    }
  }, [searchQuery]);

  // EMI Calculation
  const calculateEMI = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const months = tenure;
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayable = emi * months;
    const totalInterest = totalPayable - principal;
    return { emi: emi.toFixed(2), totalPayable: totalPayable.toFixed(2), totalInterest: totalInterest.toFixed(2) };
  };

  // Amortization Schedule
  const generateAmortizationSchedule = () => {
    const schedule = [];
    let balance = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const months = tenure;
    const emi = parseFloat(calculateEMI().emi);

    for (let i = 1; i <= months; i++) {
      const interest = balance * monthlyRate;
      const principalPaid = emi - interest;
      balance -= principalPaid;
      schedule.push({
        month: i,
        emi: emi.toFixed(2),
        principal: principalPaid.toFixed(2),
        interest: interest.toFixed(2),
        balance: Math.max(balance, 0).toFixed(2),
      });
    }
    return schedule;
  };

  const handleProductSelect = (product) => {
    setemicalclatorinfo((prev) => ({
      ...prev,
      productselected: product,
    }));
    setSearchQuery('');
    setFilteredProducts([]);
  };

  const handleBackToSearch = () => {
    setemicalclatorinfo((prev) => ({
      ...prev,
      productselected: null,
      emirequiredinfo: { ...prev.emirequiredinfo, bank: '' },
    }));
    setLoanAmount(100000);
    setSelectedBank('');
    setInterestRate(10);
  };

  const { emi, totalPayable, totalInterest } = calculateEMI();

  const currencySymbol = 'Rs.'

  return (
    <Drawer
      open={emicalclatorinfo.isEmiCalcltorOpen}
      onOpenChange={() =>
        setemicalclatorinfo((prev) => ({ ...prev, isEmiCalcltorOpen: false }))
      }
    >
      <DrawerContent className="max-h-[85vh] min-h-[60vh] max-w-6xl mx-auto bg-white border-0 shadow-xl">
        <DrawerHeader className="text-center  m-0 p-0 items-center border-b-gray-200 border-b  ">
          <DrawerTitle className="flex items-center justify-center gap-2 m-0 p-0 text-xl text-[var(--colour-fsP2)] font-semibold">
            <CreditCard className="w-5 h-5 text-[var(--colour-fsP1)] mb-2" />
            <span className=' items-center mb-2'>         EMI Calculator - {emicalclatorinfo.productselected?.name
              ? emicalclatorinfo.productselected.name.length > 45
                ? emicalclatorinfo.productselected.name.slice(0, 45) + '...'
                : emicalclatorinfo.productselected.name
              : 'Select Product'}

            </span>
          </DrawerTitle>
        </DrawerHeader>

        <div className="p-4 overflow-y-auto">
          {/* Product Search */}
          {!emicalclatorinfo.productselected && (
            <div className="mb-4">


              <div className="flex rounded-full border border-gray-300 bg-gray-50 hover:bg-white hover:border-blue-300 transition-all duration-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-200">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a product..."
                  className="w-full px-4 py-2 bg-transparent border-none focus:outline-none text-sm placeholder-gray-500"
                />
                <button className="bg-blue-600 text-white px-3 py-1.5 m-0.5 hover:bg-blue-700 transition-colors rounded-full duration-200 flex items-center justify-center">
                  <Search className="w-4 h-4" />
                </button>
              </div>
              {filteredProducts.length > 0 && (
                <div className="mt-2 max-h-56 overflow-auto bg-white border border-gray-200 rounded-md shadow-sm">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                      onClick={() => handleProductSelect(product)}
                    >
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-8 h-8 object-contain rounded mr-3 border border-gray-100"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                        <p className="text-xs text-gray-600">  {currencySymbol}{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {emicalclatorinfo.productselected && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left: Product Info */}
              <div className="lg:col-span-1 bg-gray-50 rounded-lg px-3">
                <Button
                  variant="ghost"
                  onClick={handleBackToSearch}
                  className=" m-0  h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs p-2"
                >
                  <ArrowLeft className="w-3 h-3 mr-1" />
                  Change Product
                </Button>

                <div className="text-center">
                  {emicalclatorinfo.productselected.image && (
                    <Image
                      src={emicalclatorinfo.productselected.image}
                      alt={emicalclatorinfo.productselected.name}
                      className="object-contain mb-3 bg-white rounded border border-gray-200"
                      width={400}
                      height={500}
                    />
                  )}
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{emicalclatorinfo.productselected.name}</h3>
                  <p className="text-lg font-bold text-blue-600">  {currencySymbol}{emicalclatorinfo.productselected.price}</p>
                </div>
              </div>

              {/* Center: Calculator Inputs */}
              <div className="lg:col-span-1 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Emi Terms</h3>

                <div>

                  <Select value={selectedBank} onValueChange={setSelectedBank}>
                    <SelectTrigger className="border-gray-300 w-full focus:ring-gray-200 focus:border-none focus:outline-none outline-none">
                      <SelectValue placeholder="Select your bank" />
                    </SelectTrigger>
                    <SelectContent className="border-gray-300 bg-blue-50 focus:ring-gray-200 focus:border-none w-full">
                      <SelectItem value="nabil">Nabil Bank</SelectItem>
                      <SelectItem value="nica">NIC Asia Bank</SelectItem>
                      <SelectItem value="everest">Everest Bank</SelectItem>
                      <SelectItem value="standard">Standard Chartered</SelectItem>
                      <SelectItem value="himalayan">Himalayan Bank</SelectItem>
                      <SelectItem value="global">Global IME Bank</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Downpayment */}
                <div>
                  <label className=" text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">

                    Downpayment `({currencySymbol})`
                  </label>
                  <Input
                    type="number"
                    value={emicalclatorinfo.emirequiredinfo.Downpayment}
                    onChange={(e) =>
                      setemicalclatorinfo((prev) => ({
                        ...prev,
                        emirequiredinfo: { ...prev.emirequiredinfo, Downpayment: Number(e.target.value) },
                      }))
                    }
                    className="h-9 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"

                    max={emicalclatorinfo.productselected.price}
                  />
                </div>

                {/* Loan Amount */}
                <div>
                  <label className=" text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Calculator className="w-3 h-3" />
                    Principal Amount (  {currencySymbol})
                  </label>
                  <Input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="h-9 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    min={1000}
                    max={emicalclatorinfo.productselected.price}
                  />
                </div>

                {/* Interest Rate */}
                <div>
                  <label className=" text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Percent className="w-3 h-3" />
                    Interest Rate (% p.a.)
                  </label>
                  <Input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="h-9 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    min={1}
                    max={30}
                    step={0.1}
                    disabled={selectedBank !== ''}
                  />
                </div>




                <div>
                  <label className=" text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Tenure (Months)
                  </label>
                  <Select onValueChange={(value) => setTenure(Number(value))}>
                    <SelectTrigger className="border-gray-300 w-full focus:ring-gray-200 focus:border-none focus:outline-none outline-none">
                      <SelectValue placeholder="Select  Duration " />
                    </SelectTrigger>
                    <SelectContent className="border-gray-300 bg-blue-50 focus:ring-gray-200 focus:border-none w-full">
                      <SelectItem value="6">6 Months</SelectItem>
                      <SelectItem value="9">9 Months</SelectItem>
                      <SelectItem value="12">12 Months</SelectItem>
                      <SelectItem value="18">18 Months</SelectItem>
                      <SelectItem value="24">24 Months</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Right: Results */}
              <div className="lg:col-span-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Loan Summary</h3>

                {/* Results Cards */}
                <div className="space-y-2">
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Monthly EMI</span>
                      <span className="text-lg font-bold text-blue-600">  {currencySymbol}{emi}</span>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Total Interest</span>
                      <span className="text-sm font-semibold text-red-600">  {currencySymbol}{totalInterest}</span>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Total Payable</span>
                      <span className="text-sm font-semibold text-gray-900">  {currencySymbol}{totalPayable}</span>
                    </div>
                  </div>
                </div>

                {/* Schedule Toggle */}
                <Button
                  onClick={() => setShowSchedule(!showSchedule)}
                  variant={showSchedule ? "secondary" : "default"}
                  className="w-full mt-3 h-8 text-xs"
                >
                  {showSchedule ? 'Hide Schedule' : 'Show Schedule'}
                </Button>
              </div>
            </div>
          )}

          {/* Amortization Schedule */}
          {showSchedule && emicalclatorinfo.productselected && (
            <div className="mt-4 bg-white border border-gray-200 rounded-lg">
              <div className="p-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900">Payment Schedule</h3>
              </div>

              <div className="overflow-x-auto">
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">Month</th>
                        <th className="px-3 py-2 text-right font-medium text-gray-700">EMI</th>
                        <th className="px-3 py-2 text-right font-medium text-gray-700">Principal</th>
                        <th className="px-3 py-2 text-right font-medium text-gray-700">Interest</th>
                        <th className="px-3 py-2 text-right font-medium text-gray-700">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generateAmortizationSchedule().map((row, index) => (
                        <tr key={row.month} className={index % 2 === 0 ? 'bg-gray-25' : 'bg-white'}>
                          <td className="px-3 py-2 text-gray-900">{row.month}</td>
                          <td className="px-3 py-2 text-right text-gray-900">  {currencySymbol}{row.emi}</td>
                          <td className="px-3 py-2 text-right text-gray-700">  {currencySymbol}{row.principal}</td>
                          <td className="px-3 py-2 text-right text-gray-700">  {currencySymbol}{row.interest}</td>
                          <td className="px-3 py-2 text-right text-gray-700">  {currencySymbol}{row.balance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        <DrawerFooter className="border-t border-gray-100 py-2 px-4">
          <div className="flex justify-end">
            {emicalclatorinfo.productselected === null ?
              (
                <DrawerClose asChild>
                  <Button variant="outline" className="h-8 px-4 text-xs border-gray-200 text-gray-700 hover:bg-gray-50">
                    Close
                  </Button>
                </DrawerClose>
              ) :
              (<button
                onClick={()=>{
                  setemicalclatorinfo(prev=>({...prev,isEmiCalcltorOpen:false}))
                  setEmiContextInfo(prev=>({...prev,isDrawerOpen:true,product:emicalclatorinfo.productselected}))
                }}

                className={`px-6 py-2 font-medium rounded-lg flex items-center gap-2 transition-colors bg-[var(--colour-fsP1)] text-white hover:bg-blue-700 `}
              >
                Appy Now <ArrowRight className="w-4 h-4" />
              </button>)
            }



          </div>


        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}