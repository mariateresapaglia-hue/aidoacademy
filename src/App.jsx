import { useState, useEffect, useCallback } from "react";
import {
  GraduationCap, Database, Laptop, Megaphone, Shield, FileText, Lock,
  Briefcase, Calculator, Users, MessageCircle, Star, Smartphone, School,
  Monitor, Heart, Activity, TrendingUp, Search, ChevronLeft, ChevronRight,
  Play, FileDown, CheckCircle2, Circle, Lock as LockIcon, Plus, Trash2,
  LogIn, LogOut, User, ShieldCheck, X, Edit3, Save, BarChart3, Award,
  ChevronDown, ChevronUp, AlertCircle
} from "lucide-react";

// ---------- Supabase ----------
// NOTA: la libreria @supabase/supabase-js non e' disponibile nell'anteprima
// di Claude.ai, quindi qui viene caricata dinamicamente solo quando il sito
// gira nel browser vero (es. sul tuo computer con Vite, o sul sito pubblicato).
// Su Claude.ai questa parte viene semplicemente ignorata senza dare errori.
const SUPABASE_URL = "https://lzpdypviojpjzpgfpsaf.supabase.co";
const SUPABASE_KEY = "sb_publishable_nfPjpS3i1fIl3yKHzuRpwg_QKYcVox1";

let supabase = null;
let supabaseReady = (async () => {
  try {
    const mod = await import("@supabase/supabase-js");
    supabase = mod.createClient(SUPABASE_URL, SUPABASE_KEY);
    return true;
  } catch {
    supabase = null;
    return false;
  }
})();

// ---------- Icon map ----------
const ICONS = {
  GraduationCap, Database, Laptop, Megaphone, Shield, FileText, Lock,
  Briefcase, Calculator, Users, MessageCircle, Star, Smartphone, School,
  Monitor, Heart, Activity, TrendingUp,
};

// ---------- Seed data (from "Reti di Valore") ----------
const SEED_COURSES = [
  {
    id: "c-statuto",
    track: "governance",
    icon: "FileText",
    title: "Statuto AIDO e Governance Associativa",
    description: "Quadro normativo e statutario, ruoli e funzionamento degli organi associativi.",
    modules: [
      { id: "m1", type: "video", title: "Introduzione allo Statuto AIDO", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "12 min" },
      { id: "m2", type: "pdf", title: "Statuto AIDO Nazionale (PDF)", url: "https://www.aido.it" },
      { id: "m3", type: "video", title: "Organi associativi e ruoli", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "18 min" },
    ],
    quiz: [
      { q: "Qual è l'organo che approva il bilancio dell'associazione?", options: ["Il Consiglio Direttivo", "L'Assemblea dei Socii", "Il Presidente", "Il Revisore"], correct: 1 },
      { q: "Lo Statuto AIDO regola principalmente:", options: ["Solo gli aspetti fiscali", "Ruoli, organi e funzionamento associativo", "Le campagne social", "I rapporti con gli ospedali"], correct: 1 },
    ],
  },
  {
    id: "c-runts",
    track: "governance",
    icon: "Lock",
    title: "RUNTS, SPID, CIE, PEC e Firma Digitale",
    description: "Adempimenti verso il Registro Unico del Terzo Settore e strumenti digitali per identità e firma.",
    modules: [
      { id: "m1", type: "video", title: "Cos'è il RUNTS e perché è importante", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "15 min" },
      { id: "m2", type: "pdf", title: "Guida pratica a SPID e CIE", url: "https://www.aido.it" },
      { id: "m3", type: "pdf", title: "Firma digitale e PEC: vademecum", url: "https://www.aido.it" },
    ],
    quiz: [
      { q: "Il RUNTS è:", options: ["Un social network", "Il Registro Unico del Terzo Settore", "Un sistema di pagamento", "Una piattaforma video"], correct: 1 },
      { q: "La PEC serve principalmente a:", options: ["Gestire i social media", "Inviare comunicazioni con valore legale", "Fare videochiamate", "Archiviare foto"], correct: 1 },
    ],
  },
  {
    id: "c-privacy",
    track: "governance",
    icon: "Shield",
    title: "Privacy e GDPR",
    description: "Conformità al trattamento dei dati personali.",
    modules: [
      { id: "m1", type: "video", title: "Fondamenti del GDPR per le associazioni", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "20 min" },
      { id: "m2", type: "pdf", title: "Modello di informativa privacy AIDO", url: "https://www.aido.it" },
    ],
    quiz: [
      { q: "Il GDPR riguarda:", options: ["La gestione del bilancio", "La protezione dei dati personali", "La raccolta fondi", "I trasporti"], correct: 1 },
    ],
  },
  {
    id: "c-segreteria",
    track: "governance",
    icon: "Briefcase",
    title: "Segreteria Associativa",
    description: "Gestione amministrativa, protocollazione, archiviazione e modulistica ufficiale AIDO.",
    modules: [
      { id: "m1", type: "video", title: "Organizzare la segreteria associativa", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "14 min" },
      { id: "m2", type: "pdf", title: "Modulistica ufficiale AIDO", url: "https://www.aido.it" },
    ],
    quiz: [
      { q: "La protocollazione serve a:", options: ["Decorare i documenti", "Tracciare in modo ordinato la corrispondenza", "Sostituire le email", "Calcolare il bilancio"], correct: 1 },
    ],
  },
  {
    id: "c-bilancio",
    track: "governance",
    icon: "Calculator",
    title: "Contabilità e Bilancio ETS",
    description: "Contabilità e redazione del bilancio secondo la normativa ETS.",
    modules: [
      { id: "m1", type: "video", title: "Principi di contabilità per ETS", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "22 min" },
      { id: "m2", type: "pdf", title: "Schema di bilancio ETS", url: "https://www.aido.it" },
    ],
    quiz: [
      { q: "ETS è l'acronimo di:", options: ["Ente del Terzo Settore", "Ente Tecnico Sanitario", "Ente Territoriale Sociale", "Ente di Tutela Sociale"], correct: 0 },
    ],
  },
  {
    id: "c-piattaforme",
    track: "governance",
    icon: "Database",
    title: "Piattaforme Digitali AIDO (SìAIDO e ImpactAIDO)",
    description: "Gestionale associativo e piattaforma per la rendicontazione sociale.",
    modules: [
      { id: "m1", type: "video", title: "Tour del gestionale SìAIDO", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "16 min" },
      { id: "m2", type: "video", title: "ImpactAIDO: la rendicontazione sociale", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "10 min" },
    ],
    quiz: [
      { q: "SìAIDO è:", options: ["Un'app di messaggistica", "Il nuovo sistema informativo associativo", "Un social network", "Un sito di e-commerce"], correct: 1 },
    ],
  },
  {
    id: "c-comunicazione",
    track: "operative",
    icon: "MessageCircle",
    title: "Comunicazione Efficace e Interculturale",
    description: "Comunicazione chiara, persuasiva ed efficace in contesti relazionali e interculturali.",
    modules: [
      { id: "m1", type: "video", title: "Le basi della comunicazione efficace", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "17 min" },
      { id: "m2", type: "pdf", title: "Schede pratiche di comunicazione", url: "https://www.aido.it" },
    ],
    quiz: [
      { q: "La comunicazione interculturale serve a:", options: ["Parlare più lingue", "Relazionarsi efficacemente con contesti culturali diversi", "Scrivere meglio le email", "Usare i social"], correct: 1 },
    ],
  },
  {
    id: "c-leadership",
    track: "operative",
    icon: "Users",
    title: "Leadership, Gestione dei Gruppi e dei Conflitti",
    description: "Ascolto empatico, leadership consapevole e gestione dei conflitti nei team di volontari.",
    modules: [
      { id: "m1", type: "video", title: "Leadership consapevole nel volontariato", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "19 min" },
      { id: "m2", type: "video", title: "Gestire i conflitti nei team", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "15 min" },
    ],
    quiz: [
      { q: "L'ascolto empatico richiede principalmente:", options: ["Dare subito consigli", "Comprendere il punto di vista dell'altro", "Parlare di più", "Evitare il confronto"], correct: 1 },
    ],
  },
  {
    id: "c-volontario",
    track: "operative",
    icon: "Star",
    title: "Crescita e Valorizzazione del Volontario",
    description: "Autonomia, proattività e identificazione con i valori AIDO. Gestione del passaggio generazionale.",
    modules: [
      { id: "m1", type: "video", title: "Valorizzare il volontario AIDO", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "13 min" },
      { id: "m2", type: "pdf", title: "Guida al passaggio generazionale", url: "https://www.aido.it" },
    ],
    quiz: [
      { q: "Il passaggio generazionale riguarda:", options: ["Solo gli aspetti fiscali", "Il trasferimento di ruoli e competenze tra generazioni di volontari", "La gestione dei social", "La contabilità"], correct: 1 },
    ],
  },
  {
    id: "c-digital",
    track: "operative",
    icon: "Smartphone",
    title: "Comunicazione Digitale e Social Media AIDO",
    description: "Gestione dei canali social, sito e App AIDO.",
    modules: [
      { id: "m1", type: "video", title: "Gestire i social media AIDO", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "21 min" },
      { id: "m2", type: "pdf", title: "Linee guida comunicazione digitale", url: "https://www.aido.it" },
    ],
    quiz: [
      { q: "Una buona strategia social prevede:", options: ["Pubblicare senza pianificazione", "Contenuti coerenti e pianificati", "Solo testo senza immagini", "Nessuna interazione con i follower"], correct: 1 },
    ],
  },
  {
    id: "c-scuola",
    track: "operative",
    icon: "School",
    title: "Percorsi Scuola",
    description: "Interventi formativi nelle scuole, con il supporto dei materiali didattici donati da AIDO Lombardia.",
    modules: [
      { id: "m1", type: "video", title: "Come condurre un intervento nelle scuole", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "16 min" },
      { id: "m2", type: "pdf", title: "Materiali didattici AIDO Lombardia", url: "https://www.aido.it" },
    ],
    quiz: [
      { q: "I materiali didattici per le scuole sono stati donati da:", options: ["AIDO Lombardia", "Il Ministero della Salute", "Un'azienda privata", "Un'università straniera"], correct: 0 },
    ],
  },
  {
    id: "c-alfabetizzazione",
    track: "operative",
    icon: "Monitor",
    title: "Alfabetizzazione Digitale",
    description: "Competenze base su PC, Word, Excel e PowerPoint.",
    modules: [
      { id: "m1", type: "video", title: "Le basi di Word ed Excel", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "25 min" },
      { id: "m2", type: "video", title: "Creare presentazioni con PowerPoint", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "18 min" },
    ],
    quiz: [
      { q: "PowerPoint si usa principalmente per:", options: ["Fogli di calcolo", "Presentazioni", "Database", "Posta elettronica"], correct: 1 },
    ],
  },
  {
    id: "c-fundraising",
    track: "operative",
    icon: "Heart",
    title: "Fundraising",
    description: "Tecniche e strumenti di raccolta fondi per il Terzo Settore, con attenzione al mondo del volontariato.",
    modules: [
      { id: "m1", type: "video", title: "Strategie di fundraising per ETS", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "20 min" },
      { id: "m2", type: "pdf", title: "Toolkit del fundraiser AIDO", url: "https://www.aido.it" },
    ],
    quiz: [
      { q: "Il fundraising consiste in:", options: ["La gestione del personale", "La raccolta di fondi e risorse", "La contabilità ordinaria", "La comunicazione interna"], correct: 1 },
    ],
  },
  {
    id: "c-progettazione",
    track: "operative",
    icon: "TrendingUp",
    title: "Progettazione e Coprogettazione, Bandi e Finanziamenti",
    description: "Scrittura e gestione di progetti. Opportunità di finanziamento e partecipazione ai bandi.",
    modules: [
      { id: "m1", type: "video", title: "Come scrivere un progetto vincente", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "23 min" },
      { id: "m2", type: "pdf", title: "Guida ai bandi per il Terzo Settore", url: "https://www.aido.it" },
    ],
    quiz: [
      { q: "La coprogettazione prevede:", options: ["Un solo soggetto decisore", "La collaborazione tra più soggetti", "L'assenza di pianificazione", "Solo finanziamenti privati"], correct: 1 },
    ],
  },
  {
    id: "c-donazione",
    track: "operative",
    icon: "Activity",
    title: "Donazione di Organi, Tessuti e Cellule",
    description: "Fondamenti scientifici, valoriali e normativi della donazione. Aspetti clinici del processo.",
    modules: [
      { id: "m1", type: "video", title: "Il processo di donazione: aspetti clinici", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "30 min" },
      { id: "m2", type: "pdf", title: "Normativa sulla donazione di organi", url: "https://www.aido.it" },
      { id: "m3", type: "video", title: "I valori della donazione", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "12 min" },
    ],
    quiz: [
      { q: "La donazione di organi è regolata da:", options: ["Norme internazionali non vincolanti", "Una normativa nazionale specifica", "Accordi privati tra ospedali", "Nessuna normativa"], correct: 1 },
      { q: "Gli aspetti clinici della donazione riguardano:", options: ["Solo la parte burocratica", "Le procedure medico-sanitarie del processo", "La comunicazione social", "Il bilancio associativo"], correct: 1 },
    ],
  },
  {
    id: "c-stilivita",
    track: "operative",
    icon: "Activity",
    title: "Promozione di Corretti Stili di Vita",
    description: "Stili di vita sani e competenze per campagne di sensibilizzazione.",
    modules: [
      { id: "m1", type: "video", title: "Stili di vita sani: le basi", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "14 min" },
      { id: "m2", type: "pdf", title: "Kit per campagne di sensibilizzazione", url: "https://www.aido.it" },
    ],
    quiz: [
      { q: "Una campagna di sensibilizzazione efficace deve essere:", options: ["Generica e poco mirata", "Chiara, mirata e basata su evidenze", "Solo testuale", "Senza obiettivi definiti"], correct: 1 },
    ],
  },
];

