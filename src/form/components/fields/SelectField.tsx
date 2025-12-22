import React from 'react';
import type { FieldConfig } from '../../../type/form_type';
import '../styles/form.css';


interface SelectFieldProps {
    field: FieldConfig;
    value: string | number;
    onChange: (fieldId: string, value: string) => void;
    onBlur: (fieldId: string) => void;
    hasError?: boolean;
    isValid?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
    field,
    value,
    onChange,
    onBlur,
    hasError,
    isValid
}) => {
    const getSelectClass = () => {
        let classes = 'form-input form-select';
        if (hasError) {
            classes += ' form-input--error';
        } else if (isValid) {
            classes += ' form-input--valid';
        } else {
            classes += ' form-input--default';
        }
        return classes;
    };

    if (!field.options) {
        return null;
    }

    return (
        <select
            id={field.id}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            onBlur={() => onBlur(field.id)}
            className={getSelectClass()}
        >
            {field.options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};