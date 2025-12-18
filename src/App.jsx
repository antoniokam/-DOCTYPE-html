import React, { useState, useEffect } from 'react';
import {
  Shield, LayoutDashboard, Briefcase, FileText, ClipboardCheck,
  Table as TableIcon, BarChart3, Calendar, AlertTriangle, Archive,
  Printer, Plus, CheckCircle, Clock, Trash2, X, Info, Edit3,
  Activity, Link as LinkIcon, History, LogOut, Lock, Key,
  Download, Upload, FileText as FileTextIcon
} from 'lucide-react';

// --- COMPONENTE GRAFICO RISCHIO ---
const RiskChart = ({ items }) => {
    const renderCell = (g, p) => {
        const score = g * p;
        let colorClass = "bg-green-100 border-green-200"; // Basso
        if (score > 9) colorClass = "bg-red-100 border-red-200"; // Alto
        else if (score > 4) colorClass = "bg-yellow-100 border-yellow-200"; // Medio

        const cellItems = items.filter(i => parseInt(i.prob) === p && parseInt(i.grav) === g);

        return (
            <div key={`${g}-${p}`} className={`border relative h-20 p-1 ${colorClass} transition-all hover:brightness-95`}>
                <span className="absolute top-0 right-1 text-[10px] text-slate-400 font-bold">{score}</span>
                <div className="flex flex-wrap gap-1 content-start h-full overflow-y-auto">
                    {cellItems.map((item, idx) => (
                        <div key={idx} className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[9px] font-bold shadow-sm cursor-help transform hover:scale-110 transition-transform" title={`${item.project} (Rischio: ${score})`}>
                            {idx + 1}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="flex select-none">
            <div className="flex flex-col justify-center items-center w-8 mr-2">
                <span className="transform -rotate-90 whitespace-nowrap font-bold text-xs text-slate-500 tracking-wider">GRAVITÀ (Danno)</span>
            </div>
            <div className="flex-1">
                <div className="grid grid-cols-4 gap-1 border-2 border-slate-300 rounded-lg overflow-hidden bg-slate-50">
                    {[4, 3, 2, 1].map(g => (
                        <React.Fragment key={g}>
                            {[1, 2, 3, 4].map(p => renderCell(g, p))}
                        </React.Fragment>
                    ))}
                </div>
                <div className="text-center mt-2">
                    <span className="font-bold text-xs text-slate-500 tracking-wider">PROBABILITÀ (Accadimento)</span>
                </div>
                <div className="flex justify-between text-[10px] px-2 text-slate-400 mt-1 font-mono">
                    <span>1 (Bassa)</span>
                    <span>4 (Alta)</span>
                </div>
            </div>
        </div>
    );
};

// --- APP ---
const App = () => {
    const currentYearStr = new Date().getFullYear().toString();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passInput, setPassInput] = useState("");
    const [authError, setAuthError] = useState(false);
    const [passwordWarning, setPasswordWarning] = useState(null);
    const [forcePassChange, setForcePassChange] = useState(false);

    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedYear, setSelectedYear] = useState(currentYearStr);
    const [showModal, setShowModal] = useState(null); // 'treatment', 'breach', 'dpia', 'auditQuest', 'changePass'
    const [notification, setNotification] = useState(null);

    const [authConfig, setAuthConfig] = useState(() => {
        const saved = localStorage.getItem('dpo_auth_config');
        return saved ? JSON.parse(saved) : { password: "dpo2025", lastSet: Date.now() };
    });

    useEffect(() => { localStorage.setItem('dpo_auth_config', JSON.stringify(authConfig)); }, [authConfig]);

    const initialData = {
        "2024": {
            treatments: [
                { id: 1, name: "Gestione Dipendenti", purp: "Amministrazione del personale", cat: "Anagrafica, IBAN, Fiscali", sub: "Dipendenti", ret: "10 anni", base: "Obbligo Legale", risk: "Medio", rec: "Consulente del Lavoro (Esterno)", sec: "Armadi chiusi, PC psw", trans: "No" },
                { id: 2, name: "Videosorveglianza", purp: "Sicurezza Patrimonio", cat: "Immagini video", sub: "Chiunque acceda", ret: "24 ore", base: "Legittimo Interesse", risk: "Alto", rec: "Interno", sec: "DVR sotto chiave", trans: "No" }
            ],
            breaches: [], dpias: [], deadlines: [], auditQuestions: [], esgMetrics: { training: 80, requestsTime: 12, supplierAudit: 50 },
            reportTexts: { premessa: "", attivita: "", controlli: "", nis2: "" },
            logs: []
        },
        [currentYearStr]: {
            treatments: [],
            breaches: [],
            dpias: [],
            deadlines: [
                { id: 1, task: "Revisione DPIA Videosorveglianza", date: "2025-03-15" },
                { id: 2, task: "Audit Fornitori IT", date: "2025-06-30" },
                { id: 3, task: "Formazione Privacy Dipendenti", date: "2025-09-10" }
            ],
            auditQuestions: [
                { id: 'nom1', category: "Nomine e Ruoli", label: "Sono stati nominati o designati Responsabili del Trattamento (Art. 28)?", result: "na", note: "", docLink: "" },
                { id: 'inf1', category: "Informative e Diritti", label: "È fornita l'informativa agli interessati (artt. 13-14 GDPR)?", result: "na", note: "", docLink: "" },
                { id: 'inf2', category: "Informative e Diritti", label: "È raccolto il consenso (o verificata altra base giuridica)?", result: "na", note: "", docLink: "" },
                { id: 'sec1', category: "Misure Sicurezza (Tecniche)", label: "Le credenziali di autenticazione sono individuali e complesse?", result: "na", note: "", docLink: "" },
                { id: 'sec2', category: "Misure Sicurezza (Tecniche)", label: "Le password vengono cambiate periodicamente (es. ogni 3/6 mesi)?", result: "na", note: "", docLink: "" },
                { id: 'sec3', category: "Misure Sicurezza (Tecniche)", label: "È attivo il blocco automatico della postazione (screensaver)?", result: "na", note: "", docLink: "" },
                { id: 'sec4', category: "Misure Sicurezza (Tecniche)", label: "Sono presenti Antivirus/Firewall aggiornati su tutte le macchine?", result: "na", note: "", docLink: "" },
                { id: 'sec5', category: "Misure Sicurezza (Tecniche)", label: "Viene eseguito il Backup dei dati con frequenza adeguata?", result: "na", note: "", docLink: "" },
                { id: 'sec6', category: "Misure Sicurezza (Tecniche)", label: "Il ripristino dei dati (Disaster Recovery) è stato testato?", result: "na", note: "", docLink: "" },
                { id: 'org1', category: "Misure Organizzative", label: "I documenti cartacei sono in archivi chiusi a chiave?", result: "na", note: "", docLink: "" },
                { id: 'org2', category: "Misure Organizzative (NIS2)", label: "Esiste un piano di continuità operativa (Business Continuity)?", result: "na", note: "", docLink: "" },
                { id: 'org3', category: "Misure Organizzative (NIS2)", label: "I fornitori critici sono stati valutati per la sicurezza?", result: "na", note: "", docLink: "" }
            ],
            esgMetrics: { training: 85, requestsTime: 10, supplierAudit: 60 },
            // TESTO EDITABILE PER LA RELAZIONE (Iniziale)
            reportTexts: {
                 premessa: "La presente Relazione (di seguito, la Relazione) riporta le attività e le valutazioni della funzione privacy di C.M. Service (di seguito, la Funzione Privacy) elaborate con riferimento all'esercizio sociale corrente, in ottemperanza all'art. 39 del Regolamento UE 2016/679 (GDPR). Il documento è stato predisposto con il supporto della struttura operativa interna (Ufficio Sostenibilità) che collabora con il DPO.\\n\\nIn un'ottica di adeguamento continuo agli orientamenti più recenti (incluse le direttive sulla sicurezza delle reti NIS2 e la resilienza operativa), si è provveduto a monitorare, revisionare ed incrementare la documentazione aziendale e i presidi di sicurezza.",
                 attivita: "Nel corso dell'esercizio, la Funzione Privacy ha supportato le strutture di C.M. Service per tutti gli aspetti inerenti la protezione dei dati personali. Nello specifico, le attività hanno riguardato l'aggiornamento continuativo del Registro dei Trattamenti, la revisione delle nomine a Responsabile esterno per i fornitori critici (Supply Chain Security) e l'aggiornamento della modulistica informativa per dipendenti e clienti.",
                 controlli: "L'attività di controllo si è esplicata attraverso audit periodici sui reparti aziendali (Logistica, HR, IT). In sinergia con l'Ufficio IT, e in attuazione dei principi di privacy 'by design', è stata verificata l'implementazione di procedure di autenticazione forte (MFA) per garantire la sicurezza degli accessi ai sistemi critici.",
                 nis2: "Per il prossimo esercizio, C.M. Service intende rafforzare ulteriormente i presidi di sicurezza informatica, avviando un percorso di avvicinamento ai requisiti della Direttiva UE 2022/2555 (NIS2). Si focalizzerà l'attenzione sul rafforzamento della Business Continuity, sugli audit di sicurezza della catena di approvvigionamento e sull'estensione dell'autenticazione a più fattori."
            },
            logs: []
        }
    };

    const [allData, setAllData] = useState(initialData);

    // Caricamento Dati all'avvio
    useEffect(() => {
        const load = async () => {
            if (window.electronAPI) {
                const data = await window.electronAPI.loadData();
                if (data) setAllData(data);
            } else {
                const saved = localStorage.getItem('cm_service_dpo_v11');
                if (saved) setAllData(JSON.parse(saved));
            }
        };
        load();
    }, []);

    const yearData = allData[selectedYear] || {
        treatments: [], breaches: [], dpias: [], deadlines: [], auditQuestions: [], esgMetrics: {}, logs: [], reportTexts: {}
    };

    // Se l'anno corrente non ha reportTexts (es. nuovo anno), inizializzalo copiando dal 2025 o default
    useEffect(() => {
        if (allData[selectedYear] && !allData[selectedYear].reportTexts) {
             setAllData(prev => ({
                 ...prev,
                 [selectedYear]: {
                     ...prev[selectedYear],
                     reportTexts: initialData[currentYearStr].reportTexts
                 }
             }));
        }
    }, [selectedYear]);

    // Salvataggio Dati
    useEffect(() => {
        if (window.electronAPI) {
            window.electronAPI.saveData(allData);
        } else {
            localStorage.setItem('cm_service_dpo_v11', JSON.stringify(allData));
        }
    }, [allData]);

    // --- HELPERS ---
    const notify = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };
    const formatDate = (d) => d ? new Date(d).toLocaleDateString('it-IT') : "-";
    const formatDateTime = (d) => d ? new Date(d).toLocaleString('it-IT') : "-";
    const calculateRisk = (p, g) => { const s=p*g; return { sc:s, lvl: s<=4?"Basso":s<=9?"Medio":"Alto", col: s<=4?"green":s<=9?"yellow":"red" }; };
    const checkDeadlineAlert = (dateStr) => {
        if(!dateStr) return false;
        const diff = (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24);
        return diff > 0 && diff <= 30;
    };

    // --- AUTH LOGIC ---
    const checkPasswordExpiry = () => {
        const sixMonthsMs = 180 * 24 * 60 * 60 * 1000;
        const tenDaysMs = 10 * 24 * 60 * 60 * 1000;
        const expiryDate = authConfig.lastSet + sixMonthsMs;
        const diff = expiryDate - Date.now();
        if (diff <= 0) return { status: 'expired', days: 0 };
        if (diff <= tenDaysMs) return { status: 'warning', days: Math.ceil(diff / (1000 * 60 * 60 * 24)) };
        return { status: 'ok', days: Math.ceil(diff / (1000 * 60 * 60 * 24)) };
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if(passInput === authConfig.password) {
            const expiryCheck = checkPasswordExpiry();
            if (expiryCheck.status === 'expired') {
                setIsAuthenticated(true); setForcePassChange(true); setShowModal('changePass'); setAuthError(false);
            } else {
                setIsAuthenticated(true); setAuthError(false); addLog("Login", "Accesso sistema");
                if (expiryCheck.status === 'warning') setPasswordWarning(`Attenzione: Password scade tra ${expiryCheck.days}gg.`);
                else setPasswordWarning(null);
            }
        } else setAuthError(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false); setPassInput(""); setAuthError(false); setPasswordWarning(null); setForcePassChange(false);
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const oldP = fd.get('oldP');
        const newP = fd.get('newP');
        const confP = fd.get('confP');
        if (!forcePassChange && oldP !== authConfig.password) { alert("Vecchia password errata."); return; }
        if (newP !== confP) { alert("Le password non coincidono."); return; }
        if (newP.length < 4) { alert("Password troppo corta."); return; }
        setAuthConfig({ password: newP, lastSet: Date.now() });
        addLog("Security", "Password modificata");
        setShowModal(null); setForcePassChange(false); setPasswordWarning(null); notify("Password aggiornata!");
    };

    // --- EXPORT / IMPORT ---
    const handleExport = () => {
        const now = new Date();
        const d = String(now.getDate()).padStart(2, '0');
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const y = now.getFullYear();
        const dateStr = `${d}-${m}-${y}`;
        const countKey = `dpo_backup_count_${dateStr}`;
        let count = parseInt(localStorage.getItem(countKey) || '0');
        count++;
        localStorage.setItem(countKey, count.toString());
        const prog = String(count).padStart(2, '0');
        const fileName = `Backup_DPO_CMService_${dateStr}_${prog}.json`;
        const dataStr = JSON.stringify(allData, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
    };

    const handleImportTrigger = () => document.getElementById('importFile').click();
    const handleImportFile = (e) => {
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                setAllData(data);
                notify("Dati importati con successo!");
            } catch(er) { alert("Errore lettura file."); }
        };
        reader.readAsText(file);
    };

    // --- CRUD OPS ---
    const addLog = (action, detail) => {
        const log = { id: Date.now(), date: new Date().toLocaleString('it-IT'), action, detail };
        setAllData(prev => ({
            ...prev,
            [selectedYear]: { ...prev[selectedYear], logs: [log, ...(prev[selectedYear].logs || [])] }
        }));
    };

    const addItem = (type, item, logMsg) => {
        setAllData(prev => ({
            ...prev,
            [selectedYear]: { ...prev[selectedYear], [type]: [...prev[selectedYear][type], { id: Date.now(), ...item }] }
        }));
        addLog("Creazione", logMsg);
        setShowModal(null);
        notify("Salvato!");
    };

    const deleteItem = (type, id, logMsg) => {
        if(!confirm("Sicuro di voler eliminare?")) return;
        setAllData(prev => ({
            ...prev,
            [selectedYear]: { ...prev[selectedYear], [type]: prev[selectedYear][type].filter(i=>i.id!==id) }
        }));
        addLog("Eliminazione", logMsg);
    };

    const handleEsgChange = (field, val) => {
        setAllData(prev => ({
            ...prev,
            [selectedYear]: { ...prev[selectedYear], esgMetrics: { ...prev[selectedYear].esgMetrics, [field]: val } }
        }));
    };

    const updateAudit = (id, result) => {
        setAllData(prev => ({
            ...prev,
            [selectedYear]: {
                ...prev[selectedYear],
                auditQuestions: prev[selectedYear].auditQuestions.map(q => q.id === id ? { ...q, result } : q)
            }
        }));
    };

    const updateAuditNote = (id, note) => {
        setAllData(prev => ({
            ...prev,
            [selectedYear]: {
                ...prev[selectedYear],
                auditQuestions: prev[selectedYear].auditQuestions.map(q => q.id === id ? { ...q, note } : q)
            }
        }));
    };

    const updateReportText = (key, text) => {
        setAllData(prev => ({
            ...prev,
            [selectedYear]: {
                ...prev[selectedYear],
                reportTexts: { ...prev[selectedYear].reportTexts, [key]: text }
            }
        }));
    };

    const SidebarItem = ({ icon: Icon, label, id }) => (
        <button onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${activeTab === id ? 'bg-slate-100 text-blue-700 font-bold shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
            <Icon size={18} /> <span className="text-sm">{label}</span>
        </button>
    );

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">

                {showModal === 'changePass' && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full animate-fade-in">
                            <h3 className="text-xl font-black mb-4 text-red-600 flex items-center gap-2"><Lock/> CAMBIO PASSWORD OBBLIGATORIO</h3>
                            <p className="text-sm mb-4 text-slate-600">La password è scaduta. Impostane una nuova.</p>
                            <form onSubmit={handleChangePassword} className="space-y-3">
                                <input name="oldP" type="password" placeholder="Vecchia Password" required className="w-full border p-3 rounded-xl" />
                                <input name="newP" type="password" placeholder="Nuova Password" required className="w-full border p-3 rounded-xl" />
                                <input name="confP" type="password" placeholder="Conferma Password" required className="w-full border p-3 rounded-xl" />
                                <button className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700">AGGIORNA PASSWORD</button>
                            </form>
                        </div>
                    </div>
                )}

                <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-sm w-full border border-slate-200 text-center">
                    <div className="flex justify-center mb-6"><div className="p-4 bg-blue-50 rounded-full"><Shield className="w-12 h-12 text-blue-600" /></div></div>
                    <h1 className="text-2xl font-black text-slate-900 mb-2">C.M. Service</h1>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">DPO System Login</p>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-slate-300" size={20} />
                            <input type="password" value={passInput} onChange={(e) => setPassInput(e.target.value)} className="w-full pl-10 pr-4 py-3 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Password..." autoFocus />
                        </div>
                        {authError && <p className="text-red-500 text-xs font-bold animate-pulse">Password non valida.</p>}
                        <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg">ACCEDI</button>
                    </form>
                    <p className="mt-6 text-[10px] text-slate-300">Default: <strong>dpo2025</strong></p>
                </div>
            </div>
        );
    }

    // --- MAIN LAYOUT ---
    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden print:block print:h-auto print:overflow-visible">

            {/* SIDEBAR */}
            <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-2 shadow-sm z-50 no-print">
                <div className="flex items-center gap-2 mb-8 px-2"><Shield className="text-blue-600" /><div><h1 className="font-black text-lg leading-tight">C.M. Service</h1><p className="text-[10px] font-bold text-slate-400 uppercase">DPO System v11</p></div></div>
                <nav className="flex-1 space-y-1 overflow-y-auto">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" id="dashboard" />
                    <SidebarItem icon={Briefcase} label="Registro (Art. 30)" id="register" />
                    <SidebarItem icon={FileText} label="Valutazioni DPIA" id="dpia" />
                    <SidebarItem icon={ClipboardCheck} label="Audit / NIS2 Check" id="audit" />
                    <SidebarItem icon={TableIcon} label="Matrice RACI" id="matrix" />
                    <SidebarItem icon={BarChart3} label="Reporting ESG" id="esg" />
                    <SidebarItem icon={Calendar} label="Scadenziario" id="calendar" />
                    <SidebarItem icon={AlertTriangle} label="Data Breach" id="breach" />
                    <SidebarItem icon={FileTextIcon} label="Relazione Annuale" id="report" />
                    <SidebarItem icon={History} label="Registro Log" id="logs" />
                    <SidebarItem icon={Archive} label="Archivio" id="archive" />
                </nav>
                <div className="mt-2 space-y-2 border-t pt-4">
                    <button onClick={handleExport} className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white p-2 rounded-lg font-bold text-xs hover:bg-slate-900"><Download size={14}/> ESPORTA BACKUP</button>
                    <button onClick={handleImportTrigger} className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-600 p-2 rounded-lg font-bold text-xs hover:bg-slate-200"><Upload size={14}/> IMPORTA DATI</button>
                    <input type="file" id="importFile" className="hidden" accept=".json" onChange={handleImportFile} />

                    <button onClick={() => window.print()} className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-600 p-2 rounded-lg font-bold text-xs hover:bg-slate-200"><Printer size={14}/> STAMPA VISTA</button>
                    <button onClick={() => { setForcePassChange(false); setShowModal('changePass'); }} className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 p-2 rounded-lg font-bold text-xs hover:bg-blue-100"><Key size={14}/> CAMBIA PASS</button>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 p-2 rounded-lg font-bold text-xs hover:bg-red-100"><LogOut size={14}/> LOGOUT</button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 overflow-y-auto p-10 pb-20 print:p-0 print:overflow-visible">
                <div className="flex justify-between items-center mb-10 no-print">
                    <div><h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">{activeTab.replace('_', ' ')} <span className="text-blue-600">{selectedYear}</span></h2><p className="text-slate-400 font-medium">Gestione Privacy C.M. Service</p></div>
                    <div className="flex items-center gap-4">
                        {passwordWarning && <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg text-xs font-bold animate-pulse">{passwordWarning}</div>}
                        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="bg-white border px-4 py-2 rounded-xl font-bold text-blue-600">
                            <option value="2024">2024 (Storico)</option>
                            {Object.keys(allData).filter(y=>y!=="2024").sort().reverse().map(y => <option key={y} value={y}>{y}</option>)}
                            <option value={parseInt(currentYearStr)+1}>{parseInt(currentYearStr)+1}</option>
                        </select>
                        {notification && <div className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold animate-fade-in">{notification}</div>}
                    </div>
                </div>

                {/* PRINT HEADER */}
                <div className="hidden print-only mb-8 border-b pb-4">
                    <div className="flex justify-between items-end">
                        <div><h1 className="text-3xl font-black uppercase">C.M. Service</h1><h2 className="text-xl text-slate-600">Documentazione Ufficiale Privacy</h2></div>
                        <div className="text-right"><p className="font-bold">Esercizio: {selectedYear}</p><p className="text-sm">Stampato il: {new Date().toLocaleDateString()}</p></div>
                    </div>
                </div>

                {/* --- VIEW: DASHBOARD --- */}
                {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="grid grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-2xl border shadow-sm"><p className="text-xs font-bold text-slate-400 uppercase">Conformità Audit</p><p className="text-4xl font-black text-blue-600">{yearData.auditQuestions?.length ? Math.round((yearData.auditQuestions.filter(q=>q.result==='si').length/yearData.auditQuestions.length)*100) : 0}%</p></div>
                                <div className="bg-white p-6 rounded-2xl border shadow-sm"><p className="text-xs font-bold text-slate-400 uppercase">Trattamenti</p><p className="text-4xl font-black text-slate-800">{yearData.treatments?.length||0}</p></div>
                                <div className="bg-white p-6 rounded-2xl border shadow-sm border-b-4 border-b-red-500"><p className="text-xs font-bold text-slate-400 uppercase">Breach Aperti</p><p className="text-4xl font-black text-red-600">{yearData.breaches?.filter(b=>b.status!=='Chiuso').length||0}</p></div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border shadow-sm">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Clock className="text-blue-600"/> Scadenze Imminenti</h3>
                                <div className="space-y-3">
                                    {yearData.deadlines?.map(d => (
                                        <div key={d.id} className={`flex justify-between items-center p-3 rounded-lg border ${checkDeadlineAlert(d.date) ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'}`}>
                                            <div><p className="font-bold text-sm">{d.task}</p><p className="text-xs text-slate-500">{formatDate(d.date)}</p></div>
                                            {checkDeadlineAlert(d.date) && <span className="text-[10px] font-black bg-red-600 text-white px-2 py-1 rounded uppercase">Scade</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-900 text-white p-6 rounded-3xl h-fit">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold">Ultimi Log</h3>
                                <button onClick={() => { setActiveTab('logs'); setTimeout(() => window.print(), 500); }} className="text-xs bg-slate-700 px-2 py-1 rounded hover:bg-slate-600 print:hidden flex items-center gap-1"><Printer size={12}/> STAMPA</button>
                            </div>
                            <div className="space-y-4 text-xs opacity-80">{yearData.logs?.slice(0, 5).map(l => (<div key={l.id} className="border-b border-slate-700 pb-2"><p className="font-bold text-blue-400">{l.action}</p><p>{l.detail}</p><p className="text-[10px] opacity-50">{l.date}</p></div>))}</div>
                        </div>
                    </div>
                )}

                {/* --- VIEW: REGISTER --- */}
                {activeTab === 'register' && (
                    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center">
                            <div><h3 className="font-bold text-xl">Registro Trattamenti (Art. 30)</h3><p className="text-sm text-slate-500">Mappatura completa dei processi.</p></div>
                            <button onClick={() => setShowModal('treatment')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"><Plus size={16}/> NUOVO TRATTAMENTO</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 uppercase text-[10px] font-black text-slate-500"><tr><th className="p-4">ID</th><th className="p-4">Trattamento</th><th className="p-4">Finalità</th><th className="p-4">Categorie Dati</th><th className="p-4">Interessati</th><th className="p-4">Base Giuridica</th><th className="p-4">Rischio</th><th className="p-4 text-right">Azioni</th></tr></thead>
                                <tbody className="divide-y text-slate-700">{yearData.treatments?.map(t => (<tr key={t.id} className="hover:bg-slate-50 transition-colors"><td className="p-4 font-mono text-xs text-slate-400">#{t.id}</td><td className="p-4 font-bold text-blue-900">{t.name}</td><td className="p-4">{t.purp}</td><td className="p-4 text-xs">{t.cat}</td><td className="p-4 text-xs">{t.sub}</td><td className="p-4"><span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold border">{t.base}</span></td><td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${t.risk === 'Alto' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{t.risk}</span></td><td className="p-4 text-right"><button onClick={() => deleteItem('treatments', t.id, `Eliminato trattamento: ${t.name}`)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-all"><Trash2 size={16}/></button></td></tr>))}</tbody>
                            </table>
                            {(!yearData.treatments || yearData.treatments.length === 0) && <div className="p-12 text-center text-slate-400 italic">Nessun trattamento registrato.</div>}
                        </div>
                    </div>
                )}

                {/* --- VIEW: DPIA --- */}
                {activeTab === 'dpia' && (
                    <div className="space-y-8">
                        <div className="bg-white p-6 rounded-2xl border shadow-sm">
                            <div className="flex justify-between items-start mb-6">
                                <div><h3 className="font-bold text-xl mb-2">Valutazione Rischi (DPIA)</h3><p className="text-sm text-slate-500 max-w-2xl">Analisi dei rischi per i diritti e le libertà delle persone fisiche.</p></div>
                                <button onClick={() => setShowModal('dpia')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 flex items-center gap-2 shadow-lg"><Plus size={16}/> NUOVA DPIA</button>
                            </div>
                            <div className="mb-8"><h4 className="font-bold text-xs uppercase text-slate-400 mb-4 tracking-wider">Mappa dei Rischi (Heatmap)</h4><RiskChart items={yearData.dpias || []} /></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {yearData.dpias?.map(d => (
                                <div key={d.id} className="bg-white p-5 rounded-xl border hover:shadow-md transition-all relative group">
                                    <div className={`absolute top-0 left-0 w-1 h-full rounded-l-xl bg-${d.riskLevel === 'Alto' ? 'red-500' : d.riskLevel === 'Medio' ? 'yellow-500' : 'green-500'}`}></div>
                                    <div className="pl-4">
                                        <div className="flex justify-between items-start mb-2"><h4 className="font-bold text-lg leading-tight">{d.project}</h4><button onClick={() => deleteItem('dpias', d.id, `Eliminata DPIA: ${d.project}`)} className="text-slate-300 hover:text-red-500"><X size={16}/></button></div>
                                        <div className="flex gap-2 mb-3"><span className="text-[10px] uppercase font-bold bg-slate-100 px-2 py-1 rounded text-slate-500">{formatDate(d.date)}</span><span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${d.riskLevel === 'Alto' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>Rischio: {d.riskLevel} ({d.riskScore})</span></div>
                                        <p className="text-xs text-slate-600 mb-3 line-clamp-2">{d.mitigations}</p>
                                        {d.docLink && <a href={d.docLink} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"><LinkIcon size={12}/> Documento Completo</a>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- VIEW: AUDIT --- */}
                {activeTab === 'audit' && (
                    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center">
                            <div><h3 className="font-bold text-xl">Audit & Check NIS2</h3><p className="text-sm text-slate-500">Verifica conformità e misure di sicurezza.</p></div>
                            <button onClick={() => setShowModal('auditQuest')} className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-700 flex items-center gap-2"><Plus size={16}/> AGGIUNGI CONTROLLO</button>
                        </div>
                        <div className="divide-y">
                            {yearData.auditQuestions?.map(q => (
                                <div key={q.id} className="p-4 hover:bg-slate-50 flex items-start gap-4 group">
                                    <div className={`mt-1 w-2 h-2 rounded-full ${q.result === 'si' ? 'bg-green-500' : q.result === 'no' ? 'bg-red-500' : 'bg-slate-300'}`}></div>
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <p className="font-bold text-sm text-slate-800">{q.label}</p>
                                            <button onClick={() => deleteItem('auditQuestions', q.id, `Eliminato Audit: ${q.label}`)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                                        </div>
                                        <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">{q.category}</p>
                                        <div className="flex gap-2">
                                            <button onClick={() => updateAudit(q.id, 'si')} className={`px-3 py-1 rounded text-xs font-bold border ${q.result === 'si' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-slate-600 hover:border-green-400'}`}>SÌ, CONFORME</button>
                                            <button onClick={() => updateAudit(q.id, 'no')} className={`px-3 py-1 rounded text-xs font-bold border ${q.result === 'no' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-600 hover:border-red-400'}`}>NO, CARENTE</button>
                                            <button onClick={() => updateAudit(q.id, 'na')} className={`px-3 py-1 rounded text-xs font-bold border ${q.result === 'na' ? 'bg-slate-600 text-white border-slate-600' : 'bg-white text-slate-600'}`}>N/A</button>
                                            <input type="text" placeholder="Note / Evidenze..." className="flex-1 border rounded px-2 text-xs bg-transparent" value={q.note || ""} onChange={(e) => updateAuditNote(q.id, e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- VIEW: RACI MATRIX --- */}
                {activeTab === 'matrix' && (
                    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden p-6">
                        <div className="mb-6"><h3 className="font-bold text-xl mb-2">Matrice Responsabilità (RACI)</h3><p className="text-sm text-slate-500">Ruoli Privacy in C.M. Service.</p></div>
                        <div className="grid grid-cols-4 gap-4 mb-6 text-xs border p-4 rounded-lg bg-slate-50">
                            <div className="text-center"><span className="font-black text-blue-600 text-lg block">R</span>Responsible (Esegue)</div>
                            <div className="text-center"><span className="font-black text-slate-800 text-lg block">A</span>Accountable (Risponde)</div>
                            <div className="text-center"><span className="font-black text-green-600 text-lg block">C</span>Consulted (Parere)</div>
                            <div className="text-center"><span className="font-black text-slate-400 text-lg block">I</span>Informed (Informato)</div>
                        </div>
                        <table className="w-full text-left text-xs border">
                            <thead className="bg-slate-100 uppercase font-black text-slate-600"><tr><th className="p-3 border">Attività / Processo</th><th className="p-3 text-center border bg-blue-50">Uff. Sostenibilità (Operativo)</th><th className="p-3 text-center border bg-green-50">DPO (Controllo)</th><th className="p-3 text-center border">Vertice (Titolare)</th><th className="p-3 text-center border">Altri (IT/HR)</th></tr></thead>
                            <tbody className="divide-y text-slate-700">{[{act: "Redazione delle informative", op: "R", dpo: "C / Parere", tit: "A", other: "I"},{act: "Tenuta e aggiornamento del Registro", op: "R", dpo: "C / Audit", tit: "A", other: "C (forniscono info)"},{act: "Gestione tecnica dei consensi", op: "R", dpo: "C", tit: "A", other: "I"},{act: "Valutazione d'Impatto (DPIA)", op: "R (supporto)", dpo: "C (Obbligatorio)", tit: "A", other: "R (parte tecnica)"},{act: "Gestione Data Breach (Notifica)", op: "C", dpo: "C / Guida", tit: "A", other: "R (segnalazione)"},{act: "Formazione del personale", op: "C (logistica)", dpo: "R (contenuti)", tit: "A", other: "I"},{act: "Audit periodici di conformità", op: "I (subisce)", dpo: "R", tit: "A", other: "I"},{act: "Rapporti con il Garante", op: "I", dpo: "R", tit: "A", other: "I"},{act: "Relazione Annuale sulla Privacy", op: "I", dpo: "R", tit: "A", other: "I"}].map((row, i) => (<tr key={i} className="hover:bg-slate-50"><td className="p-3 border font-bold">{row.act}</td><td className="p-3 text-center border font-bold text-blue-700 bg-blue-50 bg-opacity-30">{row.op}</td><td className="p-3 text-center border font-bold text-green-700 bg-green-50 bg-opacity-30">{row.dpo}</td><td className="p-3 text-center border font-bold">{row.tit}</td><td className="p-3 text-center border text-slate-500">{row.other}</td></tr>))}</tbody>
                        </table>
                    </div>
                )}

                {/* --- VIEW: ESG --- */}
                {activeTab === 'esg' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-2xl border shadow-sm flex flex-col items-center justify-center text-center">
                            <div className="w-32 h-32 rounded-full border-8 border-blue-100 flex items-center justify-center mb-6 relative">
                                <span className="text-3xl font-black text-blue-600">{yearData.esgMetrics?.training}%</span>
                                <div className="absolute top-0 right-0 bg-blue-600 text-white rounded-full p-2"><CheckCircle size={16}/></div>
                            </div>
                            <h3 className="font-bold text-lg mb-1">Copertura Formazione Privacy</h3>
                            <p className="text-sm text-slate-500 mb-6">Dipendenti formati nell'anno corrente.</p>
                            <button onClick={() => setShowModal('esgEdit')} className="text-blue-600 font-bold text-sm hover:underline">AGGIORNA DATI</button>
                        </div>
                        <div className="bg-white p-8 rounded-2xl border shadow-sm flex flex-col items-center justify-center text-center">
                            <div className="w-32 h-32 rounded-full border-8 border-green-100 flex items-center justify-center mb-6 relative">
                                <span className="text-3xl font-black text-green-600">{yearData.esgMetrics?.supplierAudit}%</span>
                                <div className="absolute top-0 right-0 bg-green-600 text-white rounded-full p-2"><CheckCircle size={16}/></div>
                            </div>
                            <h3 className="font-bold text-lg mb-1">Audit Fornitori (Supply Chain)</h3>
                            <p className="text-sm text-slate-500 mb-6">Fornitori critici verificati.</p>
                        </div>
                    </div>
                )}

                {/* --- VIEW: CALENDAR --- */}
                {activeTab === 'calendar' && (
                    <div className="bg-white rounded-2xl border shadow-sm p-6">
                         <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-xl">Scadenziario Adempimenti</h3>
                            <button onClick={() => setShowModal('deadline')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 flex items-center gap-2"><Plus size={16}/> NUOVA SCADENZA</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {yearData.deadlines?.sort((a,b) => new Date(a.date) - new Date(b.date)).map(d => (
                                <div key={d.id} className="border p-4 rounded-xl hover:border-blue-400 transition-colors bg-slate-50 relative overflow-hidden">
                                    {checkDeadlineAlert(d.date) && <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold px-2 py-1 uppercase rounded-bl-lg">In Scadenza</div>}
                                    <p className="font-bold text-lg mb-1">{new Date(d.date).getDate()}</p>
                                    <p className="text-xs uppercase font-bold text-slate-400 mb-3">{new Date(d.date).toLocaleString('it-IT', { month: 'long' })} {new Date(d.date).getFullYear()}</p>
                                    <p className="font-medium text-sm text-slate-800">{d.task}</p>
                                    <button onClick={() => deleteItem('deadlines', d.id, `Rimossa scadenza: ${d.task}`)} className="absolute bottom-2 right-2 text-slate-300 hover:text-red-500"><Trash2 size={14}/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- VIEW: BREACH --- */}
                {activeTab === 'breach' && (
                    <div>
                         <div className="flex justify-between items-center mb-6">
                            <div><h3 className="font-bold text-xl">Registro Violazioni (Data Breach)</h3><p className="text-sm text-slate-500">Art. 33-34 GDPR</p></div>
                            <button onClick={() => setShowModal('breach')} className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-700 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"><AlertTriangle size={16}/> NUOVA VIOLAZIONE</button>
                        </div>
                        <div className="space-y-4">
                            {yearData.breaches?.map(b => (
                                <div key={b.id} className="bg-white border border-l-4 border-l-red-500 p-6 rounded-r-xl shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-black uppercase tracking-wider">Protocollo: {b.protocol}</span>
                                                <span className="text-xs text-slate-400 font-mono">{formatDateTime(b.detectionDate)}</span>
                                            </div>
                                            <h4 className="font-bold text-lg">{b.nature}</h4>
                                        </div>
                                        <div className="text-right">
                                            <button onClick={() => deleteItem('breaches', b.id, `Eliminato Breach: ${b.protocol}`)} className="text-slate-300 hover:text-red-600 text-xs underline">Elimina Scheda</button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8 text-sm mb-4">
                                        <div><p className="font-bold text-slate-400 text-xs uppercase">Descrizione & Cause</p><p>{b.description}</p></div>
                                        <div><p className="font-bold text-slate-400 text-xs uppercase">Dati Coinvolti</p><p>{b.dataTypes} ({b.subjects})</p></div>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-lg border mb-4">
                                        <p className="font-bold text-slate-400 text-xs uppercase mb-1">Misure Correttive & Mitigazione</p>
                                        <p className="text-slate-700 italic">"{b.measures}"</p>
                                    </div>
                                    <div className="flex gap-4 border-t pt-4">
                                        <div className={`flex items-center gap-2 text-xs font-bold ${b.garante ? 'text-red-600' : 'text-green-600'}`}>
                                            {b.garante ? <CheckCircle size={14}/> : <X size={14}/>} Notifica Garante
                                        </div>
                                        <div className={`flex items-center gap-2 text-xs font-bold ${b.usersNotified ? 'text-red-600' : 'text-green-600'}`}>
                                            {b.usersNotified ? <CheckCircle size={14}/> : <X size={14}/>} Notifica Interessati
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!yearData.breaches || yearData.breaches.length === 0) && <div className="text-center py-12 bg-white rounded-xl border border-dashed"><p className="text-slate-400 font-bold">Nessuna violazione registrata nell'anno.</p></div>}
                        </div>
                    </div>
                )}

                {/* --- VIEW: RELAZIONE ANNUALE (EDITABILE) --- */}
                {activeTab === 'report' && (
                    <div className="max-w-4xl mx-auto bg-white p-12 rounded-xl shadow-lg print:shadow-none print:p-0 font-serif">
                        <div className="text-center border-b-2 border-slate-800 pb-8 mb-8">
                            <h1 className="text-3xl font-black uppercase mb-2 text-slate-900">RELAZIONE ANNUALE PRIVACY</h1>
                            <h2 className="text-xl text-slate-600">Attività del Responsabile Protezione Dati (DPO)</h2>
                            <p className="text-slate-500 mt-4 italic font-sans">Periodo di Riferimento: 01/01/{selectedYear} - 31/12/{selectedYear}</p>
                        </div>

                        <div className="space-y-8 text-justify leading-relaxed text-slate-800 text-sm">
                            <div className="bg-blue-50 p-4 rounded text-xs text-blue-700 no-print mb-4 border border-blue-200">
                                <Info size={14} className="inline mr-1"/>
                                <strong>Modalità Modifica:</strong> I testi sottostanti sono modificabili. Clicca su un paragrafo per riscriverlo o aggiornarlo. Le modifiche vengono salvate automaticamente per questo anno.
                            </div>

                            <section>
                                <h3 className="font-bold text-lg border-b border-slate-300 mb-3 text-blue-900">1. Premessa e Contesto Normativo</h3>
                                <textarea
                                    className="w-full h-40 p-2 border border-transparent hover:border-slate-300 rounded focus:bg-slate-50 focus:outline-none resize-y text-justify"
                                    value={yearData.reportTexts?.premessa}
                                    onChange={(e) => updateReportText('premessa', e.target.value)}
                                />
                            </section>

                            <section>
                                <h3 className="font-bold text-lg border-b border-slate-300 mb-3 text-blue-900">2. Attività Operative e Documentali</h3>
                                <p className="mb-2 text-slate-500 italic text-xs no-print">[Dati Automatici]: {yearData.treatments?.length} trattamenti censiti, {yearData.treatments?.filter(t => t.risk === 'Alto').length} ad alto rischio.</p>
                                <textarea
                                    className="w-full h-40 p-2 border border-transparent hover:border-slate-300 rounded focus:bg-slate-50 focus:outline-none resize-y text-justify"
                                    value={yearData.reportTexts?.attivita}
                                    onChange={(e) => updateReportText('attivita', e.target.value)}
                                />
                            </section>

                            <section>
                                <h3 className="font-bold text-lg border-b border-slate-300 mb-3 text-blue-900">3. Attività di Controllo e Sorveglianza</h3>
                                <p className="mb-2 text-slate-500 italic text-xs no-print">[Dati Automatici]: Conformità audit {yearData.auditQuestions?.length ? Math.round((yearData.auditQuestions.filter(q=>q.result==='si').length/yearData.auditQuestions.length)*100) : 0}%.</p>
                                <textarea
                                    className="w-full h-40 p-2 border border-transparent hover:border-slate-300 rounded focus:bg-slate-50 focus:outline-none resize-y text-justify"
                                    value={yearData.reportTexts?.controlli}
                                    onChange={(e) => updateReportText('controlli', e.target.value)}
                                />
                            </section>

                            <section>
                                <h3 className="font-bold text-lg border-b border-slate-300 mb-3 text-blue-900">4. Gestione Data Breach</h3>
                                <p className="mb-2">Il registro delle violazioni riporta n. <strong>{yearData.breaches?.length || 0}</strong> eventi di sicurezza registrati nell'anno.</p>
                            </section>

                            <section>
                                <h3 className="font-bold text-lg border-b border-slate-300 mb-3 text-blue-900">5. Formazione (ESG)</h3>
                                <p className="mb-2">La copertura formativa ha raggiunto il <strong>{yearData.esgMetrics?.training || 0}%</strong> della forza lavoro.</p>
                            </section>

                            <section>
                                <h3 className="font-bold text-lg border-b border-slate-300 mb-3 text-blue-900">6. Prospettive Future e Obiettivi (NIS2)</h3>
                                <textarea
                                    className="w-full h-40 p-2 border border-transparent hover:border-slate-300 rounded focus:bg-slate-50 focus:outline-none resize-y text-justify"
                                    value={yearData.reportTexts?.nis2}
                                    onChange={(e) => updateReportText('nis2', e.target.value)}
                                />
                            </section>
                        </div>

                        <div className="mt-16 pt-8 flex justify-between items-end no-print border-t">
                            <p className="text-xs text-slate-400 font-sans">Documento generato dal sistema DPO Suite il {new Date().toLocaleDateString('it-IT')}.</p>
                            <button onClick={() => window.print()} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-700 transition-colors"><Printer size={18}/> STAMPA RELAZIONE UFFICIALE</button>
                        </div>

                        <div className="hidden print-only mt-24 pt-8 flex justify-between font-sans">
                            <div className="w-1/3 border-t border-black pt-2 text-center text-sm">
                                <p className="font-bold mb-8">Il DPO</p>
                                <p className="italic">_______________________</p>
                            </div>
                            <div className="w-1/3 border-t border-black pt-2 text-center text-sm">
                                <p className="font-bold mb-8">Per Presa Visione (Titolare)</p>
                                <p className="italic">_______________________</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- VIEW: LOGS --- */}
                {activeTab === 'logs' && (
                    <div className="bg-white rounded-2xl border shadow-sm p-6">
                        <h3 className="font-bold text-xl mb-6">Registro Log di Sistema</h3>
                        <div className="overflow-auto max-h-[600px]">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-100 uppercase sticky top-0"><tr><th className="p-3">Data/Ora</th><th className="p-3">Azione</th><th className="p-3">Dettaglio</th></tr></thead>
                                <tbody className="divide-y">{yearData.logs?.map(l => (<tr key={l.id} className="hover:bg-slate-50"><td className="p-3 font-mono text-slate-500">{l.date}</td><td className="p-3 font-bold text-blue-600">{l.action}</td><td className="p-3">{l.detail}</td></tr>))}</tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- VIEW: ARCHIVE --- */}
                {activeTab === 'archive' && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
                        <Archive size={48} className="mx-auto text-slate-300 mb-4"/>
                        <h3 className="text-xl font-bold text-slate-400">Archivio Storico</h3>
                        <p className="text-slate-400">Seleziona un anno diverso dal menu in alto per consultare lo storico.</p>
                    </div>
                )}

                {/* --- MODALS --- */}
                {showModal === 'treatment' && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in relative">
                            <button onClick={() => setShowModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><X/></button>
                            <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Briefcase className="text-blue-600"/> NUOVO TRATTAMENTO</h3>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const fd = new FormData(e.target);
                                addItem('treatments', {
                                    name: fd.get('n'), purp: fd.get('p'), cat: fd.get('c'), sub: fd.get('s'),
                                    ret: fd.get('r'), base: fd.get('b'), risk: fd.get('rk'), rec: fd.get('rec'),
                                    sec: fd.get('sec'), trans: fd.get('tr')
                                }, `Aggiunto trattamento: ${fd.get('n')}`);
                            }} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2"><label className="text-xs font-bold uppercase text-slate-500">Denominazione Trattamento</label><input name="n" required className="w-full border p-2 rounded" placeholder="Es. Videosorveglianza..." /></div>
                                    <div className="col-span-2"><label className="text-xs font-bold uppercase text-slate-500">Finalità</label><input name="p" required className="w-full border p-2 rounded" placeholder="Es. Sicurezza patrimonio..." /></div>
                                    <div><label className="text-xs font-bold uppercase text-slate-500">Categorie Dati</label><input name="c" required className="w-full border p-2 rounded" placeholder="Es. Immagini..." /></div>
                                    <div><label className="text-xs font-bold uppercase text-slate-500">Interessati</label><input name="s" required className="w-full border p-2 rounded" placeholder="Es. Dipendenti..." /></div>
                                    <div><label className="text-xs font-bold uppercase text-slate-500">Conservazione</label><input name="r" required className="w-full border p-2 rounded" placeholder="Es. 24 ore..." /></div>
                                    <div><label className="text-xs font-bold uppercase text-slate-500">Base Giuridica</label><select name="b" className="w-full border p-2 rounded"><option>Obbligo Legale</option><option>Consenso</option><option>Legittimo Interesse</option><option>Contratto</option></select></div>
                                    <div><label className="text-xs font-bold uppercase text-slate-500">Livello Rischio</label><select name="rk" className="w-full border p-2 rounded"><option>Basso</option><option>Medio</option><option>Alto</option></select></div>
                                    <div><label className="text-xs font-bold uppercase text-slate-500">Trasferim. Extra UE</label><select name="tr" className="w-full border p-2 rounded"><option>No</option><option>Si</option></select></div>
                                    <div className="col-span-2"><label className="text-xs font-bold uppercase text-slate-500">Misure Sicurezza</label><textarea name="sec" className="w-full border p-2 rounded h-20" placeholder="Es. Cifratura, Password..."></textarea></div>
                                </div>
                                <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">SALVA TRATTAMENTO</button>
                            </form>
                        </div>
                    </div>
                )}

                {showModal === 'auditQuest' && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-white p-6 rounded-2xl w-full max-w-lg">
                             <button onClick={() => setShowModal(null)} className="float-right"><X/></button>
                             <h3 className="font-bold text-lg mb-4">Nuovo Controllo Audit</h3>
                             <form onSubmit={(e)=>{e.preventDefault();const fd=new FormData(e.target);addItem('auditQuestions',{category:fd.get('c'),label:fd.get('l'),result:'na',note:"",docLink:fd.get('l_doc')},`Audit: ${fd.get('l')}`)}}>
                                <input name="c" required className="w-full border p-2 rounded mb-2" placeholder="Categoria (es. Sicurezza Fisica)"/>
                                <textarea name="l" required className="w-full border p-2 rounded mb-2 h-20" placeholder="Domanda di controllo..."></textarea>
                                <input name="l_doc" className="w-full border p-2 rounded mb-4" placeholder="Link Documentazione (opzionale)"/>
                                <button className="w-full bg-blue-600 text-white font-bold py-2 rounded">SALVA</button>
                            </form>
                        </div>
                    </div>
                )}

                {/* BREACH MODAL */}
                {showModal === 'breach' && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-white p-6 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <button onClick={() => setShowModal(null)} className="float-right"><X/></button>
                            <h3 className="font-bold text-lg mb-4 text-red-600">Registrazione Data Breach</h3>
                            <form onSubmit={(e)=>{
                                e.preventDefault();
                                const fd=new FormData(e.target);
                                const protocol = fd.get('id') || `DB-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*1000)}`;
                                addItem('breaches',{
                                    protocol: protocol,
                                    detectionDate: fd.get('d'),
                                    incidentDate: fd.get('di'),
                                    description: fd.get('desc'),
                                    nature: fd.get('nat'),
                                    dataTypes: fd.get('types'),
                                    subjects: fd.get('sub'),
                                    consequences: fd.get('cons'),
                                    measures: fd.get('meas'),
                                    garante: fd.get('gar') === 'on',
                                    usersNotified: fd.get('usr') === 'on',
                                    status: 'Aperto'
                                },`Breach Registrato: ${protocol}`)
                            }}>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <div><label className="text-[10px] uppercase font-bold text-slate-500">Protocollo (ID)</label><input name="id" className="w-full border p-2 rounded text-xs" placeholder="Auto-generato se vuoto"/></div>
                                    <div><label className="text-[10px] uppercase font-bold text-slate-500">Data Rilevamento</label><input name="d" type="datetime-local" required className="w-full border p-2 rounded text-xs"/></div>
                                </div>

                                <label className="text-[10px] uppercase font-bold text-slate-500">Natura Violazione</label>
                                <select name="nat" className="w-full border p-2 rounded mb-2 text-sm">
                                    <option>Accesso non autorizzato</option>
                                    <option>Divulgazione non autorizzata</option>
                                    <option>Perdita</option>
                                    <option>Distruzione</option>
                                    <option>Modifica</option>
                                    <option>Furto Dispositivo</option>
                                    <option>Altro</option>
                                </select>

                                <textarea name="desc" required className="w-full border p-2 rounded mb-2 h-16 text-sm" placeholder="Descrizione dettagliata (causa, modalità)..."></textarea>

                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <input name="types" required className="w-full border p-2 rounded text-sm" placeholder="Tipi Dati (es. anagrafica, email)"/>
                                    <input name="sub" required className="w-full border p-2 rounded text-sm" placeholder="N. Interessati (es. <10)"/>
                                </div>

                                <textarea name="meas" className="w-full border p-2 rounded mb-2 h-12 text-sm" placeholder="Misure Correttive adottate..."></textarea>

                                <div className="flex gap-4 mb-4 bg-slate-50 p-3 rounded border">
                                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                                        <input name="gar" type="checkbox" className="w-4 h-4"/> Notifica Garante
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                                        <input name="usr" type="checkbox" className="w-4 h-4"/> Notifica Interessati
                                    </label>
                                </div>

                                <button className="w-full bg-red-600 text-white font-bold py-2 rounded-xl">REGISTRA VIOLAZIONE</button>
                            </form>
                        </div>
                    </div>
                )}

                {showModal === 'deadline' && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-white p-6 rounded-2xl w-full max-w-sm">
                            <button onClick={() => setShowModal(null)} className="float-right"><X/></button>
                            <h3 className="font-bold text-lg mb-4">Nuova Scadenza</h3>
                            <form onSubmit={(e)=>{e.preventDefault();const fd=new FormData(e.target);addItem('deadlines',{task:fd.get('t'),date:fd.get('d')},`Scadenza: ${fd.get('t')}`)}}>
                                <input name="t" required className="w-full border p-2 rounded mb-2" placeholder="Attività"/>
                                <input name="d" type="date" required className="w-full border p-2 rounded mb-4"/>
                                <button className="w-full bg-blue-600 text-white font-bold py-2 rounded">SALVA</button>
                            </form>
                        </div>
                    </div>
                )}

                {/* DPIA MODAL */}
                {showModal === 'dpia' && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-white p-6 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
                            <button onClick={() => setShowModal(null)} className="float-right"><X/></button>
                            <h3 className="font-bold text-lg mb-4">Nuova Valutazione DPIA</h3>
                            <form onSubmit={(e)=>{e.preventDefault();const fd=new FormData(e.target);const p=parseInt(fd.get('p')),g=parseInt(fd.get('g')),risk=calculateRisk(p,g);addItem('dpias',{project:fd.get('n'),date:new Date().toISOString(),prob:p,grav:g,riskScore:risk.sc,riskLevel:risk.lvl,status:"In Corso",mitigations:fd.get('m'),docLink:fd.get('l')},`DPIA: ${fd.get('n')}`)}}>
                                <input name="n" required className="w-full border p-2 rounded mb-2" placeholder="Progetto / Trattamento"/>
                                <div className="flex gap-2 mb-2">
                                    <div className="w-1/2">
                                        <label className="text-[10px] font-bold uppercase text-slate-500">Probabilità</label>
                                        <select name="p" className="border p-2 rounded w-full">
                                            <option value="1">1 - Improbabile</option>
                                            <option value="2">2 - Poco Prob.</option>
                                            <option value="3">3 - Probabile</option>
                                            <option value="4">4 - Molto Prob.</option>
                                        </select>
                                    </div>
                                    <div className="w-1/2">
                                        <label className="text-[10px] font-bold uppercase text-slate-500">Gravità Danno</label>
                                        <select name="g" className="border p-2 rounded w-full">
                                            <option value="1">1 - Minore</option>
                                            <option value="2">2 - Moderato</option>
                                            <option value="3">3 - Significativo</option>
                                            <option value="4">4 - Rilevante</option>
                                        </select>
                                    </div>
                                </div>
                                <textarea name="m" className="w-full border p-2 rounded mb-2 h-20" placeholder="Misure di mitigazione previste..."></textarea>
                                <input name="l" className="w-full border p-2 rounded mb-4" placeholder="Link DPIA completa"/>
                                <button className="w-full bg-blue-600 text-white font-bold py-2 rounded">SALVA DPIA</button>
                            </form>
                        </div>
                    </div>
                )}

                {showModal === 'esgEdit' && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-white p-6 rounded-2xl w-full max-w-sm text-center">
                            <h3 className="font-bold text-lg mb-4">Aggiorna Dati ESG</h3>
                            <div className="space-y-4">
                                <div><label className="text-xs font-bold">Formazione (%)</label><input type="range" min="0" max="100" value={yearData.esgMetrics?.training} onChange={(e) => handleEsgChange('training', e.target.value)} className="w-full"/> <span className="text-xs">{yearData.esgMetrics?.training}%</span></div>
                                <div><label className="text-xs font-bold">Audit Fornitori (%)</label><input type="range" min="0" max="100" value={yearData.esgMetrics?.supplierAudit} onChange={(e) => handleEsgChange('supplierAudit', e.target.value)} className="w-full"/> <span className="text-xs">{yearData.esgMetrics?.supplierAudit}%</span></div>
                                <button onClick={() => setShowModal(null)} className="w-full bg-slate-900 text-white font-bold py-2 rounded">CHIUDI</button>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}

export default App;
