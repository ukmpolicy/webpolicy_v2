import React, { useRef } from 'react';

interface FormFileFieldProps {
    id: string;
    label: string;
    file: File | null;
    onChange: (file: File | null) => void;
    accept?: string;
    helperText?: string;
    required?: boolean;
    previewUrl?: string | null;
}

const FormFileField: React.FC<FormFileFieldProps> = ({
    id,
    label,
    file,
    onChange,
    accept = '.jpg,.jpeg,.png',
    helperText = 'Format file: JPG, JPEG, PNG',
    required = false,
    previewUrl = null,
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleOpenFilePicker = () => {
        inputRef.current?.click();
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] ?? null;
        onChange(selectedFile);
    };

    const handleClear = () => {
        onChange(null);

        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-semibold text-white">
                {label}
                {required && <span className="ml-1 text-red-400">*</span>}
            </label>

            <input
                ref={inputRef}
                id={id}
                type="file"
                accept={accept}
                onChange={handleChange}
                className="hidden"
            />

            <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-white">
                            {file ? file.name : 'Belum ada file dipilih'}
                        </p>
                        <p className="text-xs text-zinc-400">{helperText}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={handleOpenFilePicker}
                            className="inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
                        >
                            {file ? 'Ganti File' : 'Pilih File'}
                        </button>

                        {file && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                            >
                                Hapus
                            </button>
                        )}
                    </div>
                </div>

                {(previewUrl || file) && (
                    <div className="mt-4">
                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                            <img
                                src={previewUrl || URL.createObjectURL(file as File)}
                                alt={label}
                                className="h-32 w-full object-cover"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormFileField;