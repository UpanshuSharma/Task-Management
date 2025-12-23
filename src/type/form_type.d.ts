export type FieldType = 'text' | 'email' | 'number' | 'select' | 'date';

export interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    mustBeTrue?: boolean;
    minDate?: string;
    maxDate?: string;
    notBefore?: string;
    notAfter?: string
}

export interface SelectOption {
    label: string;
    value: string;
}

export interface FieldConfig {
    id: string;
    label: string;
    type: FieldType;
    placeholder?: string;
    value: string | number;
    options?: SelectOption[];
    metadata?: {
        validator?: ValidationRule;
    };
}

export interface FormConfig {
    id: string;
    type: string;
    fields: FieldConfig[];
}

export interface ValidationResult {
    valid: boolean;
    message: string;
}

export interface FormData {
    [key: string]: string | number;
}

export interface FormErrors {
    [key: string]: string;
}

export interface FormTouched {
    [key: string]: boolean;
}

export interface SubmitMessageState {
    show: boolean;
    type: 'success' | 'error' | '';
    message: string;
}
