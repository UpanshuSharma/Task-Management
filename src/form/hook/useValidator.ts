import type { FieldConfig, ValidationResult } from "../../type/form_type";

export const useValidator = () => {
    const getTodayDate = (): string => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const parseDate = (dateStr: string): Date | null => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? null : date;
    };

    const validate = (field: FieldConfig, value: string | number): ValidationResult => {
        const validator = field.metadata?.validator;
        if (!validator) return { valid: true, message: '' };

        const errorMessages: string[] = [];

        // Required validation
        if (validator.required) {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                errorMessages.push(`${field.label} is required`);
            }
        }

        // Only validate further if value exists
        if (value && typeof value === 'string') {
            const trimmedValue = value.trim();

            // MinLength validation
            if (validator.minLength && trimmedValue.length < validator.minLength) {
                errorMessages.push(`${field.label} must be at least ${validator.minLength} characters`);
            }

            // MaxLength validation
            if (validator.maxLength && trimmedValue.length > validator.maxLength) {
                errorMessages.push(`${field.label} must not exceed ${validator.maxLength} characters`);
            }

            // Pattern validation (regex)
            if (validator.pattern) {
                const regex = new RegExp(validator.pattern);
                if (!regex.test(value)) {
                    errorMessages.push(`${field.label} format is invalid`);
                }
            }
        }

        // Number validations
        if (field.type === 'number' && value !== '') {
            const numValue = Number(value);
            if (!isNaN(numValue)) {
                if (validator.min !== undefined && numValue < validator.min) {
                    errorMessages.push(`${field.label} must be at least ${validator.min}`);
                }
                if (validator.max !== undefined && numValue > validator.max) {
                    errorMessages.push(`${field.label} must not exceed ${validator.max}`);
                }
            }
        }

        // Date validations
        if (field.type === 'date' && value) {
            const dateValue = parseDate(value as string);
            if (!dateValue) {
                errorMessages.push(`${field.label} has an invalid date format`);
            } else {
                const today = new Date(getTodayDate());
                today.setHours(0, 0, 0, 0);
                dateValue.setHours(0, 0, 0, 0);

                // notBefore validation (date cannot be before today)
                if (validator.notBefore === 'today' && dateValue < today) {
                    errorMessages.push(`${field.label} cannot be before today`);
                }

                // notAfter validation (date cannot be after today)
                if (validator.notAfter === 'today' && dateValue > today) {
                    errorMessages.push(`${field.label} cannot be after today`);
                }

                // minDate validation
                if (validator.minDate) {
                    const minDateValue = validator.minDate === 'today'
                        ? today
                        : parseDate(validator.minDate);
                    if (minDateValue && dateValue < minDateValue) {
                        errorMessages.push(`${field.label} must be on or after ${validator.minDate === 'today' ? 'today' : validator.minDate}`);
                    }
                }

                // maxDate validation
                if (validator.maxDate) {
                    const maxDateValue = validator.maxDate === 'today'
                        ? today
                        : parseDate(validator.maxDate);
                    if (maxDateValue && dateValue > maxDateValue) {
                        errorMessages.push(`${field.label} must be on or before ${validator.maxDate === 'today' ? 'today' : validator.maxDate}`);
                    }
                }
            }
        }

        return {
            valid: errorMessages.length === 0,
            message: errorMessages[0] || ''
        };
    };

    return { validate };
};