import { lazy, Suspense } from "react";
import { Loader } from "@/components/loader/Loader";

const OnboardingFlow = lazy(() => import("@/components/onboarding/OnboardingFlow"));

export default function Page() {
  return (
    <Suspense fallback={<Loader />}>
      <OnboardingFlow />
    </Suspense>
  );
}