import * as React from 'react';
import { ChevronsUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // Pastikan cn (className utility) berfungsi dengan baik

interface Option {
    value: string;
    label: string;
}

interface MultiSelectProps {
    options: Option[];
    selected: Option[];
    onChange: (selected: Option[]) => void;
    placeholder?: string;
    className?: string;
}

export function MultiSelect({ options, selected, onChange, placeholder = 'Pilih...', className }: MultiSelectProps) {
    const [open, setOpen] = React.useState(false);

    const handleSelect = (option: Option) => {
        const isSelected = selected.some(item => item.value === option.value);
        if (isSelected) {
            onChange(selected.filter(item => item.value !== option.value));
        } else {
            onChange([...selected, option]);
        }
    };

    const handleRemove = (optionToRemove: Option) => {
        onChange(selected.filter(option => option.value !== optionToRemove.value));
    };

    return (
        <div className="relative">
            <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn("w-full justify-between min-h-[40px] h-auto", className)}
                onClick={() => setOpen(!open)}
            >
                <div className="flex flex-wrap gap-1">
                    {selected.length === 0 ? (
                        <span className="text-muted-foreground">{placeholder}</span>
                    ) : (
                        selected.map((option) => (
                            <span
                                key={option.value}
                                // PERBAIKAN: Styling tag kategori yang dipilih
                                className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset
                                bg-blue-50 text-blue-700 ring-blue-700/10
                                dark:bg-[var(--secondary)] dark:text-[var(--secondary-foreground)] dark:ring-[var(--secondary-foreground)]"
                            >
                                {option.label}
                                <button
                                    type="button"
                                    // PERBAIKAN: Styling tombol X di tag
                                    className="ml-1 inline-flex h-3 w-3 items-center justify-center rounded-full hover:bg-blue-200 dark:hover:bg-[var(--muted)]"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove(option);
                                    }}
                                >
                                    <X className="h-2 w-2 dark:text-[var(--secondary-foreground)]" /> {/* PERBAIKAN: Warna icon X */}
                                </button>
                            </span>
                        ))
                    )}
                </div>
                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>

            {open && (
                // PERBAIKAN: Styling kontainer dropdown utama
                <div className="absolute z-50 w-full mt-1 rounded-md shadow-lg max-h-60 overflow-auto
                            bg-white border border-gray-200
                            dark:bg-[var(--popover)] dark:border-[var(--border)] dark:shadow-md-dark" // Anda mungkin perlu mendefinisikan shadow-md-dark di tailwind.config jika belum ada
                >
                    <div className="p-2">
                        {options.length === 0 ? (
                            // PERBAIKAN: Styling teks "Tidak ada pilihan"
                            <div className="py-2 text-center text-sm text-gray-500 dark:text-[var(--popover-foreground)]">
                                Tidak ada pilihan
                            </div>
                        ) : (
                            options.map((option) => {
                                const isSelected = selected.some(item => item.value === option.value);
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        className={cn(
                                            "w-full text-left px-2 py-2 text-sm rounded flex items-center",
                                            // PERBAIKAN: Styling opsi normal dan hover
                                            "hover:bg-gray-100 dark:hover:bg-[var(--accent)] dark:text-[var(--popover-foreground)]", // default text color and hover
                                            // PERBAIKAN: Styling opsi terpilih
                                            isSelected && "bg-blue-50 text-blue-700 dark:bg-[var(--primary)] dark:text-[var(--primary-foreground)]"
                                        )}
                                        onClick={() => handleSelect(option)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => {}}
                                            // PERBAIKAN: Styling checkbox
                                            className="mr-2 h-4 w-4 rounded
                                                    text-blue-600 border-gray-300 focus:ring-blue-500
                                                    dark:border-[var(--border)] dark:bg-[var(--card)] dark:focus:ring-[var(--ring)]
                                                    dark:checked:bg-[var(--primary)] dark:checked:border-[var(--primary)] dark:checked:text-[var(--primary-foreground)]" // text- warna untuk tanda centang
                                        />
                                        {option.label}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
