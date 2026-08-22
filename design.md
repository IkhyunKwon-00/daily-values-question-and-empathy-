# Daily Values Design System

> 이 문서는 Daily Values 앱의 디자인 시스템 원본(single source of truth)입니다.
> 토큰·컴포넌트·상태는 실제 코드(`tailwind.config.ts`, `globals.css`, `src/components/*`)와
> 1:1로 일치해야 합니다. 값을 바꾸면 코드와 이 문서를 **양쪽 모두** 갱신하세요.

<!-- design-md:section experience -->
## 1. Experience

### Visual Theme & Atmosphere

Daily Values는 **얼굴 없이 가치관과 취향으로 먼저 연결되는** 앱입니다. 톤은
**진솔함 · 따뜻함**이 바탕이고, 그 위에 **20대 중반–30대 초반이 매일 쓰고 싶은
현대적 감각**을 얹습니다. 참조 UX는 두 축입니다.

- **인스타그램** — 상단 스토리 스트립(카테고리), 큰 여백, 카드 중심 피드, 아이콘 탭바,
  중앙의 강한 "작성" 진입점.
- **틴더** — 한 장 한 장 넘겨보는 듯한 **몰입형 큰 카드**, 카드 하단의 크고 명확한
  액션(공감), 부드러운 그라디언트 강조.

메모장/포스트잇의 따뜻함은 **종이 질감의 베이스 색**과 **본문용 명조(Gowun Batang)**
질문 타이포로 유지하되, 카드·버튼·탭은 밝은 화이트 서피스 + 선명한 코럴 그라디언트로
**2020년대 모바일 감각**을 냅니다. 낡은 인상(꽉 찬 테두리, 작은 회색 텍스트, 평평한
버튼)은 배제합니다.

### Do's and Don'ts

### Do
- 카드는 **넓은 패딩 · 큰 라운드(20–28px) · 부드러운 그림자**로 띄워라.
- 주요 액션(작성·공감·보내기)은 **ember 그라디언트 + 흰 텍스트 + pop 그림자**로 하나의
  강한 위계만 부여하라.
- 질문 텍스트는 **명조(voice)** 로, UI/본문은 **산세(body)** 로 구분하라.
- 카테고리는 **고유 강조색**(사랑/취미/가치관/꿈)으로 즉시 구별되게 하라.
- 탭·버튼·카드에 **150–220ms ease-out 트랜지션**과 **눌림 시 scale 축소**를 넣어 촉각을 줘라.

### Don't
- 꽉 찬 회색 테두리 박스, 12px 이하 회색 본문, 각진 버튼 같은 **올드한 패턴**을 쓰지 마라.
- 강조색을 여러 버튼에 남발해 **위계를 흐리게** 만들지 마라(primary는 화면당 소수).
- 좋아요 **총 개수·랭킹·인기 지표**를 카드나 프로필에 노출하지 마라(제품 원칙 위반).
- 매칭 전 **얼굴/사진/실명**을 드러내는 UI를 기본값으로 만들지 마라. 성별만 공개.
- 프리뷰 목데이터 톤을 벗어난 자극적/평가적 카피를 쓰지 마라.

### Brand Narrative

하루 한 개의 질문에 진솔하게 답하고, 그 답을 존중하며 바라본다. 외모가 아니라 생각으로
연결되는 안전한 공간. 디자인은 이 서사를 **따뜻한 종이 위의 현대적 카드**로 번역한다 —
느리게 읽고 싶은 질문(명조), 가볍게 넘겨보는 피드(카드 스택), 마음이 닿으면 누르는
따뜻한 공감(코럴 하트).

### Principles

1. **따뜻하되 현대적으로.** 종이 베이스 + 명조 질문으로 온기를 지키되, 서피스·액션은
   밝고 선명하게. *UI 함의:* 카드 배경은 near-white, 강조는 ember 그라디언트.
