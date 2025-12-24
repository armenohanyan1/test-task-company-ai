"use client";
import { JSX, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { OnboardingFormValues } from "@/types/onboarding";
import { CompanyInfoStep } from "./steps/CompanyInfoStep";
import { BrandingStep } from "./steps/BrandingStep";
import { Button } from "@/components/shared/ui/buttons/Button";
import { StepIndicator } from "./StepIndicator";
import { useStepGenerator } from "@/hooks/useStepGenerator";
import { companyInfoSchema, brandingSchema } from "@/validations/onboardingSchema";

const steps = ["CompanyInfoStep", "BrandingStep"] as const;
type StepNames = typeof steps[number];

const stepSchemas = {
    CompanyInfoStep: companyInfoSchema,
    BrandingStep: brandingSchema,
};

const storage_key = "onboarding_progress";

export default function OnboardingFlow() {
    const {
        currentStep,
        formData,
        isLoaded,
        next,
        back,
        updateData,
        clearProgress
    } = useStepGenerator<OnboardingFormValues>(storage_key, {} as OnboardingFormValues);

    const currentStepName = steps[currentStep];

    const methods = useForm<OnboardingFormValues>({
        mode: "onBlur",
        resolver: yupResolver(stepSchemas[currentStepName] as any),
        defaultValues: formData
    });

    const { handleSubmit, trigger, watch, getValues, reset } = methods;

    useEffect(() => {
        if (isLoaded) {
            reset(formData);
        }
    }, [isLoaded, reset]);

    useEffect(() => {
        const subscription = watch((value) => {
            updateData(value as OnboardingFormValues);
        });
        return () => subscription.unsubscribe();
    }, [watch, updateData]);

    useEffect(() => {
        if (!isLoaded) return;

        if (currentStep > 0 && !formData.companyName) {
            back(formData);
        }
    }, [currentStep, isLoaded, back, formData]);

    const handleNext = async () => {
        const isValid = await trigger();

        if (isValid) {
            next(getValues());
        }
    };

    const onSubmit = (data: OnboardingFormValues) => {
        console.log("Final Submission:", data);
        clearProgress();
    };

    const stepsComponents: Record<StepNames, JSX.Element> = {
        CompanyInfoStep: <CompanyInfoStep />,
        BrandingStep: <BrandingStep />,
    };

    const isLastStep = currentStep === steps.length - 1;

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center">
            <div className="w-full min-h-screen sm:min-h-0 sm:h-auto max-w-container-md bg-gradient-primary sm:py-8 sm:px-0 p-4">
                <div className="max-w-container-sm mx-auto">
                    <StepIndicator step={currentStep + 1} />

                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {stepsComponents[currentStepName]}

                            <div className="mt-section flex gap-4 justify-between">
                                {!isLastStep ? (
                                    <Button
                                        text="Next"
                                        type="button"
                                        onClick={handleNext}
                                        className="w-full"
                                    />
                                ) : (
                                    <Button
                                        text="Finish"
                                        type="submit"
                                        className="w-full"
                                    />
                                )}
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </div>
    );
}