const TRACKS = {
  governance: { label: "Governance e Gestione Associativa", color: "#7a1f2b" },
  operative: { label: "Competenze Operative e Relazionali", color: "#e8233c" },
};

// ---------- Matrice Formativa per Ruolo Associativo ----------
const COLUMN_TO_COURSES = {
  1: ["c-statuto"],
  2: ["c-runts"],
  3: ["c-privacy"],
  4: ["c-segreteria"],
  5: ["c-bilancio"],
  6: ["c-piattaforme"],
  7: ["c-comunicazione", "c-digital"],
  8: ["c-leadership"],
  9: ["c-volontario", "c-scuola"],
  10: ["c-donazione"],
  11: ["c-fundraising", "c-progettazione"],
  12: ["c-alfabetizzazione", "c-stilivita"],
};

const ROLES = {
  "nuovo-volontario": {
    label: "Nuovo Volontario",
    obbligatori: [1, 2, 3, 7],
    consigliati: [4, 5, 6, 8, 9],
  },
  "volontario-attivo": {
    label: "Volontario Attivo",
    obbligatori: [2],
    consigliati: [1, 3, 4, 5, 6, 8, 9],
  },
  "referente-comunicazione": {
    label: "Referente Comunicazione",
    obbligatori: [2],
    consigliati: [1, 3, 4, 5, 6, 7, 8, 9],
  },
  "segretario": {
    label: "Segretario",
    obbligatori: [2],
    consigliati: [1, 3, 4, 5, 6, 7, 8, 9, 12],
  },
  "amministratore-tesoriere": {
    label: "Amministratore / Tesoriere",
    obbligatori: [3],
    consigliati: [1, 2, 4, 6, 12],
  },
  "presidente-comunale": {
    label: "Presidente Comunale",
    obbligatori: [3, 4],
    consigliati: [7, 8],
  },
  "presidente-provinciale": {
    label: "Presidente Provinciale",
    obbligatori: [],
    consigliati: [4, 5, 6, 7, 8, 9],
  },
  "presidente-regionale": {
    label: "Presidente Regionale",
    obbligatori: [4],
    consigliati: [7, 8, 9],
  },
};

function getCourseRequirement(courseId, roleKey) {
  if (!roleKey || !ROLES[roleKey]) return null;
  const role = ROLES[roleKey];
  const col = Object.entries(COLUMN_TO_COURSES).find(([, ids]) => ids.includes(courseId));
  if (!col) return "facoltativo";
  const colNum = parseInt(col[0], 10);
  if (role.obbligatori.includes(colNum)) return "obbligatorio";
  if (role.consigliati.includes(colNum)) return "consigliato";
  return "facoltativo";
}

