import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Package, CheckSquare, Square } from 'lucide-react';
import travelData from '../data/travelData';
import { useTravel } from '../context/TravelContext';

function Dashboard() {
  const [dDay, setDDay] = useState(0);
  const { checklist, updateChecklist, packing, updatePacking, isLoading } = useTravel();

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
    const updated = checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    updateChecklist(updated);
  };

  const togglePackingCheck = (id) => {
    const updated = packing.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    updatePacking(updated);
  };

  if (isLoading) return <div style={{textAlign:'center', padding:'50px'}}>데이터 동기화 중...</div>;

  const completedCount = checklist.filter(c => c.completed).length;

  const groupedPacking = packing.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {});

  return (
    <div className="dashboard">
      <h2 className="page-title">우리 가족 여행까지</h2>
      
      <div className="glass-card d-day-card" style={{ textAlign: 'center', padding: '30px 20px' }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{travelData.tripInfo.title}</p>
        <div style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--sunset-accent)' }}>
          {dDay > 0 ? `D-${dDay}` : dDay === 0 ? 'D-Day!' : `D+${Math.abs(dDay)}`}
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '10px' }}>
          {travelData.tripInfo.startDate} 출국
        </p>
      </div>

      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <h3 className="section-title">출국 전 필수 체크리스트 ({completedCount}/{checklist.length})</h3>
        <div className="checklist-container">
          {checklist.map((item) => (
            <div 
              key={item.id} 
              className={`check-item ${item.completed ? 'completed' : ''}`}
              onClick={() => toggleCheck(item.id)}
            >
              {item.completed ? (
                <CheckCircle2 className="check-icon" size={20} />
              ) : (
                <Circle className="check-icon" size={20} />
              )}
              <span style={{ fontSize: '0.9rem', lineHeight: '1.3' }}>{item.task}</span>
            </div>
          ))}
        </div>
      </div>

      <h2 className="page-title" style={{ marginTop: '32px' }}>짐 챙기기 준비물 목록</h2>
      
      {Object.keys(groupedPacking).map(category => {
        const items = groupedPacking[category];
        const packedCount = items.filter(i => i.completed).length;
        
        return (
          <details key={category} className="glass-card" style={{ padding: '14px 12px', marginBottom: '12px' }}>
            <summary className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', listStyle: 'none', margin: 0 }}>
              <Package size={18} color="var(--sunset-accent)"/> 
              <span style={{ fontSize: '0.95rem' }}>{category} ({packedCount}/{items.length})</span>
              <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>자세히 보기 ▼</span>
            </summary>
            <div className="checklist-container" style={{ marginTop: '12px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '12px' }}>
              {items.map(item => (
                <div 
                  key={item.id} 
                  className={`check-item ${item.completed ? 'completed' : ''}`}
                  onClick={() => togglePackingCheck(item.id)}
                  style={{ padding: '6px 0' }}
                >
                  {item.completed ? (
                    <CheckSquare className="check-icon" size={18} />
                  ) : (
                    <Square className="check-icon" size={18} />
                  )}
                  <span style={{ fontSize: '0.9rem', lineHeight: '1.3' }}>{item.task}</span>
                </div>
              ))}
            </div>
          </details>
        );
      })}

    </div>
  );
}

export default Dashboard;
