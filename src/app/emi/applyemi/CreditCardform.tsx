'use client'

import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useContextEmi } from "../emiContext";
import { Input } from "@/components/ui/input";

export default function CreditCardComponent({ cardinfofield }) {
  const { AvailablebankProvider } = useContextEmi();

  // Extract expiryDate and cardLimit fields
  const expiryField = cardinfofield.fields.find(field => field.name === "expiryDate");
  const limitField = cardinfofield.fields.find(field => field.name === "cardLimit");

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 flex items-center justify-center py-4 sm:py-6">
      <div className="">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6">
          {/* Card Image Section */}
          <div className="w-full sm:w-1/2  rounded-lg p-4 flex items-center justify-center">
            <Image
              src="/svgfile/creditCardUi.svg"
              alt="Credit Card UI"
              height={300}
              width={300}
              className="object-contain w-[200px] sm:w-[300px]"
              priority
            />
          </div>

          {/* Input Section */}
          <div className="w-full sm:w-1/2 space-y-4">
            {/* Loop through fields, excluding expiryDate and cardLimit */}
            {cardinfofield.fields
              .filter(field => field.name !== "expiryDate" && field.name !== "cardLimit")
              .map((field, fieldIndex) => (
                <div key={fieldIndex}>
                  <Label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {field.label}
                  </Label>
                  <div className="relative">
                    {field.type === "select" ? (
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange({ target: { value } })}
                      >
                        <SelectTrigger className="w-full h-10 pl-10 bg-white border-blue-200 text-gray-600 text-sm rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all duration-150">
                          <SelectValue placeholder={`Select ${field.label}`} className="text-yellow-400" />
                          <Image
                            src={field.svgicon}
                            alt={field.label}
                            height={16}
                            width={16}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600"
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-blue-100 rounded-lg shadow-lg max-h-60 overflow-y-auto z-[1000] text-sm">
                          {field.options ? (
                            field.options.map((option) => (
                              <SelectItem
                                key={option}
                                value={option}
                                className="cursor-pointer px-4 py-2 hover:bg-yellow-50 hover:text-blue-600 focus:bg-yellow-100 focus:text-blue-600 transition-all duration-150"
                              >
                                {option}
                              </SelectItem>
                            ))
                          ) : (
                            AvailablebankProvider.map((bank) => (
                              <SelectItem
                                key={bank.id}
                                value={bank.name}
                                className="cursor-pointer px-4 py-2 hover:bg-yellow-50 hover:text-blue-600 focus:bg-yellow-100 focus:text-blue-600 transition-all duration-150"
                              >
                                {bank.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="relative">
                        <Input
                          type="text"
                          name={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={field.placeholder}
                          maxLength={field.maxLength}
                          max={field?.maxvalue}
                          className="w-full h-10 pl-10 bg-white border-blue-200 text-gray-600 text-sm rounded-lg focus:border-transparent focus:ring-1 focus:ring-blue-600 focus-visible:ring-[1px] placeholder-yellow-400 transition-all duration-150"
                        />
                        <Image
                          src={field.svgicon}
                          alt={field.label}
                          height={16}
                          width={16}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

            {/* Grid for expiryDate and cardLimit */}
            {(expiryField || limitField) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {expiryField && (
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {expiryField.label}
                    </Label>
                    <div className="relative">
                      <Input
                        type="text"
                        name={expiryField.name}
                        value={expiryField.value}
                        onChange={expiryField.onChange}
                        placeholder={expiryField.placeholder}
                        maxLength={expiryField.maxLength}
                        className="w-full h-10 pl-10 bg-white border-blue-200 text-gray-600 text-sm rounded-lg focus:border-transparent focus:ring-1 focus-visible:ring-[1px] focus:ring-blue-600 placeholder-yellow-400 transition-all duration-150"
                      />
                      <Image
                        src={expiryField.svgicon}
                        alt={expiryField.label}
                        height={16}
                        width={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600"
                      />
                    </div>
                  </div>
                )}
                {limitField && (
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {limitField.label}
                    </Label>
                    <div className="relative">
                      <Input
                        type="text"
                        name={limitField.name}
                        value={limitField.value}
                        onChange={limitField.onChange}
                        placeholder={limitField.placeholder}
                        maxLength={limitField.maxLength}
                        className="w-full h-10 pl-10 bg-white border-blue-200 text-gray-600 text-sm rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder-yellow-400 transition-all duration-150"
                      />
                      <Image
                        src={limitField.svgicon}
                        alt={limitField.label}
                        height={16}
                        width={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}