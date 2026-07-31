import React from 'react';
import { MapPin, Clock, Compass, AlertTriangle } from 'lucide-react';
import travelData from '../data/travelData';
import { useTravel } from '../context/TravelContext';

function Itinerary() {
  const { itinerary, updateItinerary, tours, updateTours, tourNotes, updateTourNotes, isAdminMode } = useTravel();

  const handleItineraryChange = (dayIdx, field, value) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIdx] = { ...newItinerary[dayIdx], [field]: value };
    updateItinerary(newItinerary);
  };

  const handleScheduleChange = (dayIdx, sIdx, value) => {
    const newItinerary = [...itinerary];
    const newSchedule = [...newItinerary[dayIdx].schedule];
    newSchedule[sIdx] = value;
    newItinerary[dayIdx].schedule = newSchedule;
    updateItinerary(newItinerary);
  };

  const addScheduleItem = (dayIdx) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIdx].schedule.push("새로운 일정");
    updateItinerary(newItinerary);
  };

  const removeScheduleItem = (dayIdx, sIdx) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIdx].schedule.splice(sIdx, 1);
    updateItinerary(newItinerary);
  };

  return (
    <div className="itinerary">
      <h2 className="page-title">전체 일정 요약 {isAdminMode && <span style={{fontSize:'0.8rem', color:'var(--sunset-accent)'}}>[수정 모드]</span>}</h2>

      <div className="timeline-container">
        {itinerary.map((dayPlan, idx) => (
          <div key={idx} className="glass-card" style={{ position: 'relative', border: isAdminMode ? '2px dashed var(--sunset-accent)' : 'none', marginBottom: '20px' }}>
            {isAdminMode ? (
              <input 
                type="text" 
                value={dayPlan.day} 
                onChange={(e) => handleItineraryChange(idx, 'day', e.target.value)}
                style={{ position: 'absolute', top: '-10px', left: '-10px', background: 'var(--sunset-accent)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', border: 'none' }}
              />
            ) : (
              <div style={{ position: 'absolute', top: '-10px', left: '-10px', background: 'var(--sunset-accent)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                {dayPlan.day}
              </div>
            )}
            
            <h3 className="section-title" style={{ marginTop: isAdminMode ? '20px' : '10px' }}>
              <MapPin size={20} color="var(--text-muted)"/> 
              {isAdminMode ? (
                <input 
                  type="text" 
                  value={dayPlan.title} 
                  onChange={(e) => handleItineraryChange(idx, 'title', e.target.value)}
                  style={{ width: '80%', padding: '4px', border: '1px solid #ccc', borderRadius: '4px', marginLeft: '8px' }}
                />
              ) : (
                dayPlan.title
              )}
            </h3>
            
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {dayPlan.schedule.map((item, sIdx) => (
                <div key={sIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Clock size={16} color="var(--text-muted)" style={{ marginTop: '2px', flexShrink: 0 }}/>
                  {isAdminMode ? (
                    <div style={{ display: 'flex', flex: 1, gap: '8px' }}>
                      <textarea 
                        value={item} 
                        onChange={(e) => handleScheduleChange(idx, sIdx, e.target.value)}
                        style={{ flex: 1, padding: '4px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '40px', resize: 'vertical' }}
                      />
                      <button onClick={() => removeScheduleItem(idx, sIdx)} style={{ background: '#e76f51', color: 'white', border: 'none', borderRadius: '4px', padding: '0 8px' }}>삭제</button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.9rem', lineHeight: '1.4' }} dangerouslySetInnerHTML={{ __html: item }} />
                  )}
                </div>
              ))}
              {isAdminMode && (
                <button onClick={() => addScheduleItem(idx)} style={{ marginTop: '8px', padding: '6px', background: 'var(--ocean-accent)', color: 'white', border: 'none', borderRadius: '4px' }}>
                  + 세부 일정 추가
                </button>
              )}
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
