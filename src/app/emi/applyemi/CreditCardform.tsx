
import Image from "next/image";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useContextEmi } from "../emiContext";

export default function CreditCardComponent({ cardinfofield }) {
  const { AvailablebankProvider } = useContextEmi();

  // Extract expiryDate and cardLimit fields
  const expiryField = cardinfofield.fields.find(field => field.name === "expiryDate");
  const limitField = cardinfofield.fields.find(field => field.name === "cardLimit");

  return (
    <div className="bg-gray-50 flex items-center justify-center">
      <div className="bg-white w-full overflow-hidden">
        <div className="flex sm:flex-row flex-col space-x-2">
          {/* Card Image Section */}
          <div className="w-full sm:w-1/2 bg-[var(--colour-fsP2)]/10 rounded-lg p-1 flex items-center justify-center">
            <Image
              src="/svgfile/creditCardUi.svg"
              alt="Credit Card UI"
              height={600}
              width={600}
              className="object-contain"
              priority
            />
          </div>

          {/* Input Section */}
          <div className="w-full sm:w-1/2 p-1 space-y-1">
            {/* Loop through fields, excluding expiryDate and cardLimit */}
            {cardinfofield.fields
              .filter(field => field.name !== "expiryDate" && field.name !== "cardLimit")
              .map((field, fieldIndex) => (
                <div key={fieldIndex} >
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </Label>
                  <div className="w-full px-4 py-2 border-2 border-[var(--colour-fsP2)] rounded-lg focus:ring-2 focus:outline-none focus:ring-blue-500 flex flex-row items-center gap-3">
                    <Image
                      src={field.svgicon}
                      className="h-5 w-5 text-[var(--colour-fsP2)]/60"
                      alt={field.label}
                      height={20}
                      width={20}
                    />
                    {field.type === "select" ? (
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange({ target: { value } })}
                      >
                        <SelectTrigger className="w-full max-h-6 border-none font-semibold text-gray-700 outline-none">
                          <SelectValue placeholder={`Select ${field.label}`} />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-none outline-none max-h-60 overflow-y-auto z-[1000] font-sans text-base">
                          {field.options ? (
                            field.options.map((option) => (
                              <SelectItem
                                key={option}
                                value={option}
                                className="cursor-pointer border-none hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-100 focus:text-blue-700 transition-colors duration-150"
                              >
                                {option}
                              </SelectItem>
                            ))
                          ) : (
                            AvailablebankProvider.map((bank) => (
                              <SelectItem
                                key={bank.id}
                                value={bank.name}
                                className="cursor-pointer hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-100 focus:text-blue-700 transition-colors duration-150"
                              >
                                {bank.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    ) : (
                      <input
                        type="text"
                        name={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={field.placeholder}
                        maxLength={field.maxLength}
                        className="w-full border-none text-gray-600 font-[400] outline-none"
                      />
                    )}
                  </div>
                </div>
              ))}

            {/* Grid for expiryDate and cardLimit */}
            {(expiryField || limitField) && (
              <div className="grid grid-cols-2 gap-4 mt-1   ">
                {expiryField && (
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      {expiryField.label}
                    </Label>
                    <div className="w-full px-4 py-2 border-2 border-[var(--colour-fsP2)] rounded-lg focus:ring-2 focus:outline-none focus:ring-blue-500 flex flex-row items-center gap-3">
                      <Image
                        src={expiryField.svgicon}
                        className="h-5 w-5 text-[var(--colour-fsP2)]/60"
                        alt={expiryField.label}
                        height={20}
                        width={20}
                      />
                      <input
                        type="text" // Could use "month" for MM/YY, but keeping "text" for consistency
                        name={expiryField.name}
                        value={expiryField.value}
                        onChange={expiryField.onChange}
                        placeholder={expiryField.placeholder}
                        maxLength={expiryField.maxLength}
                        className="w-full border-none text-gray-600 font-[400] outline-none"
                      />
                    </div>
                  </div>
                )}
                {limitField && (
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      {limitField.label}
                    </Label>
                    <div className="w-full px-4 py-2 border-2 border-[var(--colour-fsP2)] rounded-lg focus:ring-2 focus:outline-none focus:ring-blue-500 flex flex-row items-center gap-3">
                      <Image
                        src={limitField.svgicon}
                        className="h-5 w-5 text-[var(--colour-fsP2)]/60"
                        alt={limitField.label}
                        height={20}
                        width={20}
                      />
                      <input
                        type="text" // Use number for cardLimit
                        name={limitField.name}
                        value={limitField.value}
                        onChange={limitField.onChange}
                        placeholder={limitField.placeholder }
                        maxLength={limitField.maxLength}
                        className="w-full border-none text-gray-600 font-[400] outline-none"
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
