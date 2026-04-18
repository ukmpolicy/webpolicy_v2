import React from 'react';

interface FormTextFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: 'text' | 'email' | 'tel' | 'number';
    required?: boolean;
    disabled?: boolean;
}

const FormTextField: React.FC<FormTextFieldProps> = ({
    id,
    label,
    value,
    onChange,
    placeholder = '',
    type = 'text',
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
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500/60 focus:bg-white/10"
            />
        </div>
    );
};

export default FormTextField;