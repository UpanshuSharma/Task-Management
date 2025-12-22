import React from 'react';
import '../styles/form.css';

interface SubmitButtonProps {
    onClick: () => void;
    disabled?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
    onClick,
    disabled = false
}) => {


    const getButtonClass = () => {
        return `submit-btn ${disabled ? 'submit-btn--disabled' : 'submit-btn--enabled'}`;
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={getButtonClass()}
        >
            Submit Form
        </button>
    );
};