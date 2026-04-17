import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { TextareaHTMLAttributes } from 'react';

type FormTextareaFieldProps = {
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    helperText?: string;
    required?: boolean;
    rows?: number;
    containerClassName?: string;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange' | 'rows'>;

export default function FormTextareaField({
    id,
    name,
    label,
    value,
    onChange,
    error,
    helperText,
    required = false,
    rows = 5,
    containerClassName = '',
    ...props
}: FormTextareaFieldProps) {
    return (
        <div className={`space-y-2 ${containerClassName}`}>
            <Label htmlFor={id} className="text-sm font-medium">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </Label>

            <Textarea
                id={id}
                name={name}
                value={value}
                rows={rows}
                onChange={(e) => onChange(e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
                className="min-h-28 resize-y"
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