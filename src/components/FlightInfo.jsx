import React from 'react';
import { PlaneTakeoff, PlaneLanding, Info } from 'lucide-react';
import travelData from '../data/travelData';

function FlightInfo() {
  const { outbound, inbound } = travelData.flights;

  return (
    <div className="flight-info">
      <h2 className="page-title">항공 및 입국 정보</h2>

      <div className="glass-card">
        <h3 className="section-title"><PlaneTakeoff size={20} color="var(--sunset-accent)"/> 가는 편 (출국)</h3>
        <p style={{ fontWeight: '600', marginBottom: '8px' }}>{outbound.date} | {outbound.flightNo}</p>
        <div style={{ background: 'rgba(255,255,255,0.4)', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
          <p><strong>출발:</strong> {outbound.departure}</p>
          <p><strong>도착:</strong> {outbound.arrival}</p>
        </div>
        <ul className="info-list">
          {outbound.tips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className="glass-card">
        <h3 className="section-title"><PlaneLanding size={20} color="var(--sunset-accent)"/> 오는 편 (귀국)</h3>
        <p style={{ fontWeight: '600', marginBottom: '8px' }}>{inbound.date} | {inbound.flightNo}</p>
        <div style={{ background: 'rgba(255,255,255,0.4)', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
          <p><strong>출발:</strong> {inbound.departure}</p>
          <p><strong>도착:</strong> {inbound.arrival}</p>
        </div>
        <ul className="info-list">
          {inbound.tips.map((tip, idx) => (
            <li key={idx} style={{ color: '#d62828', fontWeight: '500' }}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className="glass-card" style={{ background: 'rgba(255, 183, 3, 0.2)' }}>
        <h3 className="section-title"><Info size={20}/> 꿀팁 요약</h3>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
          * 모바일 체크인과 스마트패스를 결합하면 공항 대기 시간을 획기적으로 줄일 수 있습니다.<br/>
          * 출국 시 보조배터리는 반드시 직접 들고 타는 가방에 넣어주세요.
        </p>
      </div>
    </div>
  );
}

export default FlightInfo;
