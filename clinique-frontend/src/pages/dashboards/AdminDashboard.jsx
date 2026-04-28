import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import AdminNavbar from '../../components/AdminNavbar';
import StatCard from '../../components/StatCard';
import AddUserModal from '../../components/AddUserModal';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';
import { Users, CreditCard, Stethoscope, Clock, Plus, Search, Filter, RotateCcw, ShieldCheck, Activity, UserRound } from 'lucide-react';

const AdminDashboard = () => {
    const [tab, setTab] = useState('general');
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [filterRole, setFilterRole] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [logs, setLogs] = useState([]);
    const [roles, setRoles] = useState([]);
    const [tarifs, setTarifs] = useState([]);
    const [assurances, setAssurances] = useState([]);

    useEffect(() => {
        api.statistiques.dashboard().then(setStats);
        api.users.list().then(setUsers);
        api.logs.list().then(res => setLogs(res.data));
        api.roles.list().then(setRoles);
        api.tarifs.list().then(setTarifs);
        api.assurances.list().then(setAssurances);
        
        // Import Google Fonts (Inter)
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        document.body.style.fontFamily = "'Inter', sans-serif";
    }, []);

    const filteredUsers = users.filter(u => {
        const matchRole = filterRole === 'all' || u.role === filterRole;
        const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           u.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchRole && matchSearch;
    });

    const renderGeneral = () => (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <StatCard title="Total Patients" value={stats?.total_patients} icon={<Users size={24} />} color="#3b82f6" />
                <StatCard title="Recettes Jour" value={`${stats?.recettes_aujourd_hui} F`} icon={<CreditCard size={24} />} color="#10b981" />
                <StatCard title="Revenus du Mois" value={`${stats?.recettes_mois} F`} icon={<CreditCard size={24} />} color="#8b5cf6" />
                <StatCard 
                    title="En attente (>30m)" 
                    value={stats?.consultations_en_attente ?? 0} 
                    icon={<Clock size={24} />} 
                    color="#ef4444" 
                    alert={stats?.consultations_en_attente > 5}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <h4 style={{ marginBottom: '20px', color: '#0f2744' }}>Activité des consultations</h4>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats?.consultations_par_mois}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="mois" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Line type="monotone" dataKey="count" stroke="#2E8BBF" strokeWidth={3} dot={{ r: 4, fill: '#2E8BBF' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <h4 style={{ marginBottom: '20px', color: '#0f2744' }}>Top Actes</h4>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.top_actes} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="designation" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#666' }} width={100} />
                                <Tooltip />
                                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                    {stats?.top_actes.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#2E8BBF', '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'][index % 5]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderUsers = () => (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', gap: '15px', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px', flex: 1 }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input 
                            type="text" 
                            placeholder="Rechercher un utilisateur..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px' }}
                        />
                    </div>
                    <select 
                        value={filterRole} 
                        onChange={(e) => setFilterRole(e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', fontSize: '14px', minWidth: '150px' }}
                    >
                        <option value="all">Tous les rôles</option>
                        <option value="admin">Administrateur</option>
                        <option value="medecin">Médecin</option>
                        <option value="infirmier">Infirmier</option>
                        <option value="receptionniste">Réceptionniste</option>
                        <option value="caissier">Caissier</option>
                        <option value="comptable">Comptable</option>
                    </select>
                </div>
                <button 
                    onClick={() => setIsUserModalOpen(true)}
                    style={{ padding: '10px 20px', background: '#2E8BBF', color: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}
                >
                    <Plus size={18} /> Ajouter un utilisateur
                </button>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f8f9fa' }}>
                        <tr>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Utilisateur</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Rôle</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Statut</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Dernière connexion</th>
                            <th style={{ padding: '15px', textAlign: 'right', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(u => (
                            <tr key={u.id} style={{ borderTop: '1px solid #f1f5f9', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f9ff'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: '600', color: '#0f2744' }}>{u.name}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>{u.email}</div>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{ fontSize: '13px', textTransform: 'capitalize' }}>{u.role}</span>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{ 
                                        padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                                        background: u.is_active ? '#dcfce7' : '#fee2e2', 
                                        color: u.is_active ? '#166534' : '#991b1b' 
                                    }}>
                                        {u.is_active ? 'Actif' : 'Inactif'}
                                    </span>
                                </td>
                                <td style={{ padding: '15px', fontSize: '13px', color: '#64748b' }}>
                                    {u.last_login_at ? new Date(u.last_login_at).toLocaleString() : 'Jamais'}
                                </td>
                                <td style={{ padding: '15px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <button 
                                            onClick={() => api.users.resetPassword(u.id).then(res => alert(`Nouveau mot de passe: ${res.password}`))}
                                            title="Réinitialiser le mot de passe"
                                            style={{ p: '6px', borderRadius: '6px', background: '#f1f5f9', border: 'none', cursor: 'pointer' }}
                                        >
                                            <RotateCcw size={16} color="#64748b" />
                                        </button>
                                        <button 
                                            onClick={() => api.users.toggleActive(u.id).then(() => api.users.list().then(setUsers))} 
                                            style={{ 
                                                padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                                                background: u.is_active ? '#fee2e2' : '#dcfce7',
                                                color: u.is_active ? '#991b1b' : '#166534',
                                                fontSize: '12px', fontWeight: '600'
                                            }}
                                        >
                                            {u.is_active ? 'Désactiver' : 'Activer'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderTarifs = () => (
        <div style={{ padding: '20px' }}>
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f8f9fa' }}>
                        <tr>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '13px', color: '#64748b' }}>Désignation</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '13px', color: '#64748b' }}>Catégorie</th>
                            <th style={{ padding: '15px', textAlign: 'right', fontSize: '13px', color: '#64748b' }}>Prix (F)</th>
                            <th style={{ padding: '15px', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tarifs.map(t => (
                            <tr key={t.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '15px', fontWeight: '500' }}>{t.designation}</td>
                                <td style={{ padding: '15px', fontSize: '13px' }}>{t.categorie}</td>
                                <td style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold', color: '#2E8BBF' }}>{t.prix} F</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '10px', background: t.is_active ? '#dcfce7' : '#fee2e2', color: t.is_active ? '#166534' : '#991b1b' }}>
                                        {t.is_active ? 'Actif' : 'Désactivé'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderAssurances = () => (
        <div style={{ padding: '20px' }}>
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f8f9fa' }}>
                        <tr>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '13px', color: '#64748b' }}>Assureur</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '13px', color: '#64748b' }}>Code</th>
                            <th style={{ padding: '15px', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>Prise en charge</th>
                            <th style={{ padding: '15px', textAlign: 'right', fontSize: '13px', color: '#64748b' }}>Contact</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assurances.map(a => (
                            <tr key={a.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '15px', fontWeight: '600' }}>{a.nom}</td>
                                <td style={{ padding: '15px', fontSize: '12px', color: '#64748b' }}>{a.code}</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <span style={{ padding: '4px 10px', background: '#eaf6ff', color: '#2E8BBF', borderRadius: '20px', fontWeight: 'bold' }}>{a.taux_prise_en_charge}%</span>
                                </td>
                                <td style={{ padding: '15px', textAlign: 'right', fontSize: '13px' }}>{a.contact || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderLogs = () => (
        <div style={{ padding: '20px' }}>
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f8f9fa' }}>
                        <tr>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '13px', color: '#64748b' }}>Date & Heure</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '13px', color: '#64748b' }}>Utilisateur</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '13px', color: '#64748b' }}>Action</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '13px', color: '#64748b' }}>Module</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontSize: '13px', color: '#64748b' }}>IP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '15px', fontSize: '13px' }}>{new Date(log.created_at).toLocaleString()}</td>
                                <td style={{ padding: '15px', fontSize: '13px' }}>
                                    <div style={{ fontWeight: '600' }}>{log.user?.name}</div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>{log.user?.role}</div>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{ 
                                        padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold',
                                        background: log.action === 'GET' ? '#dcfce7' : log.action === 'POST' ? '#dbeafe' : '#fef3c7',
                                        color: log.action === 'GET' ? '#166534' : log.action === 'POST' ? '#1e40af' : '#92400e'
                                    }}>{log.action}</span>
                                </td>
                                <td style={{ padding: '15px', fontSize: '13px', color: '#475569' }}>{log.module}</td>
                                <td style={{ padding: '15px', fontSize: '12px', color: '#94a3b8' }}>{log.ip_address}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderRoles = () => (
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {roles.map((role, idx) => (
                <div key={idx} style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h4 style={{ margin: 0, color: '#0f2744' }}>{role.label}</h4>
                        <ShieldCheck size={20} color="#2E8BBF" />
                    </div>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>{role.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {role.permissions.map((p, i) => (
                            <span key={i} style={{ padding: '4px 10px', background: '#f1f5f9', borderRadius: '20px', fontSize: '11px', color: '#475569' }}>
                                {p}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8' }}>
            <AdminSidebar activeTab={tab} setTab={setTab} />
            <div style={{ marginLeft: '260px' }}>
                <AdminNavbar title={tab === 'general' ? 'Vue d\'ensemble' : tab === 'logs' ? 'Logs d\'activité' : tab === 'roles' ? 'Rôles & Permissions' : tab.charAt(0).toUpperCase() + tab.slice(1)} />
                <main style={{ marginTop: '70px', padding: '10px' }}>
                    {tab === 'general' && renderGeneral()}
                    {tab === 'users' && renderUsers()}
                    {tab === 'tarifs' && renderTarifs()}
                    {tab === 'assurances' && renderAssurances()}
                    {tab === 'logs' && renderLogs()}
                    {tab === 'roles' && renderRoles()}
                    {tab === 'patients' && (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', marginTop: '50px' }}>
                            <UserRound size={48} style={{ opacity: 0.2, marginBottom: '10px' }} />
                            <p>La gestion complète des patients est accessible via le module Réception ou Médecin.</p>
                        </div>
                    )}
                </main>
            </div>
            <AddUserModal 
                isOpen={isUserModalOpen} 
                onClose={() => setIsUserModalOpen(false)} 
                onUserAdded={() => api.users.list().then(setUsers)}
            />
        </div>
    );
};

export default AdminDashboard;
