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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
                <div className="h-42 flex p-2 items-center bg-[var(--colour-fsP2)]/70 border-blue-950 rounded-lg shadow-sm shadow-gray-700/30 justify-center">
                  <Image
                    src={previews[previewKey] ||null}
                    alt={label || ' document img'}
                    width={200}
                    height={200}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="rounded mx-auto group-hover:opacity-70 transition-opacity max-h-40 object-contain"
                  
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="h-42 flex items-center justify-center bg-gray-100 rounded border-2 border-dashed border-gray-300 mx-auto">
                  <Image
                    src="/svgfile/uploaddocumenticon.svg"
                    className="h-14 w-14 text-[var(--colour-fsP2)]/60"
                    alt="upload document"
                    height={80}
                    width={80}
                    priority={false}
                    loading="lazy"
                  />
                </div>
              )}
            </label>
            <Label className="block text-sm font-medium text-gray-700 mt-1">
              {label}
            </Label>
            {file && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="text-blue-600 cursor-pointer hover:text-blue-800 mr-4">
                      <Eye size={24} />
                    </Button>
                  </DialogTrigger>
         
                  <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 bg-white border border-gray-200 rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {label}
                      </h3>
        
                    </div>
                    
                    {/* Image Container */}
                    <div className="flex items-center justify-center p-6 bg-white min-h-[400px]">
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                          src={previews[previewKey] || null}
                          alt={label || 'document img'}
                          width={1200}
                          height={800}
                          sizes="100vw"
                          className="max-w-full max-h-[70vh] object-contain rounded-md shadow-lg border border-gray-300"
                          priority={false}
                          quality={100}
                          loading="lazy"
                        />
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="flex justify-center gap-3 p-4 border-t border-gray-200 bg-white">
                      <Button
                        onClick={() => document.getElementById(previewKey)?.click()}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Pencil size={16} />
                        Replace
                      </Button>
                      <Button
                        onClick={() => handleFileDelete(docType, isGranter)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                      >
                        <Trash size={16} />
                        Delete
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  onClick={() => document.getElementById(previewKey)?.click()}
                  className="cursor-pointer text-blue-600 hover:text-blue-800 mr-2"
                >
                  <Pencil size={20} />
                </Button>
                <Button
                  onClick={() => handleFileDelete(docType, isGranter)}
                  className="cursor-pointer text-blue-600 hover:text-blue-800"
                >
                  <Trash size={20} />
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DocumentUpload;