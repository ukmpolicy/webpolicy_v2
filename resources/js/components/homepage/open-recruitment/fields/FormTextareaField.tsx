import React from 'react';

interface FormTextareaFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    required?: boolean;
    disabled?: boolean;
}

const FormTextareaField: React.FC<FormTextareaFieldProps> = ({
    id,
    label,
    value,
    onChange,
    placeholder = '',
    rows = 5,
    required = false,
    disabled = false,
}) => {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-semibold text-white">
                {label}
                {required && <span className="ml-1 text-red-400">*</span>}
            </label>

            <textarea
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                required={required}
                disabled={disabled}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500/60 focus:bg-white/10"
            />
        </div>
    );
};

export default FormTextareaField;