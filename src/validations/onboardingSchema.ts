import * as yup from "yup";

export const companyInfoSchema = yup.object({
    companyName: yup.string().required("Company name is required"),
    companyWebsite: yup.string().url("Must be a valid URL").required("Company website is required"),
    location: yup.string().required("Location is required"),
});

export const brandingSchema = yup.object({
    logo: yup.mixed().required("Logo is required"),
    description: yup.string().min(10, "Description must be at least 10 characters").required("Description is required"),
});

export const onboardingSchema = companyInfoSchema.concat(brandingSchema);
