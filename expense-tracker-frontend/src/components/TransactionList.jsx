import { useState } from 'react';
import { transactionAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';

export default function TransactionList({ transactions, categories, onRefresh, page, totalPages, onPageChange }) {
  const { theme: t } = useTheme();
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);

  const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try { await transactionAPI.delete(id); onRefresh(); } catch { alert('Failed to delete'); }
  };

  const startEdit = (tx) => {
    setEditId(tx.id);
    setEditForm({ amount: tx.amount, type: tx.type, categoryId: tx.categoryId, date: tx.date, note: tx.note || '' });
  };

  const handleEditSubmit = async (id) => {
    setLoading(true);
    try { await transactionAPI.edit(id, { ...editForm, amount: parseFloat(editForm.amount) }); setEditId(null); onRefresh(); }
    catch { alert('Failed to update'); } finally { setLoading(false); }
  };

  const inp = { background: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: '8px', color: t.text, padding: '6px 10px', fontSize: '0.82rem', outline: 'none' };

  if (!transactions || transactions.length === 0) {
    return <div style={{ color: t.textMuted, textAlign: 'center', padding: '2rem', fontSize: '0.9rem' }}>No transactions found for this period.</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {transactions.map((tx) => (
          <div key={tx.id} style={{ background: t.rowBg, border: `1px solid ${t.rowBorder}`, borderRadius: '12px', padding: '0.9rem 1rem' }}>
            {editId === tx.id ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <input style={inp} type="number" value={editForm.amount} onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })} placeholder="Amount" />
                <select style={inp} value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}>
                  <option value="EXPENSE" style={{ background: t.inputBg, color: t.text }}>Expense</option>
                  <option value="INCOME" style={{ background: t.inputBg, color: t.text }}>Income</option>
                </select>
                <select style={inp} value={editForm.categoryId} onChange={(e) => setEditForm({ ...editForm, categoryId: parseInt(e.target.value) })}>
                  {categories.map((c) => <option key={c.id} value={c.id} style={{ background: t.inputBg, color: t.text }}>{c.name}</option>)}
                </select>
                <input style={inp} type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} />
                <input style={inp} type="text" value={editForm.note} onChange={(e) => setEditForm({ ...editForm, note: e.target.value })} placeholder="Note" />
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => handleEditSubmit(tx.id)} disabled={loading}
                    style={{ background: t.incomeBg, color: t.income, border: `1px solid ${t.incomeBorder}`, borderRadius: '7px', padding: '5px 12px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600' }}>Save</button>
                  <button onClick={() => setEditId(null)}
                    style={{ background: t.inputBg, color: t.textMuted, border: `1px solid ${t.cardBorder}`, borderRadius: '7px', padding: '5px 12px', fontSize: '0.8rem', cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: '700', padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap',
                    background: tx.type === 'INCOME' ? t.incomeBg : t.expenseBg, color: tx.type === 'INCOME' ? t.income : t.expense, border: `1px solid ${tx.type === 'INCOME' ? t.incomeBorder : t.expenseBorder}` }}>
                    {tx.type}
                  </span>
                  <div>
                    <div style={{ color: t.text, fontSize: '0.9rem', fontWeight: '600' }}>{tx.categoryName}</div>
                    {tx.note && <div style={{ color: t.textMuted, fontSize: '0.76rem', marginTop: '2px' }}>{tx.note}</div>}
                    <div style={{ color: t.textMuted, fontSize: '0.73rem', marginTop: '2px' }}>{new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <span style={{ fontSize: '1rem', fontWeight: '700', color: tx.type === 'INCOME' ? t.income : t.expense }}>
                    {tx.type === 'EXPENSE' ? '-' : '+'}{fmt(tx.amount)}
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => startEdit(tx)}
                      style={{ background: t.accentBg, color: t.accent, border: `1px solid ${t.accentBorder}`, borderRadius: '7px', padding: '3px 10px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '600' }}>Edit</button>
                    <button onClick={() => handleDelete(tx.id)}
                      style={{ background: t.expenseBg, color: t.expense, border: `1px solid ${t.expenseBorder}`, borderRadius: '7px', padding: '3px 10px', fontSize: '0.75rem', cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
          <button onClick={() => onPageChange(page - 1)} disabled={page === 0}
            style={{ background: t.inputBg, color: t.textSec, border: `1px solid ${t.cardBorder}`, borderRadius: '8px', padding: '6px 16px', fontSize: '0.85rem', cursor: 'pointer' }}>Prev</button>
          <span style={{ color: t.textMuted, fontSize: '0.85rem' }}>{page + 1} / {totalPages}</span>
          <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages - 1}
            style={{ background: t.inputBg, color: t.textSec, border: `1px solid ${t.cardBorder}`, borderRadius: '8px', padding: '6px 16px', fontSize: '0.85rem', cursor: 'pointer' }}>Next</button>
        </div>
      )}
    </div>
  );
}
