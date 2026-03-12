import React, { useState, useEffect } from 'react';
import { 
  Plus, Check, Circle, Flame, Trophy, 
  Dumbbell, Brain, Zap, Trash2, User, LayoutDashboard, Settings 
} from 'lucide-react';

export default function OlympusApp() {
  // State
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [category, setCategory] = useState('גופני');
  const [userId, setUserId] = useState('');
  const [activeTab, setActiveTab] = useState('home');

  // אתחול נתונים וזיהוי משתמש
  useEffect(() => {
    const savedHabits = localStorage.getItem('olympus_habits');
    const savedId = localStorage.getItem('olympus_userid');
    
    if (savedHabits) setHabits(JSON.parse(savedHabits));
    
    if (savedId) {
      setUserId(savedId);
    } else {
      const newId = 'OLY-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      localStorage.setItem('olympus_userid', newId);
      setUserId(newId);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('olympus_habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = () => {
    if (!newHabitName.trim()) return;
    const newHabit = {
      id: Date.now(),
      name: newHabitName,
      category: category,
      completedDates: [],
    };
    setHabits([...habits, newHabit]);
    setNewHabitName('');
  };

  const toggleHabit = (id) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(habits.map(h => {
      if (h.id === id) {
        const done = h.completedDates.includes(today);
        return {
          ...h,
          completedDates: done 
            ? h.completedDates.filter(d => d !== today)
            : [...h.completedDates, today]
        };
      }
      return h;
    }));
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const completedToday = habits.filter(h => h.completedDates.includes(todayStr)).length;

  return (
    <div dir="rtl" className="min-h-screen bg-[#020617] text-white font-sans pb-24">
      
      {/* Header & Logo */}
      <header className="bg-[#0f172a] p-6 text-center border-b border-blue-900/50 shadow-lg">
        <h1 className="text-3xl font-black tracking-widest text-blue-400 italic">OLYMPUS</h1>
        <p className="text-xs text-blue-200 mt-1 font-light uppercase tracking-tighter">מעקב הרגלים ומשמעת עצמית</p>
        <div className="mt-3 inline-block bg-blue-900/30 px-3 py-1 rounded-full border border-blue-500/20">
          <span className="text-[10px] text-blue-300 font-mono">מזהה משתמש: {userId}</span>
        </div>
      </header>

      <main className="max-w-md mx-auto p-5">
        
        {activeTab === 'home' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Dashboard Summary */}
            <section className="bg-gradient-to-br from-blue-900 to-[#1e293b] p-6 rounded-3xl shadow-xl border border-blue-400/20 text-center">
              <div className="flex justify-around items-center">
                <div>
                  <p className="text-blue-200 text-xs mb-1">השלמת היום</p>
                  <p className="text-3xl font-bold">{completedToday}/{habits.length}</p>
                </div>
                <div className="h-12 w-[1px] bg-blue-400/20"></div>
                <div>
                  <p className="text-blue-200 text-xs mb-1">רצף נוכחי</p>
                  <div className="flex items-center gap-1 justify-center text-3xl font-bold text-orange-400">
                    <Flame className="w-6 h-6 fill-current" />
                    <span>3</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Add Habit Section */}
            <section className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-400">
                <Plus className="w-5 h-5" /> הוספת הרגל חדש
              </h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="מה המטרה שלך?"
                  className="w-full bg-[#020617] border border-slate-700 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-center"
                />
                <div className="grid grid-cols-3 gap-2">
                  {['גופני', 'מנטלי', 'פרודוקטיביות'].map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`py-2 text-xs rounded-lg transition-all ${category === cat ? 'bg-blue-600 border-blue-400' : 'bg-slate-800 border-transparent'} border`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={addHabit}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-transform active:scale-95"
                >
                  הוסף לרשימה
                </button>
              </div>
            </section>

            {/* List Section */}
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-slate-500 mr-2 uppercase tracking-widest">משימות היום</h3>
              {habits.map(h => {
                const isDone = h.completedDates.includes(todayStr);
                return (
                  <div key={h.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isDone ? 'bg-blue-950/20 border-blue-900/50 opacity-50' : 'bg-[#0f172a] border-slate-800 shadow-md'}`}>
                    <div className="flex items-center gap-4">
                      <button onClick={() => toggleHabit(h.id)} className={`transition-all ${isDone ? 'text-green-500' : 'text-slate-500'}`}>
                        {isDone ? <Check className="w-8 h-8 stroke-[3px]" /> : <Circle className="w-8 h-8" />}
                      </button>
                      <div>
                        <p className={`font-bold ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>{h.name}</p>
                        <span className="text-[10px] text-blue-400 px-2 py-0.5 bg-blue-900/30 rounded-full">{h.category}</span>
                      </div>
                    </div>
                    <button onClick={() => deleteHabit(h.id)} className="text-slate-700 hover:text-red-500 p-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </section>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="text-center py-20 animate-in slide-in-from-bottom-5 duration-500">
            <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl shadow-blue-500/20">
              <User className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold">הפרופיל שלך</h2>
            <p className="text-slate-400 mt-2">מזהה: {userId}</p>
            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800">
                <p className="text-blue-400 font-bold text-xl">{habits.length}</p>
                <p className="text-xs text-slate-400">הרגלים פעילים</p>
              </div>
              <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800">
                <p className="text-orange-400 font-bold text-xl">30%</p>
                <p className="text-xs text-slate-400">אחוזי הצלחה</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0f172a]/90 backdrop-blur-xl border-t border-slate-800 p-4 flex justify-around items-center z-50">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-blue-500' : 'text-slate-500'}`}>
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[10px] font-bold">ראשי</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-blue-500' : 'text-slate-500'}`}>
          <User className="w-6 h-6" />
          <span className="text-[10px] font-bold">פרופיל</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-500">
          <Settings className="w-6 h-6" />
          <span className="text-[10px] font-bold">הגדרות</span>
        </button>
      </nav>
    </div>
  );
}
