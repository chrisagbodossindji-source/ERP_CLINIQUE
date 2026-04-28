import { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import ReceptionSidebar from '../../components/ReceptionSidebar';
import ReceptionNavbar from '../../components/ReceptionNavbar';
import StatCard from '../../components/StatCard';
import { 
    Users, ClipboardPlus, Clock, CheckCircle, Search, Plus, 
    UserPlus, History, X, ChevronRight 
} from 'lucide-react';

const ReceptionDashboard = () => {
    const [tab, setTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [patients, setPatients] = useState([]);
    const [consultations, setConsultations] = useState([]);
    const [searchPatient, setSearchPatient] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showResults, setShowResults] = useState(false);
    
    const [newPatient, setNewPatient] = useState({
        nom: '', prenom: '', date_naissance: '', lieu_naissance: '', 
        sexe: 'M', telephone: '', adresse: '', situation_matrimoniale: 'Célibataire', 
        profession: ''
    });
    const [newConsultation, setNewConsultation] = useState({ motif: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        api.statistiques.dashboard().then(setStats);
        api.patients.list().then(res => setPatients(res.data));
        api.consultations.list().then(setConsultations);
    };

    const handlePatientSearch = async (val) => {
        setSearchPatient(val);
        if (val.length > 1) {
            const res = await api.patients.list(val);
            setSearchResults(res.data);
            setShowResults(true);
        } else {
            setSearchResults([]);
            setShowResults(false);
        }
    };

    const handleCreatePatient = async (e) => {
        e.preventDefault();
        try {
            const p = await api.patients.create(newPatient);
            alert('Patient enregistré avec succès !');
            setNewPatient({
                nom: '', prenom: '', date_naissance: '', lieu_naissance: '', 
                sexe: 'M', telephone: '', adresse: '', situation_matrimoniale: 'Célibataire', 
                profession: ''
            });
            loadData();
            setTab('patients');
        } catch (err) {
            alert('Erreur lors de la création');
        }
    };

    const handleCreateConsultation = async (e) => {
        e.preventDefault();
        if (!selectedPatient) return alert('Veuillez sélectionner un patient');
        try {
            await api.consultations.create({
                patient_id: selectedPatient.id,
                type_operation: 'consultation',
                motif: newConsultation.motif
            });
            alert('Consultation soumise à l\'infirmerie');
            setSelectedPatient(null);
            setSearchPatient('');
            setNewConsultation({ motif: '' });
            loadData();
            setTab('consultations');
        } catch (err) {
            alert('Erreur lors de la soumission');
        }
    };

    const renderDashboard = () => (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <StatCard title="Inscrits Aujourd'hui" value={stats?.patients_aujourd_hui} icon={<UserPlus size={24} />} color="#3b82f6" />
                <StatCard title="Consultations soumises" value={consultations.length} icon={<ClipboardPlus size={24} />} color="#2E8BBF" />
                <StatCard title="En attente" value={consultations.filter(c => c.statut === 'en_attente').length} icon={<Clock size={24} />} color="#f59e0b" />
                <StatCard title="Terminées" value={consultations.filter(c => c.statut === 'terminee').length} icon={<CheckCircle size={24} />} color="#10b981" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                <div style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h4 style={{ margin: 0 }}>Nouvelle Consultation</h4>
                        <Plus size={18} color="#2E8BBF" />
                    </div>
                    <form onSubmit={handleCreateConsultation}>
                        <div style={{ position: 'relative', marginBottom: '15px' }}>
                            <label style={labelStyle}>Rechercher Patient</label>
                            <input 
                                type="text" 
                                placeholder="Nom ou N° Dossier..." 
                                value={searchPatient}
                                onChange={(e) => handlePatientSearch(e.target.value)}
                                style={inputStyle}
                            />
                            {showResults && (
                                <div style={dropdownStyle}>
                                    {searchResults.map(p => (
                                        <div key={p.id} style={dropdownItemStyle} onClick={() => {
                                            setSelectedPatient(p);
                                            setSearchPatient(`${p.nom} ${p.prenom}`);
                                            setShowResults(false);
                                        }}>
                                            <div style={{ fontWeight: '600' }}>{p.nom} {p.prenom}</div>
                                            <div style={{ fontSize: '11px', color: '#64748b' }}>{p.numero_dossier}</div>
                                        </div>
                                    ))}
                                    {searchResults.length === 0 && <div style={{ padding: '10px', fontSize: '12px' }}>Aucun résultat</div>}
                                </div>
                            )}
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Motif de la visite</label>
                            <textarea 
                                value={newConsultation.motif}
                                onChange={(e) => setNewConsultation({ motif: e.target.value })}
                                style={{ ...inputStyle, height: '80px', resize: 'none' }}
                                placeholder="Douleurs, Fièvre, Contrôle..."
                            />
                        </div>
                        <button type="submit" style={btnPrimary}>Soumettre à l'infirmerie</button>
                    </form>
                </div>

                <div style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h4 style={{ margin: 0 }}>Derniers Patients</h4>
                        <History size={18} color="#64748b" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {patients.slice(0, 5).map(p => (
                            <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '13px' }}>{p.nom} {p.prenom}</div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>{p.numero_dossier}</div>
                                </div>
                                <ChevronRight size={16} color="#94a3b8" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderPatients = () => (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '25px' }}>
                <div style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                        <h4 style={{ margin: 0 }}>Registre des Patients</h4>
                        <div style={{ position: 'relative', width: '250px' }}>
                            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input type="text" placeholder="Filtrer..." style={{ ...inputStyle, paddingLeft: '35px', marginBottom: 0 }} />
                        </div>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                                <th style={thStyle}>Patient</th>
                                <th style={thStyle}>Date Naiss.</th>
                                <th style={thStyle}>Téléphone</th>
                                <th style={thStyle}>Assurance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={tdStyle}>
                                        <div style={{ fontWeight: '600' }}>{p.nom} {p.prenom}</div>
                                        <div style={{ fontSize: '10px', color: '#94a3b8' }}>{p.numero_dossier}</div>
                                    </td>
                                    <td style={tdStyle}>{p.date_naissance}</td>
                                    <td style={tdStyle}>{p.telephone}</td>
                                    <td style={tdStyle}>{p.assurance?.nom || 'Aucune'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={cardStyle}>
                    <h4 style={{ marginBottom: '20px' }}>Nouveau Patient</h4>
                    <form onSubmit={handleCreatePatient}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={labelStyle}>Nom</label>
                                <input type="text" required style={inputStyle} value={newPatient.nom} onChange={e => setNewPatient({...newPatient, nom: e.target.value})} />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={labelStyle}>Prénom</label>
                                <input type="text" required style={inputStyle} value={newPatient.prenom} onChange={e => setNewPatient({...newPatient, prenom: e.target.value})} />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={labelStyle}>Date Naiss.</label>
                                <input type="date" required style={inputStyle} value={newPatient.date_naissance} onChange={e => setNewPatient({...newPatient, date_naissance: e.target.value})} />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={labelStyle}>Sexe</label>
                                <select style={inputStyle} value={newPatient.sexe} onChange={e => setNewPatient({...newPatient, sexe: e.target.value})}>
                                    <option value="M">Masculin</option>
                                    <option value="F">Féminin</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={labelStyle}>Téléphone</label>
                            <input type="text" required style={inputStyle} value={newPatient.telephone} onChange={e => setNewPatient({...newPatient, telephone: e.target.value})} />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={labelStyle}>Situation Matrimoniale</label>
                            <select style={inputStyle} value={newPatient.situation_matrimoniale} onChange={e => setNewPatient({...newPatient, situation_matrimoniale: e.target.value})}>
                                <option value="Célibataire">Célibataire</option>
                                <option value="Marié(e)">Marié(e)</option>
                                <option value="Divorcé(e)">Divorcé(e)</option>
                                <option value="Veuf/Veuve">Veuf/Veuve</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={labelStyle}>Profession</label>
                            <input type="text" style={inputStyle} value={newPatient.profession} onChange={e => setNewPatient({...newPatient, profession: e.target.value})} />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Adresse</label>
                            <input type="text" style={inputStyle} value={newPatient.adresse} onChange={e => setNewPatient({...newPatient, adresse: e.target.value})} />
                        </div>
                        <button type="submit" style={btnPrimary}>Enregistrer le patient</button>
                    </form>
                </div>
            </div>
        </div>
    );

    const renderConsultations = () => (
        <div style={{ padding: '20px' }}>
            <div style={cardStyle}>
                <h4 style={{ marginBottom: '20px' }}>Consultations du jour</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                            <th style={thStyle}>Heure</th>
                            <th style={thStyle}>Patient</th>
                            <th style={thStyle}>Motif</th>
                            <th style={thStyle}>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {consultations.map(c => (
                            <tr key={c.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                <td style={tdStyle}>{new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                <td style={tdStyle}>
                                    <div style={{ fontWeight: '600' }}>{c.patient.nom} {c.patient.prenom}</div>
                                </td>
                                <td style={tdStyle}>{c.motif}</td>
                                <td style={tdStyle}>
                                    <span style={{ 
                                        padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold',
                                        background: c.statut === 'en_attente' ? '#fef3c7' : c.statut === 'terminee' ? '#dcfce7' : '#dbeafe',
                                        color: c.statut === 'en_attente' ? '#92400e' : c.statut === 'terminee' ? '#166534' : '#1e40af'
                                    }}>{c.statut.replace('_', ' ')}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8' }}>
            <ReceptionSidebar activeTab={tab} setTab={setTab} />
            <div style={{ marginLeft: '260px' }}>
                <ReceptionNavbar title={tab === 'dashboard' ? 'Tableau de bord' : tab.charAt(0).toUpperCase() + tab.slice(1)} />
                <main style={{ marginTop: '70px' }}>
                    {tab === 'dashboard' && renderDashboard()}
                    {tab === 'patients' && renderPatients()}
                    {tab === 'consultations' && renderConsultations()}
                </main>
            </div>
        </div>
    );
};

// Styles
const cardStyle = { background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '0.5px solid #b8ddf0', background: '#f7fbff', marginBottom: '15px', fontSize: '14px', outline: 'none' };
const labelStyle = { display: 'block', fontSize: '11px', color: '#64748b', marginBottom: '5px', textTransform: 'uppercase', fontWeight: '600' };
const btnPrimary = { width: '100%', padding: '12px', background: '#2E8BBF', color: 'white', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' };
const thStyle = { padding: '15px', color: '#64748b', fontSize: '12px', fontWeight: '600' };
const tdStyle = { padding: '15px', fontSize: '14px' };
const dropdownStyle = { position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 50, maxHeight: '200px', overflowY: 'auto' };
const dropdownItemStyle = { padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' };

export default ReceptionDashboard;
