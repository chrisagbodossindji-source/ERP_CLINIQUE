import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { api } from '../services/api';

const OrdonnanceModal = ({ isOpen, onClose, consultationId }) => {
    const [lignes, setLignes] = useState([{ medicament: '', dosage: '', frequence: '', duree: '' }]);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const addLigne = () => setLignes([...lignes, { medicament: '', dosage: '', frequence: '', duree: '' }]);
    const removeLigne = (index) => setLignes(lignes.filter((_, i) => i !== index));
    const updateLigne = (index, field, value) => {
        const newLignes = [...lignes];
        newLignes[index][field] = value;
        setLignes(newLignes);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.ordonnances.create(consultationId, { lignes });
            alert('Ordonnance créée avec succès');
            onClose();
        } catch (err) { alert('Erreur lors de la création'); }
        finally { setLoading(false); }
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>Nouvelle Ordonnance</h3>
                    <X size={20} onClick={onClose} style={{ cursor: 'pointer' }} />
                </div>
                <form onSubmit={handleSubmit}>
                    <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
                        {lignes.map((ligne, index) => (
                            <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 40px', gap: '10px', marginBottom: '10px', alignItems: 'end' }}>
                                <div>
                                    <label style={labelStyle}>Médicament</label>
                                    <input style={inputStyle} value={ligne.medicament} onChange={e => updateLigne(index, 'medicament', e.target.value)} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>Dosage</label>
                                    <input style={inputStyle} value={ligne.dosage} onChange={e => updateLigne(index, 'dosage', e.target.value)} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>Fréquence</label>
                                    <input style={inputStyle} value={ligne.frequence} onChange={e => updateLigne(index, 'frequence', e.target.value)} placeholder="ex: 3x/j" required />
                                </div>
                                <div>
                                    <label style={labelStyle}>Durée</label>
                                    <input style={inputStyle} value={ligne.duree} onChange={e => updateLigne(index, 'duree', e.target.value)} placeholder="ex: 7 jours" required />
                                </div>
                                <button type="button" onClick={() => removeLigne(index)} style={{ padding: '8px', color: '#ef4444', background: 'none' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addLigne} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#2E8BBF', background: 'none', marginBottom: '20px', fontWeight: 'bold' }}>
                        <Plus size={16} /> Ajouter un médicament
                    </button>
                    <button type="submit" disabled={loading} style={btnPrimary}>
                        {loading ? 'Création...' : 'Générer l\'ordonnance'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const overlayStyle = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalStyle = { backgroundColor: 'white', width: '800px', borderRadius: '12px', padding: '30px', boxShadow: '0 20px 25px rgba(0,0,0,0.1)' };
const inputStyle = { width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' };
const labelStyle = { fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '5px', display: 'block' };
const btnPrimary = { width: '100%', padding: '12px', background: '#2E8BBF', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };

export default OrdonnanceModal;