const REQUIREMENT_STYLES = {
  obbligatorio: { label: "Obbligatorio", color: "#dc2626", bg: "#fef2f2" },
  consigliato: { label: "Consigliato", color: "#ea580c", bg: "#fff7ed" },
  facoltativo: { label: "Facoltativo", color: "#9ca3af", bg: "#f9fafb" },
};

// ---------- Docenti e Partner ----------
const PARTNERS = {
  "aido": { name: "AIDO", role: "Formazione interna e governance associativa", bio: "", color: "#ED1C24", logo: "/aido-logo.svg" },
  "cnt": { name: "CNT — Centro Nazionale Trapianti", role: "Formazione medico-scientifica sulla donazione", bio: "", color: "#E63946", logo: "/partner-cnt.png" },
  "e-ius": { name: "e-IUS", role: "Formazione, progettazione e fundraising", bio: "", color: "#5A8F69", logo: "/partner-e-ius.png" },
  "privacy-italia": { name: "Privacy Italia", role: "Consulenza su privacy e GDPR", bio: "", color: "#1E6FA8", logo: "/partner-privacyitalia.png" },
  "valentina-novembre": { name: "Valentina Novembre", role: "Comunicazione digitale e social media", bio: "", color: "#9333ea" },
  "guido-savelli": { name: "Guido Savelli", role: "Privacy e GDPR", bio: "", color: "#1E6FA8" },
  "medici-trapiantologi": { name: "Medici Trapiantologi", role: "Aspetti clinici della donazione", bio: "", color: "#E63946" },
  "psicologo-coachleader": { name: "Psicologo / Coachleader", role: "Mediazione e gestione dei gruppi", bio: "", color: "#9333ea" },
  "flavio-petrini": { name: "Flavio Petrini", role: "Progettazione e bandi", bio: "", color: "#5A8F69" },
  "corrado-vella": { name: "Corrado Vella", role: "Progettazione e bandi", bio: "", color: "#5A8F69" },
};

// Partner istituzionali principali, mostrati nella schermata iniziale
const MAIN_PARTNERS = ["aido", "cnt", "e-ius", "privacy-italia"];

// Collega ogni corso ai relativi docenti/partner (chiavi di PARTNERS)
const COURSE_PARTNERS = {
  "c-statuto": ["medici-trapiantologi"],
  "c-runts": ["aido"],
  "c-privacy": ["guido-savelli", "privacy-italia"],
  "c-segreteria": ["aido"],
  "c-bilancio": ["aido"],
  "c-piattaforme": ["aido", "e-ius"],
  "c-comunicazione": ["e-ius"],
  "c-leadership": ["psicologo-coachleader"],
  "c-volontario": ["e-ius"],
  "c-digital": ["valentina-novembre"],
  "c-scuola": ["aido"],
  "c-alfabetizzazione": ["valentina-novembre", "e-ius"],
  "c-fundraising": ["e-ius"],
  "c-progettazione": ["flavio-petrini", "corrado-vella"],
  "c-donazione": ["cnt", "medici-trapiantologi"],
  "c-stilivita": ["medici-trapiantologi"],
};

// ---------- Supabase Auth helpers ----------
async function signUpUser(name, email, password) {
  await supabaseReady;
  if (!supabase) return { error: "Supabase non disponibile in questo ambiente." };
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error) return { error: error.message };
const role = "volunteer";  if (data.user) {
    await supabase.from("users").upsert(
      { email, name, role },
      { onConflict: "email" }
    );
  }
  return { data };
}

async function signInUser(email, password) {
  await supabaseReady;
  if (!supabase) return { error: "Supabase non disponibile in questo ambiente." };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return { data };
}

async function signOutUser() {
  await supabaseReady;
  if (!supabase) return;
  await supabase.auth.signOut();
}

