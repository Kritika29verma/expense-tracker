import { useState, useEffect, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { transactionAPI, categoryAPI, analyticsAPI, budgetAPI, exportAPI } from '../services/api';
import SummaryCards from '../components/SummaryCards';
import CategoryPieChart from '../components/CategoryPieChart';
import TransactionList from '../components/TransactionList';
import BudgetSection from '../components/BudgetSection';

const now = new Date();
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const YEARS = [2023, 2024, 2025, 2026];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { theme: t, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pieData, setPieData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({ amount: '', type: 'EXPENSE', categoryId: '', date: now.toISOString().split('T')[0], note: '' });
  const [formMsg, setFormMsg] = useState({ text: '', success: false });
  const [formLoading, setFormLoading] = useState(false);
  const [newCat, setNewCat] = useState('');
  const [catLoading, setCatLoading] = useState(false);

  const loadAll = useCallback(async () => {
    try {
      const [catRes, sumRes, pieRes, txRes, budRes] = await Promise.all([
        categoryAPI.getAll(),
        analyticsAPI.getSummary(month, year),
        analyticsAPI.getCategoryBreakdown(month, year),
        transactionAPI.getAll(page, 8),
        budgetAPI.getAll(month, year),
      ]);
      setCategories(catRes.data.data || []);
      setSummary(sumRes.data.data);
      setPieData(pieRes.data.data || []);
      const txData = txRes.data.data;
      setTransactions(txData.content || []);
      setTotalPages(txData.totalPages || 0);
      setBudgets(budRes.data.data || []);
    } catch (e) { console.error('Load failed', e); }
  }, [month, year, page]);

  useEffect(() => { loadAll(); }, [loadAll]);

  useEffect(() => {
    if (categories.length > 0 && !form.categoryId) {
      setForm((f) => ({ ...f, categoryId: String(categories[0].id) }));
    }
  }, [categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await transactionAPI.add({ ...form, amount: parseFloat(form.amount), categoryId: parseInt(form.categoryId) });
      setFormMsg({ text: 'Saved!', success: true });
      setForm((f) => ({ ...f, amount: '', note: '' }));
      loadAll();
      setTimeout(() => setFormMsg({ text: '', success: false }), 2000);
    } catch (err) {
      setFormMsg({ text: err.response?.data?.message || 'Failed', success: false });
    } finally { setFormLoading(false); }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    setCatLoading(true);
    try {
      await categoryAPI.create({ name: newCat.trim() });
      setNewCat('');
      loadAll();
    } catch (err) {
      console.error('Category add failed', err);
    } finally { setCatLoading(false); }
  };

  const handleExport = async () => {
    try {
      const res = await exportAPI.downloadCsv(month, year);
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${year}-${String(month).padStart(2, '0')}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { alert('Export failed'); }
  };

  const card = { background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: '16px', padding: '1.6rem', boxShadow: t.shadow };
  const lbl = { color: t.textMuted, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.7px', display: 'block', marginBottom: '7px', fontWeight: '600' };
  const inp = { width: '100%', padding: '0.65rem 0.85rem', background: t.inputBg, border: `1.5px solid ${t.inputBorder}`, borderRadius: '10px', color: t.text, fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ minHeight: '100vh', background: t.bg }}>

      <nav className="anim-navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9rem 1.8rem', background: t.navbar, backdropFilter: 'blur(12px)', borderBottom: `1px solid ${t.cardBorder}`, position: 'sticky', top: 0, zIndex: 10 }}>
        <span style={{ fontSize: '1.1rem', fontWeight: '800', color: t.text }}>
          Expense<span style={{ color: t.accent }}>Tracker</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '30px', height: '30px', background: t.accent, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '0.8rem' }}>
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <span style={{ color: t.textSec, fontSize: '0.84rem' }}>Hi, {user?.username}</span>
          <button onClick={toggleTheme} style={{ background: t.isDark ? 'rgba(255,255,255,0.07)' : '#f1f5f9', border: `1px solid ${t.cardBorder}`, borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: t.text, display: 'flex', alignItems: 'center' }}>
            {t.isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={handleExport} style={{ background: t.accentBg, color: t.accent, border: `1px solid ${t.accentBorder}`, padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}>
            Export CSV
          </button>
          <button onClick={() => { logout(); navigate('/'); }} style={{ background: t.isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', color: t.textSec, border: `1px solid ${t.cardBorder}`, padding: '5px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.8rem 1rem' }}>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '1.4rem' }}>
          <select value={month} onChange={(e) => { setMonth(parseInt(e.target.value)); setPage(0); }}
            style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: '10px', color: t.text, padding: '7px 12px', fontSize: '0.84rem', outline: 'none', cursor: 'pointer', boxShadow: t.shadow }}>
            {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <select value={year} onChange={(e) => { setYear(parseInt(e.target.value)); setPage(0); }}
            style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: '10px', color: t.text, padding: '7px 12px', fontSize: '0.84rem', outline: 'none', cursor: 'pointer', boxShadow: t.shadow }}>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <SummaryCards summary={summary} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.4rem', marginBottom: '1.4rem' }}>

          <div style={card}>
            <h2 style={{ color: t.text, fontSize: '0.95rem', fontWeight: '700', marginBottom: '1.1rem' }}>Add Transaction</h2>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.1rem' }}>
              {['EXPENSE', 'INCOME'].map((tp) => (
                <button key={tp} type="button" onClick={() => setForm({ ...form, type: tp })}
                  style={{ flex: 1, padding: '0.65rem', border: `1px solid ${form.type === tp ? 'transparent' : t.cardBorder}`, borderRadius: '10px', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer',
                    background: form.type === tp ? (tp === 'EXPENSE' ? '#ef4444' : '#10b981') : (t.isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc'),
                    color: form.type === tp ? '#fff' : t.textMuted }}>
                  {tp === 'EXPENSE' ? '↓ Expense' : '↑ Income'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={lbl}>Amount (₹)</label>
                <input style={inp} type="number" placeholder="0.00" value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })} required min="1" step="0.01" />
              </div>

              <div>
                <label style={lbl}>Category</label>
                {categories.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {categories.map((c) => (
                      <button key={c.id} type="button" onClick={() => setForm({ ...form, categoryId: String(c.id) })}
                        style={{ padding: '5px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '500', cursor: 'pointer',
                          border: `1px solid ${form.categoryId === String(c.id) ? t.accent : t.cardBorder}`,
                          background: form.categoryId === String(c.id) ? t.accentBg : t.inputBg,
                          color: form.categoryId === String(c.id) ? t.accent : t.textSec }}>
                        {c.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '0.65rem', background: t.inputBg, borderRadius: '10px', border: `1px solid ${t.cardBorder}`, color: t.textMuted, fontSize: '0.82rem', textAlign: 'center' }}>
                    Add a category below first
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={lbl}>Date</label>
                  <input style={inp} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={lbl}>Note</label>
                  <input style={inp} type="text" placeholder="Optional" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
                </div>
              </div>

              {formMsg.text && (
                <div style={{ background: formMsg.success ? t.incomeBg : t.expenseBg, border: `1px solid ${formMsg.success ? t.incomeBorder : t.expenseBorder}`, color: formMsg.success ? t.income : t.expense, padding: '0.55rem 0.9rem', borderRadius: '9px', fontSize: '0.83rem', textAlign: 'center' }}>
                  {formMsg.text}
                </div>
              )}

              <button type="submit" disabled={formLoading || !form.categoryId}
                style={{ padding: '0.82rem', background: t.accent, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '700', cursor: form.categoryId ? 'pointer' : 'not-allowed', opacity: !form.categoryId ? 0.5 : 1 }}>
                {formLoading ? 'Saving...' : `Save ${form.type === 'EXPENSE' ? 'Expense' : 'Income'}`}
              </button>
            </form>

            <div style={{ marginTop: '1.2rem', paddingTop: '1.2rem', borderTop: `1px solid ${t.divider}` }}>
              <label style={lbl}>Add Category</label>
              <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '8px' }}>
                <input style={{ ...inp, flex: 1 }} type="text" placeholder="e.g. Food, Transport..." value={newCat} onChange={(e) => setNewCat(e.target.value)} />
                <button type="submit" disabled={catLoading}
                  style={{ padding: '0.65rem 1rem', background: t.accentBg, color: t.accent, border: `1px solid ${t.accentBorder}`, borderRadius: '10px', fontSize: '0.84rem', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {catLoading ? '...' : '+ Add'}
                </button>
              </form>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <CategoryPieChart data={pieData} />
            <BudgetSection budgets={budgets} categories={categories} month={month} year={year} onRefresh={loadAll} />
          </div>
        </div>

        <div style={card}>
          <h2 style={{ color: t.text, fontSize: '0.95rem', fontWeight: '700', marginBottom: '1.1rem' }}>
            Transactions — {MONTHS[month - 1]} {year}
          </h2>
          <TransactionList transactions={transactions} categories={categories} onRefresh={loadAll} page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>

      </div>
    </div>
  );
}
