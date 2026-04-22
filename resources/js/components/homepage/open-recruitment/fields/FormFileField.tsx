import React, { useRef, useState, useEffect } from 'react';

interface FormFileFieldProps {
    id: string;
    label: string;
    file: File | null;
    onChange: (file: File | null) => void;
    accept?: string;
    helperText?: string;
    required?: boolean;
    previewUrl?: string | null;
    error?: string;
}

const FormFileField: React.FC<FormFileFieldProps> = ({
    id,
    label,
    file,
    onChange,
    accept = '.jpg,.jpeg,.png,.pdf',
    helperText = 'Format file: JPG, JPEG, PNG, PDF',
    required = false,
    previewUrl = null,
    error,
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    // Handle object URL lifecycle to prevent memory leaks
    useEffect(() => {
        if (!file) {
            setPreview(null);
            return;
        }

        // Only create preview for images
        if (file.type.startsWith('image/')) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            // Cleanup function
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreview(null);
        }
    }, [file]);

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

    const isImage = file?.type.startsWith('image/') || (previewUrl && !previewUrl.endsWith('.pdf'));
    const isPdf = file?.type === 'application/pdf' || (previewUrl && previewUrl.endsWith('.pdf'));

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

            <div className={`rounded-2xl border border-dashed p-4 transition-colors ${error ? 'border-red-500 bg-red-500/5' : 'border-white/15 bg-white/5'}`}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-white truncate max-w-[250px]">
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

                {error && (
                    <p className="mt-2 text-xs font-medium text-red-400">
                        {error}
                    </p>
                )}

                {(preview || previewUrl) && (
                    <div className="mt-4">
                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                            {isPdf ? (
                                <div className="flex h-32 items-center justify-center gap-3 bg-zinc-900 text-zinc-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                                    <span className="text-xs font-medium">Dokumen PDF Terpilih</span>
                                </div>
                            ) : (
                                <img
                                    src={preview || previewUrl || ''}
                                    alt={label}
                                    className="h-32 w-full object-cover"
                                    onError={(e) => {
                                        // Handle fallback if image fails to load
                                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/000000/FFFFFF?text=File+Preview';
                                    }}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormFileField;