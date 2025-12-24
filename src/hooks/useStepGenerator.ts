"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const STEP_KEYS = ["company-info", "branding"];

export interface StepGeneratorResult<T> {
    currentStep: number;
    formData: T;
    isLoaded: boolean;
    next: (data: T) => void;
    back: (data: T) => void;
    updateData: (data: T) => void;
    clearProgress: () => void;
}

export function useStepGenerator<T>(
    storageKey: string,
    initialData: T
): StepGeneratorResult<T> {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentStepKey = searchParams.get("step") || STEP_KEYS[0];
    const currentStep = STEP_KEYS.indexOf(currentStepKey);

    const activeStepIndex = currentStep === -1 ? 0 : currentStep;

    const [formData, setFormData] = useState<T>(initialData);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.data) setFormData(parsed.data);
            } catch (e) {
                console.error("Error loading onboarding progress", e);
            }
        }
        setIsLoaded(true);
    }, [storageKey]);

    const persistData = useCallback((data: T) => {
        localStorage.setItem(storageKey, JSON.stringify({ data }));
    }, [storageKey]);

    const next = useCallback((data: T) => {
        persistData(data);

        const nextIndex = activeStepIndex + 1;
        if (nextIndex < STEP_KEYS.length) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("step", STEP_KEYS[nextIndex]);
            router.push(`${pathname}?${params.toString()}`);
        }
    }, [activeStepIndex, pathname, searchParams, router, persistData]);

    const back = useCallback((data: T) => {
        persistData(data);

        const prevIndex = activeStepIndex - 1;
        if (prevIndex >= 0) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("step", STEP_KEYS[prevIndex]);
            router.push(`${pathname}?${params.toString()}`);
        }
    }, [activeStepIndex, pathname, searchParams, router, persistData]);

    const updateData = useCallback((data: T) => {
        setFormData(data);
        persistData(data);
    }, [persistData]);

    const clearProgress = useCallback(() => {
        router.push(pathname);
    }, [pathname, router]);

    return {
        currentStep: activeStepIndex,
        formData,
        isLoaded,
        next,
        back,
        updateData,
        clearProgress,
    };
}