async function getCurrentSession() {
  await supabaseReady;
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

// ---------- Supabase data helpers ----------
async function fetchUsers() {
  await supabaseReady;
  if (!supabase) return {};
  const { data, error } = await supabase.from("users").select("*");
  if (error) { console.error(error); return {}; }
  const map = {};
  data.forEach((u) => { map[u.email] = u; });
  return map;
}

async function fetchCourses() {
  await supabaseReady;
  if (!supabase) return [];
  const { data, error } = await supabase.from("courses").select("*");
  if (error) { console.error(error); return []; }
  return data.map((c) => ({
    id: c.course_id,
    track: c.track,
    icon: c.icon,
    title: c.title,
    description: c.description,
    modules: c.modules || [],
    quiz: c.quiz || [],
  }));
}

async function seedCoursesIfEmpty() {
  await supabaseReady;
  if (!supabase) return;
  const { count, error } = await supabase.from("courses").select("*", { count: "exact", head: true });
  if (error) { console.error(error); return; }
  if (count === 0) {
    const rows = SEED_COURSES.map((c) => ({
      course_id: c.id,
      track: c.track,
      icon: c.icon,
      title: c.title,
      description: c.description,
      modules: c.modules,
      quiz: c.quiz,
    }));
    const { error: insertError } = await supabase.from("courses").insert(rows);
    if (insertError) console.error("seed error", insertError);
  }
}

async function upsertCourse(course) {
  await supabaseReady;
  if (!supabase) return;
  const row = {
    course_id: course.id,
    track: course.track,
    icon: course.icon,
    title: course.title,
    description: course.description,
    modules: course.modules,
    quiz: course.quiz,
  };
  const { error } = await supabase.from("courses").upsert(row, { onConflict: "course_id" });
  if (error) console.error("upsertCourse error", error);
}

async function deleteCourseRow(courseId) {
  await supabaseReady;
  if (!supabase) return;
  const { error } = await supabase.from("courses").delete().eq("course_id", courseId);
  if (error) console.error("deleteCourse error", error);
}

async function fetchProgress() {
  await supabaseReady;
  if (!supabase) return {};
  const { data, error } = await supabase.from("progress").select("*");
  if (error) { console.error(error); return {}; }
  const map = {};
  data.forEach((p) => {
    if (!map[p.user_email]) map[p.user_email] = {};
    map[p.user_email][p.course_id] = {
      completedModules: p.completed_modules || [],
      quizPassed: p.quiz_passed || false,
      quizScore: p.quiz_score,
      quizTotal: p.quiz_total,
    };
  });
  return map;
}

async function upsertProgress(userEmail, courseId, cp) {
  await supabaseReady;
  if (!supabase) return;
  const row = {
    user_email: userEmail,
    course_id: courseId,
    completed_modules: cp.completedModules,
    quiz_passed: cp.quizPassed,
    quiz_score: cp.quizScore,
    quiz_total: cp.quizTotal,
  };
  const { error } = await supabase.from("progress").upsert(row, { onConflict: "user_email,course_id" });
  if (error) console.error("upsertProgress error", error);
}

async function fetchAccessLog() {
  await supabaseReady;
  if (!supabase) return [];
  const { data, error } = await supabase.from("access_log").select("*").order("timestamp", { ascending: true });
  if (error) { console.error(error); return []; }
  return data.map((a) => ({ email: a.email, timestamp: a.timestamp }));
}

async function insertAccessLog(email) {
  await supabaseReady;
  if (!supabase) return;
  const { error } = await supabase.from("access_log").insert({ email, timestamp: new Date().toISOString() });
  if (error) console.error("insertAccessLog error", error);
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// ---------- PWA install prompt ----------
function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return { canInstall: !!deferredPrompt && !installed, promptInstall };
}

// ---------- AIDO-style logo ----------
function AidoLogo({ className }) {
  return <img src="/aido-logo.svg" alt="AIDO" className={`${className} object-contain`} />;
}

// ---------- Main App ----------
export default function App() {
  const [booting, setBooting] = useState(true);
  const [users, setUsers] = useState({});
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState({});
  const [accessLog, setAccessLog] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState("catalog");
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authError, setAuthError] = useState("");
  const [search, setSearch] = useState("");
  const [trackFilter, setTrackFilter] = useState("all");
  const [toast, setToast] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Boot: load from Supabase
  useEffect(() => {
    (async () => {
      await seedCoursesIfEmpty();
      const [u, c, p, log, session] = await Promise.all([
        fetchUsers(),
        fetchCourses(),
        fetchProgress(),
        fetchAccessLog(),
        getCurrentSession(),
      ]);
      setUsers(u);
      setCourses(c.length ? c : SEED_COURSES);
      setProgress(p);
      setAccessLog(log);

      if (session?.user?.email) {
        const email = session.user.email.toLowerCase();
        const known = u[email] || {
          email,
          name: session.user.user_metadata?.name || email,
role: u?.profile_role || (email === "admin@aido.it" ? "admin" : "volunteer"),        };
        setCurrentUser(known);
        if (known.profile_role) {
          setUserRole(known.profile_role);
        }
      }

      setBooting(false);
    })();
  }, []);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const logAccess = async (email) => {
    await insertAccessLog(email);
    const log = await fetchAccessLog();
    setAccessLog(log);
  };

  // ----- Auth -----
  const handleRegister = async (name, email, password) => {
    email = email.trim().toLowerCase();
    if (!name || !email || !password) { setAuthError("Compila tutti i campi."); return; }
    if (users[email]) { setAuthError("Esiste già un account con questa email."); return; }
    const { data, error } = await signUpUser(name, email, password);
    if (error) { setAuthError(error); return; }
    setAuthError("");
    if (data?.session) {
      const role = "volunteer";
      const newUser = { email, name, role };
      setUsers((prev) => ({ ...prev, [email]: newUser }));
      setCurrentUser(newUser);
      showToast(`Benvenuto/a, ${name}!`);
      await logAccess(email);
    } else {
      showToast("Controlla la tua email per confermare la registrazione! 📧");
      setAuthMode("login");
    }
  };

  const handleLogin = async (email, password) => {
    email = email.trim().toLowerCase();
    const { data, error } = await signInUser(email, password);
    if (error) {
      if (error.toLowerCase().includes("confirm")) {
        setAuthError("Devi prima confermare la tua email. Controlla la posta in arrivo.");
      } else {
        setAuthError("Email o password non corretti.");
      }
      return;
    }
    const u = users[email] || {
      email,
      name: data.user.user_metadata?.name || email,
      role: users[email]?.profile_role || (email === "admin@aido.it" ? "admin" : "volunteer"),
    };
    setCurrentUser(u);
    if (u.profile_role) setUserRole(u.profile_role);
    setAuthError("");
    showToast(`Bentornato/a, ${u.name}!`);
    await logAccess(email);
  };                          

  const handleLogout = async () => {
    await signOutUser();
    setCurrentUser(null);
    setUserRole(null);
    setView("catalog");
    setActiveCourseId(null);
  };

  const handleSelectRole = async (roleKey) => {
    setUserRole(roleKey);
    if (currentUser) {
      const updated = { ...currentUser, profile_role: roleKey };
      setCurrentUser(updated);
      setUsers((prev) => ({ ...prev, [currentUser.email]: updated }));
      await supabaseReady;
      if (supabase) {
        await supabase.from("users").update({ profile_role: roleKey }).eq("email", currentUser.email);
      }
    }
  };

  // ----- Progress -----
  const userProgress = currentUser ? (progress[currentUser.email] || {}) : {};

  const updateProgress = async (courseId, updater) => {
    if (!currentUser) return;
    const userKey = currentUser.email;
    const currentCourseProg = (progress[userKey] && progress[userKey][courseId]) || { completedModules: [], quizPassed: false, quizScore: null, quizTotal: null };
    const updated = updater(currentCourseProg);
    const newProgress = {
      ...progress,
      [userKey]: { ...(progress[userKey] || {}), [courseId]: updated },
    };
    setProgress(newProgress);
    await upsertProgress(userKey, courseId, updated);
  };

  const toggleModuleComplete = (courseId, moduleId) => {
    updateProgress(courseId, (cp) => {
      const has = cp.completedModules.includes(moduleId);
      return {
        ...cp,
        completedModules: has
          ? cp.completedModules.filter((m) => m !== moduleId)
          : [...cp.completedModules, moduleId],
      };
    });
  };

  const submitQuiz = (courseId, score, total, passed) => {
    updateProgress(courseId, (cp) => ({ ...cp, quizScore: score, quizTotal: total, quizPassed: passed }));
    if (passed) showToast("Quiz superato! 🎉");
    else showToast("Quiz non superato, riprova!", "error");
  };

  const courseCompletionPct = (course) => {
    const cp = userProgress[course.id];
    if (!cp) return 0;
    const totalItems = course.modules.length + 1;
    const done = cp.completedModules.length + (cp.quizPassed ? 1 : 0);
    return Math.round((done / totalItems) * 100);
  };

  // ----- Admin: course management -----
  const addCourse = async (course) => {
    await upsertCourse(course);
    setCourses((prev) => [...prev, course]);
  };
  const updateCourse = async (courseId, patch) => {
    const updated = { ...patch, id: courseId };
    await upsertCourse(updated);
    setCourses((prev) => prev.map((c) => (c.id === courseId ? { ...c, ...patch } : c)));
  };
  const deleteCourse = async (courseId) => {
    await deleteCourseRow(courseId);
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  if (booting) {
    return (
      <div className="h-full min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Caricamento aidoAcademy...</p>
        </div>
      </div>
    );
  }

  // Determina cosa mostrare nel corpo principale
  let mainContent;
  if (!currentUser) {
    mainContent = (
      <AuthScreen
        mode={authMode}
        setMode={setAuthMode}
        onLogin={handleLogin}
        onRegister={handleRegister}
        error={authError}
      />
    );
  } else if (!userRole) {
    mainContent = <RoleSelector onSelect={handleSelectRole} />;
  } else if (view === "admin" && currentUser.role === "admin") {
    mainContent = (
      <AdminPanel
        courses={courses}
        onAdd={addCourse}
        onUpdate={updateCourse}
        onDelete={deleteCourse}
        users={users}
        progress={progress}
        accessLog={accessLog}
      />
    );
  } else if (view === "course" && activeCourseId) {
    mainContent = (
      <CourseView
        course={courses.find((c) => c.id === activeCourseId)}
        progress={userProgress[activeCourseId] || { completedModules: [], quizPassed: false }}
        onToggleModule={toggleModuleComplete}
        onSubmitQuiz={submitQuiz}
        onBack={() => setView("catalog")}
        currentUser={currentUser}
      />
    );
  } else if (view === "dashboard") {
    mainContent = (
      <DashboardView
        courses={courses}
        userProgress={userProgress}
        courseCompletionPct={courseCompletionPct}
        onOpenCourse={(id) => { setActiveCourseId(id); setView("course"); }}
        currentUser={currentUser}
        userRole={userRole}
        onChangeRole={() => setUserRole(null)}
        currentUser={currentUser}
      />
    );
  } else {
    mainContent = (
      <CatalogView
        courses={courses}
        search={search}
        setSearch={setSearch}
        trackFilter={trackFilter}
        setTrackFilter={setTrackFilter}
        courseCompletionPct={courseCompletionPct}
        onOpenCourse={(id) => { setActiveCourseId(id); setView("course"); }}
        userRole={userRole}
        onChangeRole={() => setUserRole(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-50 font-sans text-gray-800">
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        view={view}
        setView={setView}
        setActiveCourseId={setActiveCourseId}
      />

      <ProjectContextBanner />

      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all ${
            toast.type === "error" ? "bg-red-500" : "bg-emerald-500"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {mainContent}
    </div>
  );
}

// ---------- Partner badge (usa il logo reale se disponibile, altrimenti iniziali) ----------
function PartnerBadge({ partnerKey, size = "md" }) {
  const p = PARTNERS[partnerKey];
  if (!p) return null;
  const sizes = {
    sm: "w-9 h-9 text-[10px]",
    md: "w-12 h-12 text-xs",
  };
  const initials = p.name
    .split(/[\s-]/)
    .filter((w) => w.length > 0 && w[0] === w[0].toUpperCase())
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .slice(0, 3) || p.name.slice(0, 2);

  return (
    <div className="flex flex-col items-center gap-1.5">
      {p.logo ? (
        <div className={`${sizes[size]} rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center p-1.5 overflow-hidden`}>
          <img src={p.logo} alt={p.name} className="w-full h-full object-contain" />
        </div>
      ) : (
        <div
          className={`${sizes[size]} rounded-xl flex items-center justify-center font-extrabold text-white shadow-sm`}
          style={{ backgroundColor: p.color }}
        >
          {initials}
        </div>
      )}
      <span className="text-[10px] text-gray-500 text-center leading-tight max-w-[80px]">{p.name}</span>
    </div>
  );
}

// ---------- Reti di Valore - Project Context ----------
function ProjectContextBanner() {
  const actions = [
    { name: "AIDO Academy", desc: "Formazione per dirigenti, responsabili e volontari", active: true, icon: GraduationCap },
    { name: "SìAIDO", desc: "Nuovo sistema informativo associativo", active: false, icon: Database },
    { name: "DigitalAIDO", desc: "Rinnovamento dell'app per i cittadini", active: false, icon: Smartphone },
    { name: "Comunicazione e Disseminazione", desc: "Diffusione della cultura del dono", active: false, icon: Megaphone },
  ];
  return (
    <div className="bg-white/60 border-b border-rose-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="text-center mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">Progetto Reti di Valore</span>
          <p className="text-xs text-gray-500 mt-0.5">Formazione e Innovazione per la Cultura del Dono — un progetto, quattro azioni</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {actions.map((a) => {
            const Icon = a.icon;
            return (
              <div
                key={a.name}
                className={`rounded-xl p-3 text-center border transition-all ${
                  a.active
                    ? "bg-rose-600 border-rose-600 shadow-md"
                    : "bg-white border-gray-200"
                }`}
              >
                <Icon className={`w-5 h-5 mx-auto mb-1.5 ${a.active ? "text-white" : "text-rose-500"}`} />
                <div className={`text-[11px] font-bold leading-tight ${a.active ? "text-white" : "text-gray-700"}`}>
                  {a.name}
                </div>
                <div className={`text-[10px] mt-0.5 leading-tight hidden sm:block ${a.active ? "text-rose-100" : "text-gray-400"}`}>
                  {a.desc}
                </div>
                {a.active && (
                  <div className="text-[9px] font-bold text-white/90 mt-1 bg-white/20 rounded-full px-2 py-0.5 inline-block">
                    Sei qui
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-6 mt-5 pt-4 border-t border-rose-100/60">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Con il supporto di</span>
          <div className="flex gap-4">
            {MAIN_PARTNERS.map((key) => (
              <PartnerBadge key={key} partnerKey={key} size="sm" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Header ----------
function Header({ currentUser, onLogout, view, setView, setActiveCourseId }) {
  const { canInstall, promptInstall } = useInstallPrompt();
  return (
    <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <button
          onClick={() => { setView("catalog"); setActiveCourseId(null); }}
          className="flex items-center gap-2.5 group"
        >
          <AidoLogo className="w-9 h-9 group-hover:scale-105 transition-transform flex-shrink-0" />
          <div className="text-left">
            <div className="font-extrabold text-gray-900 leading-tight text-sm sm:text-base">
              aido<span className="text-rose-600">Academy</span>
            </div>
            <div className="text-[10px] sm:text-xs text-rose-600 -mt-0.5 hidden sm:block">Formazione e Innovazione per la Cultura del Dono</div>
          </div>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {canInstall && (
            <button
              onClick={promptInstall}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-all"
              title="Installa l'app sul telefono"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Installa app</span>
            </button>
          )}
          {currentUser && (
            <>
              <NavBtn active={view === "catalog"} onClick={() => { setView("catalog"); setActiveCourseId(null); }} label="Catalogo" />
              <NavBtn active={view === "dashboard"} onClick={() => setView("dashboard")} label="I miei corsi" />
              {currentUser.role === "admin" && (
                <NavBtn active={view === "admin"} onClick={() => setView("admin")} label="Admin" icon={<ShieldCheck className="w-3.5 h-3.5" />} />
              )}
              <div className="hidden sm:flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-rose-600" />
                </div>
                <span className="text-sm text-gray-700 font-medium max-w-[100px] truncate">{currentUser.name}</span>
              </div>
              <button
                onClick={onLogout}
                className="ml-1 p-2 rounded-lg hover:bg-rose-50 text-gray-500 hover:text-rose-600 transition-colors"
                title="Esci"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function NavBtn({ active, onClick, label, icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
        active ? "bg-rose-600 text-white shadow-sm" : "text-gray-600 hover:bg-rose-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// ---------- Role Selector ----------
function RoleSelector({ onSelect }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-4">
          <Users className="w-7 h-7 text-rose-600" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Qual è il tuo ruolo in AIDO?</h2>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Seleziona il tuo profilo per vedere i corsi obbligatori e consigliati pensati per te.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {Object.entries(ROLES).map(([key, role]) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className="text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-rose-200 hover:-translate-y-0.5 transition-all p-5 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">{role.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">
                {role.obbligatori.length} corsi obbligatori · {role.consigliati.length} consigliati
              </div>
            </div>
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        Potrai cambiare il tuo profilo in qualsiasi momento dalla dashboard.
      </p>
    </div>
  );
}

// ---------- Auth Screen ----------
function AuthScreen({ mode, setMode, onLogin, onRegister, error }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registered, setRegistered] = useState(false);

  const submit = async () => {
    if (mode === "login") {
      onLogin(email, password);
    } else {
      await onRegister(name, email, password);
      setRegistered(true);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") submit();
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <AidoLogo className="w-16 h-16" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            aido<span className="text-rose-600">Academy</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Il percorso formativo per dirigenti, responsabili e volontari AIDO</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-rose-100 p-6 sm:p-8">
          <div className="flex gap-1 mb-6 bg-rose-50 rounded-xl p-1">
            <button
              onClick={() => { setMode("login"); setRegistered(false); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === "login" ? "bg-white shadow-sm text-rose-700" : "text-gray-500"}`}
            >
              Accedi
            </button>
            <button
              onClick={() => { setMode("register"); setRegistered(false); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === "register" ? "bg-white shadow-sm text-rose-700" : "text-gray-500"}`}
            >
              Registrati
            </button>
          </div>

          {mode === "register" && registered && !error ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Controlla la tua email!</h3>
              <p className="text-sm text-gray-500">
                Ti abbiamo inviato un link di conferma a <span className="font-medium text-gray-700">{email}</span>. Clicca sul link per attivare il tuo account, poi torna qui e accedi.
              </p>
              <button
                onClick={() => { setMode("login"); setRegistered(false); }}
                className="mt-5 text-sm font-semibold text-rose-600 hover:text-rose-700"
              >
                Torna al login →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Nome e cognome</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={onKeyDown}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none text-sm"
                    placeholder="Es. Mario Rossi"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={onKeyDown}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none text-sm"
                  placeholder="nome@email.it"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={onKeyDown}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none text-sm"
                  placeholder="••••••••"
                />
                {mode === "register" && (
                  <p className="text-[11px] text-gray-400 mt-1">Almeno 6 caratteri.</p>
                )}
              </div>

              {error && (
                <div className="flex items-start gap-2 text-red-600 text-xs bg-red-50 rounded-lg p-2.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={submit}
                className="w-full bg-gradient-to-r from-rose-600 to-red-700 text-white font-semibold py-2.5 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                {mode === "login" ? "Accedi" : "Crea account"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Catalog ----------
function CatalogView({ courses, search, setSearch, trackFilter, setTrackFilter, courseCompletionPct, onOpenCourse, userRole, onChangeRole, currentUser }) {
  const filtered = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchesTrack = trackFilter === "all" || c.track === trackFilter;
    return matchesSearch && matchesTrack;
  });

  const order = { obbligatorio: 0, consigliato: 1, facoltativo: 2 };
  const sorted = userRole
    ? [...filtered].sort((a, b) => {
        const ra = getCourseRequirement(a.id, userRole) || "facoltativo";
        const rb = getCourseRequirement(b.id, userRole) || "facoltativo";
        return order[ra] - order[rb];
      })
    : filtered;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Catalogo Corsi</h2>
        {userRole && (
          <button
            onClick={onChangeRole}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-full"
          >
            <User className="w-3.5 h-3.5" /> {ROLES[userRole]?.label} · Cambia profilo
          </button>
        )}
      </div>
      <div className="mb-8">
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          {userRole
            ? `Corsi ordinati per priorità in base al tuo profilo.`
            : "Formazione continua per volontari, dirigenti e responsabili AIDO — accessibile sempre, anche in modalità asincrona."}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cerca un corso..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none text-sm bg-white"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto sm:overflow-visible pb-1">
          <FilterChip active={trackFilter === "all"} onClick={() => setTrackFilter("all")} label="Tutti" />
          <FilterChip active={trackFilter === "governance"} onClick={() => setTrackFilter("governance")} label="Governance" color={TRACKS.governance.color} />
          <FilterChip active={trackFilter === "operative"} onClick={() => setTrackFilter("operative")} label="Operative" color={TRACKS.operative.color} />
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>Nessun corso trovato.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              pct={courseCompletionPct(c)}
              onClick={() => onOpenCourse(c.id)}
              requirement={userRole ? getCourseRequirement(c.id, userRole) : null}
              currentUser={currentUser}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, label, color }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
        active ? "text-white border-transparent shadow-sm" : "text-gray-600 border-gray-200 bg-white hover:border-rose-200"
      }`}
      style={active ? { backgroundColor: color || "#e8233c" } : {}}
    >
      {label}
    </button>
  );
}

function CourseCard({ course, pct, onClick, requirement, currentUser }) {
  const Icon = ICONS[course.icon] || FileText;
  const track = TRACKS[course.track];
  const req = requirement ? REQUIREMENT_STYLES[requirement] : null;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col">
      <button onClick={onClick} className="text-left p-5 flex flex-col gap-3 group flex-1">
        <div className="flex items-start justify-between">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: track.color }}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col items-end gap-1">
            {pct === 100 && (
              <span className="flex items-center gap-1 text-emerald-600 text-[11px] font-bold bg-emerald-50 px-2 py-1 rounded-full">
                <CheckCircle2 className="w-3 h-3" /> Completato
              </span>
            )}
            {req && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ color: req.color, backgroundColor: req.bg }}
              >
                {req.label}
              </span>
            )}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: track.color }}>{track.label}</div>
          <h3 className="font-bold text-gray-900 mt-1 group-hover:text-rose-700 transition-colors leading-snug">{course.title}</h3>
          <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{course.description}</p>
        </div>
        <div className="mt-auto pt-2">
          <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
            <span>{course.modules.length} contenuti + quiz</span>
            <span className="font-semibold text-gray-600">{pct}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: track.color }} />
          </div>
        </div>
      </button>
      {pct === 100 && currentUser && (
        <button
          onClick={(e) => { e.stopPropagation(); downloadCertificate(currentUser.name, course.title); }}
          className="flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 py-2.5 transition-colors border-t border-amber-100"
        >
          <Award className="w-3.5 h-3.5" /> Scarica attestato
        </button>
      )}
    </div>
  );
}

// ---------- Dashboard ----------
function DashboardView({ courses, userProgress, courseCompletionPct, onOpenCourse, currentUser, userRole, onChangeRole }) {
  const started = courses.filter((c) => userProgress[c.id]);
  const completed = started.filter((c) => courseCompletionPct(c) === 100);
  const inProgress = started.filter((c) => courseCompletionPct(c) < 100);
  const avgPct = started.length
    ? Math.round(started.reduce((sum, c) => sum + courseCompletionPct(c), 0) / started.length)
    : 0;

  const mandatoryCourses = userRole
    ? courses.filter((c) => getCourseRequirement(c.id, userRole) === "obbligatorio")
    : [];
  const mandatoryDone = mandatoryCourses.filter((c) => courseCompletionPct(c) === 100).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">I miei corsi</h2>
        {userRole && (
          <button
            onClick={onChangeRole}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-full"
          >
            <User className="w-3.5 h-3.5" /> {ROLES[userRole]?.label} · Cambia profilo
          </button>
        )}
      </div>
      <p className="text-gray-500 text-sm sm:text-base mb-6">Ciao {currentUser.name.split(" ")[0]}, ecco il tuo percorso formativo.</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={<Play className="w-5 h-5" />} label="Corsi iniziati" value={started.length} color="#e8233c" />
        <StatCard icon={<Award className="w-5 h-5" />} label="Corsi completati" value={completed.length} color="#16a34a" />
        {userRole ? (
          <StatCard icon={<AlertCircle className="w-5 h-5" />} label="Obbligatori completati" value={`${mandatoryDone}/${mandatoryCourses.length}`} color="#dc2626" />
        ) : (
          <StatCard icon={<BarChart3 className="w-5 h-5" />} label="Avanzamento medio" value={`${avgPct}%`} color="#7a1f2b" />
        )}
      </div>

      {started.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <GraduationCap className="w-10 h-10 mx-auto mb-3 text-rose-300" />
          <p className="text-gray-500">Non hai ancora iniziato nessun corso.</p>
          <p className="text-gray-400 text-sm mt-1">Vai al Catalogo per iniziare il tuo percorso formativo.</p>
        </div>
      ) : (
        <>
          {inProgress.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">In corso</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {inProgress.map((c) => (
                  <CourseCard key={c.id} course={c} pct={courseCompletionPct(c)} onClick={() => onOpenCourse(c.id)} requirement={userRole ? getCourseRequirement(c.id, userRole) : null} currentUser={currentUser} />
                ))}
              </div>
            </div>
          )}
          {completed.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Completati</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {completed.map((c) => (
                  <CourseCard key={c.id} course={c} pct={courseCompletionPct(c)} onClick={() => onOpenCourse(c.id)} requirement={userRole ? getCourseRequirement(c.id, userRole) : null} currentUser={currentUser} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15`, color }}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-extrabold text-gray-900">{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  );
}

// ---------- Course View ----------
function CourseView({ course, progress, onToggleModule, onSubmitQuiz, onBack, currentUser }) {
  const [quizOpen, setQuizOpen] = useState(false);

  if (!course) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Corso non trovato.</p>
        <button onClick={onBack} className="mt-4 text-rose-600 font-medium">← Torna al catalogo</button>
      </div>
    );
  }

  const track = TRACKS[course.track];
  const Icon = ICONS[course.icon] || FileText;
  const totalItems = course.modules.length + 1;
  const doneItems = progress.completedModules.length + (progress.quizPassed ? 1 : 0);
  const pct = Math.round((doneItems / totalItems) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={onBack} className="flex items-center gap-1.5 text-gray-500 hover:text-rose-600 text-sm font-medium mb-5 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Torna al catalogo
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0" style={{ backgroundColor: track.color }}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: track.color }}>{track.label}</div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">{course.title}</h2>
            <p className="text-sm text-gray-500 mt-1.5">{course.description}</p>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Avanzamento corso</span>
            <span className="font-bold text-gray-700">{pct}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: track.color }} />
          </div>
        </div>
        {pct === 100 && currentUser && (
          <button
            onClick={() => downloadCertificate(currentUser.name, course.title)}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all text-sm"
          >
            <Award className="w-4 h-4" /> Scarica attestato di completamento
          </button>
        )}
      </div>

      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Contenuti del corso</h3>
      <div className="space-y-3 mb-6">
        {course.modules.map((m, i) => (
          <ModuleItem
            key={m.id}
            module={m}
            index={i}
            done={progress.completedModules.includes(m.id)}
            onToggle={() => onToggleModule(course.id, m.id)}
          />
        ))}
      </div>

      <PartnersSection courseId={course.id} />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <button
          onClick={() => setQuizOpen((o) => !o)}
          className="w-full flex items-center justify-between p-4 hover:bg-rose-50/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${progress.quizPassed ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
              {progress.quizPassed ? <CheckCircle2 className="w-5 h-5" /> : <Award className="w-5 h-5" />}
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900 text-sm">Quiz di verifica finale</div>
              <div className="text-xs text-gray-500">
                {progress.quizPassed
                  ? `Superato — ${progress.quizScore}/${progress.quizTotal} risposte corrette`
                  : `${course.quiz.length} domande`}
              </div>
            </div>
          </div>
          {quizOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {quizOpen && (
          <div className="border-t border-gray-100 p-4">
            <Quiz
              questions={course.quiz}
              onSubmit={(score, total, passed) => onSubmitQuiz(course.id, score, total, passed)}
              alreadyPassed={progress.quizPassed}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Docenti e Partner del corso ----------
function PartnersSection({ courseId }) {
  const partnerKeys = COURSE_PARTNERS[courseId] || [];
  if (partnerKeys.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Docenti e Partner</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {partnerKeys.map((key) => {
          const p = PARTNERS[key];
          if (!p) return null;
          return (
            <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
              <PartnerBadge partnerKey={key} size="md" />
              <div>
                <div className="font-bold text-gray-900 text-sm">{p.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{p.role}</div>
                {p.bio && <p className="text-xs text-gray-400 mt-1.5">{p.bio}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Attestato di completamento ----------
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function generateCertificate(userName, courseTitle, dateStr) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 850;
  const ctx = canvas.getContext("2d");

  // Sfondo
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Cornice
  ctx.strokeStyle = "#ED1C24";
  ctx.lineWidth = 10;
  ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
  ctx.strokeStyle = "#7a1f2b";
  ctx.lineWidth = 2;
  ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

  // Logo AIDO ufficiale
  try {
    const logoImg = await loadImage("/aido-logo.svg");
    const logoSize = 130;
    ctx.drawImage(logoImg, 600 - logoSize / 2, 95, logoSize, logoSize);
  } catch {
    // Fallback: goccia stilizzata se il logo non si carica
    ctx.fillStyle = "#ED1C24";
    ctx.beginPath();
    ctx.moveTo(600, 110);
    ctx.bezierCurveTo(520, 200, 480, 270, 480, 310);
    ctx.bezierCurveTo(480, 360, 535, 395, 600, 395);
    ctx.bezierCurveTo(665, 395, 720, 360, 720, 310);
    ctx.bezierCurveTo(720, 270, 680, 200, 600, 110);
    ctx.closePath();
    ctx.fill();
  }

  // Titolo
  ctx.fillStyle = "#1f2937";
  ctx.font = "bold 32px Arial";
  ctx.textAlign = "center";
  ctx.fillText("AIDOACADEMY", 600, 470);
  ctx.font = "16px Arial";
  ctx.fillStyle = "#9ca3af";
  ctx.fillText("Formazione e Innovazione per la Cultura del Dono", 600, 495);

  ctx.font = "20px Arial";
  ctx.fillStyle = "#6b7280";
  ctx.fillText("Attestato di completamento", 600, 555);

  ctx.font = "bold 42px Arial";
  ctx.fillStyle = "#111827";
  ctx.fillText(userName.toUpperCase(), 600, 615);

  ctx.font = "18px Arial";
  ctx.fillStyle = "#6b7280";
  ctx.fillText("ha completato con successo il corso", 600, 655);

  ctx.font = "bold 26px Arial";
  ctx.fillStyle = "#ED1C24";
  ctx.fillText(courseTitle, 600, 700);

  ctx.font = "16px Arial";
  ctx.fillStyle = "#9ca3af";
  ctx.fillText(`Data di completamento: ${dateStr}`, 600, 755);

  return canvas.toDataURL("image/png");
}

async function downloadCertificate(userName, courseTitle) {
  const dateStr = new Date().toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" });
  const dataUrl = await generateCertificate(userName, courseTitle, dateStr);
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `Attestato-${courseTitle.replace(/[^a-zA-Z0-9]/g, "_")}.png`;
  link.click();
}

function ModuleItem({ module, index, done, onToggle }) {
  const [open, setOpen] = useState(false);
  const typeIcon = module.type === "video" ? <Play className="w-4 h-4" /> : <FileDown className="w-4 h-4" />;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <button onClick={onToggle} className="flex-shrink-0">
          {done ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Circle className="w-6 h-6 text-gray-300 hover:text-rose-300 transition-colors" />}
        </button>
        <div
          className="flex-1 flex items-center gap-3 cursor-pointer"
          onClick={() => setOpen((o) => !o)}
        >
          <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 flex-shrink-0">
            {typeIcon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 text-sm truncate">{index + 1}. {module.title}</div>
            <div className="text-[11px] text-gray-400">
              {module.type === "video" ? `Video · ${module.duration}` : "PDF / Slide"}
            </div>
          </div>
          {open ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
        </div>
      </div>
      {open && (
        <div className="border-t border-gray-100 p-4 bg-gray-50/50">
          {module.type === "video" ? (
            <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-inner">
              <iframe
                src={module.url}
                title={module.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <a
              href={module.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-rose-600 hover:text-rose-700 font-medium text-sm bg-white rounded-xl p-3 border border-rose-100 hover:border-rose-300 transition-colors"
            >
              <FileDown className="w-4 h-4" /> Apri / scarica il materiale PDF
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function Quiz({ questions, onSubmit, alreadyPassed }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const selectAnswer = (qIdx, optIdx) => {
    if (submitted) return;
    setAnswers((a) => ({ ...a, [qIdx]: optIdx }));
  };

  const handleSubmit = () => {
    let score = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) score++;
    });
    const passed = score / questions.length >= 0.6;
    setResult({ score, total: questions.length, passed });
    setSubmitted(true);
    onSubmit(score, questions.length, passed);
  };

  const retry = () => {
    setAnswers({});
    setSubmitted(false);
    setResult(null);
  };

  const allAnswered = questions.every((_, i) => answers[i] !== undefined);

  return (
    <div className="space-y-5">
      {questions.map((q, qi) => (
        <div key={qi}>
          <div className="font-medium text-sm text-gray-800 mb-2">{qi + 1}. {q.q}</div>
          <div className="space-y-1.5">
            {q.options.map((opt, oi) => {
              const isSelected = answers[qi] === oi;
              const isCorrect = q.correct === oi;
              let style = "border-gray-200 hover:border-rose-300 bg-white";
              if (submitted) {
                if (isCorrect) style = "border-emerald-400 bg-emerald-50";
                else if (isSelected && !isCorrect) style = "border-red-300 bg-red-50";
              } else if (isSelected) {
                style = "border-rose-400 bg-rose-50";
              }
              return (
                <button
                  key={oi}
                  onClick={() => selectAnswer(qi, oi)}
                  disabled={submitted}
                  className={`w-full text-left px-3.5 py-2 rounded-xl border text-sm transition-all ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="w-full bg-gradient-to-r from-rose-600 to-red-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold py-2.5 rounded-xl shadow-sm transition-all"
        >
          Invia risposte
        </button>
      ) : (
        <div className={`rounded-xl p-4 ${result.passed ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"}`}>
          <div className="flex items-center gap-2 font-bold text-sm mb-1">
            {result.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-amber-600" />}
            <span className={result.passed ? "text-emerald-700" : "text-amber-700"}>
              {result.passed ? "Quiz superato!" : "Quiz non superato"}
            </span>
          </div>
          <p className="text-xs text-gray-600 mb-3">Hai risposto correttamente a {result.score} domande su {result.total}.</p>
          {!result.passed && (
            <button onClick={retry} className="text-xs font-semibold text-rose-600 hover:text-rose-700">
              Riprova il quiz →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- Admin Panel ----------
function AdminPanel({ courses, onAdd, onUpdate, onDelete, users, progress, accessLog }) {
  const [tab, setTab] = useState("courses");
  const [editingCourse, setEditingCourse] = useState(null);

  const volunteers = Object.values(users).filter((u) => u.role !== "admin");

  const todayStr = new Date().toDateString();
  const accessesToday = accessLog.filter((a) => new Date(a.timestamp).toDateString() === todayStr).length;
  const totalAccesses = accessLog.length;
  const uniqueUsersWithAccess = new Set(accessLog.map((a) => a.email)).size;

  const accessByUser = {};
  accessLog.forEach((a) => {
    if (!accessByUser[a.email]) accessByUser[a.email] = [];
    accessByUser[a.email].push(a.timestamp);
  });

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const accessesPerDay = last7Days.map((d) => {
    const dStr = d.toDateString();
    return accessLog.filter((a) => new Date(a.timestamp).toDateString() === dStr).length;
  });
  const maxPerDay = Math.max(1, ...accessesPerDay);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck className="w-6 h-6 text-rose-600" />
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Pannello Amministratore</h2>
      </div>
      <p className="text-gray-500 text-sm mb-6">Gestisci corsi, materiali e monitora l'avanzamento dei volontari.</p>

      <div className="flex gap-1 mb-6 bg-rose-50 rounded-xl p-1 w-fit overflow-x-auto">
        <button onClick={() => setTab("courses")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${tab === "courses" ? "bg-white shadow-sm text-rose-700" : "text-gray-500"}`}>
          Corsi
        </button>
        <button onClick={() => setTab("users")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${tab === "users" ? "bg-white shadow-sm text-rose-700" : "text-gray-500"}`}>
          Volontari ({volunteers.length})
        </button>
        <button onClick={() => setTab("access")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${tab === "access" ? "bg-white shadow-sm text-rose-700" : "text-gray-500"}`}>
          Accessi
        </button>
      </div>

      {tab === "courses" && !editingCourse && (
        <>
          <button
            onClick={() => setEditingCourse("new")}
            className="mb-5 flex items-center gap-2 bg-gradient-to-r from-rose-600 to-red-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all text-sm"
          >
            <Plus className="w-4 h-4" /> Nuovo corso
          </button>
          <div className="grid sm:grid-cols-2 gap-4">
            {courses.map((c) => {
              const Icon = ICONS[c.icon] || FileText;
              const track = TRACKS[c.track];
              return (
                <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: track.color }}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-900 truncate">{c.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{c.modules.length} moduli · {c.quiz.length} domande quiz</div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => setEditingCourse(c)} className="p-2 rounded-lg hover:bg-rose-50 text-gray-400 hover:text-rose-600">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => { if (confirm(`Eliminare il corso "${c.title}"?`)) onDelete(c.id); }} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === "courses" && editingCourse && (
        <CourseEditor
          course={editingCourse === "new" ? null : editingCourse}
          onSave={(course) => {
            if (editingCourse === "new") onAdd(course);
            else onUpdate(course.id, course);
            setEditingCourse(null);
          }}
          onCancel={() => setEditingCourse(null)}
        />
      )}

      {tab === "users" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {volunteers.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-sm">Nessun volontario registrato ancora.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {volunteers.map((v) => {
                const vProg = progress[v.email] || {};
                const started = Object.keys(vProg).length;
                const completed = Object.values(vProg).filter((cp) => cp.quizPassed).length;
                return (
                  <div key={v.email} className="flex items-center gap-3 p-4">
                    <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900">{v.name}</div>
                      <div className="text-xs text-gray-400">{v.email}{v.profile_role ? ` · ${ROLES[v.profile_role]?.label || v.profile_role}` : ""}</div>
                    </div>
                    <div className="text-right text-xs flex-shrink-0">
                      <div className="text-gray-600 font-semibold">{started} corsi iniziati</div>
                      <div className="text-emerald-600">{completed} completati</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === "access" && (
        <div>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <StatCard icon={<LogIn className="w-5 h-5" />} label="Accessi totali" value={totalAccesses} color="#e8233c" />
            <StatCard icon={<Activity className="w-5 h-5" />} label="Accessi di oggi" value={accessesToday} color="#16a34a" />
            <StatCard icon={<Users className="w-5 h-5" />} label="Utenti che hanno effettuato login" value={uniqueUsersWithAccess} color="#7a1f2b" />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Accessi negli ultimi 7 giorni</h3>
            <div className="flex items-end gap-3 h-32">
              {last7Days.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="text-[11px] font-semibold text-gray-600">{accessesPerDay[i]}</div>
                  <div className="w-full bg-gray-100 rounded-t-md flex-1 flex items-end overflow-hidden">
                    <div
                      className="w-full rounded-t-md transition-all"
                      style={{
                        height: `${(accessesPerDay[i] / maxPerDay) * 100}%`,
                        backgroundColor: "#e8233c",
                        minHeight: accessesPerDay[i] > 0 ? "4px" : "0",
                      }}
                    />
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {d.toLocaleDateString("it-IT", { weekday: "short" })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Accessi per utente</h3>
            </div>
            {Object.keys(accessByUser).length === 0 ? (
              <div className="p-10 text-center text-gray-400 text-sm">Nessun accesso registrato ancora.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {Object.entries(accessByUser)
                  .sort((a, b) => b[1].length - a[1].length)
                  .map(([email, timestamps]) => {
                    const u = users[email];
                    const last = new Date(timestamps[timestamps.length - 1]);
                    return (
                      <div key={email} className="flex items-center gap-3 p-4">
                        <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900">{u ? u.name : email}</div>
                          <div className="text-xs text-gray-400">{email}{u?.role === "admin" ? " · Admin" : ""}</div>
                        </div>
                        <div className="text-right text-xs flex-shrink-0">
                          <div className="text-gray-700 font-bold">{timestamps.length} accessi</div>
                          <div className="text-gray-400">
                            Ultimo: {last.toLocaleDateString("it-IT")} {last.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CourseEditor({ course, onSave, onCancel }) {
  const [title, setTitle] = useState(course?.title || "");
  const [description, setDescription] = useState(course?.description || "");
  const [track, setTrack] = useState(course?.track || "governance");
  const [icon, setIcon] = useState(course?.icon || "FileText");
  const [modules, setModules] = useState(course?.modules || []);
  const [quiz, setQuiz] = useState(course?.quiz || []);

  const addModule = () => setModules((m) => [...m, { id: uid(), type: "video", title: "", url: "", duration: "" }]);
  const updateModule = (id, patch) => setModules((m) => m.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const removeModule = (id) => setModules((m) => m.filter((x) => x.id !== id));

  const addQuestion = () => setQuiz((q) => [...q, { q: "", options: ["", "", "", ""], correct: 0 }]);
  const updateQuestion = (idx, patch) => setQuiz((q) => q.map((x, i) => (i === idx ? { ...x, ...patch } : x)));
  const removeQuestion = (idx) => setQuiz((q) => q.filter((_, i) => i !== idx));

  const save = () => {
    if (!title.trim()) { alert("Inserisci il titolo del corso."); return; }
    onSave({
      id: course?.id || `c-${uid()}`,
      track, icon, title, description, modules, quiz,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-gray-900">{course ? "Modifica corso" : "Nuovo corso"}</h3>
        <button onClick={onCancel} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Titolo del corso</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-rose-400 outline-none text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Linea formativa</label>
          <select value={track} onChange={(e) => setTrack(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-rose-400 outline-none text-sm bg-white">
            <option value="governance">Governance e Gestione Associativa</option>
            <option value="operative">Competenze Operative e Relazionali</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Descrizione</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-rose-400 outline-none text-sm resize-none" />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Icona</label>
        <select value={icon} onChange={(e) => setIcon(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-rose-400 outline-none text-sm bg-white">
          {Object.keys(ICONS).map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Materiali (video / PDF)</label>
          <button onClick={addModule} className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700">
            <Plus className="w-3.5 h-3.5" /> Aggiungi
          </button>
        </div>
        <div className="space-y-2">
          {modules.map((m) => (
            <div key={m.id} className="border border-gray-200 rounded-xl p-3 space-y-2 bg-gray-50/50">
              <div className="flex gap-2">
                <select value={m.type} onChange={(e) => updateModule(m.id, { type: e.target.value })} className="px-2.5 py-2 rounded-lg border border-gray-200 text-xs bg-white">
                  <option value="video">Video</option>
                  <option value="pdf">PDF</option>
                </select>
                <input
                  placeholder="Titolo del materiale"
                  value={m.title}
                  onChange={(e) => updateModule(m.id, { title: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs"
                />
                <button onClick={() => removeModule(m.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                placeholder={m.type === "video" ? "URL embed video (es. YouTube embed)" : "URL del PDF"}
                value={m.url}
                onChange={(e) => updateModule(m.id, { url: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs"
              />
              {m.type === "video" && (
                <input
                  placeholder="Durata (es. 15 min)"
                  value={m.duration}
                  onChange={(e) => updateModule(m.id, { duration: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs"
                />
              )}
            </div>
          ))}
          {modules.length === 0 && <p className="text-xs text-gray-400 italic">Nessun materiale aggiunto.</p>}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Quiz di verifica</label>
          <button onClick={addQuestion} className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700">
            <Plus className="w-3.5 h-3.5" /> Aggiungi domanda
          </button>
        </div>
        <div className="space-y-3">
          {quiz.map((q, qi) => (
            <div key={qi} className="border border-gray-200 rounded-xl p-3 space-y-2 bg-gray-50/50">
              <div className="flex gap-2">
                <input
                  placeholder="Testo della domanda"
                  value={q.q}
                  onChange={(e) => updateQuestion(qi, { q: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs"
                />
                <button onClick={() => removeQuestion(qi)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-1.5">
                    <input
                      type="radio"
                      checked={q.correct === oi}
                      onChange={() => updateQuestion(qi, { correct: oi })}
                      className="accent-rose-600"
                    />
                    <input
                      placeholder={`Opzione ${oi + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...q.options];
                        newOpts[oi] = e.target.value;
                        updateQuestion(qi, { options: newOpts });
                      }}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs"
                    />
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-400">Seleziona il radio button della risposta corretta.</p>
            </div>
          ))}
          {quiz.length === 0 && <p className="text-xs text-gray-400 italic">Nessuna domanda aggiunta.</p>}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={save} className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-red-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all text-sm">
          <Save className="w-4 h-4" /> Salva corso
        </button>
        <button onClick={onCancel} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-all">
          Annulla
        </button>
      </div>
    </div>
  );
}
