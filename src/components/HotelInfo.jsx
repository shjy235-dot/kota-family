import React from 'react';
import { Building, Utensils, Star, ShoppingBag } from 'lucide-react';
import travelData from '../data/travelData';

function HotelInfo() {
  const { hotel, diningAndShopping } = travelData;

  // 공통 카드 스타일 (칸 줄이기 적용)
  const cardStyle = { padding: '14px 12px', marginBottom: '12px' };

  return (
    <div className="hotel-info">
      <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
        <Building size={24} color="var(--primary-color)"/> 숙소 및 맛집 정보
      </h2>

      <div className="glass-card" style={cardStyle}>
        <h3 className="section-title" style={{ marginBottom: '10px' }}><Building size={18} color="var(--sunset-accent)"/> {hotel.name}</h3>
        <p style={{ fontWeight: '600', marginBottom: '10px', fontSize: '0.95rem', color: 'var(--ocean-accent)' }}>{hotel.roomType}</p>
        <ul className="info-list" style={{ paddingLeft: '18px', margin: 0 }}>
          {hotel.benefits.map((benefit, idx) => (
            <li key={idx} style={{ fontSize: '0.9rem', lineHeight: '1.4', marginBottom: '6px' }}>{benefit}</li>
          ))}
        </ul>
      </div>

      <div className="glass-card" style={cardStyle}>
        <h3 className="section-title" style={{ marginBottom: '12px' }}><Utensils size={18} color="var(--sunset-accent)"/> 추천 맛집 리스트</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {diningAndShopping.dining.map((place, idx) => (
            <div key={idx} style={{ background: 'rgba(255,255,255,0.4)', padding: '10px 12px', borderRadius: '8px' }}>
              <h4 style={{ color: 'var(--text-main)', marginBottom: '2px', fontSize: '0.95rem' }}>{place.name}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{place.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card" style={cardStyle}>
        <h3 className="section-title" style={{ marginBottom: '12px' }}><ShoppingBag size={18} color="var(--sunset-accent)"/> 필수 쇼핑템</h3>
        <ul className="info-list" style={{ paddingLeft: '18px', margin: 0 }}>
          {diningAndShopping.shopping.map((item, idx) => (
            <li key={idx} style={{ fontSize: '0.9rem', lineHeight: '1.4', marginBottom: '6px' }}><strong>{item.name}</strong> - {item.desc}</li>
          ))}
        </ul>
      </div>

      <details className="glass-card" style={{ ...cardStyle, background: 'rgba(251, 133, 0, 0.1)' }}>
        <summary className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', listStyle: 'none', margin: 0 }}>
          <Star size={18} color="var(--sunset-accent)"/> 
          <span>골드카드 혜택 ({hotel.goldCard.date})</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>자세히 보기 ▼</span>
        </summary>
        <div style={{ marginTop: '12px', borderTop: '1px solid rgba(251, 133, 0, 0.2)', paddingTop: '12px' }}>
          <ul className="info-list" style={{ paddingLeft: '18px', margin: 0 }}>
            {hotel.goldCard.details.map((detail, idx) => (
              <li key={idx} style={{ fontSize: '0.9rem', lineHeight: '1.4', marginBottom: '8px', color: '#444' }}>{detail}</li>
            ))}
          </ul>
        </div>
      </details>
    </div>
  );
}

export default HotelInfo;
