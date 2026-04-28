import { LayoutDashboard, Stethoscope, Users, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MedecinSidebar = ({ activeTab, setTab }) => {
    const { logout } = useAuth();

    const menuItems = [
        { id: 'dashboard', label: 'Vue générale', icon: <LayoutDashboard size={20} /> },
        { id: 'consultations', label: 'Consultations', icon: <Stethoscope size={20} /> },
        { id: 'patients', label: 'Dossiers Patients', icon: <Users size={20} /> },
        { id: 'documents', label: 'Mes Documents', icon: <FileText size={20} /> },
    ];

    const sidebarStyle = {
        width: '260px',
        height: '100vh',
        backgroundColor: 'white',
        borderRight: '1px solid #e2e8f0',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100
    };

    const logoStyle = {
        padding: '25px',
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#0f2744',
        borderBottom: '1px solid #f0f4f8',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    };

    const itemStyle = (isActive) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 25px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        color: isActive ? 'white' : '#555',
        backgroundColor: isActive ? '#2E8BBF' : 'transparent',
        borderRadius: isActive ? '0 25px 25px 0' : '0',
        marginRight: isActive ? '15px' : '0',
    });

    return (
        <div style={sidebarStyle}>
            <div style={logoStyle}>
                <span style={{ color: '#2E8BBF' }}>✚</span> ERP Clinique
            </div>
            <div style={{ flex: 1, paddingTop: '10px' }}>
                {menuItems.map((item) => (
                    <div 
                        key={item.id} 
                        style={itemStyle(activeTab === item.id)}
                        onClick={() => setTab(item.id)}
                    >
                        {item.icon}
                        <span style={{ fontWeight: activeTab === item.id ? '600' : '400' }}>{item.label}</span>
                    </div>
                ))}
            </div>
            <div 
                style={{ ...itemStyle(false), borderTop: '1px solid #f0f4f8', padding: '20px 25px', color: '#ef4444' }}
                onClick={logout}
            >
                <LogOut size={20} />
                <span>Déconnexion</span>
            </div>
        </div>
    );
};

export default MedecinSidebar;
