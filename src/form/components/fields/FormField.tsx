import React from 'react';

import { TextField } from './TextField';
import { SelectField } from './SelectField';
import type { FieldConfig } from '../../../type/form_type';
import '../styles/form.css';

interface FormFieldProps {
    field: FieldConfig;
    value: string | number;
    onChange: (fieldId: string, value: string) => void;
    onBlur: (fieldId: string) => void;
    error?: string;
    touched?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
    field,
    value,
    onChange,
    onBlur,
    error,
    touched
}) => {
    const hasError = touched && !!error;
    const isValid = touched && !error && !!value;

    const renderInput = () => {
        switch (field.type) {
            case 'select':
                return (
                    <SelectField
                        field={field}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        hasError={hasError}
                        isValid={isValid}
                    />
                );
            case 'text':
            case 'email':
            case 'number':
            case 'date':
            default:
                return (
                    <TextField
                        field={field}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        hasError={hasError}
                        isValid={isValid}
                    />
                );
        }
    };

    return (
        <div className="form-field">
            <label htmlFor={field.id} className="form-field__label">
                {field.label}
                {field.metadata?.validator?.required && (
                    <span className="form-field__required">*</span>
                )}
            </label>

            {renderInput()}

            {/* Character count */}
            {(field.type === 'text' || field.type === 'email') &&
                field.metadata?.validator?.maxLength && (
                    <div className="form-field__char-count">
                        {String(value).length} / {field.metadata.validator.maxLength}
                    </div>
                )}

            {/* Error message */}
            <div className={`form-field__error ${(touched && error) ? 'form-field__error--visible' : ''}`}>
                {touched && error && error}
            </div>
        </div>
    );
};
