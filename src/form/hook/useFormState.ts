import { useState, type Dispatch, type SetStateAction } from "react";
import type { FormConfig, FormData, FormErrors, FormTouched } from "../../type/form_type";


interface UseFormStateReturn {
    formData: FormData;
    setFormData: Dispatch<SetStateAction<FormData>>;
    errors: FormErrors;
    setErrors: Dispatch<SetStateAction<FormErrors>>;
    touched: FormTouched;
    setTouched: Dispatch<SetStateAction<FormTouched>>;
}

export const useFormState = (
    formConfig: FormConfig,
    initialValues: FormData = {}
): UseFormStateReturn => {
    const [formData, setFormData] = useState<FormData>(() => {
        const initialData: FormData = {};
        formConfig.fields.forEach(field => {
            // Priority: initialValues > field.value > empty string
            initialData[field.id] = initialValues[field.id] !== undefined
                ? initialValues[field.id]
                : field.value;
        });
        return initialData;
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<FormTouched>({});

    return {
        formData,
        setFormData,
        errors,
        setErrors,
        touched,
        setTouched
    };
};
