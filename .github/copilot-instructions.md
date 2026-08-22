# Copilot Instructions (Daily Values Question and Empathy)

> GitHub Copilot이 이 저장소의 모든 대화에 자동으로 로드하는 지침서입니다.
> AI 어시스턴트와 사람이 함께 보는 단일 원본입니다.

---

## 1. 코딩 철학 (Andrej Karpathy 스타일)

> 아래는 Karpathy가 공개적으로 밝혀온 코딩 취향(nanoGPT, micrograd 등에서 드러난 원칙)을 이 저장소에 맞게 정리한 것입니다.

- **단순함이 최우선.** 가장 단순하게 동작하는 코드를 써라. 영리함보다 명확함(explicit > clever).
- **작은 diff.** 요청받은 것만 바꿔라. 관련 없는 리팩터링/포매팅/"개선"을 끼워 넣지 마라.
- **조기 추상화 금지.** 한 번 쓰는 로직에 헬퍼/레이어/제네릭을 만들지 마라. 두세 번 반복될 때 추출하라.
- **에러를 삼키지 마라.** 광범위한 `try/catch`로 조용히 무시하지 말 것. 실패는 경계(boundary)에서만, 눈에 보이게 처리.
- **방어 코드 최소화.** 일어날 수 없는 케이스를 검증하지 마라. 입력은 시스템 경계에서만 검증.
- **읽기 쉬운 이름.** 짧지만 의미 있는 변수/함수명. 주석은 "왜"만 한 줄로. 코드가 말하는 걸 반복 설명하지 마라.
- **의존성 추가에 보수적.** 새 npm 패키지를 넣기 전에 표준 라이브러리/기존 유틸로 되는지 먼저 확인.
- **함수는 짧게.** 한 함수는 한 가지 일. 깊은 중첩보다 이른 return.
- **동작하는 것을 먼저, 그다음 다듬기.** 하지만 커밋 전엔 반드시 정리된 상태로.

---

## 2. 프로젝트 개요 — Daily Values

매일 하나의 **가치관·취향 질문**에 서로가 진솔하게 답하고, 그 답들을 **존중하며 바라봐주는 것**에서
시작하는 앱. 속마음을 나누며 안정감을 느끼고, 때로는 이성 간에 설렘을 느끼기도 한다.
**서로 얼굴을 모르는 채 오직 내면으로만 대화한다** — 외모가 아닌 생각과 가치관으로 먼저
연결되는 경험을 지향한다.

- **정서적 목표:** 진솔함 · 존중 · 안정감 · (때로는) 설렘. 서열화·평가·전시가 아니라
  서로의 속마음을 안전하게 나누는 공간이다. 기능/카피/데이터 설계 모두 이 톤을 지켜라.
- **핵심 원칙:** 오늘의 질문에 답을 남긴 뒤에야 다른 사람의 답변을 볼 수 있다 (생각 먼저).
- **얼굴 없는 대화:** 매칭 전까지는 얼굴/사진을 모르는 상태가 기본값이다. 이 익명의 안전함이
  진솔함을 만든다 — 이를 깨는 노출을 기본 동작으로 넣지 마라.
- **웹:** Vercel 배포 대상 Next.js 14 (App Router).

---

## 3. 아키텍처 & 구조

단일 Next.js 앱. Supabase(Auth + Postgres + RLS)가 백엔드 전부.

```
src/
  middleware.ts        인증 세션 갱신 · 미로그인 → /login 리다이렉트
  app/
    layout.tsx         루트 레이아웃 (폰트/글로벌 스타일)
    globals.css        Tailwind + 디자인 토큰
    actions.ts         서버 액션 (답변/좋아요/신고/로그아웃)
    (main)/            인증된 사용자 화면 (하단 탭 네비)
      page.tsx         오늘의 질문 + 답변 작성
      feed/page.tsx    탐색 피드
      me/page.tsx      내 기록
    login/page.tsx     로그인 / 가입
    auth/callback/     이메일 확인 콜백 (route.ts)
  components/          QuestionCard, AnswerComposer, AnswerCard, Nav
  lib/
    supabase/          client(브라우저) · server · middleware 클라이언트
    data.ts            서버 데이터 조회 (server-only)
    session.ts         뷰어 식별 · PREVIEW_MODE (server-only)
    types.ts           공유 타입 + 검증 상수
    format.ts          날짜/표시 포매터
supabase/
  migrations/0001_init.sql   스키마 + RLS + 트리거
  seed.sql                   질문 뱅크 시드
scripts/
  check-supabase.mjs   Supabase 연결 점검
```

```
브라우저 (Client Components)
  → Server Actions / Server Components (Next.js)
      → Supabase (Auth · Postgres · Row Level Security)
```

