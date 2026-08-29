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
        // eSIM 참고 링크 패치 (관리자가 문구를 수정했어도 "eSIM" 단어만 찾아 링크로 치환)
        const esimItem = currentChecklist.find(i => i.id === 3);
        if (esimItem && esimItem.task.includes('eSIM') && !esimItem.task.includes('<a href')) {
          checklistPatched = true;
          currentChecklist = currentChecklist.map(i =>
            i.id === 3 ? { ...i, task: i.task.replace('eSIM', "<a href='https://www.usimsa.com/guide/domestic' target='_blank' rel='noreferrer' style='color:var(--ocean-accent); text-decoration:underline; font-weight:600;'>eSIM</a>") } : i
          );
        }
        if (checklistPatched) updateDoc(docRef, { checklist: currentChecklist }); // DB 업데이트
        setChecklist(currentChecklist);

        let currentPacking = data.packing || [];
        // ATM기 사용법 항목에 참고 링크 강제 업데이트 패치 (기존 사용자 DB 패치용)
        const atmTask = "현지 공항 atm기 사용법";
        const atmTaskWithLink = "현지 공항 atm기 사용법 <a href='https://blog.naver.com/y86mh/224389033721' target='_blank' rel='noreferrer' style='color:var(--ocean-accent); text-decoration:underline; font-weight:600;'>[참고 링크]</a>";
        let packingPatched = false;
        if (currentPacking.some(item => item.task === atmTask)) {
          currentPacking = currentPacking.map(item => item.task === atmTask ? { ...item, task: atmTaskWithLink } : item);
          packingPatched = true;
        }
        // ATM기 참고 링크 주소 변경 패치 (기존에 이미 붙어있던 구 링크를 새 링크로 교체)
        if (currentPacking.some(item => item.task.includes('현지 공항 atm기 사용법') && item.task.includes('zbxm914/224360088544'))) {
          currentPacking = currentPacking.map(item =>
            (item.task.includes('현지 공항 atm기 사용법') && item.task.includes('zbxm914/224360088544'))
              ? { ...item, task: atmTaskWithLink }
              : item
          );
          packingPatched = true;
        }
        // 미네랄워터 항목에 참고 링크 강제 업데이트 패치 (기존 사용자 DB 패치용)
        if (currentPacking.some(item => item.task.includes('미네랄워터') && !item.task.includes('<a href'))) {
          currentPacking = currentPacking.map(item =>
            (item.task.includes('미네랄워터') && !item.task.includes('<a href'))
              ? { ...item, task: item.task.replace('미네랄워터', "<a href='https://blog.naver.com/jyujjnam/223968549834' target='_blank' rel='noreferrer' style='color:var(--ocean-accent); text-decoration:underline; font-weight:600;'>미네랄워터</a>") }
              : item
          );
          packingPatched = true;
        }
        // 마사지 추천 꿀팁을 준비물 목록에서 제거 (호텔 이용팁으로 이전됨)
        if (currentPacking.some(item => item.task.includes('마사지'))) {
          currentPacking = currentPacking.filter(item => !item.task.includes('마사지'));
          packingPatched = true;
        }
        if (packingPatched) updateDoc(docRef, { packing: currentPacking });
        setPacking(currentPacking);

        setExpenses(data.expenses || []);
        
        // 새로 추가된 필드들 (없으면 travelData 기본값 사용)
        let currentItinerary = data.itinerary || travelData.itinerary;
        // 일정 텍스트 강제 업데이트 패치 (기존 사용자 DB 패치용, [예전 문구, 새 문구] 목록)
        const soldOutDinnerLine = "17:30 시내 이동 ➔ 이마고몰 투어 및 <a href='https://blog.naver.com/hoilove5653/224275232094' target='_blank' rel='noreferrer' style='color:var(--ocean-accent); text-decoration:underline; font-weight:600;'>솔드아웃</a> 저녁 식사";
        const breakfastLine = "07:00 래시가드 착용 후 파이브 세일링 조식 뷔페 식사";
        const subwayLine = "08:10 제셀톤 스퀘어(Jesselton Square) 내 <a href='https://blog.naver.com/happy_24h/224207917387' target='_blank' rel='noreferrer' style='color:var(--ocean-accent); text-decoration:underline; font-weight:600;'>서브웨이</a>에서 점심 테이크아웃 <a href='http://google.com/maps/search/?api=1&query=Subway%20Jesselton%20Square&query_place_id=ChIJddC6zlhpOzIRwxZRauqldgU' target='_blank' rel='noreferrer' style='color:var(--ocean-accent); text-decoration:underline; font-weight:600;'>[지도 보기]</a>";
        const grabLine = "08:00 그랩 탑승 ➔ 제셀톤 포인트 이동 (약 10분 소요)";
        const itineraryTextPatches = [
          ["17:30 시내 이동 ➔ 웰컴 씨푸드 저녁 식사 및 필리피노 야시장 구경", soldOutDinnerLine],
          ["17:30 시내 이동 ➔ 이마고몰 투어 및 솔드아웃 저녁 식사", soldOutDinnerLine],
          ["16:00 인천공항 제1터미널 단기주차장 지하 1층(C구역) 공식 주차대행 접수장 하차", "16:00 인천공항 제1터미널 단기주차장 지하 1층(B1) A구역 15번 공식 주차대행 접수장 하차"],
          ["07:50 단기주차장 지하 1층 주차대행 정산소 이동 (다자녀 할인 정산)", "07:50 단기주차장 지하 3층 A정산소(A32구역) 또는 H정산소(H38구역) 이동"],
          ["07:30 래시가드 착용 후 파이브 세일링 조식 뷔페 식사", breakfastLine],
          ["08:15 그랩 탑승 ➔ 제셀톤 포인트 이동", grabLine],
          ["08:00 그랩 탑승 ➔ 제셀톤 포인트 이동", grabLine],
          ["08:00 제셀톤 포인트 인근 서브웨이에서 점심 테이크아웃", subwayLine],
          ["08:20 제셀톤 포인트 인근 서브웨이에서 점심 테이크아웃", subwayLine],
          ["08:10 수리아 사바몰(Suria Sabah) 내 서브웨이에서 점심 테이크아웃", subwayLine],
          ["08:10 제셀톤 스퀘어(Jesselton Square) 내 서브웨이에서 점심 테이크아웃 <a href='http://google.com/maps/search/?api=1&query=Subway%20Jesselton%20Square&query_place_id=ChIJddC6zlhpOzIRwxZRauqldgU' target='_blank' rel='noreferrer' style='color:var(--ocean-accent); text-decoration:underline; font-weight:600;'>[지도 보기]</a>", subwayLine],
          ["08:40 제셀톤 포인트 사우스제티 입구 흰색 천막 미팅 (잔금 RM 1,420 현금 일괄 결제)", "08:40 제셀톤 포인트 사우스제티 입구 흰색 천막 미팅 (잔금 RM 1,440 현금 일괄 결제)"]
        ];
        let itineraryPatched = false;
        itineraryTextPatches.forEach(([oldLine, newLine]) => {
          if (oldLine === newLine) return;
          if (currentItinerary.some(day => day.schedule?.includes(oldLine))) {
            itineraryPatched = true;
            currentItinerary = currentItinerary.map(day =>
              day.schedule?.includes(oldLine)
                ? { ...day, schedule: day.schedule.map(line => line === oldLine ? newLine : line) }
                : day
            );
          }
        });
        // 사피섬 점심 문구 부분 치환 패치 (관리자가 시간대를 직접 수정했어도 매칭되도록 줄 전체가 아닌 문구만 치환)
        const sapiOldLunchTexts = ["(점심: 섬 내 식당/간식)", "(점심: 서브웨이 테이크아웃)"];
        const sapiNewLunchText = "(점심: 서브웨이/컵라면)";
        if (currentItinerary.some(day => day.schedule?.some(line => line.includes('[사피섬]') && sapiOldLunchTexts.some(t => line.includes(t))))) {
          itineraryPatched = true;
          currentItinerary = currentItinerary.map(day => ({
            ...day,
            schedule: day.schedule?.map(line => {
              if (!line.includes('[사피섬]')) return line;
              let patchedLine = line;
              sapiOldLunchTexts.forEach(t => { patchedLine = patchedLine.replace(t, sapiNewLunchText); });
              return patchedLine;
            })
          }));
        }
        // 서브웨이 점심 테이크아웃 일정 신규 삽입 패치 (그랩 탑승 줄 바로 뒤에 없으면 추가)
        if (currentItinerary.some(day => day.schedule?.includes(grabLine) && !day.schedule.includes(subwayLine))) {
          itineraryPatched = true;
          currentItinerary = currentItinerary.map(day => {
            if (!day.schedule?.includes(grabLine) || day.schedule.includes(subwayLine)) return day;
            const idx = day.schedule.indexOf(grabLine);
            const newSchedule = [...day.schedule];
            newSchedule.splice(idx + 1, 0, subwayLine);
            return { ...day, schedule: newSchedule };
          });
        }
        // 중복된 줄(예: 문구 교체로 두 줄이 같은 텍스트가 된 경우) 정리
        const dedupedItinerary = currentItinerary.map(day => ({ ...day, schedule: day.schedule ? [...new Set(day.schedule)] : day.schedule }));
        if (dedupedItinerary.some((day, i) => day.schedule?.length !== currentItinerary[i].schedule?.length)) {
          itineraryPatched = true;
        }
        currentItinerary = dedupedItinerary;
        if (itineraryPatched) updateDoc(docRef, { itinerary: currentItinerary });
        setItinerary(currentItinerary);
        if (data.tours) setTours(data.tours);
        // 결제 및 준비사항에 섬 입장료 상세 금액 추가 패치 (기존 사용자 DB 패치용)
        let currentTourNotes = data.tourNotes || travelData.tourNotes;
        const paymentCategory = currentTourNotes.find(c => c.category?.includes('결제 및 준비사항'));
        if (paymentCategory && !paymentCategory.items.some(i => i.includes('섬 입장료: 성인'))) {
          currentTourNotes = currentTourNotes.map(c =>
            c.category?.includes('결제 및 준비사항')
              ? { ...c, items: [...c.items.slice(0, 2), "섬 입장료: 성인 25 RM × 2명 + 아동 20 RM × 2명 = **총 90 RM**", ...c.items.slice(2)] }
              : c
          );
          updateDoc(docRef, { tourNotes: currentTourNotes });
        }
        setTourNotes(currentTourNotes);

        let currentHotel = data.hotel || travelData.hotel;
        // 호텔이용팁을 benefits 목록 항목 → 단일 usageTip 필드 → usageTips 배열로 이전하는 패치 (기존 사용자 DB 패치용)
        const kidsTrainTip = "리틀 마젤란에서 <a href='https://kotamania.tistory.com/61' target='_blank' rel='noreferrer' style='color:var(--ocean-accent); text-decoration:underline; font-weight:600;'>꼬마기차</a> 이용 가능";
        let hotelPatched = false;
        if (currentHotel?.benefits?.some(b => b.includes('꼬마기차'))) {
          currentHotel = { ...currentHotel, benefits: currentHotel.benefits.filter(b => !b.includes('꼬마기차')) };
          hotelPatched = true;
        }
        if (!currentHotel?.usageTips) {
          currentHotel = { ...currentHotel, usageTips: currentHotel?.usageTip ? [currentHotel.usageTip] : [kidsTrainTip] };
          hotelPatched = true;
        }
        if (currentHotel.usageTip !== undefined) {
          const { usageTip, ...rest } = currentHotel;
          currentHotel = rest;
          hotelPatched = true;
        }
        // 마사지 이용팁에 참고 링크 강제 업데이트 패치 (기존 사용자 DB 패치용, "마사지" 단어만 찾아 링크로 치환)
        if (currentHotel?.usageTips?.some(t => t.includes('마사지') && !t.includes('<a href'))) {
          currentHotel = {
            ...currentHotel,
            usageTips: currentHotel.usageTips.map(t =>
              (t.includes('마사지') && !t.includes('<a href'))
                ? t.replace('마사지', "<a href='https://kotamania.tistory.com/50' target='_blank' rel='noreferrer' style='color:var(--ocean-accent); text-decoration:underline; font-weight:600;'>마사지</a>")
                : t
            )
          };
          hotelPatched = true;
        }
        if (hotelPatched) updateDoc(docRef, { hotel: currentHotel });
        setHotel(currentHotel);

        let currentDiningAndShopping = data.diningAndShopping || travelData.diningAndShopping;
        // 쇼핑 참고 링크 신규 삽입 패치 (기존 사용자 DB 패치용, [식별용 postId, 링크 HTML] 목록)
        const shoppingLinkPatches = [
          ['224382931615', "<a href='https://blog.naver.com/zbxm914/224382931615' target='_blank' rel='noreferrer' style='color:var(--ocean-accent); text-decoration:underline; font-weight:600;'>참고 링크 1</a>"],
          ['224384357171', "<a href='https://blog.naver.com/dydydy12-/224384357171' target='_blank' rel='noreferrer' style='color:var(--ocean-accent); text-decoration:underline; font-weight:600;'>참고 링크 2</a>"],
          ['224382344580', "<a href='https://blog.naver.com/sinhyunarr/224382344580' target='_blank' rel='noreferrer' style='color:var(--ocean-accent); text-decoration:underline; font-weight:600;'>참고 링크 3</a>"]
        ];
        let shoppingLinksPatched = false;
        shoppingLinkPatches.forEach(([postId, linkHtml]) => {
          if (!currentDiningAndShopping?.shoppingLinks?.some(l => l.includes(postId))) {
            currentDiningAndShopping = { ...currentDiningAndShopping, shoppingLinks: [...(currentDiningAndShopping?.shoppingLinks || []), linkHtml] };
            shoppingLinksPatched = true;
          }
        });
        if (shoppingLinksPatched) updateDoc(docRef, { diningAndShopping: currentDiningAndShopping });
        setDiningAndShopping(currentDiningAndShopping);
        if (data.flights) setFlights(data.flights);
        
        let currentBudget = data.budgetStatic || travelData.budget;
        let budgetPatched = false;
        if (currentBudget?.local?.travelWallet?.title) {
          const title = currentBudget.local.travelWallet.title;
          if (title.includes("트래블월렛") || title.includes("트레블월렛") || title.includes("트래블로그카드")) {
            currentBudget = {
              ...currentBudget,
              local: {
                ...currentBudget.local,
                travelWallet: {
                  ...currentBudget.local.travelWallet,
                  title: title.replace("트래블월렛", "트레블로그카드").replace("트레블월렛", "트레블로그카드").replace("트래블로그카드", "트레블로그카드")
                }
              }
            };
            budgetPatched = true;
          }
        }
        // 투어 잔금 1,420 RM -> 1,440 RM 확정 및 호텔 보증금(노디파짓 확인) 항목 제거 패치
        if (currentBudget?.local?.travelWallet?.items) {
          const items = currentBudget.local.travelWallet.items;
          const hasOldAmount = items.some(i => i.name?.includes('투어 잔금') && i.amount === '1,420 RM');
          const hasDepositItem = items.some(i => i.name?.includes('호텔 보증금'));
          if (hasOldAmount || hasDepositItem) {
            const newItems = items
              .filter(i => !i.name?.includes('호텔 보증금'))
              .map(i => (i.name?.includes('투어 잔금') && i.amount === '1,420 RM') ? { ...i, amount: '1,440 RM' } : i);
            currentBudget = { ...currentBudget, local: { ...currentBudget.local, travelWallet: { ...currentBudget.local.travelWallet, items: newItems } } };
            budgetPatched = true;
          }
        }
        // 예산 팁 문구의 투어 잔금 금액 업데이트 패치
        if (currentBudget?.tips?.some(t => t.includes('1,420 RM'))) {
          currentBudget = { ...currentBudget, tips: currentBudget.tips.map(t => t.replace('1,420 RM', '1,440 RM')) };
          budgetPatched = true;
        }
        if (budgetPatched) updateDoc(docRef, { budgetStatic: currentBudget });
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
