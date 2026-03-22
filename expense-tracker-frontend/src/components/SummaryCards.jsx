import { useTheme } from '../context/ThemeContext';

export default function SummaryCards({ summary }) {
  const { theme: t } = useTheme();
  const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
  const cards = [
    { label: 'Income',  value: summary?.totalIncome  ?? 0, color: t.income,  bg: t.incomeBg,  border: t.incomeBorder  },
    { label: 'Expense', value: summary?.totalExpense ?? 0, color: t.expense, bg: t.expenseBg, border: t.expenseBorder },
    { label: 'Balance', value: summary?.balance      ?? 0, color: t.balance, bg: t.balanceBg, border: t.balanceBorder },
  ];
  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.4rem', flexWrap: 'wrap' }}>
      {cards.map((c) => (
        <div key={c.label} style={{ flex: 1, minWidth: '140px', borderRadius: '14px', padding: '1.1rem 1.4rem', background: c.bg, border: `1px solid ${c.border}`, boxShadow: t.shadow }}>
          <span style={{ fontSize: '0.73rem', fontWeight: '600', color: c.color, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '5px' }}>{c.label}</span>
          <span style={{ fontSize: '1.45rem', fontWeight: '800', color: c.color }}>{fmt(c.value)}</span>
        </div>
      ))}
    </div>
  );
}
