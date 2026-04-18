import React from 'react';

interface StepIndicatorProps {
    currentStep: number;
}

const steps = [
    'Data Diri',
    'Motivasi',
    'Kuisioner',
    'Dokumen',
    'Review',
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isActive = currentStep === stepNumber;
                    const isCompleted = currentStep > stepNumber;

                    return (
                        <div
                            key={step}
                            className={`flex min-w-[140px] flex-1 items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                                isActive
                                    ? 'border-red-500/40 bg-red-500/10'
                                    : isCompleted
                                      ? 'border-emerald-500/30 bg-emerald-500/10'
                                      : 'border-white/10 bg-white/5'
                            }`}
                        >
                            <div
                                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-black ${
                                    isActive
                                        ? 'bg-red-500 text-white'
                                        : isCompleted
                                          ? 'bg-emerald-500 text-white'
                                          : 'bg-white/10 text-zinc-300'
                                }`}
                            >
                                {stepNumber}
                            </div>

                            <div className="min-w-0">
                                <p
                                    className={`truncate text-sm font-semibold ${
                                        isActive
                                            ? 'text-white'
                                            : isCompleted
                                              ? 'text-emerald-300'
                                              : 'text-zinc-300'
                                    }`}
                                >
                                    {step}
                                </p>
                                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                                    Step {stepNumber}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                    className="h-full rounded-full bg-red-500 transition-all duration-300"
                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
            </div>
        </div>
    );
};

export default StepIndicator;