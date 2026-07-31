# Firebase Firestore 실시간 동기화 및 Vercel 다이렉트 배포

## 문제 상황 및 요구사항
- 가족 여행 앱 데이터를 여러 기기에서 실시간으로 공유하고 수정해야 함
- GitHub 연동 없이 빠르고 자동화된 배포 프로세스 필요

## 해결 방안 (Architecture & Deployment)
1. **Firebase Firestore 실시간 동기화 구현**
   - `TravelContext.jsx`를 생성하여 앱 전체를 감싸는 상태 관리 계층 구축
   - `onSnapshot`을 통해 `trips/kota2026` 문서의 실시간 변경을 감지
   - `setDoc`과 `updateDoc`을 활용한 낙관적 업데이트(Optimistic Update)로 UI 반응성 극대화
   - 기존 `localStorage`에 있던 유저 캐시 데이터를 초기에 Firestore로 마이그레이션(병합)하는 로직 구현

2. **Vercel CLI를 통한 다이렉트 자동 배포 (GitHub Bypass)**
   - `npx vercel whoami` 및 디바이스 인증(`oauth/device`) 흐름을 유도하여 로컬 인증 획득
   - 인증 완료 후 `npx vercel --prod --yes` 명령어를 백그라운드 작업으로 실행하여, 번거로운 GitHub 연동 없이 로컬 코드를 그대로 프로덕션 환경에 원클릭 자동 배포 성공

## 학습 및 재사용 포인트
- React에서 Firebase Firestore 실시간 구독 시 Context API를 활용하면 상태 주입이 매우 간결해짐
- 터미널 접근 권한이 있을 때 `vercel` CLI를 적극 활용하면 GitHub 저장소 생성 단계를 건너뛰고 빠른 결과물 검증(배포)이 가능함
