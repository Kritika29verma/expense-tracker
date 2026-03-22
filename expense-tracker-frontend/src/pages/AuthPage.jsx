import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const { theme: t, toggleTheme } = useTheme();
  const navigate = useNavigate();

  if (user) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      if (isLogin) {
        const res = await authAPI.login({ username: form.username, password: form.password });
        login(res.data.data, res.data.data.token);
        navigate('/dashboard');
      } else {
        await authAPI.register(form);
        setSuccess('Account created! Please login.');
        setIsLogin(true);
        setForm({ username: '', email: '', password: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const lbl = { display: 'block', fontSize: '0.73rem', fontWeight: '600', color: t.textSec, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' };
  const inp = { width: '100%', padding: '0.72rem 0.9rem', background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, borderRadius: '10px', color: t.text, fontSize: '0.9rem', boxSizing: 'border-box' };

  return (
    <div style={{ minHeight: '100vh', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', position: 'relative' }}>

      <button onClick={toggleTheme} title={t.isDark ? 'Light mode' : 'Dark mode'}
        style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: '10px', padding: '7px 10px', cursor: 'pointer', boxShadow: t.shadow, color: t.text, display: 'flex', alignItems: 'center' }}>
        {t.isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className="anim-card" style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: '20px', padding: '2.4rem', width: '100%', maxWidth: '400px', boxShadow: t.shadow }}>

        <div className="field-1" style={{ textAlign: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '1.75rem', fontWeight: '800', color: t.text }}>
            Expense<span style={{ color: t.accent }}>Tracker</span>
          </span>
        </div>

        <p className="field-2" style={{ textAlign: 'center', color: t.textMuted, fontSize: '0.84rem', marginBottom: '1.8rem' }}>
          Track smarter, spend better.
        </p>

        <div className="field-3" style={{ display: 'flex', background: t.isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9', borderRadius: '12px', padding: '4px', marginBottom: '1.5rem', border: `1px solid ${t.cardBorder}` }}>
          {['Login', 'Register'].map((tab) => {
            const active = (tab === 'Login') === isLogin;
            return (
              <button key={tab} className="btn-tab"
                onClick={() => { setIsLogin(tab === 'Login'); setError(''); setSuccess(''); }}
                style={{ flex: 1, padding: '0.58rem', border: 'none', background: active ? t.accent : 'transparent', color: active ? '#fff' : t.textMuted, borderRadius: '9px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '600' }}>
                {tab}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <div className="field-4">
              <label style={lbl}>Email</label>
              <input className="input-field" style={inp} type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
          )}

          <div className={isLogin ? 'field-4' : 'field-5'}>
            <label style={lbl}>Username</label>
            <input className="input-field" style={inp} type="text" name="username" placeholder="Enter username" value={form.username} onChange={handleChange} required />
          </div>

          <div className={isLogin ? 'field-5' : 'field-6'}>
            <label style={lbl}>Password</label>
            <input className="input-field" style={inp} type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            {!isLogin && form.password.length > 0 && form.password.length < 6 && (
              <span style={{ fontSize: '0.75rem', color: t.expense, marginTop: '4px', display: 'block' }}>
                Password must be at least 6 characters
              </span>
            )}
          </div>

          {error && <div className="msg-pop" style={{ background: t.expenseBg, border: `1px solid ${t.expenseBorder}`, color: t.expense, padding: '0.6rem 0.9rem', borderRadius: '10px', fontSize: '0.84rem', textAlign: 'center' }}>{error}</div>}
          {success && <div className="msg-pop" style={{ background: t.incomeBg, border: `1px solid ${t.incomeBorder}`, color: t.income, padding: '0.6rem 0.9rem', borderRadius: '10px', fontSize: '0.84rem', textAlign: 'center' }}>{success}</div>}

          <button className="btn-main" type="submit" disabled={loading}
            style={{ padding: '0.82rem', background: t.accent, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '0.94rem', fontWeight: '700', cursor: 'pointer', marginTop: '0.2rem' }}>
            {loading ? 'Please wait...' : isLogin ? 'Login to Dashboard' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.4rem', color: t.textMuted, fontSize: '0.84rem' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span className="switch-link" style={{ color: t.accent, cursor: 'pointer', fontWeight: '600' }}
            onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}>
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}