2. **한 화면에 하나의 강한 액션.** 인스타/틴더처럼 다음 행동이 명확해야 한다.
   *UI 함의:* primary 버튼은 화면당 하나. 나머지는 ghost/텍스트.
3. **프라이버시가 미학보다 우선.** 익명성·비서열화는 스타일보다 앞선다.
   *UI 함의:* 성별 칩만, 카운트/랭킹 금지, 얼굴 없음이 기본.
4. **촉각적 피드백.** 탭은 반응해야 살아있다. *UI 함의:* transition + active:scale + 하트 pop.

### Personas
- **매일 기록가(26–31세)** — 오늘의 질문에 5분 안에 답을 남기고 싶다. 중앙 작성 버튼이 명확해야 한다.
- **밤의 탐색가** — 자기 전 남의 생각을 카드로 넘겨보며 공감을 남긴다. 몰입형 카드 피드가 필요.
- **조심스러운 연결자** — 마음이 닿은 사람에게 부담 없이 쪽지를 건넨다. 얼굴 없는 안전함이 전제.

<!-- design-md:section foundations -->
## 2. Foundations

### Color Palette & Roles

베이스는 따뜻한 종이(그레이가 아닌 크림), 서피스는 near-white, 강조는 코럴→로즈 그라디언트.

| Role | Token | Value | Usage |
| --- | --- | --- | --- |
| Canvas | `paper` | `#F5F0E8` | 앱 배경(따뜻한 크림) |
| Surface | `paper-card` | `#FFFDF9` | 카드·시트·입력 필드 배경 |
| Ink | `ink` | `#241F1A` | 본문·제목 기본 텍스트 |
| Ink soft | `ink-soft` | `#8A8073` | 보조/메타 텍스트 |
| Line | `line` | `#ECE4D6` | 구분선·저강조 테두리 |
| Primary | `clay` | `#F0623C` | 주요 액션·활성 강조(코럴) |
| Primary deep | `clay-deep` | `#D8452A` | 그라디언트 하단/눌림 톤 |
| Calm accent | `sage` | `#5E8A6E` | 보조 강조·성공/공감 완료 |
| Category 사랑 | `rose` | `#E8506E` | 카테고리 강조 |
| Category 취미 | `sage` | `#5E8A6E` | 카테고리 강조 |
| Category 가치관 | `amber` | `#D98A2B` | 카테고리 강조 |
| Category 꿈 | `indigo` | `#6C7BB8` | 카테고리 강조 |

**Gradient**

| Token | Value | Usage |
| --- | --- | --- |
| `bg-ember` | `linear-gradient(135deg,#FF8A4C 0%,#F0623C 48%,#E8506E 100%)` | primary 버튼, 중앙 작성 FAB, 활성 하트, 내 메시지 버블 |

### Radius

| Token | Value | Usage |
| --- | --- | --- |
| `rounded-2xl` | 1rem (16px) | 입력 필드, 작은 칩 컨테이너 |
| `rounded-xl2` | 1.5rem (24px) | 표준 카드 |
| `rounded-xl3` | 2rem (32px) | 몰입형 탐색 카드, 시트 |
| `rounded-full` | pill | 버튼, 칩, 아바타, 탭 |

### Depth & Elevation

| Token | Value | Usage |
| --- | --- | --- |
| `shadow-soft` | `0 1px 3px rgba(36,31,26,.06)` | 저강조 요소, 칩 |
| `shadow-card` | `0 2px 8px rgba(36,31,26,.05), 0 14px 34px rgba(36,31,26,.08)` | 카드 기본 떠 있음 |
| `shadow-pop` | `0 10px 30px rgba(240,98,60,.30)` | ember 버튼/FAB 강조 |

### Motion & Easing

- 기본: `transition` 150–220ms, `ease-out`.
- 탭/버튼 눌림: `active:scale-95`.
- 하트 공감: 채워질 때 `animate-pop`(scale 1→1.25→1, 260ms).
- 카드 진입: `hover:-translate-y-0.5`(포인터 환경 한정).

