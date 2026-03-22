import { useState } from 'react';
import { budgetAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';

const ALERT = {
  SAFE:     { color: '#10b981', label: 'Safe' },
  WARNING:  { color: '#f97316', label: 'Warning' },
  EXCEEDED: { color: '#ef4444', label: 'Exceeded' },
};

export default function BudgetSection({ budgets, categories, month, year, onRefresh }) {
  const { theme: t } = useTheme();
  const [form, setForm] = useState({ categoryId: '', limitAmount: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSet = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await budgetAPI.set({ ...form, categoryId: parseInt(form.categoryId), limitAmount: parseFloat(form.limitAmount), month, year });
      setForm({ categoryId: '', limitAmount: '' });
      setMsg('Budget set!');
      onRefresh();
      setTimeout(() => setMsg(''), 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    try { await budgetAPI.delete(id); onRefresh(); } catch { alert('Failed to delete budget'); }
  };

  const alerts = budgets.filter((b) => b.alertLevel !== 'SAFE');
  const inp = { flex: 1, minWidth: '100px', background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, borderRadius: '9px', color: t.text, padding: '7px 10px', fontSize: '0.82rem', outline: 'none' };

  return (
    <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: '14px', padding: '1.2rem', boxShadow: t.shadow }}>
      <h3 style={{ color: t.text, fontSize: '0.9rem', fontWeight: '700', marginBottom: '1rem' }}>Budget Tracker</h3>

      {alerts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1rem' }}>
          {alerts.map((b) => (
            <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 11px', borderRadius: '9px', border: `1px solid ${ALERT[b.alertLevel].color}44`, background: `${ALERT[b.alertLevel].color}11`, fontSize: '0.82rem' }}>
              <span style={{ color: ALERT[b.alertLevel].color, fontWeight: 700 }}>
                {b.alertLevel === 'EXCEEDED' ? '🚨' : '⚠️'} {b.categoryName}
              </span>
              <span style={{ color: t.textMuted, fontSize: '0.76rem' }}>
                ₹{b.spent.toLocaleString('en-IN')} / ₹{b.limitAmount.toLocaleString('en-IN')} ({b.percentUsed}%)
              </span>
            </div>
          ))}
        </div>
      )}

      {budgets.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1rem' }}>
          {budgets.map((b) => {
            const a = ALERT[b.alertLevel];
            return (
              <div key={b.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ color: t.text, fontSize: '0.84rem', fontWeight: '600' }}>{b.categoryName}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: a.color }}>{b.percentUsed}%</span>
                    <button onClick={() => handleDelete(b.id)} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', fontSize: '1rem', lineHeight: 1, padding: '0 2px' }}>×</button>
                  </div>
                </div>
                <div style={{ height: '6px', background: t.isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0', borderRadius: '3px', overflow: 'hidden', marginBottom: '3px' }}>
                  <div style={{ height: '100%', borderRadius: '3px', width: `${Math.min(b.percentUsed, 100)}%`, background: a.color, transition: 'width 0.4s ease' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: t.textMuted, fontSize: '0.7rem' }}>Spent: ₹{b.spent.toLocaleString('en-IN')}</span>
                  <span style={{ color: t.textMuted, fontSize: '0.7rem' }}>Limit: ₹{b.limitAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <form onSubmit={handleSet} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <select style={inp} value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
          <option value="" style={{ background: t.inputBg, color: t.text }}>Select category</option>
          {categories.map((c) => <option key={c.id} value={c.id} style={{ background: t.inputBg, color: t.text }}>{c.name}</option>)}
        </select>
        <input style={{ ...inp, flex: 0, width: '110px' }} type="number" placeholder="Limit (₹)" value={form.limitAmount}
          onChange={(e) => setForm({ ...form, limitAmount: e.target.value })} required min="1" />
        <button type="submit" disabled={loading}
          style={{ background: t.accent, color: '#fff', border: 'none', borderRadius: '9px', padding: '7px 14px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}>
          {loading ? '...' : 'Set'}
        </button>
      </form>
      {msg && <div style={{ color: t.income, fontSize: '0.78rem', marginTop: '6px' }}>{msg}</div>}
    </div>
  );
}
