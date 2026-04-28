import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CaissierSidebar from '../../components/CaissierSidebar';
import CaissierNavbar from '../../components/CaissierNavbar';
import StatCard from '../../components/StatCard';
import { Wallet, History, Search, Plus, Trash2, CreditCard, Banknote, Smartphone } from 'lucide-react';

const CaissierDashboard = () => {
    const [tab, setTab] = useState('billing');
    const [consultations, setConsultations] = useState([]);
    const [selected, setSelected] = useState(null);
    const [facture, setFacture] = useState(null);
    const [tarifs, setTarifs] = useState([]);
    const [paiement, setPaiement] = useState({ montant: 0, mode_paiement: 'especes', reference_transaction: '' });
    const [stats, setStats] = useState(null);
    const [paiements, setPaiements] = useState([]);

    useEffect(() => {
        loadData();
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        document.body.style.fontFamily = "'Inter', sans-serif";
    }, []);

    const loadData = async () => {
        api.consultations.list({ statut: 'terminee' }).then(setConsultations);
        api.tarifs.list().then(setTarifs);
        api.statistiques.dashboard().then(setStats);
        api.paiements.list().then(setPaiements);
    };

    const selectConsultation = async (c) => {
        setSelected(c);
        try {
            const f = await api.factures.get(c.id);
            setFacture(f);
            setPaiement({...paiement, montant: f.montant_patient});
        } catch (e) { alert('Erreur chargement facture'); }
    };

    const handleAddLigne = async (tarifId) => {
        if (!tarifId) return;
        await api.factures.addLigne(facture.id, { tarif_id: tarifId });
        const f = await api.factures.get(selected.id);
        setFacture(f);
        setPaiement({...paiement, montant: f.montant_patient});
    };

    const handleRemoveLigne = async (ligneId) => {
        await api.factures.removeLigne(facture.id, ligneId);
        const f = await api.factures.get(selected.id);
        setFacture(f);
        setPaiement({...paiement, montant: f.montant_patient});
    };

    const handlePayer = async () => {
        try {
            await api.factures.pay(facture.id, paiement);
            alert('Paiement enregistré avec succès');
            setSelected(null);
            setFacture(null);
            loadData();
        } catch (e) { alert('Erreur lors du paiement'); }
    };

    const renderDashboard = () => (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <StatCard title="Recettes Jour" value={`${stats?.recettes_aujourd_hui} F`} icon={<Banknote size={24} />} color="#10b981" />
                <StatCard title="À facturer" value={consultations.length} icon={<Wallet size={24} />} color="#2E8BBF" />
                <StatCard title="Paiements Mobile" value={`${stats?.repartition_paiements.find(p => p.mode_paiement === 'mobile_money')?.total || 0} F`} icon={<Smartphone size={24} />} color="#8b5cf6" />
            </div>
            <div style={{ background: 'white', padding: '40px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Wallet size={48} color="#2E8BBF" style={{ opacity: 0.2, marginBottom: '15px' }} />
                <h3>Gestion de la Caisse</h3>
                <p style={{ color: '#64748b' }}>{consultations.length} patient(s) attendent leur facturation.</p>
            </div>
        </div>
    );

    const renderBilling = () => (
        <div style={{ display: 'flex', height: 'calc(100vh - 100px)', margin: '10px' }}>
            {/* Liste Gauche */}
            <div style={{ width: '350px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflowY: 'auto', marginRight: '20px' }}>
                <div style={{ padding: '20px', fontWeight: 'bold', borderBottom: '1px solid #f0f4f8', color: '#0f2744' }}>Consultations à facturer</div>
                {consultations.map(c => (
                    <div key={c.id} onClick={() => selectConsultation(c)} style={{
                        padding: '16px 20px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9',
                        background: selected?.id === c.id ? '#EBF6FC' : 'transparent',
                        borderLeft: selected?.id === c.id ? '4px solid #2E8BBF' : '4px solid transparent',
                        transition: 'all 0.2s'
                    }}>
                        <div style={{ fontWeight: '600', color: '#0f2744' }}>{c.patient?.nom} {c.patient?.prenom}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', margin: '4px 0' }}>{c.motif}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8' }}>
                            <span>{new Date(c.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            <span style={{ color: '#10b981', fontWeight: 'bold' }}>TERMINÉE</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Détail Facture */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {selected && facture ? (
                    <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                            <div>
                                <h4 style={{ margin: 0, color: '#64748b', fontSize: '12px' }}>FACTURE N° {facture.numero_facture}</h4>
                                <h2 style={{ margin: '5px 0', color: '#0f2744' }}>{selected.patient?.nom} {selected.patient?.prenom}</h2>
                                {facture.patient?.assurance && <span style={{ padding: '3px 10px', background: '#dcfce7', color: '#166534', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>ASSURÉ : {facture.patient.assurance.nom}</span>}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '24px', fontWeight: '800', color: '#2E8BBF' }}>{facture.montant_patient} F</div>
                                <div style={{ fontSize: '11px', color: '#64748b' }}>NET À PAYER PATIENT</div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '30px', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                            <h5 style={{ margin: '0 0 15px 0', fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Ajouter un acte ou service</h5>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <select 
                                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #b8ddf0', outline: 'none' }}
                                    onChange={(e) => handleAddLigne(e.target.value)}
                                    value=""
                                >
                                    <option value="">Sélectionner un tarif...</option>
                                    {tarifs.map(t => <option key={t.id} value={t.id}>{t.designation} — {t.prix} F</option>)}
                                </select>
                            </div>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                                    <th style={{ padding: '12px', color: '#64748b', fontSize: '12px' }}>Désignation</th>
                                    <th style={{ padding: '12px', color: '#64748b', fontSize: '12px', textAlign: 'right' }}>Prix Unitaire</th>
                                    <th style={{ padding: '12px', color: '#64748b', fontSize: '12px', textAlign: 'center' }}>Qté</th>
                                    <th style={{ padding: '12px', color: '#64748b', fontSize: '12px', textAlign: 'right' }}>Total</th>
                                    <th style={{ padding: '12px', width: '50px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {facture.lignes.map(l => (
                                    <tr key={l.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                        <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>{l.designation}</td>
                                        <td style={{ padding: '12px', fontSize: '14px', textAlign: 'right' }}>{l.prix_unitaire} F</td>
                                        <td style={{ padding: '12px', fontSize: '14px', textAlign: 'center' }}>{l.quantite}</td>
                                        <td style={{ padding: '12px', fontSize: '14px', textAlign: 'right', fontWeight: 'bold' }}>{l.montant_total} F</td>
                                        <td style={{ padding: '12px', textAlign: 'right' }}>
                                            <Trash2 size={16} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => handleRemoveLigne(l.id)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
                            <div style={{ width: '250px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', color: '#64748b' }}>
                                    <span>Total Brut :</span>
                                    <span>{facture.montant_total} F</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', color: '#166534', fontWeight: '600' }}>
                                    <span>Part Assurance :</span>
                                    <span>- {facture.montant_assurance} F</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderTop: '2px solid #eee', marginTop: '10px', fontSize: '18px', fontWeight: '800', color: '#0f2744' }}>
                                    <span>Net Patient :</span>
                                    <span>{facture.montant_patient} F</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '25px', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #2E8BBF' }}>
                            <h4 style={{ margin: '0 0 20px 0', color: '#0f2744' }}>Enregistrer le paiement</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={labelStyle}>Montant reçu</label>
                                    <input type="number" style={inputStyle} value={paiement.montant} onChange={e => setPaiement({...paiement, montant: e.target.value})} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Mode de paiement</label>
                                    <select style={inputStyle} value={paiement.mode_paiement} onChange={e => setPaiement({...paiement, mode_paiement: e.target.value})}>
                                        <option value="especes">Espèces</option>
                                        <option value="mobile_money">Mobile Money</option>
                                        <option value="carte">Carte Bancaire</option>
                                        <option value="virement">Virement</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <button onClick={handlePayer} style={{ width: '100%', padding: '12px', background: '#2E8BBF', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Valider l'encaissement</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', background: 'white', borderRadius: '12px' }}>
                        Sélectionnez une consultation pour gérer la facture
                    </div>
                )}
            </div>
        </div>
    );

    const renderHistory = () => (
        <div style={{ padding: '20px' }}>
            <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginBottom: '20px' }}>Encaissements du jour</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                            <th style={labelStyle}>Heure</th>
                            <th style={labelStyle}>Patient</th>
                            <th style={labelStyle}>N° Facture</th>
                            <th style={labelStyle}>Mode</th>
                            <th style={{ ...labelStyle, textAlign: 'right' }}>Montant</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paiements.map(p => (
                            <tr key={p.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                <td style={{ padding: '12px', fontSize: '13px' }}>{new Date(p.date_paiement).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                                <td style={{ padding: '12px', fontSize: '14px', fontWeight: '600' }}>{p.facture?.patient?.nom} {p.facture?.patient?.prenom}</td>
                                <td style={{ padding: '12px', fontSize: '13px' }}>{p.facture?.numero_facture}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{ padding: '3px 8px', background: '#f1f5f9', borderRadius: '4px', fontSize: '11px', textTransform: 'uppercase' }}>{p.mode_paiement}</span>
                                </td>
                                <td style={{ padding: '12px', fontSize: '14px', fontWeight: 'bold', textAlign: 'right', color: '#10b981' }}>{p.montant} F</td>
                            </tr>
                        ))}
                        {paiements.length === 0 && <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>Aucun paiement enregistré aujourd'hui.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
            <CaissierSidebar activeTab={tab} setTab={setTab} />
            <div style={{ marginLeft: '260px' }}>
                <CaissierNavbar title={tab === 'billing' ? 'Facturation & Caisse' : tab.charAt(0).toUpperCase() + tab.slice(1)} />
                <main style={{ marginTop: '70px' }}>
                    {tab === 'dashboard' && renderDashboard()}
                    {tab === 'billing' && renderBilling()}
                    {tab === 'history' && renderHistory()}
                </main>
            </div>
        </div>
    );
};

const labelStyle = { display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #b8ddf0', background: 'white', outline: 'none', fontSize: '14px' };

export default CaissierDashboard;
