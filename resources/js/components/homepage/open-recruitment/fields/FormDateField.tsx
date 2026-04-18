import React from 'react';

interface FormDateFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
}

const FormDateField: React.FC<FormDateFieldProps> = ({
    id,
    label,
    value,
    onChange,
    required = false,
    disabled = false,
}) => {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-semibold text-white">
                {label}
                {required && <span className="ml-1 text-red-400">*</span>}
            </label>

            <input
                id={id}
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                disabled={disabled}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-red-500/60 focus:bg-white/10"
            />
        </div>
    );
};

export default FormDateField;