import { Label } from '@/components/ui/label';
import type { SelectHTMLAttributes } from 'react';
import type { SelectOption } from '../types';

type FormSelectFieldProps = {
    id: string;
    name: string;
    label: string;
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
    error?: string;
    helperText?: string;
    placeholder?: string;
    required?: boolean;
    containerClassName?: string;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'>;

export default function FormSelectField({
    id,
    name,
    label,
    value,
    options,
    onChange,
    error,
    helperText,
    placeholder = 'Pilih salah satu',
    required = false,
    containerClassName = '',
    ...props
}: FormSelectFieldProps) {
    return (
        <div className={`space-y-2 ${containerClassName}`}>
            <Label htmlFor={id} className="text-sm font-medium">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </Label>

            <select
                id={id}
                name={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
                className="flex min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                {...props}
            >
                <option value="" disabled>
                    {placeholder}
                </option>

                {options.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.disabled}>
                        {option.label}
                    </option>
                ))}
            </select>

            {helperText && !error && (
                <p id={`${id}-helper`} className="text-xs text-muted-foreground">
                    {helperText}
                </p>
            )}

            {error && (
                <p id={`${id}-error`} className="text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}