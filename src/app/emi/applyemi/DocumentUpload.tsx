'use client'

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, Pencil, Trash, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface DocumentUploadProps {
  docTypes: string[];
  isGranter?: boolean;
  files: any;
  previews: { [key: string]: string };
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, docType: string, isGranter?: boolean) => void;
  handleFileDelete: (docType: string, isGranter?: boolean) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  docTypes,
  isGranter = false,
  files,
  previews,
  handleFileChange,
  handleFileDelete,
}) => {
  const getFile = (docType: string) => {
    if (isGranter) return files.granterDocument[docType];
    if (docType === 'bankStatement') return files.bankStatement;
    return files.citizenshipFile[docType];
  };

  const getPreviewKey = (docType: string) => {
    if (isGranter) return `granter-${docType}`;
    if (docType === 'bankStatement') return 'bankStatement';
    return `citizenship-${docType}`;
  };

  const getLabel = (docType: string) => {
    if (isGranter) {
      return docType === 'ppphoto' ? 'Passport Photo' : `Citizenship ${docType.charAt(0).toUpperCase() + docType.slice(1)}`;
    }
    if (docType === 'bankStatement') return 'Bank Statement';
    return docType === 'ppphoto' ? 'Passport Photo' : `Citizenship ${docType.charAt(0).toUpperCase() + docType.slice(1)}`;
  };

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 py-4 sm:py-6">
      <div className="w-full max-w-[95%] sm:max-w-3xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {docTypes.map((docType) => {
            const file = getFile(docType);
            const previewKey = getPreviewKey(docType);
            const label = getLabel(docType);
            return (
              <div key={docType} className="relative group text-center">
                <input
                  type="file"
                  id={previewKey}
                  onChange={(e) => handleFileChange(e, docType, isGranter)}
                  className="hidden"
                />
                <label htmlFor={previewKey} className="cursor-pointer block">
                  {file ? (
                    <div className="h-40 flex p-2 items-center  rounded-lg border border-blue-100 shadow-sm justify-center">
                      <Image
                        src={previews[previewKey] || ''}
                        alt={label || 'document img'}
                        width={200}
                        height={200}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="rounded-lg max-h-36 object-contain transition-transform duration-150 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="h-40 flex items-center justify-center  rounded-lg border-2 border-dashed border-blue-200 mx-auto">
                      <Image
                        src="/svgfile/uploaddocumenticon.svg"
                        alt="upload document"
                        height={48}
                        width={48}
                        className="h-12 w-12 text-blue-600"
                        loading="lazy"
                      />
                    </div>
                  )}
                </label>
                <Label className="block text-sm font-medium text-gray-700 mt-1.5">
                  {label}
                </Label>
                {file && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-700 hover:bg-yellow-50 rounded-full p-2"
                        >
                          <Eye size={20} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-[95%] sm:max-w-4xl max-h-[90vh] p-0 bg-white border border-blue-100 rounded-xl shadow-sm overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-blue-100 bg-white">
                          <h3 className="text-base font-medium text-gray-700">
                            {label}
                          </h3>
                          <Button
                            variant="ghost"
                            onClick={() => document.getElementById(previewKey)?.click()}
                            className="text-blue-600 hover:text-blue-700 hover:bg-yellow-50 rounded-full p-2"
                          >
                            <X size={20} />
                          </Button>
                        </div>
                        {/* Image Container */}
                        <div className="flex items-center justify-center p-4 sm:p-6 bg-white min-h-[300px] sm:min-h-[400px]">
                          <div className="relative w-full h-full flex items-center justify-center">
                            <Image
                              src={previews[previewKey] || ''}
                              alt={label || 'document img'}
                              width={1200}
                              height={800}
                              sizes="100vw"
                              className="max-w-full max-h-[70vh] object-contain rounded-lg border border-blue-100 shadow-sm"
                              quality={100}
                              loading="lazy"
                            />
                          </div>
                        </div>
                        {/* Footer */}
                        <div className="flex justify-center gap-3 p-4 border-t border-blue-100 bg-white">
                          <Button
                            onClick={() => document.getElementById(previewKey)?.click()}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 border-blue-200 text-blue-600 hover:bg-yellow-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-150"
                          >
                            <Pencil size={16} />
                            Replace
                          </Button>
                          <Button
                            onClick={() => handleFileDelete(docType, isGranter)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 border-blue-200 text-blue-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-150"
                          >
                            <Trash size={16} />
                            Delete
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      onClick={() => document.getElementById(previewKey)?.click()}
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-700 hover:bg-yellow-50 rounded-full p-2"
                    >
                      <Pencil size={20} />
                    </Button>
                    <Button
                      onClick={() => handleFileDelete(docType, isGranter)}
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-700 hover:bg-yellow-50 rounded-full p-2"
                    >
                      <Trash size={20} />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;