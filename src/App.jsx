import React, { useState, useEffect } from 'react';
import {
  Download, CheckCircle, Circle, ExternalLink, BookOpen,
  Video, Info, Share2, Check, ChevronRight, Zap, Target,
  Trophy, BarChart2, X, Menu
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';

// ==========================================
// FIREBASE CONFIG
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyA7St3c6bC6T_SvUXSUMs1f5Nz8CmBWDMQ",
  authDomain: "master-tracker-e93b8.firebaseapp.com",
  projectId: "master-tracker-e93b8",
  storageBucket: "master-tracker-e93b8.firebasestorage.app",
  messagingSenderId: "595762774291",
  appId: "1:595762774291:web:fb12071f47e571acd65ae6",
  measurementId: "G-S9P5MR3RCE"
};

let app, auth, db;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.log("Firebase not yet configured.");
}

// --- Course Data ---
const courseData = [
  { day: 1, week: 1, topic: "Interface & Project Setup", learning: "1. Create database 2. Set project settings 3. Explore workspaces", practice: "Navigate through all tabs and customize your layout.", assignment: "Create a project named 'W1_Basics', set to 1080p 60fps, and import 10 clips.", challenge: "Do the entire setup and import in under 2 minutes.", mistakes: "Forgetting to set timeline frame rate before importing.", shortcuts: "Shift + 1-9 to switch workspaces.", linkText: "Casey Faris: Interface", linkUrl: "https://www.youtube.com/results?search_query=Casey+Faris+DaVinci+Resolve+Interface", difficulty: "1/10" },
  { day: 2, week: 1, topic: "Media Org & Smart Bins", learning: "1. Create Bin structure 2. Use color tags 3. Create a Smart Bin", practice: "Tag 5 clips with 'B-roll' and create a Smart Bin.", assignment: "Organize 10 clips into 3 folders and color-code them.", challenge: "Add metadata markers to 3 clips.", mistakes: "Dumping everything in the master bin.", shortcuts: "Ctrl/Cmd + Shift + N for new Bin.", linkText: "Jason Yadlovski: Organization", linkUrl: "https://www.youtube.com/results?search_query=Jason+Yadlovski+Organization+Resolve", difficulty: "2/10" },
  { day: 3, week: 1, topic: "Timeline Basics & Assembly", learning: "1. Create timeline 2. Drag & drop 3. In/out points 4. Append edits", practice: "Set In/Out points on 5 clips and append.", assignment: "Assemble a raw 1-minute sequence using 5 clips.", challenge: "Use ONLY keyboard shortcuts to move clips.", mistakes: "Dragging 10-minute clips instead of sub-clipping.", shortcuts: "I (In), O (Out), F9 (Insert), F10 (Overwrite).", linkText: "MrAlexTech: Basic Editing", linkUrl: "https://www.youtube.com/results?search_query=MrAlexTech+Basic+Editing+Resolve", difficulty: "2/10" },
  { day: 4, week: 1, topic: "Cutting & Trimming", learning: "1. Blade tool 2. Ripple delete 3. Trim start/end 4. Slip/Slide", practice: "Cut dead space from a talking-head clip.", assignment: "Edit your 1-min sequence to exactly 30 seconds.", challenge: "Perform 5 cuts without using the mouse.", mistakes: "Leaving 1-frame gaps between clips.", shortcuts: "Ctrl/Cmd + B (Blade), Shift + Backspace (Ripple).", linkText: "Casey Faris: Workflow", linkUrl: "https://www.youtube.com/results?search_query=Casey+Faris+Editing+Workflow+Resolve", difficulty: "3/10" },
  { day: 5, week: 1, topic: "Basic Transitions", learning: "1. Cross dissolve 2. Transition duration 3. Dip to color 4. Audio crossfades", practice: "Apply a 1-second cross dissolve between scenes.", assignment: "Add 3 smooth video transitions & 3 audio crossfades.", challenge: "Create a custom length default transition & save it.", mistakes: "Overusing flashy transitions instead of hard cuts.", shortcuts: "Ctrl/Cmd + T (Add transition). Alt+drag to copy.", linkText: "Learn Color Grading: Transitions", linkUrl: "https://www.youtube.com/results?search_query=Learn+Color+Grading+Transitions+Resolve", difficulty: "2/10" },
  { day: 6, week: 1, topic: "Audio Basics", learning: "1. Read audio meters 2. Adjust volume 3. Fade handles 4. Mute/Solo", practice: "Normalize a voiceover clip to peak between -6dB and -3dB.", assignment: "Add bg music, lower by -15dB, fade out at end.", challenge: "Balance audio so voice is clear over music.", mistakes: "Peaking audio into the red (distortion).", shortcuts: "Alt + Click on audio line to add keyframes.", linkText: "Jason Yadlovski: Audio Basics", linkUrl: "https://www.youtube.com/results?search_query=Jason+Yadlovski+Audio+Basics+Resolve", difficulty: "3/10" },
  { day: 7, week: 1, topic: "Simple Export & W1 Project", learning: "1. Deliver page 2. YouTube preset 3. File name/location 4. Render queue", practice: "Render a 10-second test clip (H.264 / MP4).", assignment: "W1 Project: Export finalized 30s montage (1080p).", challenge: "Create a custom render preset for Fast YouTube Exports.", mistakes: "Rendering entire timeline when wanting a section.", shortcuts: "Right-click render job -> Find in Media Pool.", linkText: "Cullen Kelly: Export Settings", linkUrl: "https://www.youtube.com/results?search_query=Best+Export+Settings+DaVinci+Resolve", difficulty: "2/10" },
  { day: 8, week: 2, topic: "Advanced Cuts & Pacing", learning: "1. Unlink audio/video 2. Create J-Cuts 3. Create L-Cuts", practice: "Turn 3 hard cuts into smooth J/L cuts.", assignment: "Edit a 45s clip featuring at least 2 J-cuts & 2 L-cuts.", challenge: "Overlap audio of an impact before visual cut.", mistakes: "Audio drifting out of sync when unlinking.", shortcuts: "Ctrl/Cmd + Shift + L (Link/Unlink).", linkText: "MrAlexTech: J and L Cuts", linkUrl: "https://www.youtube.com/results?search_query=MrAlexTech+J+and+L+Cuts+Resolve", difficulty: "4/10" },
  { day: 9, week: 2, topic: "B-Roll & Storytelling", learning: "1. Use Video Track 2 2. Match B-roll to A-roll 3. Adjust opacity", practice: "Overlay 3 b-roll clips over a talking-head.", assignment: "Create a 1-min video with narrative and 5 B-roll overlays.", challenge: "Sync a B-roll cut perfectly to a music beat.", mistakes: "Forgetting to mute the scratch audio of B-roll.", shortcuts: "Alt + Up Arrow to move clip up a track.", linkText: "Casey Faris: B-Roll", linkUrl: "https://www.youtube.com/results?search_query=Casey+Faris+B-Roll+Resolve", difficulty: "4/10" },
  { day: 10, week: 2, topic: "Text & Titles", learning: "1. Basic Text 2. Text+ 3. Change styling 4. Lower thirds", practice: "Create a clean lower third with your name.", assignment: "Add a custom intro and 3 pop-up text graphics.", challenge: "Save your custom Text+ title into Power Bins.", mistakes: "Using clunky default fonts (Arial); poor contrast.", shortcuts: "Use Power Bins for reusability.", linkText: "MrAlexTech: Text and Titles", linkUrl: "https://www.youtube.com/results?search_query=MrAlexTech+Text+and+Titles+Resolve", difficulty: "3/10" },
  { day: 11, week: 2, topic: "Keyframing Basics", learning: "1. Open Inspector 2. Diamond icon 3. Animate Zoom/Position", practice: "Create a slow Ken Burns push-in effect.", assignment: "Add a digital zoom-in on a crucial moment & sliding text.", challenge: "Use keyframes to make facecam bounce on loud noise.", mistakes: "Adding too many keyframes (jerky movement).", shortcuts: "Click curve icon on timeline clip to ease keyframes.", linkText: "Casey Faris: Keyframes", linkUrl: "https://www.youtube.com/results?search_query=Casey+Faris+Keyframes+Resolve", difficulty: "5/10" },
  { day: 12, week: 2, topic: "Effects Basics", learning: "1. Effects Library 2. Adjustment Clips 3. Blur, Glow, Camera Shake", practice: "Add Adjustment Clip over 3 videos; apply tint & blur.", assignment: "Apply 'Camera Shake' to emphasize an impact.", challenge: "Stack 2 effects on an adjustment layer (dream sequence).", mistakes: "Applying heavy effects directly to clips instead of Adjustment Clips.", shortcuts: "Alt+drag Adjustment Clip to duplicate effect stack.", linkText: "MrAlexTech: Adjustment Clips", linkUrl: "https://www.youtube.com/results?search_query=MrAlexTech+Adjustment+Clips+Resolve", difficulty: "4/10" },
  { day: 13, week: 2, topic: "Color Correction Intro", learning: "1. Color Page 2. Read Scopes 3. Balance Contrast 4. White Balance", practice: "Take flat/log clip and add basic contrast/saturation.", assignment: "Correct exposure/white balance of 3 different clips.", challenge: "Match skin tones of two clips using Vectorscope.", mistakes: "Adding too much saturation or crushing blacks.", shortcuts: "Shift + Z fits image. Ctrl/Cmd + D toggles grade.", linkText: "Cullen Kelly: Basic Color", linkUrl: "https://www.youtube.com/results?search_query=Cullen+Kelly+Basic+Color+Correction+Resolve", difficulty: "5/10" },
  { day: 14, week: 2, topic: "YouTube Editing & W2 Project", learning: "1. Pacing 2. Jump cuts 3. Pop-up graphics 4. SFX for text", practice: "Cut a 10s intro with jump cuts every 2-3s.", assignment: "W2 Project: Edit a 1-min YouTube Hook with text/SFX/J-cuts.", challenge: "Find/sync 3 'whoosh' SFX to text appearances.", mistakes: "Leaving dead air in talking-head footage.", shortcuts: "Use 'Cut' page for fast ripple editing.", linkText: "HillierSmith: YouTube Pacing", linkUrl: "https://www.youtube.com/results?search_query=HillierSmith+Editing+Pacing", difficulty: "6/10" },
  { day: 15, week: 3, topic: "Color Grading & Nodes", learning: "1. Serial nodes 2. Using LUTs safely 3. Teal & Orange look", practice: "Apply a LUT to a node, dial back intensity.", assignment: "Create cinematic 'Teal & Orange' grade using 3 nodes.", challenge: "Copy grade and apply to 4 other clips seamlessly.", mistakes: "Applying LUTs before correcting exposure.", shortcuts: "Alt + S adds serial node. Middle mouse copies grade.", linkText: "Waqas Qazi: Teal & Orange", linkUrl: "https://www.youtube.com/results?search_query=Waqas+Qazi+Teal+and+Orange", difficulty: "6/10" },
  { day: 16, week: 3, topic: "Sound Design & Fairlight", learning: "1. Fairlight interface 2. Track EQ 3. Reverb 4. Audio ducking", practice: "Apply low-pass filter to music when 'underwater'.", assignment: "Add 3 layers of SFX under a 10s silent video.", challenge: "Set up auto-ducking for music under voiceover.", mistakes: "Ignoring EQ; bass frequencies clashing.", shortcuts: "Double-click EQ graphic to open full track EQ.", linkText: "Jason Yadlovski: Audio Ducking", linkUrl: "https://www.youtube.com/results?search_query=Jason+Yadlovski+Audio+Ducking+Resolve", difficulty: "6/10" },
  { day: 17, week: 3, topic: "Dynamic Motion & Transforms", learning: "1. Dynamic Zoom 2. Pitch/Yaw 3. Easing keyframes", practice: "Use Dynamic Zoom to pan across a photo.", assignment: "Keyframe gameplay to tilt back in 3D (Pitch/Yaw).", challenge: "Smooth out all motion keyframes using splines.", mistakes: "Linear keyframes making animations feel robotic.", shortcuts: "Toggle Dynamic Zoom in inspector instantly.", linkText: "MrAlexTech: Dynamic Zoom", linkUrl: "https://www.youtube.com/results?search_query=MrAlexTech+Dynamic+Zoom", difficulty: "5/10" },
  { day: 18, week: 3, topic: "Speed Ramping", learning: "1. Retime controls 2. Retime curve 3. Speed points 4. Optical Flow", practice: "Ramp a 10s clip to 300% then slow to 50%.", assignment: "Create 15s action montage with fast-to-slow ramps.", challenge: "Use Optical Flow to make 30fps look like smooth slow-mo.", mistakes: "Not smoothing curves (jarring jumps).", shortcuts: "Ctrl/Cmd + R brings up Retime Controls.", linkText: "Jamie Fenn: Speed Ramping", linkUrl: "https://www.youtube.com/results?search_query=Jamie+Fenn+Speed+Ramping+Resolve", difficulty: "7/10" },
  { day: 19, week: 3, topic: "Power Windows & Masking", learning: "1. Color page windows 2. Inverting masks 3. Tracking", practice: "Add circular window over face, brighten, and track.", assignment: "Create vignette (dark outside) and brighten subject (inner track).", challenge: "Mask out a window and change sky color.", mistakes: "Not adding 'Softness' to masks (harsh lines).", shortcuts: "Alt + O adds Outside Node.", linkText: "Casey Faris: Power Windows", linkUrl: "https://www.youtube.com/results?search_query=Casey+Faris+Power+Windows", difficulty: "6/10" },
  { day: 20, week: 3, topic: "Multi-Layer & Compound Clips", learning: "1. Sync multi-cam 2. Compound clips 3. Render in place", practice: "Combine 3 synced clips into Compound Clip, apply 1 grade.", assignment: "Set up Multicam with 2 angles & live cut 30s.", challenge: "Use 'Render in Place' on a heavy effects clip.", mistakes: "Getting trapped inside compound clips.", shortcuts: "Right-click -> Decompose in Place to unpack.", linkText: "Learn Color Grading: Multicam", linkUrl: "https://www.youtube.com/results?search_query=DaVinci+Resolve+Multicam+Editing", difficulty: "6/10" },
  { day: 21, week: 3, topic: "Platform Exports & W3 Project", learning: "1. Vertical resolution 2. Smart Reframe 3. Safe zones", practice: "Convert 16:9 clip into 9:16 using Smart Reframe.", assignment: "W3 Project: Edit 45s promo, duplicate & convert to Short.", challenge: "Overlay 'Shorts Safe Zone' PNG to check UI buttons.", mistakes: "Forgetting project scaling 'Scale full frame with crop'.", shortcuts: "Check 'Use vertical resolution' in settings.", linkText: "MrAlexTech: Vertical Video", linkUrl: "https://www.youtube.com/results?search_query=MrAlexTech+Vertical+Video+Resolve", difficulty: "5/10" },
  { day: 22, week: 4, topic: "Advanced Node Structures", learning: "1. Parallel Nodes 2. Layer Nodes 3. Alpha outputs", practice: "Create Layer Node setup to grade subject apart from bg.", assignment: "Build a 6-node tree & save as PowerGrade.", challenge: "Use Parallel node to blend harsh color naturally.", mistakes: "Creating a messy web; forgetting to label nodes.", shortcuts: "Right-click node -> Label. Save in PowerGrade gallery.", linkText: "Cullen Kelly: Node Structures", linkUrl: "https://www.youtube.com/results?search_query=Cullen+Kelly+Node+Structures", difficulty: "8/10" },
  { day: 23, week: 4, topic: "Fusion Basics", learning: "1. Fusion interface 2. MediaIn/Out 3. Merge/Transform nodes", practice: "Add Background node and Merge it over video using mask.", assignment: "Create custom graphic (colored box + text) & animate.", challenge: "Understand: Yellow = Background, Green = Foreground.", mistakes: "Connecting nodes backwards into Merge node.", shortcuts: "Shift + Spacebar opens node search.", linkText: "Casey Faris: Fusion Beginners", linkUrl: "https://www.youtube.com/results?search_query=Casey+Faris+Fusion+Beginners", difficulty: "8/10" },
  { day: 24, week: 4, topic: "Motion Graphics (Fusion)", learning: "1. Text+ animations 2. Callout lines 3. Spline editor", practice: "Create tracking callout line displaying text.", assignment: "Build custom 'Subscribe' button & save as macro.", challenge: "Master Spline editor by making text 'bounce'.", mistakes: "Overcomplicating paths; ignoring spline editor.", shortcuts: "Pin Spline editor, select keys, hit F to smooth.", linkText: "William Justice: Callouts", linkUrl: "https://www.youtube.com/results?search_query=William+Justice+Fusion+Callouts", difficulty: "9/10" },
  { day: 25, week: 4, topic: "Advanced Tracking & Masking", learning: "1. Planar Tracker 2. Magic Mask / Object Tracking", practice: "Use Planar Tracker to replace smartphone screen.", assignment: "Put text *behind* a walking person (Magic Mask/Rotoscoping).", challenge: "Track a glowing effect onto moving eyes/hands.", mistakes: "Tracking blurred objects without adjusting params.", shortcuts: "Track forward AND backward from middle for best results.", linkText: "MrAlexTech: Planar Tracker", linkUrl: "https://www.youtube.com/results?search_query=MrAlexTech+Planar+Tracker", difficulty: "9/10" },
  { day: 26, week: 4, topic: "Green Screen & VFX", learning: "1. Delta Keyer 2. Clean Plate 3. Spill suppression", practice: "Remove green screen background and place in gaming bg.", assignment: "Perform flawless key, color match, add drop shadow.", challenge: "Add a light wrap for natural environmental blending.", mistakes: "Crushing matte too hard (jagged hair edges).", shortcuts: "Drag background into Delta Keyer to sample green.", linkText: "Casey Faris: Delta Keyer", linkUrl: "https://www.youtube.com/results?search_query=Casey+Faris+Green+Screen+Delta+Keyer", difficulty: "8/10" },
  { day: 27, week: 4, topic: "Workflow & Speed", learning: "1. Keyboard customization 2. Render cache 3. Proxy media", practice: "Set custom shortcuts for Blade, Ripple, Zoom.", assignment: "Generate proxy media and enable 'Smart' render cache.", challenge: "Edit a 1-min high-res clip using ONLY proxies/shortcuts.", mistakes: "Editing 4K/60fps without proxies (playback lag).", shortcuts: "Ctrl/Cmd + Alt + K opens Keyboard Customization.", linkText: "Jamie Fenn: Edit Faster", linkUrl: "https://www.youtube.com/results?search_query=Jamie+Fenn+Edit+Faster+Resolve", difficulty: "5/10" },
  { day: 28, week: 4, topic: "Final Portfolio Project", learning: "Full pipeline: Import, Cut, B-Roll, SFX, Graphic, Grade, Export.", practice: "Plan timeline structure (Audio -> A-roll -> VFX -> Grade).", assignment: "W4 Final Project: Edit 1.5-2m showreel with all learned skills.", challenge: "Organize timeline perfectly labeled and color-coded.", mistakes: "Rushing final export without watching in full screen.", shortcuts: "Render out XML or DRP to back up masterwork.", linkText: "JayAreTV: Workflow", linkUrl: "https://www.youtube.com/results?search_query=JayAreTV+DaVinci+Resolve+Workflow", difficulty: "10/10" }
];

