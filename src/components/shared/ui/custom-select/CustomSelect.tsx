"use client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { forwardRef, useId, useRef, useState } from "react";
import { FieldLabel } from "../FieldLabel";

export type SelectOption = {
    label: string;
    value: string;
};

interface CustomSelectProps {
    value?: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    label?: string;
    required?: boolean;
}

export const CustomSelect = forwardRef<HTMLDivElement, CustomSelectProps>(({
    value,
    onChange,
    options,
    placeholder = "Select...",
    disabled,
    error,
    label,
    required = false }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const internalRef = useRef<HTMLDivElement>(null);
    const combinedRef = (ref as React.RefObject<HTMLDivElement>) || internalRef;
    const inputId = useId();

    const selectedOption = options.find((o) => o.value === value);
    const filteredOptions = options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div ref={combinedRef} className="relative w-full">
            <FieldLabel label={label} required={required} />
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen((p) => !p)}
                className="w-full rounded-lg border border-border-primary px-4 py-3 text-sm text-left bg-white flex items-center justify-between"
            >
                <span className={`${selectedOption ? "text-text-primary" : "text-text-tertiary"} placeholder:text-text-tertiary`}>
                    {selectedOption?.label || placeholder}
                </span>
                {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-text-tertiary" />
                ) : (
                    <ChevronDown className="h-4 w-4 text-text-tertiary" />
                )}
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-full rounded-lg border border-border-primary bg-white">
                    <input
                        id={inputId}
                        autoFocus
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                        className="w-full border-b border-border-primary px-3 py-2 text-sm outline-none"
                    />

                    <ul className="max-h-48 overflow-auto scroll-smooth [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border-primary [&::-webkit-scrollbar-thumb]:rounded-full">
                        {filteredOptions.length === 0 && (
                            <li className="px-4 py-2 text-sm text-text-tertiary">No results</li>
                        )}
                        {filteredOptions.map((option) => (
                            <li
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                    setSearch("");
                                }}
                                className={`px-4 py-2 text-sm cursor-pointer hover:bg-text-tertiary hover:text-white ${option.value === value ? "text-white bg-text-tertiary font-medium" : ""
                                    }`}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {error && <p className="absolute -bottom-3.5 text-red-500 text-10">{error}</p>}
        </div>
    );
}
);
