import React, { useState, useEffect } from 'react';
import { Package, CheckSquare, Square } from 'lucide-react';
import travelData from '../data/travelData';

function PackingList() {
  const [packing, setPacking] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('kota_packing_v2');
    if (saved) {
      setPacking(JSON.parse(saved));
    } else {
      // 초기 상태: 카테고리별 아이템들을 펼쳐서 객체 형태로 만듦
      const initial = travelData.packingList.flatMap(category => 
        category.items.map((item, idx) => ({
          id: `${category.category}-${idx}`,
          category: category.category,
          task: item,
          completed: false
        }))
      );
      setPacking(initial);
    }
  }, []);

  const toggleCheck = (id) => {
    const updated = packing.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setPacking(updated);
    localStorage.setItem('kota_packing_v2', JSON.stringify(updated));
  };

  // 카테고리별로 그룹화
  const grouped = packing.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {});

  return (
    <div className="packing-list">
      <h2 className="page-title">준비물 체크리스트</h2>

      {Object.keys(grouped).map(category => (
        <div key={category} className="glass-card">
          <h3 className="section-title"><Package size={20} color="var(--sunset-accent)"/> {category}</h3>
          <div className="checklist-container">
            {grouped[category].map(item => (
              <div 
                key={item.id} 
                className={`check-item ${item.completed ? 'completed' : ''}`}
                onClick={() => toggleCheck(item.id)}
              >
                {item.completed ? (
                  <CheckSquare className="check-icon" size={20} />
                ) : (
                  <Square className="check-icon" size={20} />
                )}
                <span style={{ fontSize: '0.9rem', lineHeight: '1.3' }}>{item.task}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PackingList;