const resourceData = {
  video: "Pexels (pexels.com), Pixabay (pixabay.com), Mixkit (mixkit.co)",
  gaming: "Download royalty-free gameplay from YouTube (search 'No Copyright Gameplay')",
  cinematic: "Blackmagic Design website (sample BRAW), Artgrid (free test footage)",
  audio: "YouTube Audio Library, Freesound.org, Mixkit SFX"
};

const projectData = [
  { week: 1, title: 'The 30-Second Sizzle', desc: 'Assemble a 30-second fast-paced montage using 10 clips, matching cuts to a background music beat. Export in 1080p.' },
  { week: 2, title: 'The YouTube Intro/Vlog Hook', desc: 'Create a 1-minute engaging intro using A-roll, B-roll overlays, animated text, J/L cuts, and basic sound effects.' },
  { week: 3, title: 'The Cinematic Promo', desc: 'Edit a 45-second cinematic sequence featuring speed ramping, color grading (moody look), dynamic sound design, and masked transitions.' },
  { week: 4, title: 'The Portfolio Showreel', desc: 'Build a 1 to 2-minute dynamic showreel combining gameplay, talking head, motion graphics, and advanced Fusion VFX.' }
];

const WEEK_COLORS = {
  1: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  2: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-500' },
  3: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  4: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
};

