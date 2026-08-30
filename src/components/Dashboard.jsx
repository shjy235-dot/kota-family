import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Package, CheckSquare, Square } from 'lucide-react';
import travelData from '../data/travelData';
import { useTravel } from '../context/TravelContext';

function Dashboard() {
  const [dDay, setDDay] = useState(0);
  const { checklist, updateChecklist, localChecklist, updateLocalChecklist, packing, updatePacking, isLoading, syncError, isAdminMode } = useTravel();

  useEffect(() => {
    // 디데이 계산
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(travelData.tripInfo.startDate);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 24 * 60));
    setDDay(diffDays);
  }, []);

  const toggleCheck = (id) => {
    if (isAdminMode) return; // 수정 모드일 때는 체크 방지
    const updated = checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    updateChecklist(updated);
  };

  const toggleLocalCheck = (id) => {
    if (isAdminMode) return;
    const updated = localChecklist.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    updateLocalChecklist(updated);
  };

  const updateLocalChecklistText = (id, newText) => {
    const updated = localChecklist.map(item => item.id === id ? { ...item, task: newText } : item);
    updateLocalChecklist(updated);
  };

  const deleteLocalChecklistItem = (id) => {
    const updated = localChecklist.filter(item => item.id !== id);
    updateLocalChecklist(updated);
  };

  const addLocalChecklistItem = () => {
    const newItem = { id: Date.now(), task: '', completed: false };
    updateLocalChecklist([...localChecklist, newItem]);
  };

  const togglePackingCheck = (id) => {
    if (isAdminMode) return;
    const updated = packing.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    updatePacking(updated);
  };

  const updateChecklistText = (id, newText) => {
    const updated = checklist.map(item => item.id === id ? { ...item, task: newText } : item);
    updateChecklist(updated);
  };

  const deleteChecklistItem = (id) => {
    const updated = checklist.filter(item => item.id !== id);
    updateChecklist(updated);
  };

  const addChecklistItem = () => {
    const newItem = { id: Date.now(), task: '', completed: false };
    updateChecklist([...checklist, newItem]);
  };

  const updatePackingText = (id, newText) => {
    const updated = packing.map(item => item.id === id ? { ...item, task: newText } : item);
    updatePacking(updated);
  };

  const deletePackingItem = (id) => {
    const updated = packing.filter(item => item.id !== id);
    updatePacking(updated);
  };

  const addPackingItem = (category) => {
    const newItem = { id: Date.now().toString(), category, task: '', completed: false };
    updatePacking([...packing, newItem]);
  };

  if (isLoading) return <div style={{textAlign:'center', padding:'50px'}}>데이터 동기화 중...</div>;
  if (syncError) return <div style={{textAlign:'center', padding:'50px', color:'#e76f51'}}>데이터를 불러오지 못했어요.<br/>네트워크 상태를 확인하거나 잠시 후 다시 시도해주세요.</div>;

  const completedCount = checklist.filter(c => c.completed).length;

  const groupedPacking = packing.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {});

  return (
    <div className="dashboard">
      <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className="emoji-float">✈️</span> 우리 가족 여행까지
      </h2>
      
      <div className="glass-card d-day-card" style={{ textAlign: 'center', padding: '30px 20px' }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{travelData.tripInfo.title} <span className="emoji-float">🌴</span></p>
        <div className="pulse-dday" style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--sunset-accent)' }}>
          {dDay > 0 ? `D-${dDay}` : dDay === 0 ? 'D-Day!' : `D+${Math.abs(dDay)}`}
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '10px' }}>
          {travelData.tripInfo.startDate} 출국
        </p>
      </div>

      <details className="glass-card" open style={{ marginBottom: '24px', border: isAdminMode ? '2px dashed var(--sunset-accent)' : 'none' }}>
        <summary className="section-title" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', listStyle: 'none' }}>
          <span>출국 전 필수 체크리스트 ({completedCount}/{checklist.length}) {isAdminMode && <span style={{fontSize:'0.8rem', color:'var(--sunset-accent)'}}>[수정 모드]</span>}</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>자세히 보기 ▼</span>
        </summary>
        <div className="checklist-container">
          {checklist.map((item) => (
            <div 
              key={item.id} 
              className={`check-item ${item.completed ? 'completed' : ''}`}
              onClick={() => toggleCheck(item.id)}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {item.completed ? (
                <CheckCircle2 className="check-icon" size={20} style={{ flexShrink: 0 }} />
              ) : (
                <Circle className="check-icon" size={20} style={{ flexShrink: 0 }} />
              )}
              {isAdminMode ? (
                <div style={{ display: 'flex', flex: 1, gap: '8px', marginLeft: '8px' }}>
                  <input 
                    type="text" 
                    value={item.task} 
                    onChange={(e) => updateChecklistText(item.id, e.target.value)}
                    style={{ flex: 1, padding: '4px', border: '1px solid #ccc', borderRadius: '4px' }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button onClick={(e) => { e.stopPropagation(); deleteChecklistItem(item.id); }} style={{ background: '#e76f51', color: 'white', border: 'none', borderRadius: '4px', padding: '0 8px' }}>삭제</button>
                </div>
              ) : (
                <span 
                  style={{ fontSize: '0.9rem', lineHeight: '1.3' }} 
                  dangerouslySetInnerHTML={{ __html: item.task }} 
                  onClick={(e) => { if (e.target.tagName.toLowerCase() === 'a') e.stopPropagation(); }}
                />
              )}
            </div>
          ))}
          {isAdminMode && (
            <button onClick={addChecklistItem} style={{ marginTop: '10px', padding: '6px 12px', background: 'var(--ocean-accent)', color: 'white', border: 'none', borderRadius: '4px', width: '100%' }}>
              + 새 체크리스트 추가
            </button>
          )}
        </div>
      </details>

      <details className="glass-card" style={{ marginBottom: '24px', border: isAdminMode ? '2px dashed var(--sunset-accent)' : 'none' }}>
        <summary className="section-title" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', listStyle: 'none' }}>
          <span>현지 체크리스트 ({localChecklist.filter(c => c.completed).length}/{localChecklist.length}) {isAdminMode && <span style={{fontSize:'0.8rem', color:'var(--sunset-accent)'}}>[수정 모드]</span>}</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>자세히 보기 ▼</span>
        </summary>
        <div className="checklist-container">
          {localChecklist.map((item) => (
            <div
              key={item.id}
              className={`check-item ${item.completed ? 'completed' : ''}`}
              onClick={() => toggleLocalCheck(item.id)}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {item.completed ? (
                <CheckCircle2 className="check-icon" size={20} style={{ flexShrink: 0 }} />
              ) : (
                <Circle className="check-icon" size={20} style={{ flexShrink: 0 }} />
              )}
              {isAdminMode ? (
                <div style={{ display: 'flex', flex: 1, gap: '8px', marginLeft: '8px' }}>
                  <input
                    type="text"
                    value={item.task}
                    onChange={(e) => updateLocalChecklistText(item.id, e.target.value)}
                    style={{ flex: 1, padding: '4px', border: '1px solid #ccc', borderRadius: '4px' }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button onClick={(e) => { e.stopPropagation(); deleteLocalChecklistItem(item.id); }} style={{ background: '#e76f51', color: 'white', border: 'none', borderRadius: '4px', padding: '0 8px' }}>삭제</button>
                </div>
              ) : (
                <span
                  style={{ fontSize: '0.9rem', lineHeight: '1.3' }}
                  dangerouslySetInnerHTML={{ __html: item.task }}
                  onClick={(e) => { if (e.target.tagName.toLowerCase() === 'a') e.stopPropagation(); }}
                />
              )}
            </div>
          ))}
          {localChecklist.length === 0 && !isAdminMode && (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>아직 등록된 항목이 없어요. [수정 모드]에서 추가해보세요.</p>
          )}
          {isAdminMode && (
            <button onClick={addLocalChecklistItem} style={{ marginTop: '10px', padding: '6px 12px', background: 'var(--ocean-accent)', color: 'white', border: 'none', borderRadius: '4px', width: '100%' }}>
              + 새 체크리스트 추가
            </button>
          )}
        </div>
      </details>

      <h2 className="page-title" style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className="emoji-float">🧳</span> 짐 챙기기 준비물 목록
      </h2>
      
      {Object.keys(groupedPacking).map(category => {
        const items = groupedPacking[category];
        const packedCount = items.filter(i => i.completed).length;
        
        return (
          <details key={category} className="glass-card" style={{ padding: '14px 12px', marginBottom: '12px', border: isAdminMode ? '2px dashed var(--sunset-accent)' : 'none' }}>
            <summary className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', listStyle: 'none', margin: 0 }}>
              <Package size={18} color="var(--sunset-accent)"/> 
              <span style={{ fontSize: '0.95rem' }}>{category} ({packedCount}/{items.length}) {isAdminMode && <span style={{fontSize:'0.7rem', color:'var(--sunset-accent)'}}>[수정 모드]</span>}</span>
              <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>자세히 보기 ▼</span>
            </summary>
            <div className="checklist-container" style={{ marginTop: '12px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '12px' }}>
              {items.map(item => (
                <div 
                  key={item.id} 
                  className={`check-item ${item.completed ? 'completed' : ''}`}
                  onClick={() => togglePackingCheck(item.id)}
                  style={{ padding: '6px 0', display: 'flex', alignItems: 'center' }}
                >
                  {item.completed ? (
                    <CheckSquare className="check-icon" size={18} style={{ flexShrink: 0 }} />
                  ) : (
                    <Square className="check-icon" size={18} style={{ flexShrink: 0 }} />
                  )}
                  {isAdminMode ? (
                    <div style={{ display: 'flex', flex: 1, gap: '8px', marginLeft: '8px' }}>
                      <input 
                        type="text" 
                        value={item.task} 
                        onChange={(e) => updatePackingText(item.id, e.target.value)}
                        style={{ flex: 1, padding: '4px', border: '1px solid #ccc', borderRadius: '4px' }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button onClick={(e) => { e.stopPropagation(); deletePackingItem(item.id); }} style={{ background: '#e76f51', color: 'white', border: 'none', borderRadius: '4px', padding: '0 8px' }}>삭제</button>
                    </div>
                  ) : (
                    <span 
                      style={{ fontSize: '0.9rem', lineHeight: '1.3' }} 
                      dangerouslySetInnerHTML={{ __html: item.task }} 
                      onClick={(e) => { if (e.target.tagName.toLowerCase() === 'a') e.stopPropagation(); }}
                    />
                  )}
                </div>
              ))}
              {isAdminMode && (
                <button onClick={() => addPackingItem(category)} style={{ marginTop: '10px', padding: '4px 12px', background: 'var(--ocean-accent)', color: 'white', border: 'none', borderRadius: '4px', width: '100%', fontSize: '0.85rem' }}>
                  + [{category}] 항목 추가
                </button>
              )}
            </div>
          </details>
        );
      })}

    </div>
  );
}

export default Dashboard;
