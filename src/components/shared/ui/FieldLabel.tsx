"use client";
import React from "react";

interface FieldLabelProps {
    label?: string;
    required?: boolean;
    className?: string;
}

export const FieldLabel: React.FC<FieldLabelProps> = ({
    label,
    required,
    className = "",
}) => {
    if (!label) return null;

    return (
        <label className={`mb-2 block text-sm font-medium text-slate-900 ${className}`}>
            {label}
            {required && <span className="text-red-500">*</span>}
        </label>
    );
};
