import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Flame, 
  Trophy, 
  Dumbbell, 
  Brain, 
  Zap, 
  Trash2,
  ExternalLink 
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for Tailwind classes
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const CATEGORIES = [
  { id: 'גופני', icon: Dumbbell, color: 'text-blue-500' },
  { id: 'מנטלי', icon: Brain, color: 'text-purple-500' },
  { id: 'פרודוקטיביות', icon: Zap, color: 'text-amber-500' },
];

export default function OlympusApp() {
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [streak, setStreak] = useState(0);
  const [showFunnel, setShowFunnel] = useState(false);

  // Load Data
  useEffect(() => {
    const savedHabits = localStorage.getItem('olympus_habits');
    if (savedHabits) setHabits(JSON.parse(savedHabits));
  }, []);

  // Save Data & Calculate Streak
  useEffect(() => {
    localStorage.setItem('olympus_habits', JSON.stringify(habits));
    calculateStreak();
  }, [habits]);

  const calculateStreak = () => {
    if (habits.length === 0) {
      setStreak(0);
      return;
    }

    let currentStreak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const dateToCheck = new Date();
      dateToCheck.setDate(today.getDate() - i);
      const dateStr = dateToCheck.toISOString().split('T')[0];
      
      const allCompleted = habits.every(h => h.completedDates.includes(dateStr));
      
      if (allCompleted) {
        currentStreak++;
      } else if (i === 0) {
        // If today isn't finished yet, keep checking from yesterday
        continue;
      } else {
        break;
      }
    }
    
    setStreak(currentStreak);
    // Funnel Logic: 3 days in a row
    if (currentStreak >= 3) setShowFunnel(true);
  };

  const addHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    
    const newHabit = {
      id: Date.now(),
      name: newHabitName,
      category: selectedCategory,
      completedDates: [],
      createdAt: new Date().toISOString()
    };
    
    setHabits([...habits, newHabit]);
    setNewHabitName('');
  };

  const toggleHabit = (habitId) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDates.includes(today);
        return {
          ...habit,
          completedDates: isCompleted 
            ? habit.completedDates.filter(d => d !== today)
            : [...habit.completedDates, today]
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const completedToday = habits.filter(h => h.completedDates.includes(todayStr)).length;

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black tracking-tighter text-blue-500 italic">OLYMPUS</h1>
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full">
            <Flame className={cn("w-5 h-5", streak > 0 ? "text-orange-500 fill-orange-500" : "text-slate-500")} />
            <span className="font-bold">{streak} ימים</span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Greeting Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold mb-1">שלום, לוחם</h2>
          <p className="text-slate-400">
            {habits.length === 0 
              ? "התחל בבניית המשמעת העצמית שלך היום." 
              : `השלמת ${completedToday} מתוך ${habits.length} המשימות להיום.`}
          </p>
        </section>

        {/* Funnel Success Card */}
        {showFunnel && (
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 border border-blue-400 shadow-xl shadow-blue-900/20 animate-in fade-in zoom-in duration-500">
            <div className="flex items-start justify-between">
              <div>
                <Trophy className="w-10 h-10 text-white mb-3" />
                <h3 className="text-xl font-bold text-white mb-1">הישג יוצא דופן!</h3>
                <p className="text-blue-100 text-sm mb-4">השלמת 3 ימים רצופים של משמעת ברזל. אתה מוכן לשלב הבא.</p>
                <a 
                  href="https://whatsapp.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-100 transition-colors"
                >
                  הצטרף לקהילת ה-WhatsApp של Olympus
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Add Habit Form */}
        <form onSubmit={addHabit} className="mb-8 space-y-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="שם ההרגל (למשל: אימון בוקר)"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-right"
          />
          
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex-1 py-2 px-1 rounded-md border text-xs font-medium transition-all flex flex-col items-center gap-1",
                  selectedCategory === cat.id 
                    ? "bg-slate-800 border-blue-500 text-blue-400" 
                    : "bg-slate-950 border-slate-800 text-slate-500"
                )}
              >
                <cat.icon className="w-4 h-4" />
                {cat.id}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            הוסף הרגל לרשימה
          </button>
        </form>

        {/* Habits List */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">הרגלים פעילים</h3>
          {habits.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl">
              <p className="text-slate-600">אין הרגלים עדיין. זה הזמן להתחיל.</p>
            </div>
          )}
          {habits.map((habit) => {
            const isDone = habit.completedDates.includes(todayStr);
            const CategoryIcon = CATEGORIES.find(c => c.id === habit.category)?.icon || Circle;
            
            return (
              <div 
                key={habit.id}
                className={cn(
                  "group flex items-center justify-between p-4 rounded-xl border transition-all duration-300",
                  isDone 
                    ? "bg-slate-900/40 border-slate-800 opacity-60" 
                    : "bg-slate-900 border-slate-800 hover:border-slate-700"
                )}
              >
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => toggleHabit(habit.id)}
                    className={cn(
                      "transition-transform active:scale-90",
                      isDone ? "text-green-500" : "text-slate-600 hover:text-slate-400"
                    )}
                  >
                    {isDone ? <CheckCircle2 className="w-8 h-8" /> : <Circle className="w-8 h-8" />}
                  </button>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-xs px-2 py-0.5 rounded-full bg-slate-800 font-medium", 
                        CATEGORIES.find(c => c.id === habit.category)?.color
                      )}>
                        {habit.category}
                      </span>
                    </div>
                    <h4 className={cn(
                      "font-bold text-lg mt-0.5",
                      isDone && "line-through text-slate-500"
                    )}>
                      {habit.name}
                    </h4>
                  </div>
                </div>

                <button 
                  onClick={() => deleteHabit(habit.id)}
                  className="text-slate-700 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* Stats Summary Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800 p-4">
        <div className="max-w-md mx-auto grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold">ביצועים</p>
            <p className="text-lg font-black text-blue-500">
              {habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0}%
            </p>
          </div>
          <div className="border-x border-slate-800">
            <p className="text-[10px] text-slate-500 uppercase font-bold">רצף נוכחי</p>
            <p className="text-lg font-black text-white">{streak} ימים</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold">סה"כ הרגלים</p>
            <p className="text-lg font-black text-white">{habits.length}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
