import React, { useState, useEffect } from 'react';
import { Wallet, CreditCard, Banknote, Lightbulb, Edit2, Check, Plus, Trash2, Receipt } from 'lucide-react';
import travelData from '../data/travelData';
import { useTravel } from '../context/TravelContext';

function BudgetGuide() {
  const {
    expenses, updateExpenses,
    budgetStatic, updateBudgetStatic,
    exchangeRate, updateExchangeRate,
    isAdminMode, isLoading
  } = useTravel();

  // 환율 편집용 로컬 상태
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [tempRate, setTempRate] = useState(exchangeRate);

  // 실시간 환율 조회 전용 로컬 상태
  const [realTimeRate, setRealTimeRate] = useState(null);

  // 미니 계산기용 상태
  const [calcRm, setCalcRm] = useState('');
  const [calcKrw, setCalcKrw] = useState('');

  const [newExpense, setNewExpense] = useState({ 
    date: travelData.tripInfo.startDate, 
    desc: '', 
    amount: '', 
    currency: 'RM' 
  });

  useEffect(() => {
    setTempRate(exchangeRate);
  }, [exchangeRate]);

  // 실시간 환율 조회 (단순 참고용)
  useEffect(() => {
    const fetchRealTimeRate = async () => {
      try {
        const res = await fetch('https://api.frankfurter.dev/v1/latest?from=MYR&to=KRW');
        if (res.ok) {
          const data = await res.json();
          const rate = data.rates.KRW;
          if (rate) {
            setRealTimeRate(Math.round(rate * 100) / 100);
          }
        }
      } catch (err) {
        console.error("실시간 환율 조회 실패:", err);
      }
    };
    fetchRealTimeRate();
  }, []);

  const handleRateSave = () => {
    setIsEditingRate(false);
    const parsedRate = parseFloat(tempRate) || 360;
    updateExchangeRate(parsedRate);
  };

  // 계산기는 예산용 수동 환율이 아니라 실시간 환율 기준 (실시간 환율 미조회 시 수동 환율로 대체)
  const calcRate = realTimeRate || exchangeRate;

  const handleCalcRmChange = (val) => {
    setCalcRm(val);
    if (val === '') {
      setCalcKrw('');
    } else {
      const num = parseFloat(val) || 0;
      setCalcKrw(Math.round(num * calcRate).toLocaleString());
    }
  };

  const handleCalcKrwChange = (val) => {
    setCalcKrw(val);
    if (val === '') {
      setCalcRm('');
    } else {
      const num = parseFloat(val.replace(/,/g, '')) || 0;
      setCalcRm((Math.round((num / calcRate) * 100) / 100).toString());
    }
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

  // RM 금액(문자열)을 환산된 원화 문자열로 변환하는 헬퍼
  const convertRmStringToKrwString = (amountStr) => {
    if (!amountStr) return '';
    if (amountStr.includes('RM')) {
      const num = parseFloat(amountStr.replace(/[^0-9.]/g, '')) || 0;
      const krw = Math.round(num * exchangeRate);
      return ` (약 ${Math.round(krw / 1000) / 10}만 원)`;
    }
    return '';
  };


  // "약 2,688,000원", "15~20만 원" 같은 원화 텍스트를 숫자로 환산 (범위는 평균값 사용)
  const parseKrwText = (str) => {
    if (!str) return 0;
    const cleaned = str.replace(/약|원|,|\s/g, '');
    const hasMan = cleaned.includes('만');
    const parts = cleaned.replace(/만/g, '').split('~').map(p => parseFloat(p) || 0);
    const avg = parts.reduce((a, b) => a + b, 0) / parts.length;
    return hasMan ? avg * 10000 : avg;
  };

  // 항목 금액 문자열에서 숫자만 추출 (합산용)
  const parseAmountNumber = (str) => {
    if (!str) return 0;
    const match = str.match(/-?[\d,.]+/);
    if (!match) return 0;
    return parseFloat(match[0].replace(/,/g, '')) || 0;
  };

  // 항목 금액을 천단위 쉼표 + 단위(원/RM)로 정규화해서 표시
  const formatAmount = (str, unit) => {
    const num = parseAmountNumber(str);
    if (!str || isNaN(num)) return str;
    return unit === 'RM' ? `${num.toLocaleString()} RM` : `${num.toLocaleString()}원`;
  };

  if (isLoading) return <div style={{textAlign:'center', padding:'50px'}}>데이터 동기화 중...</div>;

  if (!budgetStatic) return null;

  // 사전결제 예상 (한국, 원화) - 항목별 금액 합산 (총액 텍스트는 항목 추가 시 갱신되지 않아 항목 합산으로 계산)
  const prePaidKrw = budgetStatic.prePaid.items.reduce((sum, item) => sum + parseAmountNumber(item.amount), 0);
  // 현지지출 예상 (트래블로그카드 RM 항목 합산 후 환산 + 현금 비상금)
  const travelWalletRm = budgetStatic.local.travelWallet.items.reduce((sum, item) => sum + parseAmountNumber(item.amount), 0);
  const localWalletKrw = travelWalletRm * exchangeRate;
  const localCashKrw = parseKrwText(budgetStatic.local.cash.total);
  const localKrw = localWalletKrw + localCashKrw;
  // 실지출 합산 (RM은 현재 설정된 환율로 환산)
  const expensesSumKrw = expenses.reduce((sum, exp) => {
    const amt = parseFloat(exp.amount) || 0;
    return sum + (exp.currency === 'RM' ? amt * exchangeRate : amt);
  }, 0);

  const totalSpent = prePaidKrw + localKrw + expensesSumKrw;

  const cardStyle = { padding: '14px 12px', marginBottom: '12px' };

  return (
    <div className="budget-guide">
      <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
        <span className="emoji-float">💰</span> 여행 가계부 및 예산
      </h2>
      
      {/* 총액 카드 */}
      <div className="glass-card" style={{ ...cardStyle, textAlign: 'center', background: 'linear-gradient(135deg, rgba(2,62,138,0.1), rgba(0,119,182,0.1))' }}>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>4인 가족 총 예상/지출 금액</p>
        <div style={{ margin: '8px 0', fontSize: '2.2rem', fontWeight: '900', color: 'var(--ocean-accent)' }}>
          약 {totalSpent.toLocaleString()}원
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '10px', fontSize: '0.8rem', color: '#666' }}>
          <span>사전결제 예상: {Math.round(prePaidKrw).toLocaleString()}원</span>
          <span>현지지출 예상: {Math.round(localKrw).toLocaleString()}원</span>
          <span>실지출 합계: {Math.round(expensesSumKrw).toLocaleString()}원</span>
        </div>
      </div>

      {/* 실시간 링깃 환율 및 계산기 카드 */}
      <div className="glass-card" style={{ ...cardStyle, background: 'rgba(251, 133, 0, 0.05)', border: '1px solid rgba(251, 133, 0, 0.2)' }}>
        <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <Banknote size={18} color="var(--sunset-accent)"/>
          <span>말레이시아 링깃(RM) 환율 설정</span>
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
          <span>1 RM =</span>
          {isEditingRate ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input 
                type="number" 
                value={tempRate}
                onChange={(e) => setTempRate(e.target.value)}
                style={{ width: '80px', padding: '2px 4px', border: '1px solid #ccc', borderRadius: '4px' }}
                step="0.01"
                autoFocus
              />
              <span>원</span>
              <button onClick={handleRateSave} style={{ background: 'var(--ocean-accent)', color: 'white', border: 'none', borderRadius: '4px', padding: '2px 8px', display: 'flex', alignItems: 'center' }}><Check size={14}/></button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <strong style={{ fontSize: '1.1rem', color: 'var(--sunset-accent)' }}>{exchangeRate}원</strong>
              <button onClick={() => { setTempRate(exchangeRate); setIsEditingRate(true); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }} title="적용 환율 수동 수정"><Edit2 size={14} /></button>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '12px', paddingLeft: '12px', borderLeft: '1px solid #ddd' }}>
                오늘의 실시간 환율 (참고용): <strong>{realTimeRate ? `${realTimeRate}원` : '조회 중...'}</strong>
              </span>
            </div>
          )}
        </div>

        {/* 링깃 계산기 */}
        <div style={{ marginTop: '12px', borderTop: '1px solid rgba(251, 133, 0, 0.1)', paddingTop: '12px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '6px', color: 'var(--text-muted)' }}>
            🧮 링깃 ⇄ 원화 간편 계산기 <span style={{ fontWeight: 'normal' }}>(실시간 환율 {calcRate}원 기준)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="number" 
              placeholder="RM 금액" 
              value={calcRm} 
              onChange={(e) => handleCalcRmChange(e.target.value)} 
              style={{ flex: 1, minWidth: 0, padding: '6px 8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.85rem', outline: 'none' }}
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>RM ⇄</span>
            <input 
              type="text" 
              placeholder="원화 금액" 
              value={calcKrw} 
              onChange={(e) => handleCalcKrwChange(e.target.value)} 
              style={{ flex: 1.2, minWidth: 0, padding: '6px 8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.85rem', outline: 'none' }}
            />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>원</span>
          </div>
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
          <span>사전 결제 예상 (한국) {isAdminMode && <span style={{fontSize:'0.7rem', color:'var(--sunset-accent)'}}>[수정]</span>}</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>자세히 보기 ▼</span>
        </summary>
        <div style={{ marginTop: '12px' }}>
          <p style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
            총 약 {prePaidKrw.toLocaleString()}원
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {budgetStatic.prePaid.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '6px' }}>
                <div style={{ flex: 1, paddingRight: '8px' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                    {isAdminMode ? <input type="text" value={item.name} onChange={e => {
                      const newItems = [...budgetStatic.prePaid.items];
                      newItems[idx] = { ...item, name: e.target.value };
                      updateBudgetStatic({...budgetStatic, prePaid: {...budgetStatic.prePaid, items: newItems}});
                    }} style={{padding:'2px', width:'100%'}}/> : item.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: '1.2' }}>
                    {isAdminMode ? <input type="text" value={item.desc} onChange={e => {
                      const newItems = [...budgetStatic.prePaid.items];
                      newItems[idx] = { ...item, desc: e.target.value };
                      updateBudgetStatic({...budgetStatic, prePaid: {...budgetStatic.prePaid, items: newItems}});
                    }} style={{padding:'2px', width:'100%'}}/> : item.desc}
                  </div>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--ocean-accent)', whiteSpace: 'nowrap' }}>
                  {isAdminMode ? <input type="text" value={item.amount} onChange={e => {
                    const newItems = [...budgetStatic.prePaid.items];
                    newItems[idx] = { ...item, amount: e.target.value };
                    updateBudgetStatic({...budgetStatic, prePaid: {...budgetStatic.prePaid, items: newItems}});
                  }} style={{padding:'2px', width:'80px'}}/> : formatAmount(item.amount, '원')}
                  {isAdminMode && <button onClick={() => {
                    const newItems = [...budgetStatic.prePaid.items];
                    newItems.splice(idx, 1);
                    updateBudgetStatic({...budgetStatic, prePaid: {...budgetStatic.prePaid, items: newItems}});
                  }} style={{ background: '#e76f51', color: 'white', border: 'none', borderRadius: '4px', padding: '2px 4px', marginLeft:'4px' }}>삭제</button>}
                </div>
              </div>
            ))}
            {isAdminMode && (
              <button onClick={() => updateBudgetStatic({...budgetStatic, prePaid: {...budgetStatic.prePaid, items: [...budgetStatic.prePaid.items, {name:'항목', desc:'설명', amount:'0원'}]}})} style={{ padding: '4px', background: 'var(--ocean-accent)', color: 'white', border: 'none', borderRadius: '4px' }}>
                + 사전 결제 내역 추가
              </button>
            )}
          </div>
        </div>
      </details>

      <details className="glass-card" style={cardStyle}>
        <summary className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', listStyle: 'none', margin: 0 }}>
          <Banknote size={18} color="#2a9d8f"/> 
          <span>현지 지출 예상 (코타키나발루) {isAdminMode && <span style={{fontSize:'0.7rem', color:'var(--sunset-accent)'}}>[수정]</span>}</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>자세히 보기 ▼</span>
        </summary>
        <div style={{ marginTop: '12px' }}>
          <p style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
            총 약 {Math.round(localKrw).toLocaleString()}원 (실지출 {travelWalletRm.toLocaleString()} RM 예상액)
          </p>

          {/* 트래블월렛 섹션 */}
          <div style={{ background: 'rgba(42, 157, 143, 0.05)', padding: '10px', borderRadius: '10px', marginBottom: '12px', border: '1px solid rgba(42, 157, 143, 0.2)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#2a9d8f', marginBottom: '2px' }}>
              {isAdminMode ? <input type="text" value={budgetStatic.local.travelWallet.title} onChange={e => updateBudgetStatic({...budgetStatic, local: {...budgetStatic.local, travelWallet: {...budgetStatic.local.travelWallet, title: e.target.value}}})} style={{padding:'2px', width:'100%'}}/> : budgetStatic.local.travelWallet.title}
            </h4>
            <p style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--ocean-accent)', marginBottom: '8px' }}>
              총 {travelWalletRm.toLocaleString()} RM (약 {Math.round(localWalletKrw).toLocaleString()}원)
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {budgetStatic.local.travelWallet.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px dashed rgba(0,0,0,0.1)', paddingBottom: '4px' }}>
                  <div style={{ flex: 1, paddingRight: '8px' }}>
                    <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>
                      {isAdminMode ? <input type="text" value={item.name} onChange={e => {
                        const newItems = [...budgetStatic.local.travelWallet.items];
                        newItems[idx] = { ...item, name: e.target.value };
                        updateBudgetStatic({...budgetStatic, local: {...budgetStatic.local, travelWallet: {...budgetStatic.local.travelWallet, items: newItems}}});
                      }} style={{padding:'2px', width:'100%'}}/> : item.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1px', lineHeight: '1.2' }}>
                      {isAdminMode ? <input type="text" value={item.desc} onChange={e => {
                        const newItems = [...budgetStatic.local.travelWallet.items];
                        newItems[idx] = { ...item, desc: e.target.value };
                        updateBudgetStatic({...budgetStatic, local: {...budgetStatic.local, travelWallet: {...budgetStatic.local.travelWallet, items: newItems}}});
                      }} style={{padding:'2px', width:'100%'}}/> : item.desc}
                    </div>
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#333', whiteSpace: 'nowrap' }}>
                    {isAdminMode ? <input type="text" value={item.amount} onChange={e => {
                      const newItems = [...budgetStatic.local.travelWallet.items];
                      newItems[idx] = { ...item, amount: e.target.value };
                      updateBudgetStatic({...budgetStatic, local: {...budgetStatic.local, travelWallet: {...budgetStatic.local.travelWallet, items: newItems}}});
                    }} style={{padding:'2px', width:'60px'}}/> : (
                      <span>
                        {formatAmount(item.amount, 'RM')}
                        {convertRmStringToKrwString(item.amount)}
                      </span>
                    )}
                    {isAdminMode && <button onClick={() => {
                      const newItems = [...budgetStatic.local.travelWallet.items];
                      newItems.splice(idx, 1);
                      updateBudgetStatic({...budgetStatic, local: {...budgetStatic.local, travelWallet: {...budgetStatic.local.travelWallet, items: newItems}}});
                    }} style={{ background: '#e76f51', color: 'white', border: 'none', borderRadius: '4px', padding: '2px 4px', marginLeft:'4px' }}>삭제</button>}
                  </div>
                </div>
              ))}
              {isAdminMode && (
                <button onClick={() => updateBudgetStatic({...budgetStatic, local: {...budgetStatic.local, travelWallet: {...budgetStatic.local.travelWallet, items: [...budgetStatic.local.travelWallet.items, {name:'항목', desc:'설명', amount:'0 RM'}]}}})} style={{ padding: '4px', background: 'var(--ocean-accent)', color: 'white', border: 'none', borderRadius: '4px' }}>
                  + 항목 추가
                </button>
              )}
            </div>
          </div>

          {/* 현금 비상금 섹션 */}
          <div style={{ background: 'rgba(255, 183, 3, 0.05)', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255, 183, 3, 0.2)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--sunset-accent)', marginBottom: '2px' }}>
              {budgetStatic.local.cash.title}
            </h4>
            <p style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--ocean-accent)', marginBottom: '8px' }}>
              총 {budgetStatic.local.cash.total}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {budgetStatic.local.cash.items.map((item, idx) => (
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
