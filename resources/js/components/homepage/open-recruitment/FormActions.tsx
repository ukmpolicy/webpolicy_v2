import React from 'react';

interface FormActionsProps {
    currentStep: number;
    totalSteps: number;
    onBack: () => void;
    onNext: () => void;
    onSubmit: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({
    currentStep,
    totalSteps,
    onBack,
    onNext,
    onSubmit,
}) => {
    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === totalSteps;

    return (
        <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
                {!isFirstStep && (
                    <button
                        type="button"
                        onClick={onBack}
                        className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
                    >
                        Kembali
                    </button>
                )}
            </div>

            <div className="flex w-full justify-end">
                {isLastStep ? (
                    <button
                        type="button"
                        onClick={onSubmit}
                        className="inline-flex w-full items-center justify-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 sm:w-auto"
                    >
                        Kirim Pendaftaran
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={onNext}
                        className="inline-flex w-full items-center justify-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 sm:w-auto"
                    >
                        Lanjut
                    </button>
                )}
            </div>
        </div>
    );
};

export default FormActions;