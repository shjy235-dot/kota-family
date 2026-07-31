import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import travelData from '../data/travelData';

const TravelContext = createContext();

export const useTravel = () => useContext(TravelContext);

export const TravelProvider = ({ children }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 개별 상태들
  const [checklist, setChecklist] = useState([]);
  const [packing, setPacking] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // 추가된 정적 데이터들 (초기값은 travelData.js)
  const [itinerary, setItinerary] = useState(travelData.itinerary);
  const [tours, setTours] = useState(travelData.tours);
  const [tourNotes, setTourNotes] = useState(travelData.tourNotes);
  const [hotel, setHotel] = useState(travelData.hotel);
  const [diningAndShopping, setDiningAndShopping] = useState(travelData.diningAndShopping);
  const [flights, setFlights] = useState(travelData.flights);
  const [budgetStatic, setBudgetStatic] = useState(travelData.budget);

  // 환율 상태 추가 (기본값 360원, DB 연동)
  const [exchangeRate, setExchangeRate] = useState(360);

  const docRef = doc(db, 'trips', 'kota2026');

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const dataChecklist = data.checklist || [];
        let currentChecklist = dataChecklist;
        // 참고 링크 강제 업데이트 패치 (기존 사용자 DB 패치용, MDAC/스마트패스 등)
        let checklistPatched = false;
        [1, 2].forEach(id => {
          const item = currentChecklist.find(i => i.id === id);
          if (item && !item.task.includes('<a href')) {
            checklistPatched = true;
            currentChecklist = currentChecklist.map(i =>
              i.id === id ? { ...i, task: travelData.preTripChecklist.find(t => t.id === id).task } : i
            );
          }
        });
        if (checklistPatched) updateDoc(docRef, { checklist: currentChecklist }); // DB 업데이트
        setChecklist(currentChecklist);
        setPacking(data.packing || []);
        setExpenses(data.expenses || []);
        
        // 새로 추가된 필드들 (없으면 travelData 기본값 사용)
        let currentItinerary = data.itinerary || travelData.itinerary;
        // 일정 텍스트 강제 업데이트 패치 (기존 사용자 DB 패치용, [예전 문구, 새 문구] 목록)
        const soldOutDinnerLine = "17:30 시내 이동 ➔ 이마고몰 투어 및 <a href='https://blog.naver.com/hoilove5653/224275232094' target='_blank' rel='noreferrer' style='color:var(--ocean-accent); text-decoration:underline; font-weight:600;'>솔드아웃</a> 저녁 식사";
        const itineraryTextPatches = [
          ["17:30 시내 이동 ➔ 웰컴 씨푸드 저녁 식사 및 필리피노 야시장 구경", soldOutDinnerLine],
          ["17:30 시내 이동 ➔ 이마고몰 투어 및 솔드아웃 저녁 식사", soldOutDinnerLine],
          ["16:00 인천공항 제1터미널 단기주차장 지하 1층(C구역) 공식 주차대행 접수장 하차", "16:00 인천공항 제1터미널 단기주차장 지하 1층(B1) A구역 15번 공식 주차대행 접수장 하차"],
          ["07:50 단기주차장 지하 1층 주차대행 정산소 이동 (다자녀 할인 정산)", "07:50 단기주차장 지하 3층 A정산소(A32구역) 또는 H정산소(H38구역) 이동"]
        ];
        let itineraryPatched = false;
        itineraryTextPatches.forEach(([oldLine, newLine]) => {
          if (currentItinerary.some(day => day.schedule?.includes(oldLine))) {
            itineraryPatched = true;
            currentItinerary = currentItinerary.map(day =>
              day.schedule?.includes(oldLine)
                ? { ...day, schedule: day.schedule.map(line => line === oldLine ? newLine : line) }
                : day
            );
          }
        });
        if (itineraryPatched) updateDoc(docRef, { itinerary: currentItinerary });
        setItinerary(currentItinerary);
        if (data.tours) setTours(data.tours);
        if (data.tourNotes) setTourNotes(data.tourNotes);
        if (data.hotel) setHotel(data.hotel);
        if (data.diningAndShopping) setDiningAndShopping(data.diningAndShopping);
        if (data.flights) setFlights(data.flights);
        
        let currentBudget = data.budgetStatic || travelData.budget;
        if (currentBudget?.local?.travelWallet?.title) {
          const title = currentBudget.local.travelWallet.title;
          if (title.includes("트래블월렛") || title.includes("트레블월렛")) {
            currentBudget = {
              ...currentBudget,
              local: {
                ...currentBudget.local,
                travelWallet: {
                  ...currentBudget.local.travelWallet,
                  title: title.replace("트래블월렛", "트래블로그카드").replace("트레블월렛", "트래블로그카드")
                }
              }
            };
            updateDoc(docRef, { budgetStatic: currentBudget });
          }
        }
        setBudgetStatic(currentBudget);

        // 환율 정보 로드 (없으면 기본값 360)
        setExchangeRate(data.exchangeRate !== undefined ? data.exchangeRate : 360);
        
        setIsLoading(false);
      } else {
        // 첫 접속 시 초기 데이터(혹은 로컬스토리지 데이터)로 문서 생성
        const initialChecklist = travelData.preTripChecklist;
        const initialPacking = travelData.packingList.flatMap(category => 
          category.items.map((item, idx) => ({
            id: `${category.category}-${idx}`,
            category: category.category,
            task: item,
            completed: false
          }))
        );
        
        const savedChecklist = localStorage.getItem('kota_checklist');
        const mergedChecklist = savedChecklist ? initialChecklist.map(defaultItem => {
          const found = JSON.parse(savedChecklist).find(s => s.id === defaultItem.id);
          return found || defaultItem;
        }) : initialChecklist;

        const savedPacking = localStorage.getItem('kota_packing_v2');
        const mergedPacking = savedPacking ? initialPacking.map(defaultItem => {
          const found = JSON.parse(savedPacking).find(s => s.id === defaultItem.id);
          return found || defaultItem;
        }) : initialPacking;

        const savedExpenses = localStorage.getItem('kota_expenses');
        const mergedExpenses = savedExpenses ? JSON.parse(savedExpenses) : [];

        const initialData = {
          checklist: mergedChecklist,
          packing: mergedPacking,
          expenses: mergedExpenses,
          itinerary: travelData.itinerary,
          tours: travelData.tours,
          tourNotes: travelData.tourNotes,
          hotel: travelData.hotel,
          diningAndShopping: travelData.diningAndShopping,
          flights: travelData.flights,
          budgetStatic: travelData.budget,
          exchangeRate: 360
        };

        await setDoc(docRef, initialData);
      }
    });

    return () => unsubscribe();
  }, []);

  // 공통 업데이트 함수
  const updateField = async (field, value) => {
    // 로컬 상태 즉시 반영
    if (field === 'checklist') setChecklist(value);
    else if (field === 'packing') setPacking(value);
    else if (field === 'expenses') setExpenses(value);
    else if (field === 'itinerary') setItinerary(value);
    else if (field === 'tours') setTours(value);
    else if (field === 'tourNotes') setTourNotes(value);
    else if (field === 'hotel') setHotel(value);
    else if (field === 'diningAndShopping') setDiningAndShopping(value);
    else if (field === 'flights') setFlights(value);
    else if (field === 'budgetStatic') setBudgetStatic(value);
    else if (field === 'exchangeRate') setExchangeRate(value);

    // DB 업데이트
    await updateDoc(docRef, { [field]: value });
  };

  return (
    <TravelContext.Provider value={{
      isAdminMode, setIsAdminMode,
      checklist, updateChecklist: (v) => updateField('checklist', v),
      packing, updatePacking: (v) => updateField('packing', v),
      expenses, updateExpenses: (v) => updateField('expenses', v),
      itinerary, updateItinerary: (v) => updateField('itinerary', v),
      tours, updateTours: (v) => updateField('tours', v),
      tourNotes, updateTourNotes: (v) => updateField('tourNotes', v),
      hotel, updateHotel: (v) => updateField('hotel', v),
      diningAndShopping, updateDiningAndShopping: (v) => updateField('diningAndShopping', v),
      flights, updateFlights: (v) => updateField('flights', v),
      budgetStatic, updateBudgetStatic: (v) => updateField('budgetStatic', v),
      exchangeRate, updateExchangeRate: (v) => updateField('exchangeRate', v),
      isLoading
    }}>
      {children}
    </TravelContext.Provider>
  );
};
