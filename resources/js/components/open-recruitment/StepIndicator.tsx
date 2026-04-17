import type { StepKey } from './types';
import { openRecruitmentSteps } from './utils/stepConfig';

type StepIndicatorProps = {
    currentStep: StepKey;
    onStepClick?: (step: StepKey) => void;
};

export default function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
    const currentIndex = openRecruitmentSteps.findIndex((step) => step.key === currentStep);

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto">
                <div className="flex min-w-max gap-3 pb-1">
                    {openRecruitmentSteps.map((step, index) => {
                        const isActive = step.key === currentStep;
                        const isCompleted = index < currentIndex;

                        return (
                            <button
                                key={step.key}
                                type="button"
                                onClick={() => onStepClick?.(step.key)}
                                disabled={!onStepClick}
                                className={`flex min-w-[180px] flex-col rounded-xl border px-4 py-3 text-left transition ${
                                    isActive
                                        ? 'border-primary bg-primary/10'
                                        : isCompleted
                                          ? 'border-primary/40 bg-muted/40'
                                          : 'border-border bg-background'
                                } ${onStepClick ? 'cursor-pointer' : 'cursor-default'}`}
                            >
                                <span className="text-xs font-medium text-muted-foreground">
                                    Step {index + 1}
                                </span>
                                <span className="mt-1 text-sm font-semibold">{step.title}</span>
                                <span className="mt-1 text-xs text-muted-foreground">
                                    {step.description}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{
                        width: `${((currentIndex + 1) / openRecruitmentSteps.length) * 100}%`,
                    }}
                />
            </div>
        </div>
    );
}