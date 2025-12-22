import React, { useState } from 'react';
import type { FormConfig, FormData, SubmitMessageState } from '../type/form_type';
import { useValidator } from './hook/useValidator';
import { useFormState } from './hook/useFormState';
import { FormField } from "./components/fields/FormField";
import { SubmitButton } from './components/ui/SubmitButton';
import { SubmitMessage } from './components/ui/SubmitMessage';


interface DynamicFormProps {
    config: FormConfig;
    onSubmit?: (data: FormData) => void;
    initialValues?: FormData;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
    config,
    onSubmit,
    initialValues = {}
}) => {
    const { validate } = useValidator();
    const { formData, setFormData, errors, setErrors, touched, setTouched } = useFormState(config, initialValues);
    const [submitMessage, setSubmitMessage] = useState<SubmitMessageState>({
        show: false,
        type: '',
        message: ''
    });

    const handleChange = (fieldId: string, value: string): void => {
        setFormData(prev => ({ ...prev, [fieldId]: value }));

        if (touched[fieldId]) {
            const field = config.fields.find(f => f.id === fieldId);
            if (field) {
                const result = validate(field, value);
                setErrors(prev => ({
                    ...prev,
                    [fieldId]: result.valid ? '' : result.message
                }));
            }
        }
    };

    const handleBlur = (fieldId: string): void => {
        setTouched(prev => ({ ...prev, [fieldId]: true }));

        const field = config.fields.find(f => f.id === fieldId);
        if (field) {
            const result = validate(field, formData[fieldId]);
            setErrors(prev => ({
                ...prev,
                [fieldId]: result.valid ? '' : result.message
            }));
        }
    };

    const validateAll = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        let isValid = true;

        config.fields.forEach(field => {
            const result = validate(field, formData[field.id]);
            if (!result.valid) {
                newErrors[field.id] = result.message;
                isValid = false;
            }
        });

        setErrors(newErrors);

        const allTouched: { [key: string]: boolean } = {};
        config.fields.forEach(field => {
            allTouched[field.id] = true;
        });
        setTouched(allTouched);

        return isValid;
    };

    const handleSubmit = (): void => {
        setSubmitMessage({ show: false, type: '', message: '' });

        const isValid = validateAll();

        if (isValid) {
            setSubmitMessage({
                show: true,
                type: 'success',
                message: 'Form submitted successfully! ✓'
            });

            if (onSubmit) {
                onSubmit(formData);
            }
            console.log('Form Data:', formData);
        } else {
            setSubmitMessage({
                show: true,
                type: 'error',
                message: 'Please fill all required field'
            });
        }
    };

    return (
        <div>
            {config.fields.map(field => (
                <FormField
                    key={field.id}
                    field={field}
                    value={formData[field.id]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors[field.id]}
                    touched={touched[field.id]}
                />
            ))}

            <SubmitButton onClick={handleSubmit} />

            <SubmitMessage
                message={submitMessage.message}
                type={submitMessage.type}
                show={submitMessage.show}
            />
        </div>
    );
};
