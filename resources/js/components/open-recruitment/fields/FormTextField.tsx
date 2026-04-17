import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { InputHTMLAttributes } from 'react';

type FormTextFieldProps = {
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    helperText?: string;
    required?: boolean;
    containerClassName?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> & {
        type?: 'text' | 'email' | 'tel' | 'number' | 'password';
    };

export default function FormTextField({
    id,
    name,
    label,
    value,
    onChange,
    error,
    helperText,
    required = false,
    containerClassName = '',
    type = 'text',
    ...props
}: FormTextFieldProps) {
    return (
        <div className={`space-y-2 ${containerClassName}`}>
            <Label htmlFor={id} className="text-sm font-medium">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </Label>

            <Input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
                className="min-h-11"
                {...props}
            />

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