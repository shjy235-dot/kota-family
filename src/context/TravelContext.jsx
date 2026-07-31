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
  const [baseAmount, setBaseAmount] = useState(3480000);
  const [expenses, setExpenses] = useState([]);

  // 추가된 정적 데이터들 (초기값은 travelData.js)
  const [itinerary, setItinerary] = useState(travelData.itinerary);
  const [tours, setTours] = useState(travelData.tours);
  const [tourNotes, setTourNotes] = useState(travelData.tourNotes);
  const [hotel, setHotel] = useState(travelData.hotel);
  const [diningAndShopping, setDiningAndShopping] = useState(travelData.diningAndShopping);
  const [flights, setFlights] = useState(travelData.flights);
  const [budgetStatic, setBudgetStatic] = useState(travelData.budget);

  const docRef = doc(db, 'trips', 'kota2026');

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        let currentChecklist = data.checklist || [];
        // MDAC 링크 강제 업데이트 패치 (기존 사용자 DB 패치용)
        const mdacItem = currentChecklist.find(item => item.id === 1);
        if (mdacItem && !mdacItem.task.includes('<a href')) {
          currentChecklist = currentChecklist.map(item => 
            item.id === 1 ? { ...item, task: travelData.preTripChecklist.find(t => t.id === 1).task } : item
          );
          updateDoc(docRef, { checklist: currentChecklist }); // DB 업데이트
        }
        setChecklist(currentChecklist);
        setPacking(data.packing || []);
        setBaseAmount(data.baseAmount || 3480000);
        setExpenses(data.expenses || []);
        
        // 새로 추가된 필드들 (없으면 travelData 기본값 사용)
        if (data.itinerary) setItinerary(data.itinerary);
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

        const savedBase = localStorage.getItem('kota_budget_base');
        const mergedBase = savedBase ? parseInt(savedBase, 10) : 3480000;

        const savedExpenses = localStorage.getItem('kota_expenses');
        const mergedExpenses = savedExpenses ? JSON.parse(savedExpenses) : [];

        const initialData = {
          checklist: mergedChecklist,
          packing: mergedPacking,
          baseAmount: mergedBase,
          expenses: mergedExpenses,
          itinerary: travelData.itinerary,
          tours: travelData.tours,
          tourNotes: travelData.tourNotes,
          hotel: travelData.hotel,
          diningAndShopping: travelData.diningAndShopping,
          flights: travelData.flights,
          budgetStatic: travelData.budget
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
    else if (field === 'baseAmount') setBaseAmount(value);
    else if (field === 'expenses') setExpenses(value);
    else if (field === 'itinerary') setItinerary(value);
    else if (field === 'tours') setTours(value);
    else if (field === 'tourNotes') setTourNotes(value);
    else if (field === 'hotel') setHotel(value);
    else if (field === 'diningAndShopping') setDiningAndShopping(value);
    else if (field === 'flights') setFlights(value);
    else if (field === 'budgetStatic') setBudgetStatic(value);

    // DB 업데이트
    await updateDoc(docRef, { [field]: value });
  };

  return (
    <TravelContext.Provider value={{
      isAdminMode, setIsAdminMode,
      checklist, updateChecklist: (v) => updateField('checklist', v),
      packing, updatePacking: (v) => updateField('packing', v),
      baseAmount, updateBaseAmount: (v) => updateField('baseAmount', v),
      expenses, updateExpenses: (v) => updateField('expenses', v),
      itinerary, updateItinerary: (v) => updateField('itinerary', v),
      tours, updateTours: (v) => updateField('tours', v),
      tourNotes, updateTourNotes: (v) => updateField('tourNotes', v),
      hotel, updateHotel: (v) => updateField('hotel', v),
      diningAndShopping, updateDiningAndShopping: (v) => updateField('diningAndShopping', v),
      flights, updateFlights: (v) => updateField('flights', v),
      budgetStatic, updateBudgetStatic: (v) => updateField('budgetStatic', v),
      isLoading
    }}>
      {children}
    </TravelContext.Provider>
  );
};