### Spacing & Layout Rhythm

- 모바일 폭: 본문 컨테이너 `max-w-xl`, 좌우 패딩 16px.
- 카드 간격: 수직 16px(`space-y-4`).
- 카드 내부 패딩: 20–24px.
- 하단 탭바 높이 확보를 위해 본문 하단 패딩 `pb-28`.

<!-- design-md:section typography-assets -->
## 3. Typography & Assets

### Font Families

| Token | Stack | 용도 |
| --- | --- | --- |
| `font-voice` | `"Gowun Batang", serif` | **질문 텍스트** 전용. 느리게 읽는 온기. |
| `font-body` | `"IBM Plex Sans KR", system-ui` | UI·본문·버튼·라벨 기본. |
| `font-mono` | `"IBM Plex Mono", ui-monospace` | 메타(시간·성별 이니셜·상태). |

### Type Scale

| 이름 | 크기/행간/굵기 | 폰트 | 용도 |
| --- | --- | --- | --- |
| Display | 30–34 / 1.2 / 700 | voice | 페이지 히어로 질문 |
| H1 | 24–26 / 1.35 / 700 | voice/body | 페이지 타이틀 |
| Question | 19–22 / 1.4 / 500 | voice | 카드 내 질문 |
| Body | 15–16 / 1.7 / 400 | body | 답변·메시지 본문 |
| Label | 14 / 1.4 / 600 | body | 버튼·칩 |
| Meta | 12–13 / 1.4 / 500 | mono | 시간·성별·상태 |

### Asset Boundary
- 브랜드 폰트는 Gowun Batang(질문)·IBM Plex(본문/모노)로 한정. 임의 시스템 폰트로
  대체하며 브랜드 폰트로 라벨링하지 마라.
- 사진/일러스트 아바타는 사용하지 않는다(익명 원칙). 아바타는 **성별 이니셜 + 톤 배경**.

<!-- design-md:section components-states -->
## 4. Components & States

### Button — Primary (ember)
- 배경: `bg-ember` 그라디언트 · 텍스트 `#FFFFFF`
- 라운드: full · 패딩: 12px 22px · 폰트: 14–15 / 600 body
- 그림자: `shadow-pop` · 상태: `hover:brightness-105`, `active:scale-95`, `disabled:opacity-50`
- 용도: 답변 게시, 저장, 쪽지 보내기 등 화면당 단일 주요 액션.

### Button — Ghost
- 배경: 투명 · 텍스트 `ink-soft` · 테두리 `1px line`
- 라운드: full · `hover:bg-line/40`, `active:scale-95`
- 용도: 취소·부차 액션·"쪽지" 진입 등.

### Card (standard)
- 배경: `paper-card` · 라운드: `xl2(24px)` · 그림자: `shadow-card` · 테두리 없음(또는 hairline)
- 패딩: 20–24px · 상단 4px 카테고리 그라디언트 악센트(선택).

### Explore Card (immersive, Tinder-like)
- 배경: `paper-card` · 라운드: `xl3(32px)` · 그림자: `shadow-card` · `hover:-translate-y-0.5`
- 상단: 카테고리 칩(고유색 pill) + 상대시간 메타
- 본문: 질문(voice 18–20) → 답변(body 15–16, 최대 6줄 클램프)
- 하단 액션: 성별 아바타 + **공감 하트 버튼**(비활성 `♡` 라인, 활성 `♥` ember + `animate-pop`)

### Bottom Tab Bar (Instagram-like)
- 컨테이너: 상단 hairline, `paper-card/90` + `backdrop-blur`, sticky bottom
- 항목 5개: 탐색 · 관심 · **오늘(중앙 작성)** · 쪽지 · 기록
- 아이콘: 라인 SVG, 활성 시 `ink`/채움, 비활성 `ink-soft`
- 중앙 "오늘": **ember 원형 FAB(56px)** 로 살짝 떠 있게(`-mt-6`, `shadow-pop`) — 작성 진입

