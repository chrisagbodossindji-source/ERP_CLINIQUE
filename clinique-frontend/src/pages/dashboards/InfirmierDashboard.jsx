import { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import InfirmierSidebar from '../../components/InfirmierSidebar';
import InfirmierNavbar from '../../components/InfirmierNavbar';
import StatCard from '../../components/StatCard';
import { HeartPulse, Thermometer, Weight, Ruler, Activity, Droplets, Search, Clock, ClipboardPlus } from 'lucide-react';

const InfirmierDashboard = () => {
    const { logout, user } = useAuth();
    const [tab, setTab] = useState('dashboard');
    const [consultations, setConsultations] = useState([]);
    const [selected, setSelected] = useState(null);
    const [medecins, setMedecins] = useState([]);
    const [medecinSearch, setMedecinSearch] = useState('');
    const [showMedecins, setShowMedecins] = useState(false);
    const [medecinSelected, setMedecinSelected] = useState(null);
    const [constantes, setConstantes] = useState({ tension: '', temperature: '', poids: '', taille: '', pouls: '', saturation: '' });

    useEffect(() => {
        loadData();
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        document.body.style.fontFamily = "'Inter', sans-serif";
    }, []);

    const loadData = async () => {
        try {
            const data = await api.consultations.list();
            setConsultations(data);
            const docs = await api.get('/infirmier/medecins');
            setMedecins(docs);
        } catch (e) { console.error(e); }
    };

    const handleSelect = (c) => {
        setSelected(c);
        setConstantes({
            tension: c.tension || '',
            temperature: c.temperature || '',
            poids: c.poids || '',
            taille: c.taille || '',
            pouls: c.pouls || '',
            saturation: c.saturation || ''
        });
        setMedecinSelected(c.medecin || null);
        setMedecinSearch(c.medecin ? `Dr. ${c.medecin.name}` : '');
    };

    const handleSave = async () => {
        try {
            await api.patch(`/consultations/${selected.id}/constantes`, constantes);
            alert('Constantes enregistrées');
            loadData();
        } catch (e) { alert('Erreur sauvegarde'); }
    };

    const handleEnvoyer = async () => {
        if (!medecinSelected) return alert('Veuillez sélectionner un médecin');
        try {
            await api.patch(`/consultations/${selected.id}/constantes`, constantes);
            await api.post(`/consultations/${selected.id}/assigner-medecin`, { medecin_id: medecinSelected.id });
            alert('Patient envoyé au médecin');
            setSelected(null);
            loadData();
        } catch (e) { alert('Erreur lors de l\'envoi'); }
    };

    const mesPatients = consultations.filter(c => c.infirmier_id === user?.id && c.statut === 'en_attente');
    const fileAttente = consultations.filter(c => !c.infirmier_id && c.statut === 'en_attente');
    const patientsEnvoyes = consultations.filter(c => c.infirmier_id === user?.id && (c.statut === 'en_consultation' || c.statut === 'terminee'));

    const renderDashboard = () => (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <StatCard title="En attente" value={fileAttente.length} icon={<Clock size={24} />} color="#f59e0b" />
                <StatCard title="À traiter par moi" value={mesPatients.length} icon={<Activity size={24} />} color="#2E8BBF" />
                <StatCard title="Traités ce jour" value={patientsEnvoyes.length} icon={<ClipboardPlus size={24} />} color="#10b981" />
            </div>
            <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center', color: '#64748b' }}>
                Accédez à l'onglet <strong>Consultations</strong> pour commencer la prise des constantes.
            </div>
        </div>
    );

    const renderConsultations = () => (
        <div style={{ display: 'flex', height: 'calc(100vh - 100px)', margin: '10px' }}>
            {/* SIDEBAR INTERNE */}
            <div style={{ width: '350px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflowY: 'auto', marginRight: '20px' }}>
                <SectionTitle title="Mes Patients" count={mesPatients.length} color="#0f2744" />
                {mesPatients.map(c => (
                    <div key={c.id} onClick={() => handleSelect(c)} style={itemStyle(selected?.id === c.id)}>
                        <div style={{ fontWeight: '600', color: '#0f2744' }}>{c.patient?.nom} {c.patient?.prenom}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{c.motif}</div>
                        <span style={badgeStyle('en_attente')}>Prise en charge</span>
                    </div>
                ))}

                <SectionTitle title="File d'attente" count={fileAttente.length} color="#ef4444" />
                {fileAttente.map(c => (
                    <div key={c.id} onClick={() => handleSelect(c)} style={itemStyle(selected?.id === c.id)}>
                        <div style={{ fontWeight: '600', color: '#0f2744' }}>{c.patient?.nom} {c.patient?.prenom}</div>
                        <span style={badgeStyle('file_attente')}>Attente</span>
                    </div>
                ))}

                <SectionTitle title="Patients Envoyés" count={patientsEnvoyes.length} color="#10b981" />
                {patientsEnvoyes.map(c => (
                    <div key={c.id} style={{ ...itemStyle(false), opacity: 0.7, cursor: 'default' }}>
                        <div style={{ fontWeight: '600', color: '#0f2744' }}>{c.patient?.nom} {c.patient?.prenom}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Dr. {c.medecin?.name || 'Inconnu'}</div>
                        <span style={badgeStyle('en_consultation')}>Transféré</span>
                    </div>
                ))}
            </div>

            {/* DETAIL ZONE */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {selected ? (
                    <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                            <div>
                                <h2 style={{ margin: '0 0 5px 0', color: '#0f2744' }}>{selected.patient?.nom} {selected.patient?.prenom}</h2>
                                <div style={{ fontSize: '13px', color: '#64748b' }}>N° {selected.patient?.numero_dossier} • {selected.patient?.date_naissance}</div>
                            </div>
                            <span style={badgeStyle(selected.statut)}>{selected.statut.replace('_', ' ')}</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
                            <ConstanteCard label="Tension" unit="mmHg" icon={<HeartPulse size={14}/>} value={constantes.tension} onChange={v => setConstantes({...constantes, tension: v})} />
                            <ConstanteCard label="Température" unit="°C" icon={<Thermometer size={14}/>} value={constantes.temperature} onChange={v => setConstantes({...constantes, temperature: v})} />
                            <ConstanteCard label="Poids" unit="kg" icon={<Weight size={14}/>} value={constantes.poids} onChange={v => setConstantes({...constantes, poids: v})} />
                            <ConstanteCard label="Taille" unit="cm" icon={<Ruler size={14}/>} value={constantes.taille} onChange={v => setConstantes({...constantes, taille: v})} />
                            <ConstanteCard label="Pouls" unit="bpm" icon={<Activity size={14}/>} value={constantes.pouls} onChange={v => setConstantes({...constantes, pouls: v})} />
                            <ConstanteCard label="Saturation" unit="%" icon={<Droplets size={14}/>} value={constantes.saturation} onChange={v => setConstantes({...constantes, saturation: v})} />
                        </div>

                        <div style={{ marginBottom: '30px', position: 'relative' }}>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Assigner un médecin</label>
                            <input 
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #b8ddf0', background: '#f7fbff', outline: 'none' }}
                                placeholder="Chercher un médecin..."
                                value={medecinSearch}
                                onChange={e => { setMedecinSearch(e.target.value); setShowMedecins(true); }}
                                onFocus={() => setShowMedecins(true)}
                            />
                            {showMedecins && medecinSearch && (
                                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100, maxHeight: '200px', overflowY: 'auto' }}>
                                    {medecins.filter(m => m.name.toLowerCase().includes(medecinSearch.toLowerCase())).map(m => (
                                        <div key={m.id} style={{ padding: '12px', cursor: 'pointer', borderBottom: '1px solid #f8fafc' }} onClick={() => { setMedecinSelected(m); setMedecinSearch(`Dr. ${m.name}`); setShowMedecins(false); }}>
                                            <div style={{ fontWeight: '600' }}>Dr. {m.name}</div>
                                            <div style={{ fontSize: '11px', color: '#64748b' }}>{m.specialite || 'Généraliste'}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button onClick={handleSave} style={{ padding: '12px 24px', border: '1px solid #2E8BBF', color: '#2E8BBF', background: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Enregistrer</button>
                            <button onClick={handleEnvoyer} style={{ padding: '12px 24px', background: '#2E8BBF', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Valider et envoyer au médecin</button>
                        </div>
                    </div>
                ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', background: 'white', borderRadius: '12px' }}>
                        Sélectionnez un patient pour commencer
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
            <InfirmierSidebar activeTab={tab} setTab={setTab} />
            <div style={{ marginLeft: '260px' }}>
                <InfirmierNavbar title={tab === 'dashboard' ? 'Vue générale' : tab.charAt(0).toUpperCase() + tab.slice(1)} />
                <main style={{ marginTop: '70px' }}>
                    {tab === 'dashboard' && renderDashboard()}
                    {tab === 'consultations' && renderConsultations()}
                    {tab === 'patients' && <div style={{ padding: '30px' }}>Recherche patient historique...</div>}
                </main>
            </div>
        </div>
    );
};

const SectionTitle = ({ title, count, color }) => (
    <div style={{ padding: '15px 20px', fontSize: '12px', fontWeight: '800', color: color, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f0f4f8', background: '#fcfdfe', display: 'flex', justifyContent: 'space-between' }}>
        <span>{title}</span>
        <span>{count}</span>
    </div>
);

const ConstanteCard = ({ label, unit, value, onChange, icon }) => (
    <div style={{ background: '#f7fbff', border: '0.5px solid #c8e8f5', borderRadius: '10px', padding: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#64748b', fontWeight: '600' }}>{icon} {label}</div>
        <input value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%', border: 'none', background: 'transparent', fontWeight: '800', fontSize: '20px', color: '#0f2744', outline: 'none', marginTop: '5px' }} />
        <div style={{ fontSize: '10px', color: '#94a3b8' }}>{unit}</div>
    </div>
);

const itemStyle = (isActive) => ({
    padding: '16px 20px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9',
    background: isActive ? '#EBF6FC' : 'transparent', borderLeft: isActive ? '4px solid #2E8BBF' : '4px solid transparent',
    transition: 'all 0.2s'
});

const badgeStyle = (statut) => {
    const colors = { en_attente: { bg: '#FFF3CD', color: '#856404' }, en_consultation: { bg: '#D1ECF1', color: '#0C5460' }, file_attente: { bg: '#F8D7DA', color: '#721C24' } };
    const c = colors[statut] || colors.file_attente;
    return { padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold', background: c.bg, color: c.color, textTransform: 'uppercase' };
};

export default InfirmierDashboard;
