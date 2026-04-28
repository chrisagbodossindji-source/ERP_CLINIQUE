import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login({ email, password });
            const user = JSON.parse(localStorage.getItem('user'));
            navigate(`/dashboard/${user.role === 'receptionniste' ? 'reception' : user.role}`);
        } catch (err) {
            setError(err.message || 'Erreur de connexion');
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ flex: 1, background: 'linear-gradient(135deg, #0a2540 0%, #1a6fa8 100%)', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px' }}>
                <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>✚ ERP Clinique</h1>
                <p style={{ fontSize: '18px', opacity: 0.8, marginBottom: '40px' }}>La solution complète pour la gestion hospitalière moderne.</p>
                <ul style={{ listStyle: 'none', fontSize: '18px' }}>
                    <li style={{ marginBottom: '15px' }}>✓ Gestion des dossiers patients</li>
                    <li style={{ marginBottom: '15px' }}>✓ Suivi des consultations & examens</li>
                    <li style={{ marginBottom: '15px' }}>✓ Facturation & Assurances</li>
                    <li style={{ marginBottom: '15px' }}>✓ Statistiques & Pilotage</li>
                </ul>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
                <form onSubmit={handleSubmit} style={{ width: '400px', padding: '40px' }}>
                    <h2 style={{ marginBottom: '30px', color: '#0a2540' }}>Connexion</h2>
                    {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>{error}</div>}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#4b5563' }}>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '4px' }} placeholder="admin@clinique.com" />
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#4b5563' }}>Mot de passe</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '4px' }} placeholder="••••••••" />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '14px', background: '#0a2540', color: 'white', borderRadius: '4px', fontWeight: 'bold' }}>Se connecter</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