function DifficultyBadge({ difficulty }) {
  const [current, total] = difficulty.split('/').map(Number);
  const isEasy = current <= 3;
  const isMed = current <= 6;
  const cls = isEasy
    ? 'bg-emerald-50 text-emerald-700'
    : isMed
    ? 'bg-amber-50 text-amber-700'
    : 'bg-rose-50 text-rose-700';
  return (
    <span className={`badge ${cls} border border-current/20`} style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
      {difficulty}
    </span>
  );
}

function WeekBadge({ week }) {
  const c = WEEK_COLORS[week];
  return (
    <span className={`badge ${c.bg} ${c.text} border ${c.border}`} style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
      Wk {week}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-card flex items-start gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-semibold text-slate-900 leading-none">{value}</p>
        <p className="text-sm text-slate-500 mt-1">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function App() {
  const [completedDays, setCompletedDays] = useState([]);
  const [feedbackData, setFeedbackData] = useState({});
  const [activeWeekFilter, setActiveWeekFilter] = useState('All');
  const [showResources, setShowResources] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [trackerId, setTrackerId] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try { await signInAnonymously(auth); } catch (error) { console.error("Auth error:", error); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    let currentHash = window.location.hash.replace('#', '');
    if (!currentHash) {
      currentHash = crypto.randomUUID();
      window.location.hash = currentHash;
    }
    setTrackerId(currentHash);
    const handleHashChange = () => setTrackerId(window.location.hash.replace('#', ''));
    window.addEventListener('hashchange', handleHashChange);
    return () => { unsubscribe(); window.removeEventListener('hashchange', handleHashChange); };
  }, []);

  useEffect(() => {
    if (!user || !trackerId || !db) return;
    const docRef = doc(db, 'trackers', trackerId);
    const unsubscribeDb = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCompletedDays(data.completedDays || []);
        setFeedbackData(data.feedbackData || {});
      }
    }, (error) => console.error("Firestore error:", error));
    return () => unsubscribeDb();
  }, [user, trackerId]);

  const saveToDb = async (newCompleted, newFeedback) => {
    if (!user || !trackerId || !db) return;
    try {
      const docRef = doc(db, 'trackers', trackerId);
      await setDoc(docRef, { completedDays: newCompleted, feedbackData: newFeedback, updatedAt: Date.now() }, { merge: true });
    } catch (error) { console.error("Error saving data:", error); }
  };

  const toggleDay = (dayNum) => {
    const newCompleted = completedDays.includes(dayNum)
      ? completedDays.filter(d => d !== dayNum)
      : [...completedDays, dayNum];
    setCompletedDays(newCompleted);
    saveToDb(newCompleted, feedbackData);
  };

  const updateFeedback = (dayNum, text) => {
    const newFeedback = { ...feedbackData, [dayNum]: text };
    setFeedbackData(newFeedback);
    saveToDb(completedDays, newFeedback);
  };

  const copyShareLink = () => {
    const url = window.location.href;
    const textArea = document.createElement("textarea");
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) { console.error('Failed to copy', err); }
    document.body.removeChild(textArea);
  };

  const exportToCSV = () => {
    const headers = ['Day', 'Week', 'Topic', 'Step-by-step learning', 'Practice task', 'Daily assignment', 'Mini challenge', 'Common mistakes', 'Shortcuts', 'Tutorial Link', 'Status', 'Feedback', 'Difficulty'];
    const rows = courseData.map(day => {
      const isDone = completedDays.includes(day.day) ? 'Done' : 'Pending';
      const feedback = feedbackData[day.day] || '';
      return [day.day, day.week, `"${day.topic}"`, `"${day.learning}"`, `"${day.practice}"`, `"${day.assignment}"`, `"${day.challenge}"`, `"${day.mistakes}"`, `"${day.shortcuts}"`, `"${day.linkUrl}"`, isDone, `"${feedback}"`, `"${day.difficulty}"`].join(',');
    });
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "DaVinci_Resolve_Masterclass_Tracker.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredData = activeWeekFilter === 'All' ? courseData : courseData.filter(d => d.week === parseInt(activeWeekFilter));
  const progressPercentage = Math.round((completedDays.length / courseData.length) * 100);

  const weekCompletions = [1, 2, 3, 4].map(w => {
    const days = courseData.filter(d => d.week === w);
    return days.filter(d => completedDays.includes(d.day)).length;
  });

  const navWeeks = ['All', '1', '2', '3', '4'];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-30
        w-64 flex-shrink-0 flex flex-col
        bg-sidebar-DEFAULT text-sidebar-text
        transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `} style={{ background: '#0f172a' }}>

        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Video className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-none">DaVinci</p>
              <p className="text-xs text-slate-400 leading-none mt-0.5">Masterclass</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress summary */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Overall Progress</span>
            <span className="text-xs font-semibold text-white">{progressPercentage}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
          </div>
          <p className="text-xs text-slate-400 mt-2">{completedDays.length} of 28 days complete</p>
        </div>

        {/* Week navigation */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider px-2 mb-3">Filter by Week</p>
          {navWeeks.map(week => {
            const isActive = activeWeekFilter === week;
            const label = week === 'All' ? 'Full Program' : `Week ${week}`;
            const weekNum = parseInt(week);
            const c = WEEK_COLORS[weekNum];
            const done = week !== 'All' ? weekCompletions[weekNum - 1] : completedDays.length;
            const total = week !== 'All' ? 7 : 28;
            return (
              <button
                key={week}
                onClick={() => { setActiveWeekFilter(week); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {week !== 'All' && <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? 'bg-white' : c.dot}`} />}
                  <span>{label}</span>
                </div>
                <span className={`text-xs ${isActive ? 'text-white/70' : 'text-slate-500'}`}>{done}/{total}</span>
              </button>
            );
          })}

          {/* Resources toggle */}
          <div className="mt-6">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider px-2 mb-3">Quick Access</p>
            <button
              onClick={() => setShowResources(v => !v)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                showResources ? 'bg-primary text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4 flex-shrink-0" />
              <span>Resources & Projects</span>
            </button>
          </div>
        </nav>

        {/* Sidebar footer actions */}
        <div className="px-4 py-4 border-t border-white/10 space-y-2">
          <button
            onClick={copyShareLink}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              copied ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            {copied ? 'Link Copied!' : 'Share Progress Link'}
          </button>
          <button
            onClick={exportToCSV}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-hover transition-all"
          >
            <Download className="w-4 h-4" />
            Export to CSV
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top header bar */}
        <header className="flex-shrink-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between gap-4" style={{ boxShadow: '0 1px 0 0 #e2e8f0' }}>
          <div className="flex items-center gap-4 min-w-0">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-500 hover:text-slate-900 flex-shrink-0">
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base font-semibold text-slate-900 leading-none truncate">
                {activeWeekFilter === 'All' ? 'Full 28-Day Program' : `Week ${activeWeekFilter} — ${['Interface & Foundations', 'Storytelling & Effects', 'Advanced Techniques', 'Mastery & Portfolio'][parseInt(activeWeekFilter) - 1]}`}
              </h1>
              <p className="text-xs text-slate-400 mt-1">{filteredData.length} lessons &bull; {filteredData.filter(d => completedDays.includes(d.day)).length} completed</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-600">Cloud sync active</span>
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-[1800px] mx-auto flex flex-col gap-6">

            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={BarChart2} label="Overall Progress" value={`${progressPercentage}%`} sub={`${completedDays.length}/28 days`} color="bg-blue-50 text-blue-600" />
              <StatCard icon={Trophy} label="Week 1 Complete" value={`${weekCompletions[0]}/7`} color="bg-violet-50 text-violet-600" />
              <StatCard icon={Target} label="Current Streak" value={(() => {
                let streak = 0;
                for (let i = 28; i >= 1; i--) {
                  if (completedDays.includes(i)) streak++;
                  else break;
                }
                return streak;
              })()} sub="days in a row" color="bg-amber-50 text-amber-600" />
              <StatCard icon={Zap} label="Remaining Days" value={28 - completedDays.length} sub="to completion" color="bg-rose-50 text-rose-600" />
            </div>

            {/* Resources panel */}
            {showResources && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                  <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Practice Resources & Weekly Projects
                  </h2>
                  <button onClick={() => setShowResources(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                  <div className="p-6">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Free Practice Media</h3>
                    <ul className="space-y-2.5">
                      {[
                        { label: 'Video Footage', val: resourceData.video },
                        { label: 'Gaming Clips', val: resourceData.gaming },
                        { label: 'Cinematic', val: resourceData.cinematic },
                        { label: 'Audio & SFX', val: resourceData.audio },
                      ].map(r => (
                        <li key={r.label} className="flex flex-col gap-0.5">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{r.label}</span>
                          <span className="text-sm text-slate-600">{r.val}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Weekly Portfolio Projects</h3>
                    <div className="space-y-3">
                      {projectData.map(proj => {
                        const c = WEEK_COLORS[proj.week];
                        return (
                          <div key={proj.week} className={`p-4 rounded-lg border ${c.border} ${c.bg}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <WeekBadge week={proj.week} />
                              <span className={`text-sm font-semibold ${c.text}`}>{proj.title}</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{proj.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Table card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[1300px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-4 w-14 text-center">
                        <span className="sr-only">Status</span>
                      </th>
                      <th className="p-4 w-16 text-xs font-semibold text-slate-500 uppercase tracking-wider">Day</th>
                      <th className="p-4 w-20 text-xs font-semibold text-slate-500 uppercase tracking-wider">Week</th>
                      <th className="p-4 min-w-[200px] text-xs font-semibold text-slate-500 uppercase tracking-wider">Topic</th>
                      <th className="p-4 min-w-[280px] text-xs font-semibold text-slate-500 uppercase tracking-wider">Daily Assignment</th>
                      <th className="p-4 min-w-[240px] text-xs font-semibold text-slate-500 uppercase tracking-wider">Step-by-Step</th>
                      <th className="p-4 min-w-[200px] text-xs font-semibold text-slate-500 uppercase tracking-wider">Practice Task</th>
                      <th className="p-4 min-w-[200px] text-xs font-semibold text-slate-500 uppercase tracking-wider">Mini Challenge</th>
                      <th className="p-4 min-w-[180px] text-xs font-semibold text-slate-500 uppercase tracking-wider">Mistakes</th>
                      <th className="p-4 min-w-[180px] text-xs font-semibold text-slate-500 uppercase tracking-wider">Shortcuts</th>
                      <th className="p-4 min-w-[140px] text-xs font-semibold text-slate-500 uppercase tracking-wider">Tutorial</th>
                      <th className="p-4 w-20 text-xs font-semibold text-slate-500 uppercase tracking-wider">Diff.</th>
                      <th className="p-4 min-w-[240px] text-xs font-semibold text-slate-500 uppercase tracking-wider">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredData.map((day) => {
                      const isDone = completedDays.includes(day.day);
                      return (
                        <tr
                          key={day.day}
                          className={`tracker-row transition-colors ${isDone ? 'completed' : ''}`}
                        >
                          {/* Status */}
                          <td
                            className="p-4 text-center align-top cursor-pointer"
                            onClick={() => toggleDay(day.day)}
                            title={isDone ? 'Mark incomplete' : 'Mark complete'}
                          >
                            {isDone ? (
                              <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-300 hover:text-primary mx-auto transition-colors" />
                            )}
                          </td>

                          {/* Day */}
                          <td className="p-4 align-top">
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                              isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {day.day}
                            </span>
                          </td>

                          {/* Week */}
                          <td className="p-4 align-top">
                            <WeekBadge week={day.week} />
                          </td>

                          {/* Topic */}
                          <td className="p-4 align-top">
                            <span className={`text-sm font-semibold leading-snug ${isDone ? 'text-slate-400 line-through' : 'text-slate-900'}`} style={{ whiteSpace: 'normal' }}>
                              {day.topic}
                            </span>
                          </td>

                          {/* Assignment */}
                          <td className="p-4 align-top">
                            <p className="text-sm text-primary font-medium leading-snug" style={{ whiteSpace: 'normal' }}>{day.assignment}</p>
                          </td>

                          {/* Learning steps */}
                          <td className="p-4 align-top">
                            <ul className="space-y-1" style={{ whiteSpace: 'normal' }}>
                              {day.learning.split(/(?=\d\.)/g).map((item, i) => (
                                <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                                  <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0 mt-0.5" />
                                  <span>{item.trim()}</span>
                                </li>
                              ))}
                            </ul>
                          </td>

                          {/* Practice */}
                          <td className="p-4 align-top">
                            <p className="text-xs text-slate-600 leading-relaxed" style={{ whiteSpace: 'normal' }}>{day.practice}</p>
                          </td>

                          {/* Challenge */}
                          <td className="p-4 align-top">
                            <p className="text-xs text-amber-700 leading-relaxed font-medium" style={{ whiteSpace: 'normal' }}>{day.challenge}</p>
                          </td>

                          {/* Mistakes */}
                          <td className="p-4 align-top">
                            <p className="text-xs text-rose-600 leading-relaxed" style={{ whiteSpace: 'normal' }}>{day.mistakes}</p>
                          </td>

                          {/* Shortcuts */}
                          <td className="p-4 align-top">
                            <p className="text-xs font-mono text-slate-600 leading-relaxed bg-slate-50 rounded-md px-2 py-1.5 border border-slate-100" style={{ whiteSpace: 'normal' }}>{day.shortcuts}</p>
                          </td>

                          {/* Tutorial */}
                          <td className="p-4 align-top">
                            <a
                              href={day.linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-start gap-1.5 text-xs text-primary hover:text-primary-hover hover:underline transition-colors"
                              style={{ whiteSpace: 'normal' }}
                            >
                              <ExternalLink className="w-3 h-3 flex-shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{day.linkText}</span>
                            </a>
                          </td>

                          {/* Difficulty */}
                          <td className="p-4 align-top">
                            <DifficultyBadge difficulty={day.difficulty} />
                          </td>

                          {/* Notes */}
                          <td className="p-4 align-top">
                            <input
                              type="text"
                              placeholder="Notes, time, rating..."
                              className="feedback-input w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 placeholder-slate-400 transition-all"
                              value={feedbackData[day.day] || ''}
                              onChange={(e) => updateFeedback(day.day, e.target.value)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table footer */}
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Showing {filteredData.length} lessons &bull; {filteredData.filter(d => completedDays.includes(d.day)).length} completed
                </p>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                    Completed
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />
                    Pending
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
