"use client";
import { X } from "lucide-react";
import React, { useState, useRef, ChangeEvent, DragEvent, useEffect } from "react";
import { FieldLabel } from "../FieldLabel";

interface FileUploadProps {
    onChange?: (value: string | null) => void; // Changed from FileList to string
    value?: string | null; // The base64 string
    initials?: string;
    label?: string;
    className?: string;
    error?: string;
    required?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
    onChange,
    value,
    initials = "NA",
    label,
    className = "",
    error,
    required = false,
}) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Synchronize preview with the value (Base64 string or URL)
    useEffect(() => {
        if (value && typeof value === "string") {
            setPreview(value);
        } else {
            setPreview(null);
        }
    }, [value]);

    const handleFile = (files: FileList | null) => {
        if (files && files.length > 0) {
            const file = files[0];

            // Convert File to Base64 String so it can be persisted
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPreview(base64String);
                onChange?.(base64String); // Send the string to the form state
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation();
        setIsDragActive(false);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation();
        setIsDragActive(true);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleFile(e.target.files);
    };

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        if (inputRef.current) inputRef.current.value = "";
        onChange?.(null);
    };

    return (
        <div className={`w-full ${className}`}>
            <FieldLabel label={label} required={required} />
            <div
                className={`relative flex sm:flex-row flex-col sm:gap-0 gap-6 items-center rounded-xl border py-6 px-12 transition-all cursor-pointer ${isDragActive ? "border-blue-500 bg-blue-50" : "border-border-primary bg-white"
                    }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                <div className="shrink-0">
                    {preview ? (
                        <div className="relative h-30 w-30 rounded-full shadow-sm">
                            <img
                                src={preview}
                                alt="Preview"
                                className="h-full w-full rounded-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-text-primary cursor-pointer hover:bg-gray-50"
                            >
                                <X size={16} strokeWidth={2} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex h-30 w-30 bg-gradient-tertiary items-center justify-center rounded-full text-3xl font-bold text-white">
                            {initials}
                        </div>
                    )}
                </div>

                <div className="flex flex-1 flex-col items-center">
                    <div className="group mb-2 flex items-center justify-center rounded-full border border-gray-200 px-5 py-2.5 transition-colors group-hover:bg-gray-50 bg-white">
                        <span className="mr-1 text-sm text-gray-900">Drag and drop or</span>
                        <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                            Upload Logo
                        </span>
                    </div>
                    <p className="pl-1 text-xs text-gray-500">JPG or PNG</p>
                </div>

                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                    accept=".jpg,.png"
                />
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};