import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';

const COLORS = ['#6366f1','#ec4899','#f97316','#10b981','#3b82f6','#eab308','#ef4444','#8b5cf6'];

export default function CategoryPieChart({ data }) {
  const { theme: t } = useTheme();

  if (!data || data.length === 0) {
    return (
      <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: '14px', padding: '2rem', textAlign: 'center', boxShadow: t.shadow }}>
        <span style={{ color: t.textMuted, fontSize: '0.85rem' }}>No expense data for this month</span>
      </div>
    );
  }

  const chartData = data.map((d) => ({ name: d.categoryName, value: d.total }));

  return (
    <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: '14px', padding: '1.2rem', boxShadow: t.shadow }}>
      <h3 style={{ color: t.text, fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.5rem' }}>Spending by Category</h3>
      <ResponsiveContainer width="100%" height={210}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
            {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={(val) => `₹${val.toLocaleString('en-IN')}`}
            contentStyle={{ background: t.tooltipBg, border: `1px solid ${t.tooltipBorder}`, borderRadius: '10px', color: t.tooltipText, fontSize: '0.82rem' }} />
          <Legend formatter={(val) => <span style={{ color: t.pieText, fontSize: '0.76rem' }}>{val}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
