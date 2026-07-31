import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import travelData from '../data/travelData';

const TravelContext = createContext();

export const useTravel = () => useContext(TravelContext);

export const TravelProvider = ({ children }) => {
  const [checklist, setChecklist] = useState([]);
  const [packing, setPacking] = useState([]);
  const [baseAmount, setBaseAmount] = useState(3480000);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const docRef = doc(db, 'trips', 'kota2026');

  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setChecklist(data.checklist || []);
        setPacking(data.packing || []);
        setBaseAmount(data.baseAmount || 3480000);
        setExpenses(data.expenses || []);
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
        
        // 로컬 스토리지 마이그레이션 로직
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
          expenses: mergedExpenses
        };

        await setDoc(docRef, initialData);
        // setDoc will trigger onSnapshot again, so we just wait
      }
    });

    return () => unsubscribe();
  }, []);

  const updateChecklist = async (newChecklist) => {
    // 낙관적 업데이트 (UI 즉시 반영)
    setChecklist(newChecklist);
    await updateDoc(docRef, { checklist: newChecklist });
  };

  const updatePacking = async (newPacking) => {
    setPacking(newPacking);
    await updateDoc(docRef, { packing: newPacking });
  };

  const updateBaseAmount = async (newAmount) => {
    setBaseAmount(newAmount);
    await updateDoc(docRef, { baseAmount: newAmount });
  };

  const updateExpenses = async (newExpenses) => {
    setExpenses(newExpenses);
    await updateDoc(docRef, { expenses: newExpenses });
  };

  return (
    <TravelContext.Provider value={{
      checklist, updateChecklist,
      packing, updatePacking,
      baseAmount, updateBaseAmount,
      expenses, updateExpenses,
      isLoading
    }}>
      {children}
    </TravelContext.Provider>
  );
};
