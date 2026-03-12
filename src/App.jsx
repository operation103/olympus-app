import React, { useState, useEffect } from 'react';
import { 
  Plus, Check, Circle, Flame, 
  Dumbbell, Brain, Zap, Trash2, User, LayoutDashboard, BarChart3 
} from 'lucide-react';

export default function OlympusApp() {
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [category, setCategory] = useState('גופני');
  const [userId, setUserId] = useState('');
  const [activeTab, setActiveTab] = useState('home');

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
    setHabits([...habits, {
      id: Date.now(),
      name: newHabitName,
      category,
      completedDates: []
    }]);
    setNewHabitName('');
  };

  const toggleHabit = (id) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(habits.map(h => {
      if (h.id === id) {
        const done = h.completedDates.includes(today);
        return { ...h, completedDates: done ? h.completedDates.filter(d => d !== today) : [...h.completedDates, today] };
      }
      return h;
    }));
  };

  const deleteHabit = (id) => setHabits(habits.filter(h => h.id !== id));

  const todayStr = new Date().toISOString().split('T')[0];
  const completedCount = habits.filter(h => h.completedDates.includes(todayStr)).length;

  return (
    <div dir="rtl" className="fixed inset-0 bg-[#020617] text-white flex flex-col font-sans">
      
      {/* Header - Fixed Top */}
      <header className="shrink-0 bg-[#0f172a] p-5 border-b border-blue-900/50 text-center shadow-2xl">
        <h1 className="text-3xl font-black tracking-tighter text-blue-500 italic">OLYMPUS</h1>
        <div className="flex justify-center items-center gap-2 mt-2">
          <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-1 rounded border border-blue-500/30">
             ID: {userId}
          </span>
        </div>
      </header>

      {/* Main Content - Scrollable Area */}
      <main className="flex-1 overflow-y-auto p-4 pb-32">
        
        {activeTab === 'home' && (
          <div className="max-w-md mx-auto space-y-6">
            
            {/* Stats Card */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0f172a] p-4 rounded-2xl border border-blue-500/20 flex flex-col items-center">
                <Flame className="text-orange-500 w-6 h-6 mb-1" />
                <span className="text-2xl font-bold">3</span>
                <span className="text-[10px] text-slate-400">רצף ימים</span>
              </div>
              <div className="bg-[#0f172a] p-4 rounded-2xl border border-blue-500/20 flex flex-col items-center">
                <Check className="text-green-500 w-6 h-6 mb-1" />
                <span className="text-2xl font-bold">{completedCount}/{habits.length}</span>
                <span className="text-[10px] text-slate-400">הושלמו היום</span>
              </div>
            </div>

            {/* Input Form */}
            <div className="bg-[#0f172a] p-5 rounded-3xl border border-slate-800 shadow-xl">
              <label className="block text-sm font-bold mb-3 text-blue-300">הוספת יעד חדש:</label>
              <input 
                type="text" 
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="למשל: 50 שכיבות סמיכה"
                className="w-full bg-[#020617] border border-slate-700 p-4 rounded-xl text-white mb-4 focus:border-blue-500 outline-none transition-all"
              />
              <div className="grid grid-cols-3 gap-2 mb-4">
                {['גופני', 'מנטלי', 'פרודוקטיביות'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`py-2 text-[11px] rounded-lg border font-bold ${category === cat ? 'bg-blue-600 border-blue-400' : 'bg-slate-800 border-transparent text-slate-400'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <button 
                onClick={addHabit}
                className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40"
              >
                <Plus className="w-6 h-6" /> הוסף לרשימה
              </button>
            </div>

            {/* Habit List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase mr-1">הרגלים פעילים</h3>
              {habits.map(h => {
                const isDone = h.completedDates.includes(todayStr);
                return (
                  <div key={h.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isDone ? 'bg-blue-900/20 border-blue-500/30' : 'bg-[#0f172a] border-slate-800'}`}>
                    <div className="flex items-center gap-4 flex-1">
                      <button onClick={() => toggleHabit(h.id)} className={`shrink-0 ${isDone ? 'text-green-500' : 'text-slate-600'}`}>
                        {isDone ? <Check className="w-9 h-9 stroke-[3px]" /> : <Circle className="w-9 h-9" />}
                      </button>
                      <div className="flex flex-col">
                        <span className={`text-lg font-bold leading-tight ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
                          {h.name}
                        </span>
                        <span className="text-[10px] text-blue-400 font-medium uppercase mt-1">{h.category}</span>
                      </div>
                    </div>
                    <button onClick={() => deleteHabit(h.id)} className="p-2 text-slate-700 hover:text-red-500">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="max-w-md mx-auto text-center py-10">
            <BarChart3 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">גרף התקדמות</h2>
            <p className="text-slate-400">בקרוב: ניתוח ביצועים שבועי</p>
          </div>
        )}
      </main>

      {/* Navigation Bar - Fixed Bottom */}
      <nav className="shrink-0 bg-[#0f172a] border-t border-slate-800 pb-8 pt-4 px-6 flex justify-around items-center">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-blue-500' : 'text-slate-500'}`}>
          <LayoutDashboard className="w-7 h-7" />
          <span className="text-[10px] font-bold">בית</span>
        </button>
        <button onClick={() => setActiveTab('stats')} className={`flex flex-col items-center gap-1 ${activeTab === 'stats' ? 'text-blue-500' : 'text-slate-500'}`}>
          <BarChart3 className="w-7 h-7" />
          <span className="text-[10px] font-bold">סטטיסטיקה</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-blue-500' : 'text-slate-500'}`}>
          <User className="w-7 h-7" />
          <span className="text-[10px] font-bold">פרופיל</span>
        </button>
      </nav>
    </div>
  );
}
