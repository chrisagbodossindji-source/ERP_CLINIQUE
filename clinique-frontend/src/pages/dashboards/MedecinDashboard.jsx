import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import MedecinSidebar from '../../components/MedecinSidebar';
import MedecinNavbar from '../../components/MedecinNavbar';
import StatCard from '../../components/StatCard';
import OrdonnanceModal from '../../components/OrdonnanceModal';
import CertificatModal from '../../components/CertificatModal';
import { 
    Stethoscope, CheckCircle, Clock, Save, FileText, 
    Send, User, Activity, HeartPulse, Thermometer, Weight, PlusCircle
} from 'lucide-react';

const MedecinDashboard = () => {
    const { user } = useAuth();
    const [tab, setTab] = useState('dashboard');
    const [consultations, setConsultations] = useState([]);
    const [selected, setSelected] = useState(null);
    const [dossier, setDossier] = useState({ anamnese: '', examen_clinique: '', diagnostic: '', traitement: '', observations: '' });
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isOrdModalOpen, setIsOrdModalOpen] = useState(false);
    const [isCertModalOpen, setIsCertModalOpen] = useState(false);

    useEffect(() => {
        loadData();
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        document.body.style.fontFamily = "'Inter', sans-serif";
    }, []);

    const loadData = async () => {
        api.consultations.list({ statut: 'en_consultation' }).then(setConsultations);
        api.statistiques.dashboard().then(setStats);
    };

    const handleSelect = async (c) => {
        setSelected(c);
        try {
            const data = await api.dossier.get(c.id);
            setDossier(data);
        } catch (e) {
            setDossier({ anamnese: '', examen_clinique: '', diagnostic: '', traitement: '', observations: '' });
        }
    };

    const handleSaveDossier = async () => {
        if (!selected) return;
        setLoading(true);
        try {
            await api.dossier.save(selected.id, dossier);
            alert('Dossier médical mis à jour.');
        } catch (e) { alert('Erreur lors de la sauvegarde'); }
        finally { setLoading(false); }
    };

    const handleTerminer = async () => {
        if (!confirm('Voulez-vous terminer cette consultation ?')) return;
        setLoading(true);
        try {
            await api.dossier.save(selected.id, dossier);
            await api.consultations.updateStatut(selected.id, 'terminee');
            setSelected(null);
            loadData();
        } catch (e) { alert('Erreur lors de la clôture'); }
        finally { setLoading(false); }
    };

    const renderDashboard = () => (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <StatCard title="Mes patients" value={consultations.length} icon={<Stethoscope size={24} />} color="#2E8BBF" />
                <StatCard title="Terminés aujourd'hui" value={stats?.consultations_aujourd_hui - consultations.length} icon={<CheckCircle size={24} />} color="#10b981" />
                <StatCard title="Patients totaux" value={stats?.total_patients} icon={<User size={24} />} color="#3b82f6" />
            </div>
            <div style={{ background: 'white', padding: '40px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Activity size={48} color="#2E8BBF" style={{ opacity: 0.2, marginBottom: '15px' }} />
                <h3 style={{ color: '#0f2744' }}>Bienvenue Docteur</h3>
                <p style={{ color: '#64748b' }}>Vous avez {consultations.length} consultation(s) en attente dans votre liste.</p>
            </div>
        </div>
    );

    const renderConsultations = () => (
        <div style={{ display: 'flex', height: 'calc(100vh - 100px)', margin: '10px' }}>
            {/* Liste Gauche */}
            <div style={{ width: '350px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflowY: 'auto', marginRight: '20px' }}>
                <div style={{ padding: '20px', fontWeight: 'bold', borderBottom: '1px solid #f0f4f8', color: '#0f2744' }}>Consultations en cours</div>
                {consultations.length === 0 && <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>Aucune consultation</div>}
                {consultations.map(c => (
                    <div key={c.id} onClick={() => handleSelect(c)} style={{
                        padding: '16px 20px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9',
                        background: selected?.id === c.id ? '#EBF6FC' : 'transparent',
                        borderLeft: selected?.id === c.id ? '4px solid #2E8BBF' : '4px solid transparent',
                        transition: 'all 0.2s'
                    }}>
                        <div style={{ fontWeight: '600', color: '#0f2744' }}>{c.patient?.nom} {c.patient?.prenom}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', margin: '4px 0' }}>{c.motif}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                            <span style={{ fontSize: '10px', color: '#94a3b8' }}>{new Date(c.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            <span style={{ padding: '2px 8px', background: '#D1ECF1', color: '#0C5460', borderRadius: '12px', fontSize: '9px', fontWeight: 'bold' }}>EXAMEN</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Détail Droite */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {selected ? (
                    <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                            <div>
                                <h2 style={{ margin: '0 0 5px 0', color: '#0f2744' }}>{selected.patient?.nom} {selected.patient?.prenom}</h2>
                                <div style={{ fontSize: '13px', color: '#64748b' }}>
                                    N° {selected.patient?.numero_dossier} • {selected.patient?.date_naissance} • {selected.patient?.sexe}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => setIsOrdModalOpen(true)} style={{ padding: '10px 20px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <PlusCircle size={16} /> Ordonnance
                                </button>
                                <button onClick={() => setIsCertModalOpen(true)} style={{ padding: '10px 20px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FileText size={16} /> Certificat
                                </button>
                                <button onClick={handleSaveDossier} disabled={loading} style={{ padding: '10px 20px', border: '1px solid #2E8BBF', color: '#2E8BBF', background: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Save size={16} /> Enregistrer
                                </button>
                                <button onClick={handleTerminer} disabled={loading} style={{ padding: '10px 20px', background: '#10b981', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CheckCircle size={16} /> Clôturer
                                </button>
                            </div>
                        </div>

                        {/* Constantes de l'infirmier (Lecture seule) */}
                        <div style={{ display: 'flex', gap: '15px', padding: '15px', background: '#f8fafc', borderRadius: '10px', marginBottom: '25px' }}>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ fontSize: '10px', color: '#64748b' }}>TEMPÉRATURE</div>
                                <div style={{ fontWeight: 'bold', color: '#ef4444' }}>{selected.temperature || '--'} °C</div>
                            </div>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ fontSize: '10px', color: '#64748b' }}>TENSION</div>
                                <div style={{ fontWeight: 'bold', color: '#0f2744' }}>{selected.tension || '--'}</div>
                            </div>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ fontSize: '10px', color: '#64748b' }}>POIDS</div>
                                <div style={{ fontWeight: 'bold', color: '#0f2744' }}>{selected.poids || '--'} kg</div>
                            </div>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ fontSize: '10px', color: '#64748b' }}>POULS</div>
                                <div style={{ fontWeight: 'bold', color: '#0f2744' }}>{selected.pouls || '--'} bpm</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                            <div>
                                <label style={labelStyle}>Anamnèse (Histoire de la maladie)</label>
                                <textarea style={textareaStyle} value={dossier.anamnese} onChange={e => setDossier({...dossier, anamnese: e.target.value})} placeholder="Décrire les symptômes rapportés par le patient..." />
                            </div>
                            <div>
                                <label style={labelStyle}>Examen Clinique</label>
                                <textarea style={textareaStyle} value={dossier.examen_clinique} onChange={e => setDossier({...dossier, examen_clinique: e.target.value})} placeholder="Observations physiques, palpations..." />
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Diagnostic</label>
                            <textarea style={{ ...textareaStyle, height: '60px' }} value={dossier.diagnostic} onChange={e => setDossier({...dossier, diagnostic: e.target.value})} placeholder="Diagnostic médical retenu..." />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Traitement & Prescriptions</label>
                            <textarea style={{ ...textareaStyle, height: '80px', border: '1px solid #10b981' }} value={dossier.traitement} onChange={e => setDossier({...dossier, traitement: e.target.value})} placeholder="Médicaments, posologie, durée..." />
                        </div>

                        <div>
                            <label style={labelStyle}>Observations supplémentaires</label>
                            <textarea style={{ ...textareaStyle, height: '60px' }} value={dossier.observations} onChange={e => setDossier({...dossier, observations: e.target.value})} placeholder="Notes internes, recommandations..." />
                        </div>
                    </div>
                ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', background: 'white', borderRadius: '12px' }}>
                        Sélectionnez une consultation pour ouvrir le dossier médical
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
            <MedecinSidebar activeTab={tab} setTab={setTab} />
            <div style={{ marginLeft: '260px' }}>
                <MedecinNavbar title={tab === 'dashboard' ? 'Tableau de bord' : tab.charAt(0).toUpperCase() + tab.slice(1)} />
                <main style={{ marginTop: '70px' }}>
                    {tab === 'dashboard' && renderDashboard()}
                    {tab === 'consultations' && renderConsultations()}
                    {tab === 'patients' && (
                        <div style={{ padding: '30px' }}>
                            <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <h3>Dossiers Patients</h3>
                                <p style={{ color: '#64748b' }}>Accédez à l'historique complet des patients de la clinique.</p>
                            </div>
                        </div>
                    )}
                    {tab === 'documents' && (
                        <div style={{ padding: '30px' }}>
                            <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <h3>Mes Documents</h3>
                                <p style={{ color: '#64748b' }}>Retrouvez ici vos ordonnances et certificats émis.</p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
            {selected && (
                <>
                    <OrdonnanceModal 
                        isOpen={isOrdModalOpen} 
                        onClose={() => setIsOrdModalOpen(false)} 
                        consultationId={selected.id} 
                    />
                    <CertificatModal 
                        isOpen={isCertModalOpen} 
                        onClose={() => setIsCertModalOpen(false)} 
                        consultationId={selected.id} 
                    />
                </>
            )}
        </div>
    );
};

const labelStyle = { display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' };
const textareaStyle = { width: '100%', height: '120px', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fcfdfe', outline: 'none', fontSize: '14px', resize: 'none', transition: 'border-color 0.2s' };

export default MedecinDashboard;