### 서버/클라이언트 경계 (중요)
- `src/lib/data.ts`, `src/lib/session.ts`는 `import "server-only"`. 클라이언트로 import 금지.
- 서버 액션(`actions.ts`)은 `"use server"`. 데이터 쓰기는 여기 또는 서버 컴포넌트에서만.
- `src/lib/supabase/server.ts`(서버)와 `client.ts`(브라우저)를 상황에 맞게 구분해서 써라.
- 컴포넌트가 상호작용/상태를 쓰면 `'use client'`, 아니면 기본 서버 컴포넌트로 둔다.

---

## 4. 개발 워크플로우 (명령어)

항상 **저장소 루트**에서 실행.

| 명령 | 용도 |
|---|---|
| `npm run dev` | 개발 서버 (localhost:3000) |
| `npm run build` | 프로덕션 빌드 |
| `npm run lint` | ESLint (next core-web-vitals) |
| `npm run start` | 빌드 결과 실행 |
| `node scripts/check-supabase.mjs` | Supabase 연결/스키마 점검 |

- **로컬 UI만 빠르게 확인:** `.env.local`에 `NEXT_PUBLIC_PREVIEW=true`를 두면 인증을 건너뛰고
  목 데이터로 렌더링된다 (`src/lib/session.ts`의 `PREVIEW_MODE`). 실제 DB 없이 화면 확인용.
- **DB 초기 세팅:** Supabase SQL Editor에서 `supabase/migrations/0001_init.sql` → `supabase/seed.sql` 순서로 실행.

---

## 5. 컨벤션 & 알려진 함정

- **언어:** UI 텍스트·주석은 한국어, 코드 식별자는 영어.
- **타입:** TypeScript strict. `any` 지양. 공유 타입/상수는 `src/lib/types.ts`.
- **커밋 전:** `npm run lint`와 `npm run build`가 통과해야 한다.
- **마이그레이션:** `supabase/migrations/NNNN_*.sql` 번호를 순서대로. 새 파일은 다음 번호를 이어서.
- **검증은 한 곳에서만 늘리지 말 것:** 답변 길이 규칙(100~500자)은 `types.ts` 상수
  (`ANSWER_MIN_LENGTH`/`ANSWER_MAX_LENGTH`)와 DB `check` 제약 **양쪽**에 있다. 값을 바꾸면 둘 다 맞춰라.
- **중복 답변:** `answers`는 `(user_id, question_id)` unique. 서버 액션은 Postgres 에러
  코드 `23505`를 "이미 답변함"으로 처리한다.
- **오늘의 질문:** `publish_date` 기준 하루 1개. 날짜 키는 `src/lib/format.ts`의 `todayKey()`.
- **캐시 무효화:** 답변/좋아요 등 mutation 후 관련 경로를 `revalidatePath`로 갱신 (`/`, `/feed`, `/me`).

---

## 6. 프라이버시 설계 원칙 (제품의 핵심 — 절대 위반 금지)

- **얼굴 없는 대화가 기본값.** 매칭 전까지 얼굴/사진은 어디에서도 노출되지 않는다. 이 익명의
  안전함이 진솔함을 만든다. 사진/실명을 기본으로 드러내는 기능을 넣지 마라.
- **성별만 공개.** 프로필의 나이·사진·지역 등은 매칭 전까지 API/쿼리에서도 조회되지 않는다.
  새 쿼리/타입에 비공개 필드를 노출하지 마라 (`FeedAnswer`는 `author_gender`만 공개).
- **존중 우선, 서열화 금지.** 받은 좋아요의 **총 개수는 본인/타인 모두에게 비공개.** 상대에게는
  "공감이 도착했다"는 사실만 표시한다. count·랭킹·인기 지표를 노출하는 쿼리/집계를 추가하지 마라.
- **생각 먼저.** 오늘 질문에 답을 남긴 뒤에야 다른 사람의 답변을 열람할 수 있다.
- **RLS가 방어선.** 모든 테이블에 Row Level Security가 적용된다. 클라이언트 쿼리로 우회 가능한
  민감 데이터 노출을 만들지 말고, 접근 규칙은 마이그레이션의 RLS 정책으로 강제하라.

---

## 7. 환경변수

`.env.example`을 복사해 `.env.local`을 만들고 값을 채운다 (Supabase Project Settings > API).

| 키 | 용도 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL (필수) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon 키 (필수) |
| `NEXT_PUBLIC_PREVIEW` | `true`면 인증 없이 목 데이터 렌더링 (선택, 로컬 UI 확인용) |

> `NEXT_PUBLIC_` 접두사는 브라우저에 노출된다. 시크릿(service role 키 등)에는 절대 이 접두사를
> 붙이지 말고, 어떤 시크릿도 커밋하지 마라.
