import * as React from 'react';
import { ChevronsUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
                                className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                            >
                                {option.label}
                                <button
                                    type="button"
                                    className="ml-1 inline-flex h-3 w-3 items-center justify-center rounded-full hover:bg-blue-200"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove(option);
                                    }}
                                >
                                    <X className="h-2 w-2" />
                                </button>
                            </span>
                        ))
                    )}
                </div>
                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>

            {open && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    <div className="p-2">
                        {options.length === 0 ? (
                            <div className="py-2 text-center text-sm text-gray-500">
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
                                            "w-full text-left px-2 py-2 text-sm rounded hover:bg-gray-100 flex items-center",
                                            isSelected && "bg-blue-50 text-blue-700"
                                        )}
                                        onClick={() => handleSelect(option)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => {}}
                                            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
