import { Button } from '@/components/ui/button';

type FormActionsProps = {
    isFirstStep: boolean;
    isLastStep: boolean;
    processing?: boolean;
    onBack: () => void;
    onNext: () => void;
};

export default function FormActions({
    isFirstStep,
    isLastStep,
    processing = false,
    onBack,
    onNext,
}: FormActionsProps) {
    return (
        <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
                {!isFirstStep && (
                    <Button type="button" variant="outline" onClick={onBack} className="w-full sm:w-auto">
                        Kembali
                    </Button>
                )}
            </div>

            <div className="flex w-full justify-end">
                {isLastStep ? (
                    <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                        {processing ? 'Mengirim...' : 'Kirim Pendaftaran'}
                    </Button>
                ) : (
                    <Button type="button" onClick={onNext} className="w-full sm:w-auto">
                        Lanjut
                    </Button>
                )}
            </div>
        </div>
    );
}