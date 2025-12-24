"use client";
import { useFormContext, Controller } from "react-hook-form";
import { FileUpload } from "@/components/shared/ui/file-upload/FileUpload";
import { Textarea } from "@/components/shared/ui/form-inputs/textarea/TextArea";
import { OnboardingFormValues } from "@/types/onboarding";
import { StepHeader } from "@/components/onboarding/StepHeader";
import { getInitials } from "@/utils/stringUtils";

export const BrandingStep = () => {
    const { register, control, watch, formState: { errors } } = useFormContext<OnboardingFormValues>();
    const companyName = watch("companyName");
    const initials = getInitials(companyName);

    return (
        <div className="space-y-6">
            <StepHeader
                title="Make your company recognizable"
                description="This helps identify your workspace"
            />

            <Controller
                name="logo"
                control={control}
                render={({ field }) => (
                    <FileUpload
                        label="Logo (optional)"
                        required
                        initials={initials}
                        error={errors.logo?.message}
                        value={field.value as unknown as string}
                        onChange={field.onChange}
                    />
                )}
            />

            <Textarea
                label="Description (optional)"
                required
                placeholder="Enter a description"
                {...register("description")}
                error={errors.description?.message}
            />
        </div>
    );
};