### Category Story Strip (Instagram stories-like)
- 피드 상단 가로 스크롤 칩: `전체` + 카테고리들. 선택 시 ember 링/채움.
- 기능: 클라이언트 사이드 카테고리 필터.

### Chip (category)
- 라운드 full · 패딩 2px 10px · 폰트 12/600 · 배경 `색/12%` · 텍스트 해당 색.

### Input / Field
- 배경 `paper-card` · 라운드 `2xl` · 패딩 12–16px · 포커스 `ring-2 ring-clay/40` + `border-clay`.

### Message Bubble
- 내 메시지: `bg-ember` 흰 텍스트, 우측 정렬, 라운드 `2xl`(꼬리쪽 살짝 작게 가능)
- 상대: `paper-card` + hairline, 좌측 정렬.

### States

| 상태 | 정의 |
| --- | --- |
| Default | 위 각 컴포넌트 기본 스타일 |
| Hover(포인터) | 카드 `-translate-y-0.5`, 버튼 `brightness-105` |
| Pressed | `active:scale-95` |
| Disabled | `opacity-50`, `cursor-not-allowed` |
| Loading | 버튼 텍스트를 "…/게시 중…"으로 치환 |
| Empty | 카드형 안내 + 다음 행동 유도 문구 |
| Success/공감완료 | 하트 ember 채움 + pop, "공감함" 톤(sage) |

<!-- design-md:section layout-platforms -->
## 5. Layout & Platforms

### Layout Principles
- 단일 컬럼, 모바일 우선(`max-w-xl`). 카드 스택으로 위계를 만든다.
- 페이지 상단: 큰 타이틀(선택) + 한 줄 서브카피. 그 아래 콘텐츠 카드.
- 하단 고정 탭바가 항상 다음 행동을 노출.

### Responsive Behavior
- 기준 모바일 360–430px. `md` 이상에서 탭바는 상단으로 이동 가능하나, 기본은 하단.
- 데스크톱에서도 콘텐츠 폭은 `max-w-xl` 유지(읽기 리듬 보존).

<!-- design-md:section content-locales -->
## 6. Content & Locales

### Voice & Tone
- UI 텍스트/카피는 **한국어**, 코드 식별자는 영어.
- 따뜻하고 담백하게. 평가·서열·과장을 배제("인기", "랭킹", "베스트" 금지).

| Do | Don't |
| --- | --- |
| "마음이 머무는 답에 공감을 남겨보세요." | "가장 인기 있는 답변 TOP 10" |
| "얼굴을 모르는 채, 생각으로 이어진 사이" | 얼굴/외모를 전제한 카피 |
| "공감이 도착했어요"(사실만) | "좋아요 32개 받음"(카운트 노출) |

<!-- design-md:section governance -->
## 7. Governance

### Agent Prompt Guide
- 새 UI는 **따뜻한 종이 베이스 + near-white 카드 + ember 그라디언트 강조 + 명조 질문**을
  기본으로 구성한다.
- 주요 액션은 화면당 하나의 ember primary로. 카테고리는 고유색 칩으로 구별.
- 좋아요 총계·랭킹·얼굴/사진을 노출하는 컴포넌트를 만들지 마라(제품 원칙 우선).
- 모션은 150–220ms ease-out + active:scale, 하트 pop을 표준으로 한다.

### Application Priority
1. 사용자의 직접 지시(요청 범위)
2. 저장소 사실(`.github/copilot-instructions.md`, 실제 코드)
3. 이 디자인 시스템 문서
4. 참조 영감(인스타그램/틴더 등)

### Changes
토큰·컴포넌트를 바꾸면 코드와 이 문서를 함께 갱신하고, 프라이버시 원칙 위반이 없는지
먼저 검토한다.
