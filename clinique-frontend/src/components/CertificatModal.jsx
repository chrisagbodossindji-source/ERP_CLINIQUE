import { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../services/api';

const CertificatModal = ({ isOpen, onClose, consultationId }) => {
    const [formData, setFormData] = useState({
        type: 'arret_travail',
        motif: '',
        date_debut: '',
        date_fin: '',
        contenu: ''
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.certificats.create(consultationId, formData);
            alert('Certificat généré avec succès');
            onClose();
        } catch (err) { alert('Erreur lors de la génération'); }
        finally { setLoading(false); }
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>Émettre un certificat médical</h3>
                    <X size={20} onClick={onClose} style={{ cursor: 'pointer' }} />
                </div>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                        <div>
                            <label style={labelStyle}>Type de certificat</label>
                            <select style={inputStyle} value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                <option value="arret_travail">Arrêt de travail</option>
                                <option value="aptitude">Aptitude physique</option>
                                <option value="inaptitude">Inaptitude</option>
                                <option value="autre">Autre</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Motif principal</label>
                            <input style={inputStyle} value={formData.motif} onChange={e => setFormData({...formData, motif: e.target.value})} placeholder="ex: État grippal" required />
                        </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                        <div>
                            <label style={labelStyle}>Date de début</label>
                            <input type="date" style={inputStyle} value={formData.date_debut} onChange={e => setFormData({...formData, date_debut: e.target.value})} />
                        </div>
                        <div>
                            <label style={labelStyle}>Date de fin (le cas échéant)</label>
                            <input type="date" style={inputStyle} value={formData.date_fin} onChange={e => setFormData({...formData, date_fin: e.target.value})} />
                        </div>
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label style={labelStyle}>Contenu détaillé</label>
                        <textarea style={{ ...inputStyle, height: '150px', resize: 'none' }} value={formData.contenu} onChange={e => setFormData({...formData, contenu: e.target.value})} placeholder="Rédigez ici le texte officiel du certificat..." required />
                    </div>

                    <button type="submit" disabled={loading} style={btnPrimary}>
                        {loading ? 'Génération...' : 'Valider et imprimer'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const overlayStyle = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalStyle = { backgroundColor: 'white', width: '600px', borderRadius: '12px', padding: '30px', boxShadow: '0 20px 25px rgba(0,0,0,0.1)' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' };
const labelStyle = { fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '5px', display: 'block' };
const btnPrimary = { width: '100%', padding: '12px', background: '#0f2744', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };

export default CertificatModal;
