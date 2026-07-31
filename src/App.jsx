import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Home, Plane, Hotel, Map, CheckSquare, Wallet } from 'lucide-react';
import Dashboard from './components/Dashboard';
import FlightInfo from './components/FlightInfo';
import HotelInfo from './components/HotelInfo';
import Itinerary from './components/Itinerary';
import BudgetGuide from './components/BudgetGuide';
import { TravelProvider } from './context/TravelContext';
import './App.css';

function App() {
  return (
    <TravelProvider>
      <Router>
        <div className="app-container">
          {/* 헤더 */}
          <header className="glass-header">
            <h1>🏖️ 코타키나발루 가족 여행</h1>
          </header>

          {/* 메인 컨텐츠 영역 */}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/flight" element={<FlightInfo />} />
              <Route path="/hotel" element={<HotelInfo />} />
              <Route path="/itinerary" element={<Itinerary />} />
              <Route path="/budget" element={<BudgetGuide />} />
            </Routes>
          </main>

          {/* 하단 네비게이션 (모바일 탭) */}
          <nav className="bottom-nav glass-nav">
            <NavLink to="/" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
              <Home size={24} />
              <span>홈</span>
            </NavLink>
            <NavLink to="/flight" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
              <Plane size={24} />
              <span>항공/입국</span>
            </NavLink>
            <NavLink to="/itinerary" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
              <Map size={24} />
              <span>일정</span>
            </NavLink>
            <NavLink to="/hotel" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
              <Hotel size={24} />
              <span>숙소/식사</span>
            </NavLink>
            <NavLink to="/budget" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
              <Wallet size={24} />
              <span>예산</span>
            </NavLink>
          </nav>
        </div>
      </Router>
    </TravelProvider>
  );
}

export default App;
