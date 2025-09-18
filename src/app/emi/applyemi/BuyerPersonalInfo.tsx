
import Image from "next/image";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useContextEmi } from "../emiContext";

export default function BuyerPersonalInfo({ cardinfofield }) {
  const { AvailablebankProvider } = useContextEmi();


  return (
    <div className="bg-gray-50  grid grid-cols-2 gap-3">
      {cardinfofield.fields

        .map((field, fieldIndex) => (
          <div key={fieldIndex} className={` ${field.extenduserinfo} `}>
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
                  onValueChange={(value) => field.onChange({ target: { name: field.name, value } })}
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
    </div>
  );
}
