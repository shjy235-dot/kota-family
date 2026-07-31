import React, { useState, useEffect } from 'react';
import { Wallet, CreditCard, Banknote, Lightbulb, Edit2, Check, Plus, Trash2, Receipt } from 'lucide-react';
import travelData from '../data/travelData';
import { useTravel } from '../context/TravelContext';

function BudgetGuide() {
  const { budget } = travelData;

  const { baseAmount, updateBaseAmount, expenses, updateExpenses, isLoading } = useTravel();
  const [isEditingBase, setIsEditingBase] = useState(false);
  const [tempBaseAmount, setTempBaseAmount] = useState(baseAmount);

  const [newExpense, setNewExpense] = useState({ 
    date: travelData.tripInfo.startDate, 
    desc: '', 
    amount: '', 
    currency: 'RM' 
  });

  useEffect(() => {
    setTempBaseAmount(baseAmount);
  }, [baseAmount]);

  const handleBaseSave = () => {
    setIsEditingBase(false);
    updateBaseAmount(tempBaseAmount);
  };

  const handleAddExpense = () => {
    if (!newExpense.desc || !newExpense.amount) return;
    const updated = [...expenses, { ...newExpense, id: Date.now() }];
    updateExpenses(updated);
    setNewExpense({ ...newExpense, desc: '', amount: '' });
  };

  const handleDeleteExpense = (id) => {
    const updated = expenses.filter(e => e.id !== id);
    updateExpenses(updated);
  };

  if (isLoading) return <div style={{textAlign:'center', padding:'50px'}}>데이터 동기화 중...</div>;

  // 실지출 합산 계산 (RM은 360원으로 환산)
  const expensesSumKrw = expenses.reduce((sum, exp) => {
    const amt = parseFloat(exp.amount) || 0;
    return sum + (exp.currency === 'RM' ? amt * 360 : amt);
  }, 0);

  const totalSpent = baseAmount + expensesSumKrw;

  if (!budget) return null;

  const cardStyle = { padding: '14px 12px', marginBottom: '12px' };

  return (
    <div className="budget-guide">
      <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
        <Wallet size={24} color="var(--primary-color)"/> 여행 가계부 및 예산
      </h2>
      
      {/* 총액 카드 */}
      <div className="glass-card" style={{ ...cardStyle, textAlign: 'center', background: 'linear-gradient(135deg, rgba(2,62,138,0.1), rgba(0,119,182,0.1))' }}>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>4인 가족 총 예상/지출 금액</p>
        <div style={{ margin: '8px 0', fontSize: '2.2rem', fontWeight: '900', color: 'var(--ocean-accent)' }}>
          약 {totalSpent.toLocaleString()}원
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '0.85rem' }}>
          <span style={{ color: '#555' }}>기본 고정금액(사전+현지예상): </span>
          {isEditingBase ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input 
                type="number" 
                value={tempBaseAmount}
                onChange={(e) => setTempBaseAmount(parseInt(e.target.value) || 0)}
                style={{ width: '100px', padding: '2px 4px', border: '1px solid #ccc', borderRadius: '4px' }}
                autoFocus
              />
              <button onClick={handleBaseSave} style={{ background: 'var(--ocean-accent)', color: 'white', border: 'none', borderRadius: '4px', padding: '2px 8px' }}><Check size={14}/></button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
              {baseAmount.toLocaleString()}원
              <button onClick={() => setIsEditingBase(true)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}><Edit2 size={14} /></button>
            </div>
          )}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
          + 현지 입력 지출액 ({expensesSumKrw.toLocaleString()}원)
        </div>
      </div>

      {/* 실제 지출 기록 섹션 상단 배치 */}
      <div className="glass-card" style={{ ...cardStyle, paddingBottom: '20px', border: '1px solid var(--ocean-accent)' }}>
        <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <Receipt size={18} color="var(--primary-color)"/> 현지 실지출 내역 기록
        </h3>
        
        {/* 입력 폼 */}
        <div style={{ background: 'rgba(2, 62, 138, 0.05)', padding: '10px', borderRadius: '8px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
            <input 
              type="date" 
              value={newExpense.date}
              onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
              style={{ flex: 1, minWidth: 0, padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.85rem' }}
            />
            <select 
              value={newExpense.currency}
              onChange={(e) => setNewExpense({...newExpense, currency: e.target.value})}
              style={{ width: '65px', flexShrink: 0, padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.85rem', outline: 'none' }}
            >
              <option value="RM">RM</option>
              <option value="KRW">원</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <input 
              type="text" 
              placeholder="내역 (예: 야시장 과일)" 
              value={newExpense.desc}
              onChange={(e) => setNewExpense({...newExpense, desc: e.target.value})}
              style={{ flex: 1.5, minWidth: 0, padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.85rem', outline: 'none' }}
            />
            <input 
              type="number" 
              placeholder="금액" 
              value={newExpense.amount}
              onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
              style={{ flex: 1, minWidth: 0, padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.85rem', outline: 'none' }}
            />
            <button onClick={handleAddExpense} style={{ flexShrink: 0, background: 'var(--ocean-accent)', color: 'white', border: 'none', borderRadius: '4px', width: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* 지출 리스트 */}
        {expenses.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {expenses.sort((a,b) => new Date(b.date) - new Date(a.date)).map(exp => (
              <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{exp.date}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>{exp.desc}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 'bold', color: exp.currency === 'RM' ? '#2a9d8f' : '#e76f51', fontSize: '0.9rem' }}>
                    {exp.amount} {exp.currency}
                  </span>
                  <button onClick={() => handleDeleteExpense(exp.id)} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', padding: 0 }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', margin: '10px 0' }}>
            등록된 지출 내역이 없습니다.
          </p>
        )}
      </div>

      <details className="glass-card" style={cardStyle}>
        <summary className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', listStyle: 'none', margin: 0 }}>
          <CreditCard size={18} color="var(--sunset-accent)"/> 
          <span>사전 결제 예상 (한국)</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>자세히 보기 ▼</span>
        </summary>
        <div style={{ marginTop: '12px' }}>
          <p style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
            총 {budget.prePaid.total}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {budget.prePaid.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '6px' }}>
                <div style={{ flex: 1, paddingRight: '8px' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: '1.2' }}>{item.desc}</div>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--ocean-accent)', whiteSpace: 'nowrap' }}>{item.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </details>

      <details className="glass-card" style={cardStyle}>
        <summary className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', listStyle: 'none', margin: 0 }}>
          <Banknote size={18} color="#2a9d8f"/> 
          <span>현지 지출 예상 (코타키나발루)</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>자세히 보기 ▼</span>
        </summary>
        <div style={{ marginTop: '12px' }}>
          <p style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
            총 {budget.local.total}
          </p>

          {/* 트래블월렛 섹션 */}
          <div style={{ background: 'rgba(42, 157, 143, 0.05)', padding: '10px', borderRadius: '10px', marginBottom: '12px', border: '1px solid rgba(42, 157, 143, 0.2)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#2a9d8f', marginBottom: '2px' }}>
              {budget.local.travelWallet.title}
            </h4>
            <p style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--ocean-accent)', marginBottom: '8px' }}>
              총 {budget.local.travelWallet.total}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {budget.local.travelWallet.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px dashed rgba(0,0,0,0.1)', paddingBottom: '4px' }}>
                  <div style={{ flex: 1, paddingRight: '8px' }}>
                    <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1px', lineHeight: '1.2' }}>{item.desc}</div>
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#333', whiteSpace: 'nowrap' }}>{item.amount}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 현금 비상금 섹션 */}
          <div style={{ background: 'rgba(255, 183, 3, 0.05)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255, 183, 3, 0.2)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--sunset-accent)', marginBottom: '2px' }}>
              {budget.local.cash.title}
            </h4>
            <p style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--ocean-accent)', marginBottom: '8px' }}>
              총 {budget.local.cash.total}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {budget.local.cash.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, paddingRight: '8px' }}>
                    <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1px', lineHeight: '1.2' }}>{item.desc}</div>
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#333', whiteSpace: 'nowrap' }}>{item.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </details>

    </div>
  );
}

export default BudgetGuide;
