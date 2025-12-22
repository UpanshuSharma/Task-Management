import React from 'react';
import type { FieldConfig } from '../../../type/form_type';
import '../styles/form.css';


interface TextFieldProps {
    field: FieldConfig;
    value: string | number;
    onChange: (fieldId: string, value: string) => void;
    onBlur: (fieldId: string) => void;
    hasError?: boolean;
    isValid?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({
    field,
    value,
    onChange,
    onBlur,
    hasError,
    isValid
}) => {
    const getInputClass = () => {
        let classes = 'form-input';
        if (hasError) {
            classes += ' form-input--error';
        } else if (isValid) {
            classes += ' form-input--valid';
        } else {
            classes += ' form-input--default';
        }
        return classes;
    };

    return (
        <input
            type={field.type}
            id={field.id}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            onBlur={() => onBlur(field.id)}
            className={getInputClass()}
        />
    );
};