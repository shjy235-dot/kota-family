import React from 'react';
import { MapPin, Clock, Compass, AlertTriangle } from 'lucide-react';
import travelData from '../data/travelData';

function Itinerary() {
  const { itinerary, tours, tourNotes } = travelData;

  return (
    <div className="itinerary">
      <h2 className="page-title">전체 일정 요약</h2>

      <div className="timeline-container">
        {itinerary.map((dayPlan, idx) => (
          <div key={idx} className="glass-card" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-10px', left: '-10px', background: 'var(--sunset-accent)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
              {dayPlan.day}
            </div>
            <h3 className="section-title" style={{ marginTop: '10px' }}>
              <MapPin size={20} color="var(--text-muted)"/> {dayPlan.title}
            </h3>
            
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {dayPlan.schedule.map((item, sIdx) => (
                <div key={sIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Clock size={16} color="var(--text-muted)" style={{ marginTop: '2px', flexShrink: 0 }}/>
                  <span style={{ fontSize: '0.9rem', lineHeight: '1.4' }} dangerouslySetInnerHTML={{ __html: item }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {tours && tours.length > 0 && (
        <div className="tours-container" style={{ marginTop: '2rem' }}>
          <h2 className="page-title" style={{ fontSize: '1.2rem', marginBottom: '1rem', borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '1.5rem' }}>
            <Compass size={24} style={{ verticalAlign: 'middle', marginRight: '8px' }} color="var(--primary-color)" />
            투어/액티비티 상세 가이드
          </h2>
          {tours.map((tour, idx) => (
            <div key={idx} className="glass-card" style={{ marginBottom: '16px' }}>
              <h3 className="section-title" style={{ marginBottom: '12px' }}>{tour.title}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {tour.details.map((detail, dIdx) => (
                  <div key={dIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--ocean-accent)', marginTop: '8px', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.95rem', lineHeight: '1.45', color: '#333' }} dangerouslySetInnerHTML={{ __html: detail }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tourNotes && tourNotes.length > 0 && (
        <div style={{ marginTop: '1rem', paddingBottom: '2rem' }}>
          <details className="glass-card" style={{ cursor: 'pointer' }}>
            <summary className="section-title" style={{ outline: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', margin: 0 }}>
              <AlertTriangle size={20} color="var(--primary-color)" style={{ marginRight: '8px' }} />
              <span style={{ fontSize: '1.05rem' }}>투어 중요사항 요약 안내</span>
              <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>자세히 보기 ▼</span>
            </summary>
            <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '1rem' }}>
              {tourNotes.map((note, idx) => (
                <div key={idx} style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '8px', color: 'var(--ocean-accent)' }}>{note.category}</h4>
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                    {note.items.map((item, iIdx) => (
                      <li key={iIdx} style={{ fontSize: '0.9rem', lineHeight: '1.4', marginBottom: '6px' }} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

export default Itinerary;
