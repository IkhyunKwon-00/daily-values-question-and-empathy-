# Daily Values Question and Empathy

매일 하나의 가치관 질문에 답을 남기는 저널 앱. 답변은 피드처럼 쌓이고, 마음에 드는
가치관을 가진 사람을 발견하며 자연스럽게 연결됩니다. **외모가 아닌 생각과 가치관으로
먼저 연결되는 것**을 지향합니다.

## 기술 스택

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Postgres, Row Level Security)

## 디자인 토큰

| 용도 | 값 |
| --- | --- |
| paper | `#EFE9DD` |
| paper-card | `#FBF8F2` |
| ink | `#2B2721` |
| ink-soft | `#756D5E` |
| line | `#DED4C0` |
| clay (accent) | `#A85639` |
| sage (accent) | `#66795E` |

폰트 — 질문(voice): Gowun Batang · 본문(body): IBM Plex Sans KR · 메타(mono): IBM Plex Mono

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. Supabase 프로젝트 준비

[supabase.com](https://supabase.com)에서 프로젝트를 만든 뒤:

1. SQL Editor에서 `supabase/migrations/0001_init.sql` 실행 (스키마 + RLS + 트리거)
2. 이어서 `supabase/seed.sql` 실행 (오늘부터 하루 한 개씩 질문 뱅크 등록)
3. Authentication > Providers 에서 Email 활성화

### 3. 환경 변수

`.env.example`을 복사해 `.env.local`을 만들고 값을 채웁니다 (Project Settings > API).

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 4. 개발 서버 실행

```bash
npm run dev
```

## MVP 범위 (1차 — 구현됨)

- [x] 오늘의 질문 노출 (전 유저 공통, 1일 1개, `publish_date` 기준)
- [x] 답변 작성 (최소 100자 · 최대 500자 검증) + 피드 게시
- [x] 피드: 성별 태그만 노출, 사진/나이 등 비공개
- [x] 다른 유저 답변 탐색 (본인 답변 작성 후 열람)
- [x] 좋아요/공감 (누른 여부만 표시, 총 개수는 항상 비공개)
- [x] 기본 신고 / 차단

## 2차 범위 (이후)

- [ ] 상호 좋아요 시 매칭 처리 + 상세 프로필 공개
- [ ] 매칭 후 1:1 채팅
- [ ] 얼굴 공개 요청/동의 플로우
- [ ] AI 기반 유해 발언 필터링

## 프라이버시 설계 원칙

- **성별만 공개**: 프로필의 나이·사진·지역 등은 매칭 전까지 API에서도 조회되지 않습니다.
- **인기 서열화 방지**: 받은 좋아요의 총 개수는 본인/타인 모두에게 비공개. 상대에게는
  "공감이 도착했다"는 사실만 표시됩니다.
- **생각 먼저**: 오늘의 질문에 답을 남긴 뒤에야 다른 사람의 답변을 볼 수 있습니다.

## 프로젝트 구조

```
src/
  app/
    (main)/            # 인증된 사용자용 화면 (하단 탭 네비)
      page.tsx         # 오늘의 질문 + 답변 작성
      feed/page.tsx    # 탐색 피드
      me/page.tsx      # 내 기록
    login/page.tsx     # 로그인 / 가입
    auth/callback/     # 이메일 확인 콜백
    actions.ts         # 서버 액션 (답변/좋아요/신고/로그아웃)
  components/          # QuestionCard, AnswerComposer, AnswerCard, Nav
  lib/
    supabase/          # 브라우저/서버/미들웨어 클라이언트
    data.ts            # 서버 데이터 조회
    types.ts, format.ts
supabase/
  migrations/0001_init.sql
  seed.sql
```

## 보안 참고

- 인증 세션은 미들웨어에서 갱신되며, 로그인하지 않은 요청은 `/login`으로 리다이렉트됩니다.
- 모든 테이블에 Row Level Security가 적용되어, 사용자는 자신의 데이터만 쓰기/삭제할 수
  있고 좋아요 총계 같은 민감 정보는 노출되지 않습니다.
- Next.js는 v14 라인의 최신 패치(14.2.x)를 사용합니다.