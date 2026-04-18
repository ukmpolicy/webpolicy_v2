import React from 'react';

interface SelectOption {
    label: string;
    value: string;
}

interface FormSelectFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
}

const FormSelectField: React.FC<FormSelectFieldProps> = ({
    id,
    label,
    value,
    onChange,
    options,
    placeholder = 'Pilih salah satu',
    required = false,
    disabled = false,
}) => {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-semibold text-white">
                {label}
                {required && <span className="ml-1 text-red-400">*</span>}
            </label>

            <select
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                disabled={disabled}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-red-500/60 focus:bg-white/10"
            >
                <option value="" disabled className="bg-zinc-900 text-zinc-400">
                    {placeholder}
                </option>

                {options.map((option) => (
                    <option key={option.value} value={option.value} className="bg-zinc-900 text-white">
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FormSelectField;