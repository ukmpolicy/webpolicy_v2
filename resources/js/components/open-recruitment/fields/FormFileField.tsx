import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ChangeEvent, InputHTMLAttributes } from 'react';

type FormFileFieldProps = {
    id: string;
    name: string;
    label: string;
    file: File | null;
    onChange: (file: File | null) => void;
    error?: string;
    helperText?: string;
    required?: boolean;
    accept?: string;
    maxSizeMb?: number;
    containerClassName?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange' | 'accept'>;

export default function FormFileField({
    id,
    name,
    label,
    file,
    onChange,
    error,
    helperText,
    required = false,
    accept = '.jpg,.jpeg,.png',
    maxSizeMb,
    containerClassName = '',
    ...props
}: FormFileFieldProps) {
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] ?? null;
        onChange(selectedFile);
    };

    return (
        <div className={`space-y-2 ${containerClassName}`}>
            <Label htmlFor={id} className="text-sm font-medium">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </Label>

            <Input
                id={id}
                name={name}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : `${id}-helper`}
                className="min-h-11 file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-2 file:text-sm file:font-medium"
                {...props}
            />

            <div id={`${id}-helper`} className="space-y-1">
                {helperText && !error && <p className="text-xs text-muted-foreground">{helperText}</p>}

                {!helperText && (
                    <p className="text-xs text-muted-foreground">
                        Format file yang diterima: {accept}
                        {maxSizeMb ? ` • Maksimal ${maxSizeMb}MB` : ''}
                    </p>
                )}

                {helperText && maxSizeMb && !error && (
                    <p className="text-xs text-muted-foreground">Maksimal ukuran file {maxSizeMb}MB.</p>
                )}

                {file && <p className="text-xs text-foreground">File terpilih: {file.name}</p>}
            </div>

            {error && (
                <p id={`${id}-error`} className="text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}