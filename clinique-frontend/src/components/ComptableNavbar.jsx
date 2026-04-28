import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';

const ComptableNavbar = ({ title }) => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??';
    };

    const navStyle = {
        height: '70px',
        backgroundColor: '#0f2744',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 30px',
        position: 'fixed',
        top: 0,
        right: 0,
        left: '260px',
        zIndex: 90,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    return (
        <nav style={navStyle}>
            <h3 style={{ margin: 0, fontWeight: '500' }}>{title}</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{user?.name}</div>
                    <div style={{ fontSize: '11px', opacity: 0.7 }}>Comptable</div>
                </div>
                <div style={{ position: 'relative' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#2E8BBF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '2px solid rgba(255,255,255,0.2)', cursor: 'pointer' }} onClick={() => setIsOpen(!isOpen)}>
                        {getInitials(user?.name)}
                    </div>

                    {isOpen && (
                        <div style={{ position: 'absolute', top: '55px', right: 0, backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', width: '200px', padding: '10px 0', zIndex: 1000, color: '#333' }}>
                            <div style={{ padding: '10px 20px', borderBottom: '1px solid #f0f4f8', fontWeight: 'bold', fontSize: '13px' }}>{user?.email}</div>
                            <div style={{ padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                                <User size={16} /> Mon profil
                            </div>
                            <div onClick={logout} style={{ padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#ef4444' }}>
                                <LogOut size={16} /> Déconnexion
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {isOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 80 }} onClick={() => setIsOpen(false)} />}
        </nav>
    );
};

export default ComptableNavbar;
