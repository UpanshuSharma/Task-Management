import React from 'react';

interface SubmitMessageProps {
    message: string;
    type: 'success' | 'error' | '';
    show: boolean;
}

export const SubmitMessage: React.FC<SubmitMessageProps> = ({
    message,
    type,
    show
}) => {
    if (!show) return null;

    return (
        <div style={{
            marginTop: '20px',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center',
            fontWeight: '600',
            background: type === 'success' ? '#d4edda' : '#f8d7da',
            color: type === 'success' ? '#155724' : '#721c24',
            border: type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
            boxSizing: 'border-box'
        }}>
            {message}
        </div>
    );
};