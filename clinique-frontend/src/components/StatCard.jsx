const StatCard = ({ title, value, icon, color, alert }) => {
    const cardStyle = {
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        border: alert ? '2px solid #ef4444' : '1px solid #f0f4f8',
        animation: alert ? 'pulse 2s infinite' : 'none'
    };

    const iconBoxStyle = {
        width: '50px',
        height: '50px',
        borderRadius: '12px',
        backgroundColor: `${color}15`, // opacity 0.15
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px'
    };

    return (
        <div style={cardStyle}>
            <div style={iconBoxStyle}>{icon}</div>
            <div>
                <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase' }}>{title}</div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#111827' }}>{value}</div>
            </div>
            {alert && (
                <style>{`
                    @keyframes pulse {
                        0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
                        70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
                        100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                    }
                `}</style>
            )}
        </div>
    );
};

export default StatCard;
