import { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../services/api';

const AddUserModal = ({ isOpen, onClose, onUserAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'receptionniste',
        telephone: '',
        specialite: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.users.create(formData);
            onUserAdded();
            onClose();
        } catch (err) {
            setError(err.message || 'Erreur lors de la création');
        } finally {
            setLoading(false);
        }
    };

    const overlayStyle = {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(2px)'
    };

    const modalStyle = {
        backgroundColor: 'white',
        width: '500px',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        padding: '30px',
        position: 'relative'
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #d1d5db',
        marginTop: '5px',
        fontSize: '14px'
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', cursor: 'pointer', color: '#64748b' }}>
                    <X size={20} />
                </button>
                <h3 style={{ marginBottom: '25px', color: '#0f2744' }}>Ajouter un utilisateur</h3>
                
                {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>Nom complet</label>
                        <input type="text" required style={inputStyle} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>Email professionnel</label>
                        <input type="email" required style={inputStyle} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>Mot de passe temporaire</label>
                        <input type="password" required style={inputStyle} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>Rôle</label>
                        <select style={inputStyle} value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                            <option value="admin">Administrateur</option>
                            <option value="medecin">Médecin</option>
                            <option value="infirmier">Infirmier</option>
                            <option value="receptionniste">Réceptionniste</option>
                            <option value="caissier">Caissier</option>
                            <option value="comptable">Comptable</option>
                        </select>
                    </div>
                    <div style={{ marginTop: '30px' }}>
                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{ 
                                width: '100%', padding: '12px', background: '#2E8BBF', color: 'white', 
                                borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Création...' : 'Créer l\'utilisateur'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;
