import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Check, Circle, Flame, Trophy, 
  Dumbbell, Brain, Zap, Trash2, User, 
  LayoutDashboard, Target, ChevronRight,
  Share2, Award, Star
} from 'lucide-react';

// --- Utility for Category Icons ---
const CategoryIcon = ({ type, className }) => {
  switch (type) {
    case 'גופני': return <Dumbbell className={className} />;
    case 'מנטלי': return <Brain className={className} />;
    case 'פרודוקטיביות': return <Zap className={className} />;
    default: return <Target className={className} />;
  }
};

export default function OlympusApp() {
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [category, setCategory] = useState('גופני');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userId, setUserId] = useState('');

  // --- Initialization ---
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('olympus_v2_data') || '[]');
    const savedId = localStorage.getItem('olympus_userid') || `OLY-${Math.random().toString(36).substring(2,8).toUpperCase()}`;
    setHabits(saved);
    setUserId(savedId);
    localStorage.setItem('olympus_userid', savedId);
  }, []);

  useEffect(() => {
    localStorage.setItem('olympus_v2_data', JSON.stringify(habits));
  }, [habits]);

  // --- Logic ---
  const today = new Date().toISOString().split('T')[0];
  
  const addHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    const newHabit = {
      id: Date.now(),
      name: newHabitName,
      category,
      streak: 0,
      completedDates: [],
      createdAt: new Date().toISOString()
    };
    setHabits([newHabit, ...habits]);
    setNewHabitName('');
  };

  const toggleHabit = (id) => {
    setHabits(habits.map(h => {
      if (h.id === id) {
        const isDone = h.completedDates.includes(today);
        const newDates = isDone 
          ? h.completedDates.filter(d => d !== today)
          : [...h.completedDates, today];
        return { ...h, completedDates: newDates };
      }
      return h;
    }));
  };

  // --- Stats Calculations ---
  const stats = useMemo(() => {
    const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
    const totalHabits = habits.length;
    const progress = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;
    const totalCompletions = habits.reduce((acc, h) => acc + h.completedDates.length, 0);
    const level = Math.floor(totalCompletions / 5) + 1;
    return { completedToday, totalHabits, progress, level, totalCompletions };
  }, [habits, today]);

  // Funnel Logic: 3 day streak overall
  const hasGlobalStreak = stats.totalCompletions >= 3;

  return (
    <div dir="rtl" className="fixed inset-0 bg-[#020617] text-slate-100 font-sans overflow-hidden flex flex-col">
      
      {/* --- Top Navbar --- */}
      <header className="px-6 pt-12 pb-6 bg-gradient-to-b from-[#0f172a] to-transparent shrink-0">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-blue-500 font-black text-xs tracking-[0.2em] uppercase">Status: Elite</h2>
            <h1 className="text-4xl font-black italic tracking-tighter">OLYMPUS</h1>
          </div>
          <div className="flex flex-col items-end">
            <div className="bg-blue-600/20 border border-blue-500/30 px-3 py-1 rounded-full flex items-center gap-2">
              <Star className="w-3 h-3 text-blue-400 fill-blue-400" />
              <span className="text-xs font-bold text-blue-100">LEVEL {stats.level}</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 font-mono uppercase">{userId}</span>
          </div>
        </div>
      </header>

      {/* --- Main Content Area --- */}
      <main className="flex-1 overflow-y-auto px-6 pb-32">
        
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Progress Card */}
            <section className="relative overflow-hidden bg-[#0f172a] rounded-[2rem] p-6 border border-slate-800 shadow-2xl">
              <div className="relative z-10">
                <p className="text-slate-400 text-sm font-medium">הביצועים שלך היום</p>
                <div className="flex items-end gap-2 mt-1">
                  <span className="text-5xl font-black">{Math.round(stats.progress)}%</span>
                  <span className="text-blue-500 font-bold mb-2">הושלם</span>
                </div>
                {/* Custom Progress Bar */}
                <div className="w-full h-3 bg-slate-800 rounded-full mt-4 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-l from-blue-600 to-cyan-400 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                    style={{ width: `${stats.progress}%` }}
                  />
                </div>
              </div>
              {/* Background Glow */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/10 blur-[80px]" />
            </section>

            {/* Global Success Funnel */}
            {hasGlobalStreak && (
              <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-700 p-1 rounded-[2rem] shadow-lg shadow-blue-500/20">
                <div className="bg-[#0f172a]/40 backdrop-blur-sm rounded-[1.9rem] p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-yellow-500/20 p-3 rounded-2xl">
                      <Trophy className="text-yellow-400 w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">מועדון ה-1%</h4>
                      <p className="text-xs text-blue-200">פתחת גישה לקהילה הסגורה</p>
                    </div>
                  </div>
                  <button className="bg-white text-blue-700 p-3 rounded-xl shadow-lg active:scale-90 transition-transform">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}

            {/* Category Selector */}
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {['גופני', 'מנטלי', 'פרודוקטיביות'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`shrink-0 px-5 py-2.5 rounded-2xl border text-sm font-bold transition-all ${category === cat ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-600/20' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Habit List */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.2em] px-1">הרגלים פעילים</h3>
              {habits.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-slate-800 rounded-3xl">
                  <p className="text-slate-500 text-sm">הלוח חלק. הגיע הזמן לבנות את הגורל שלך.</p>
                </div>
              ) : (
                habits.map(h => {
                  const isDone = h.completedDates.includes(today);
                  return (
                    <div 
                      key={h.id} 
                      className={`group relative flex items-center justify-between p-5 rounded-3xl border transition-all duration-500 ${isDone ? 'bg-blue-900/10 border-blue-900/40 opacity-60' : 'bg-[#0f172a] border-slate-800 shadow-xl'}`}
                    >
                      <div className="flex items-center gap-5">
                        <button 
                          onClick={() => toggleHabit(h.id)}
                          className={`relative w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${isDone ? 'bg-green-500 border-green-500' : 'border-slate-700 bg-slate-800 group-hover:border-blue-500'}`}
                        >
                          {isDone ? <Check className="text-slate-950 w-6 h-6 stroke-[4px]" /> : <div className="w-2 h-2 bg-slate-600 rounded-full" />}
                        </button>
                        <div>
                          <h4 className={`text-lg font-bold transition-all ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>{h.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <CategoryIcon type={h.category} className="w-3 h-3 text-blue-500" />
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{h.category}</span>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => { if(window.confirm('למחוק את ההרגל?')) setHabits(habits.filter(prev => prev.id !== h.id)) }} className="opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-red-500 transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* --- Add Habit Tab --- */}
        {activeTab === 'add' && (
          <div className="max-w-md mx-auto py-6 animate-in zoom-in-95 duration-300">
            <h2 className="text-3xl font-black mb-8 text-center">הוספת יעד חדש</h2>
            <form onSubmit={addHabit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-blue-500 mr-2 uppercase">שם ההרגל</label>
                <input 
                  type="text" 
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="למשל: מדיטציה עמוקה"
                  className="w-full bg-slate-900 border-2 border-slate-800 p-5 rounded-[2rem] text-xl font-bold focus:border-blue-600 outline-none transition-all shadow-inner"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-blue-500 mr-2 uppercase">קטגוריה</label>
                <div className="grid grid-cols-3 gap-3">
                  {['גופני', 'מנטלי', 'פרודוקטיביות'].map(cat => (
                    <button 
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all ${category === cat ? 'bg-blue-600/20 border-blue-600 text-blue-400' : 'bg-slate-900 border-slate-800 text-slate-600'}`}
                    >
                      <CategoryIcon type={cat} className="w-6 h-6" />
                      <span className="text-[10px] font-bold">{cat}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 py-6 rounded-[2rem] font-black text-xl shadow-[0_10px_30px_rgba(37,99,235,0.3)] active:scale-[0.98] transition-all"
              >
                התחל עכשיו
              </button>
            </form>
          </div>
        )}
      </main>

      {/* --- Floating Bottom Navigation --- */}
      <nav className="fixed bottom-8 left-6 right-6 h-20 bg-[#0f172a]/80 backdrop-blur-2xl rounded-[2.5rem] border border-slate-800 shadow-2xl flex items-center justify-around px-2 z-50">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`relative p-4 transition-all duration-300 ${activeTab === 'dashboard' ? 'text-blue-500 scale-110' : 'text-slate-500'}`}
        >
          <LayoutDashboard className="w-7 h-7" />
          {activeTab === 'dashboard' && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]" />}
        </button>

        {/* Central Add Button */}
        <button 
          onClick={() => setActiveTab('add')}
          className={`-translate-y-8 w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_15px_30px_rgba(37,99,235,0.4)] border-4 border-[#020617] transition-transform active:scale-90 ${activeTab === 'add' ? 'rotate-45 bg-slate-800' : ''}`}
        >
          <Plus className="w-8 h-8 text-white stroke-[3px]" />
        </button>

        <button 
          onClick={() => setActiveTab('profile')}
          className={`relative p-4 transition-all duration-300 ${activeTab === 'profile' ? 'text-blue-500 scale-110' : 'text-slate-500'}`}
        >
          <User className="w-7 h-7" />
          {activeTab === 'profile' && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]" />}
        </button>
      </nav>

      {/* CSS Overrides for No-Scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
