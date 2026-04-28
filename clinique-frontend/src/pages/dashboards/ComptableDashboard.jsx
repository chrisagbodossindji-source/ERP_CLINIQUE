import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ComptableSidebar from '../../components/ComptableSidebar';
import ComptableNavbar from '../../components/ComptableNavbar';
import StatCard from '../../components/StatCard';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line 
} from 'recharts';
import { TrendingUp, FileCheck, History, PieChart as PieIcon, DollarSign } from 'lucide-react';

const ComptableDashboard = () => {
    const [tab, setTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [factures, setFactures] = useState([]);

    useEffect(() => {
        loadData();
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        document.body.style.fontFamily = "'Inter', sans-serif";
    }, []);

    const loadData = async () => {
        api.statistiques.dashboard().then(setStats);
        api.factures.list({ statut: 'paye', normalisee: 'false' }).then(setFactures);
    };

    const handleNormalise = async (id) => {
        if (!confirm('Normaliser cette facture ?')) return;
        await api.factures.normalise(id);
        alert('Facture normalisée');
        loadData();
    };

    const renderDashboard = () => (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <StatCard title="Recettes du Mois" value={`${stats?.recettes_mois} F`} icon={<TrendingUp size={24} />} color="#10b981" />
                <StatCard title="Recettes Jour" value={`${stats?.recettes_aujourd_hui} F`} icon={<DollarSign size={24} />} color="#2E8BBF" />
                <StatCard title="Top Acte" value={stats?.top_actes[0]?.designation || '--'} icon={<FileCheck size={24} />} color="#8b5cf6" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div style={chartCard}>
                    <h4 style={{ marginBottom: '20px', color: '#0f2744' }}>Recettes des 7 derniers jours</h4>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.recettes_par_semaine}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                                <Bar dataKey="total" fill="#2E8BBF" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={chartCard}>
                    <h4 style={{ marginBottom: '20px', color: '#0f2744' }}>Modes de paiement</h4>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={stats?.repartition_paiements} 
                                    dataKey="total" 
                                    nameKey="mode_paiement" 
                                    cx="50%" cy="50%" 
                                    innerRadius={60} 
                                    outerRadius={80} 
                                    paddingAngle={5}
                                >
                                    {stats?.repartition_paiements.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#2E8BBF', '#10b981', '#f59e0b', '#ef4444'][index % 4]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div style={chartCard}>
                <h4 style={{ marginBottom: '20px', color: '#0f2744' }}>Actes les plus fréquents (Top 5)</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                            <th style={thStyle}>Désignation</th>
                            <th style={{ ...thStyle, textAlign: 'right' }}>Nombre d'actes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats?.top_actes.map((a, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                <td style={tdStyle}>{a.designation}</td>
                                <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 'bold' }}>{a.count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderValidate = () => (
        <div style={{ padding: '20px' }}>
            <div style={chartCard}>
                <h3 style={{ marginBottom: '20px' }}>Factures payées à normaliser</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                            <th style={thStyle}>Date</th>
                            <th style={thStyle}>N° Facture</th>
                            <th style={thStyle}>Patient</th>
                            <th style={{ ...thStyle, textAlign: 'right' }}>Montant Total</th>
                            <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {factures.map(f => (
                            <tr key={f.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                <td style={tdStyle}>{new Date(f.created_at).toLocaleDateString()}</td>
                                <td style={{ ...tdStyle, fontWeight: 'bold' }}>{f.numero_facture}</td>
                                <td style={tdStyle}>{f.patient?.nom} {f.patient?.prenom}</td>
                                <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 'bold' }}>{f.montant_total} F</td>
                                <td style={{ ...tdStyle, textAlign: 'right' }}>
                                    <button onClick={() => handleNormalise(f.id)} style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Normaliser</button>
                                </td>
                            </tr>
                        ))}
                        {factures.length === 0 && <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>Aucune facture en attente de normalisation.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderHistory = () => (
        <div style={{ padding: '20px' }}>
            <div style={chartCard}>
                <h3 style={{ marginBottom: '20px' }}>Historique Global des Factures</h3>
                <p style={{ color: '#64748b', marginBottom: '20px' }}>Vue d'ensemble de toutes les transactions (Payées, Partielles, En attente).</p>
                <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    <History size={48} style={{ opacity: 0.2, marginBottom: '10px' }} />
                    <p>Le chargement de l'historique complet est en cours de développement...</p>
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
            <ComptableSidebar activeTab={tab} setTab={setTab} />
            <div style={{ marginLeft: '260px' }}>
                <ComptableNavbar title={tab === 'dashboard' ? 'Analyse Financière' : tab.charAt(0).toUpperCase() + tab.slice(1)} />
                <main style={{ marginTop: '70px' }}>
                    {tab === 'dashboard' && renderDashboard()}
                    {tab === 'validate' && renderValidate()}
                    {tab === 'history' && renderHistory()}
                </main>
            </div>
        </div>
    );
};

const chartCard = { background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' };
const thStyle = { padding: '12px 15px', color: '#64748b', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' };
const tdStyle = { padding: '12px 15px', fontSize: '14px', color: '#1a2e3d' };

export default ComptableDashboard;
