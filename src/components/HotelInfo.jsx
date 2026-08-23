import React from 'react';
import { Building, Utensils, Star, ShoppingBag } from 'lucide-react';
import travelData from '../data/travelData';
import { useTravel } from '../context/TravelContext';

function HotelInfo() {
  const { hotel, updateHotel, diningAndShopping, updateDiningAndShopping, isAdminMode } = useTravel();

  // 공통 카드 스타일
  const cardStyle = { padding: '14px 12px', marginBottom: '12px', border: isAdminMode ? '2px dashed var(--sunset-accent)' : 'none' };

  const handleDiningChange = (idx, field, value) => {
    const newDining = [...diningAndShopping.dining];
    newDining[idx] = { ...newDining[idx], [field]: value };
    updateDiningAndShopping({ ...diningAndShopping, dining: newDining });
  };
  
  const addDining = () => {
    const newDining = [...diningAndShopping.dining, { name: '새 맛집', desc: '설명' }];
    updateDiningAndShopping({ ...diningAndShopping, dining: newDining });
  };
  
  const removeDining = (idx) => {
    const newDining = [...diningAndShopping.dining];
    newDining.splice(idx, 1);
    updateDiningAndShopping({ ...diningAndShopping, dining: newDining });
  };

  const handleShoppingChange = (idx, field, value) => {
    const newShopping = [...diningAndShopping.shopping];
    newShopping[idx] = { ...newShopping[idx], [field]: value };
    updateDiningAndShopping({ ...diningAndShopping, shopping: newShopping });
  };

  const addShopping = () => {
    const newShopping = [...diningAndShopping.shopping, { name: '새 쇼핑템', desc: '설명' }];
    updateDiningAndShopping({ ...diningAndShopping, shopping: newShopping });
  };

  const removeShopping = (idx) => {
    const newShopping = [...diningAndShopping.shopping];
    newShopping.splice(idx, 1);
    updateDiningAndShopping({ ...diningAndShopping, shopping: newShopping });
  };

  return (
    <div className="hotel-info">
      <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
        <span className="emoji-float">🏨</span> 숙소 및 맛집 정보 {isAdminMode && <span style={{fontSize:'0.8rem', color:'var(--sunset-accent)'}}>[수정]</span>}
      </h2>

      <div className="glass-card" style={cardStyle}>
        <h3 className="section-title" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
          <Building size={18} color="var(--sunset-accent)"/>
          {isAdminMode ? (
            <input type="text" value={hotel.name} onChange={e => updateHotel({...hotel, name: e.target.value})} style={{marginLeft: '8px', padding: '4px', border: '1px solid #ccc', borderRadius: '4px'}} />
          ) : (
            <span>
              {hotel.name.split('(')[0]}
              {hotel.name.includes('(') && <span style={{ display: 'inline-block' }}>({hotel.name.substring(hotel.name.indexOf('(') + 1)}</span>}
            </span>
          )}
          <a href="/hotel-voucher.pdf" target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: '#0077b6', textDecoration: 'underline', backgroundColor: 'rgba(255,255,255,0.7)', padding: '2px 6px', borderRadius: '4px' }}>
            📄 예약 바우처 보기
          </a>
        </h3>
        <p style={{ fontWeight: '600', marginBottom: '10px', fontSize: '0.95rem', color: 'var(--ocean-accent)' }}>
          {isAdminMode ? (
            <input type="text" value={hotel.roomType} onChange={e => updateHotel({...hotel, roomType: e.target.value})} style={{width: '100%', padding: '4px', border: '1px solid #ccc', borderRadius: '4px'}} />
          ) : (
            <span>
              {hotel.roomType.split('(')[0]} 
              {hotel.roomType.includes('(') && <span style={{ display: 'inline-block' }}>({hotel.roomType.substring(hotel.roomType.indexOf('(') + 1)}</span>}
            </span>
          )}
        </p>
        <ul className="info-list" style={{ paddingLeft: '18px', margin: 0 }}>
          {hotel.benefits.map((benefit, idx) => (
            <li key={idx} style={{ fontSize: '0.9rem', lineHeight: '1.4', marginBottom: '6px' }}>
              {isAdminMode ? (
                <div style={{display:'flex', gap:'4px'}}>
                  <input type="text" value={benefit} onChange={e => {
                    const newBenefits = [...hotel.benefits];
                    newBenefits[idx] = e.target.value;
                    updateHotel({...hotel, benefits: newBenefits});
                  }} style={{flex:1, padding: '2px', border: '1px solid #ccc', borderRadius: '4px'}} />
                  <button onClick={() => {
                    const newBenefits = [...hotel.benefits];
                    newBenefits.splice(idx, 1);
                    updateHotel({...hotel, benefits: newBenefits});
                  }} style={{ background: '#e76f51', color: 'white', border: 'none', borderRadius: '4px', padding: '0 8px' }}>삭제</button>
                </div>
              ) : benefit}
            </li>
          ))}
          {isAdminMode && (
            <button onClick={() => updateHotel({...hotel, benefits: [...hotel.benefits, '새 혜택']})} style={{ marginTop: '8px', padding: '4px', background: 'var(--ocean-accent)', color: 'white', border: 'none', borderRadius: '4px' }}>
              + 혜택 추가
            </button>
          )}
        </ul>
      </div>

      <div className="glass-card" style={cardStyle}>
        <h3 className="section-title" style={{ marginBottom: '12px' }}><Utensils size={18} color="var(--sunset-accent)"/> 추천 맛집 리스트</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {diningAndShopping.dining.map((place, idx) => (
            <div key={idx} style={{ background: 'rgba(255,255,255,0.4)', padding: '10px 12px', borderRadius: '8px' }}>
              {isAdminMode ? (
                <div style={{display:'flex', flexDirection:'column', gap:'4px'}}>
                  <input type="text" value={place.name} onChange={e => handleDiningChange(idx, 'name', e.target.value)} style={{padding: '4px', border: '1px solid #ccc', borderRadius: '4px'}} />
                  <input type="text" value={place.desc} onChange={e => handleDiningChange(idx, 'desc', e.target.value)} style={{padding: '4px', border: '1px solid #ccc', borderRadius: '4px'}} />
                  <button onClick={() => removeDining(idx)} style={{ background: '#e76f51', color: 'white', border: 'none', borderRadius: '4px', padding: '4px' }}>맛집 삭제</button>
                </div>
              ) : (
                <>
                  <h4 style={{ color: 'var(--text-main)', marginBottom: '2px', fontSize: '0.95rem' }}>{place.name}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{place.desc}</p>
                </>
              )}
            </div>
          ))}
          {isAdminMode && (
            <button onClick={addDining} style={{ padding: '6px', background: 'var(--ocean-accent)', color: 'white', border: 'none', borderRadius: '4px' }}>
              + 맛집 추가
            </button>
          )}
        </div>
      </div>

      <div className="glass-card" style={cardStyle}>
        <h3 className="section-title" style={{ marginBottom: '12px' }}><ShoppingBag size={18} color="var(--sunset-accent)"/> 필수 쇼핑템</h3>
        <ul className="info-list" style={{ paddingLeft: '18px', margin: 0 }}>
          {diningAndShopping.shopping.map((item, idx) => (
            <li key={idx} style={{ fontSize: '0.9rem', lineHeight: '1.4', marginBottom: '6px' }}>
              {isAdminMode ? (
                <div style={{display:'flex', flexDirection:'column', gap:'4px', marginBottom:'8px'}}>
                  <input type="text" value={item.name} onChange={e => handleShoppingChange(idx, 'name', e.target.value)} style={{padding: '2px', border: '1px solid #ccc', borderRadius: '4px'}} />
                  <input type="text" value={item.desc} onChange={e => handleShoppingChange(idx, 'desc', e.target.value)} style={{padding: '2px', border: '1px solid #ccc', borderRadius: '4px'}} />
                  <button onClick={() => removeShopping(idx)} style={{ background: '#e76f51', color: 'white', border: 'none', borderRadius: '4px', padding: '2px' }}>삭제</button>
                </div>
              ) : (
                <><strong>{item.name}</strong> - {item.desc}</>
              )}
            </li>
          ))}
          {isAdminMode && (
            <button onClick={addShopping} style={{ marginTop: '8px', padding: '4px', background: 'var(--ocean-accent)', color: 'white', border: 'none', borderRadius: '4px' }}>
              + 쇼핑템 추가
            </button>
          )}
        </ul>
      </div>

      <details className="glass-card" style={{ ...cardStyle, background: 'rgba(251, 133, 0, 0.1)' }}>
        <summary className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', listStyle: 'none', margin: 0 }}>
          <Star size={18} color="var(--sunset-accent)"/> 
          <span style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
            골드카드 혜택 
            <a href="/goldcard.pdf" target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: '#0077b6', textDecoration: 'underline', backgroundColor: 'rgba(255,255,255,0.7)', padding: '2px 6px', borderRadius: '4px' }} onClick={e => e.stopPropagation()}>
              📄 원본 PDF 보기
            </a>
            {isAdminMode ? <input type="text" value={hotel.goldCard.date} onChange={e => updateHotel({...hotel, goldCard: {...hotel.goldCard, date: e.target.value}})} style={{padding:'2px'}} onClick={e=>e.stopPropagation()}/> : <span style={{ fontSize: '0.9rem' }}>({hotel.goldCard.date})</span>}
          </span>
          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>자세히 보기 ▼</span>
        </summary>
        <div style={{ marginTop: '12px', borderTop: '1px solid rgba(251, 133, 0, 0.2)', paddingTop: '12px' }}>
          <ul className="info-list" style={{ paddingLeft: '18px', margin: 0 }}>
            {hotel.goldCard.details.map((detail, idx) => (
              <li key={idx} style={{ fontSize: '0.9rem', lineHeight: '1.4', marginBottom: '8px', color: '#444' }}>
                {isAdminMode ? (
                  <div style={{display:'flex', gap:'4px'}}>
                    <input type="text" value={detail} onChange={e => {
                      const newDetails = [...hotel.goldCard.details];
                      newDetails[idx] = e.target.value;
                      updateHotel({...hotel, goldCard: {...hotel.goldCard, details: newDetails}});
                    }} style={{flex:1, padding: '2px', border: '1px solid #ccc', borderRadius: '4px'}} />
                    <button onClick={() => {
                      const newDetails = [...hotel.goldCard.details];
                      newDetails.splice(idx, 1);
                      updateHotel({...hotel, goldCard: {...hotel.goldCard, details: newDetails}});
                    }} style={{ background: '#e76f51', color: 'white', border: 'none', borderRadius: '4px', padding: '0 8px' }}>삭제</button>
                  </div>
                ) : detail}
              </li>
            ))}
            {isAdminMode && (
              <button onClick={() => updateHotel({...hotel, goldCard: {...hotel.goldCard, details: [...hotel.goldCard.details, '새 혜택']}})} style={{ marginTop: '8px', padding: '4px', background: 'var(--ocean-accent)', color: 'white', border: 'none', borderRadius: '4px' }}>
                + 골드카드 혜택 추가
              </button>
            )}
          </ul>
        </div>
      </details>
    </div>
  );
}

export default HotelInfo;
