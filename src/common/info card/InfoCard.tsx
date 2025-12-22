import React from 'react'

interface InfoCardProps {
    title: string,
    value: string,
    className: string
}
const InfoCard: React.FC<InfoCardProps> = ({ title, value, className }) => {
    return (
        <div className="info-card">
            <div className="info-card-label">{title}</div>
            <div className={`info-card-value ${className}`}>{value}</div>
        </div>
    )
}

export default InfoCard