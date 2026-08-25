// 여행 정보 데이터
// 이 파일을 직접 수정하면 웹앱 화면에 즉시 반영됩니다! (텍스트, 날짜 등)
// 추후 'npm run sync' 명령어를 통해 NotebookLM에서 최신 정보를 가져와 이 파일을 덮어쓸 수 있습니다.

const travelData = {
  tripInfo: {
    title: "가족 코타키나발루 여행",
    startDate: "2026-08-30", // 출국일 (디데이 계산용)
    endDate: "2026-09-03",
    travelers: ["아빠", "엄마", "첫째", "둘째"],
  },
  
  // 메인 홈: 출국 전 필수 체크리스트
  preTripChecklist: [
    { id: 1, task: "말레이시아 디지털 입국카드(MDAC) 사전 등록 (출발 3일 전) <a href='https://blog.naver.com/jooae0512/224354303354' target='_blank' rel='noreferrer' style='color:var(--ocean-accent); text-decoration:underline; font-weight:600;'>[참고 링크]</a>", completed: false },
    { id: 2, task: "인천공항 스마트패스 가족 모두 등록 <a href='https://blog.naver.com/dlwndud1974/224354904353' target='_blank' rel='noreferrer' style='color:var(--ocean-accent); text-decoration:underline; font-weight:600;'>[참고 링크]</a>", completed: false },
    { id: 3, task: "가족별 개인 <a href='https://www.usimsa.com/guide/domestic' target='_blank' rel='noreferrer' style='color:var(--ocean-accent); text-decoration:underline; font-weight:600;'>eSIM</a> 설치 또는 SKT 가족로밍 가입", completed: false },
    { id: 4, task: "그랩(Grab) 택시 앱 설치 및 트래블로그 카드 연동", completed: false },
    { id: 5, task: "차키 챙기기 (공항 공식 주차대행 발렛 시 필수)", completed: false }
  ],

  // 항공편 및 출입국 정보
  flights: {
    outbound: {
      date: "2026년 8월 30일 (일)",
      flightNo: "제주항공 7C2603",
      departure: "19:10 (인천 ICN 제1터미널)",
      arrival: "23:30 (코타키나발루 BKI)",
      tips: [
        "모바일 체크인은 출발 24시간 전(8/29 19:10) 제주항공 앱에서 완료하기",
        "공항 3층 L 카운터에서 '셀프 백드롭(자동 위탁)' 이용하기 (보조배터리는 위탁 불가!)",
      ]
    },
    inbound: {
      date: "2026년 9월 3일 (목)",
      flightNo: "제주항공 7C2604",
      departure: "00:30 (코타키나발루 BKI)",
      arrival: "06:50 (인천 ICN 제1터미널)",
      tips: ["9월 2일 수요일 밤에 공항으로 이동해야 함 (주의!)"]
    }
  },

  // 숙소 정보
  hotel: {
    name: "더 마젤란 수트라 리조트 (The Magellan Sutera Resort)",
    roomType: "마젤란 클럽룸 (트윈베드 + 엑스트라베드 세팅)",
    benefits: [
      "전 일정 클럽 라운지 조식 포함 (06:30 ~ 10:30)",
      "해피아워 다과 제공 (17:30 ~ 19:00, 체크아웃 당일 제외)",
      "18시 무료 레이트 체크아웃 적용 완료 (마지막 날)",
      "<strong style='color:var(--ocean-accent); font-size:0.95rem;'>호텔이용팁</strong>: 리틀 마젤란에서 <a href='https://kotamania.tistory.com/61' target='_blank' rel='noreferrer' style='color:var(--ocean-accent); text-decoration:underline; font-weight:600;'>꼬마기차</a> 이용 가능",
    ],
    goldCard: {
      date: "2026년 9월 1일 (화) 사용",
      details: [
        "[원데이 골드카드] 리조트 내 3식 전면 무료 (파이브세일링 조식, 알 프레스코 중식/석식 등)",
        "식사 시 음료 기본 제공 (탄산, 주스, 커피/차 중 1잔 제공, 주류 제외)",
        "마리나 클럽 스포츠 시설 무료 (볼링 1일 1회 무료, 테니스, 스쿼시, 미니골프 등)",
        "키즈 시설 무료 (키디스 클럽, 리틀 마젤란 입장 및 꼬마 기차 이용)",
        "⚠️ 주의: 1일권 프로모션은 마누칸섬 투어 및 골프 관련 혜택이 제외됩니다."
      ]
    }
  },

  // 맛집 및 쇼핑
  diningAndShopping: {
    dining: [
      { name: "알 프레스코", desc: "리조트 내 화덕피자/양식 (선셋 명당)" },
      { name: "실크 가든", desc: "퍼시픽 리조트 내 중식당 (딤섬, 탕수육)" },
      { name: "웰컴 씨푸드", desc: "시내 가성비 최고 해산물 (칠리크랩, 볶음밥)" },
      { name: "이펑 락사", desc: "가야스트리트 로컬 락사 및 우란찌" },
    ],
    shopping: [
      { name: "올드타운 화이트 커피 & 사바 티", desc: "선물용 커피/차 (이마고몰 에버라이즈 마트)" },
      { name: "카야잼 & 망고 젤리", desc: "아이들 간식 및 선물용" },
      { name: "필리피노 야시장 과일", desc: "망고, 망고스틴 (저녁에 방문)" }
    ]
  },

  // 전체 일정 요약 (상세)
  itinerary: [
    { day: "Day 1 (8/30 일)", title: "출발 & 주차대행 하차 & 출국", schedule: [
      "12:30 대전 용운동 에코포레 아파트 출발 (휴게소 방문 감안)",
      "16:00 인천공항 제1터미널 단기주차장 지하 1층(B1) A구역 15번 공식 주차대행 접수장 하차",
      "16:10 엘리베이터 탑승 후 3층 출국장 이동",
      "16:30 사전 모바일 체크인 QR 준비 후 L카운터 셀프 백드롭 기기로 수하물 직접 위탁",
      "17:00 스마트패스 전용 라인으로 보안검색대 빠른 통과",
      "17:30 ~ 18:30 면세구역 식사 및 탑승게이트 대기",
      "19:10 인천국제공항 출발 (제주항공 7C2603)",
      "23:30 코타키나발루 국제공항(BKI) 도착 및 입국 심사",
      "23:50 그랩(Grab) 탑승하여 더 마젤란 수트라 리조트 이동",
      "24:10 리조트 체크인 및 휴식 (골드카드 등록 및 식당 예약)"
    ] },
    { day: "Day 2 (8/31 월)", title: "2개 섬 호핑투어(마무틱&사피) & 시내 맛집", schedule: [
      "07:00 래시가드 착용 후 파이브 세일링 조식 뷔페 식사",
      "08:00 그랩 탑승 ➔ 제셀톤 포인트 이동 (약 10분 소요)",
      "08:10 제셀톤 스퀘어(Jesselton Square) 내 <a href='https://blog.naver.com/happy_24h/224207917387' target='_blank' rel='noreferrer' style='color:var(--ocean-accent); text-decoration:underline; font-weight:600;'>서브웨이</a>에서 점심 테이크아웃 <a href='http://google.com/maps/search/?api=1&query=Subway%20Jesselton%20Square&query_place_id=ChIJddC6zlhpOzIRwxZRauqldgU' target='_blank' rel='noreferrer' style='color:var(--ocean-accent); text-decoration:underline; font-weight:600;'>[지도 보기]</a>",
      "08:40 제셀톤 포인트 사우스제티 입구 흰색 천막 미팅 (잔금 RM 1,420 현금 일괄 결제)",
      "09:00 대여품 수령 후 보트 탑승 ➔ <a href='https://blog.naver.com/chayalim/223680436707' target='_blank' rel='noreferrer' style='color:var(--ocean-accent); text-decoration:underline; font-weight:600;'>마무틱섬</a> 이동",
      "09:30 ~ 11:50 [마무틱섬] 패러세일링, 제트스키, 단독 가이드 스노클링 진행",
      "12:00 보트 탑승하여 <a href='https://blog.naver.com/chayalim/223477669647' target='_blank' rel='noreferrer' style='color:var(--ocean-accent); text-decoration:underline; font-weight:600;'>사피섬</a>으로 이동",
      "12:30 ~ 15:00 [사피섬] 가족 자유 스노클링 및 해변 휴식 (점심: 서브웨이/컵라면)",
      "15:00 귀환 보트 탑승 ➔ 육지 도착 후 리조트 복귀 및 샤워",
      "17:30 시내 이동 ➔ 이마고몰 투어 및 <a href='https://blog.naver.com/hoilove5653/224275232094' target='_blank' rel='noreferrer' style='color:var(--ocean-accent); text-decoration:underline; font-weight:600;'>솔드아웃</a> 저녁 식사",
      "20:00 리조트 복귀 후 휴식"
    ] },
    { day: "Day 3 (9/1 화)", title: "원데이 골드카드 100% 활용 데이", schedule: [
      "08:30 [조식] 파이브 세일링 인터내셔널 뷔페 (골드카드)",
      "10:00 마젤란 라군풀 및 마리나 키즈 수영장 오전 물놀이",
      "12:30 [중식] 알 프레스코 화덕 피자 & 파스타 세트 (골드카드)",
      "14:30 [액티비티] 마리나 클럽 볼링장(내기 볼링) 및 미니 골프 즐기기",
      "17:30 [석식] 알 프레스코 선셋 3코스 식사하며 3대 석양 감상",
      "20:00 리조트 야간 산책 또는 객실 휴식"
    ] },
    { day: "Day 4 (9/2 수)", title: "체크아웃 & 봉가완 반딧불 투어", schedule: [
      "08:30 리조트 조식 뷔페 식사",
      "10:00 수영장에서 마지막 물놀이 후 객실 샤워 및 짐 정리",
      "12:30 [중식] 퍼시픽 구역 실크 가든 딤섬 식사 또는 로컬 맛집 이용",
      "14:00 ~ 14:30 리조트 체크아웃 진행 및 투어 차량에 짐 싣기",
      "14:30 (스탠바이) 마젤란 로비에서 반딧불 투어 차량 탑승",
      "16:30 봉가완 도착 및 웰컴 스낵 타임",
      "17:00 맹그로브 숲 크루즈 및 원숭이 투어 감상",
      "18:00 현지식 뷔페 저녁 식사",
      "19:00 선셋 포인트 감상 및 하이라이트 반딧불 투어 진행",
      "20:30 ~ 21:00 투어 종료 후 코타키나발루 공항 다이렉트 드랍",
      "21:30 공항 도착 및 출국 수속 진행"
    ] },
    { day: "Day 5 (9/3 목)", title: "귀국 및 자택 도착", schedule: [
      "00:30 코타키나발루 공항 출발 (제주항공 7C2604)",
      "06:50 인천국제공항 제1터미널 도착 및 입국 심사",
      "07:50 단기주차장 지하 3층 A정산소(A32구역) 또는 H정산소(H38구역) 이동",
      "11:00 ~ 11:30 대전 용운동 에코포레 아파트 무사 도착 및 종료"
    ] }
  ],

  // 준비물 리스트
  packingList: [
    { category: "필수 서류/금융 및 의약품", items: [
      "여권(사본), 트래블로그 카드, 한국 5만원권 신권",
      "지사제(포타겔), 링티, 해열제, 비오플, 모기기피제"
    ] },
    { category: "미리 챙길 준비물", items: [
      "빨랫줄 및 집게 (수영복 건조용)",
      "멀티탭 및 충전기"
    ] },
    { category: "기타 꿀팁", items: [
      "현지 천연 미네랄워터 구입 (초록/파란뚜껑 스프리처)",
      "어린이 스노클링용 일반 마스크"
    ] }
  ],

  // 투어 상세 일정
  tours: [
    {
      title: "🏝️ 8/31 제셀톤 호핑투어 상세",
      details: [
        "08:40 제셀톤 포인트 사우스제티 입구(흰색 천막) 미팅 및 투어비 결제",
        "09:00 대여품(구명조끼, 마스크) 수령 후 첫 번째 섬(<a href='https://blog.naver.com/chayalim/223680436707' target='_blank' rel='noreferrer' style='color:var(--ocean-accent); text-decoration:underline; font-weight:600;'>마무틱섬</a>)으로 보트 이동",
        "09:30 ~ 11:50 <a href='https://blog.naver.com/chayalim/223680436707' target='_blank' rel='noreferrer' style='color:var(--ocean-accent); text-decoration:underline; font-weight:600;'>마무틱섬</a> 액티비티 진행 (패러세일링, 제트스키, 가이드 스노클링)",
        "12:00 두 번째 섬(<a href='https://blog.naver.com/chayalim/223477669647' target='_blank' rel='noreferrer' style='color:var(--ocean-accent); text-decoration:underline; font-weight:600;'>사피섬</a>/마누칸섬 중 택1) 이동 (두 번째 섬부터는 가이드 미동행)",
        "귀환 아웃시간(13:00, 14:00, 15:00, 16:00 중 택1) 5분 전까지 현지 코디네이터 미팅 필수"
      ]
    },
    {
      title: "🪲 9/2 봉가완 반딧불투어 상세",
      details: [
        "14:30 마젤란 수트라 로비 스탠바이 및 픽업 차량 탑승 (당일 14:00경 차량번호 안내)",
        "16:30 봉가완 선착장 도착 및 웰컴 스낵(커피/다과) 타임",
        "17:00 맹그로브 숲 크루즈 탑승 후 야생 원숭이(긴코원숭이 등) 관람",
        "18:00 선착장 복귀 후 현지식 뷔페로 저녁 식사",
        "19:00 선셋 포인트에서 석양 감상 후, 메인 투어인 '야간 반딧불 관람' 시작",
        "20:30 ~ 21:00 모든 투어 종료 후 공항(또는 시내)으로 다이렉트 드랍"
      ]
    }
  ],

  // 투어 중요사항 요약
  tourNotes: [
    {
      category: "💵 결제 및 준비사항",
      items: [
        "제셀톤 잔금 결제는 **반드시 현금(RM)**만 가능",
        "섬 입장료 결제용 **실물 해외 결제 카드** 지참 (트래블로그 등)",
        "모바일에 저장된 **예약증(PDF)** 캡쳐본 준비 (실물 여권 불필요)"
      ]
    },
    {
      category: "🏝️ 섬투어(호핑) 수칙",
      items: [
        "가이드 촬영 스노클링 사진은 **직후 현장에서 휴대폰으로 바로 전송**받기",
        "보트 탑승 **10분 전 코디네이터 미팅 필수** (지각 시 1시간 대기)",
        "마스크 흘러내림 방지를 위해 **얼굴 선크림은 최소한만** 도포",
        "구명조끼, 마스크 등 장비 분실 시 개당 RM 150 부과"
      ]
    },
    {
      category: "🦟 반딧불 투어 수칙",
      items: [
        "비가 와도 정상 진행 (우천 취소/환불 불가)",
        "**모기기피제는 보트 탑승 전**에만 사용, 관람 중엔 **카메라 플래시와 기피제 사용 절대 금지**",
        "야생 원숭이 먹이주기 전면 금지"
      ]
    },
    {
      category: "🔁 취소 및 환불 규정",
      items: [
        "노쇼 및 당일 취소 시 투어 전체 금액 기준으로 환불 불가 (전액 지불 책임)",
        "섬투어 보트 출발 후 기상 악화나 멀미로 인한 일정 단축은 환불 불가"
      ]
    }
  ],

  // 💰 예산 가이드
  budget: {
    totalEstimate: "약 3,480,000원",
    prePaid: {
      total: "약 2,688,000원",
      items: [
        { name: "항공권", amount: "약 1,500,000원", desc: "제주항공 4인 (위탁 15kg 포함)" },
        { name: "숙박비", amount: "1,127,000원", desc: "마젤란 클럽룸 3박, 골드카드 1일, 레이트체크아웃" },
        { name: "통신비", amount: "43,000원", desc: "KT 로밍 공유(3.3만) + eSIM 1인(1만)" },
        { name: "주차비", amount: "18,000원", desc: "공항 전기차 50% 할인 적용 (4일)" }
      ]
    },
    local: {
      total: "약 792,000원 (실지출 2,200 RM 예상액)",
      travelWallet: {
        title: "트레블로그카드 사전 충전 (ATM 인출 + 카드 결제)",
        total: "2,800 RM (약 1,008,000원)",
        items: [
          { name: "투어 잔금 (현금 필수)", amount: "1,420 RM", desc: "공항 도착 즉시 ATM에서 인출" },
          { name: "호텔 보증금 (카드 결제)", amount: "600 RM", desc: "퇴실 시 전액 환불 (실지출 제외)" },
          { name: "기타 현지 경비", amount: "약 780 RM", desc: "관광세, 섬 입장료, 그랩, 식비, 쇼핑 등" }
        ]
      },
      cash: {
        title: "한국 5만원권 신권 지참",
        total: "15~20만 원",
        items: [
          { name: "비상금 및 야시장용", amount: "15~20만원", desc: "카드/ATM 오류 대비 및 필요시 시내 환전" }
        ]
      }
    },
    tips: [
      "공항 도착 즉시 노란색(Maybank) 또는 빨간색(CIMB) ATM에서 투어 잔금(1,420 RM)을 수수료 없이 인출하세요.",
      "eSIM 사용자는 한국 유심을 빼지 말고 켜두되, '데이터 로밍'만 OFF로 해두면 한국 문자 수신을 무료로 이용할 수 있습니다."
    ]
  }
};

export default travelData;
