# Lynco Notion Workspace Setup (운영/개발/세일즈 공용)

목표: PRD/의사결정/카피/리서치를 분리하되, **서로 링크로 연결**되어 “왜 만들었는지”가 남도록 설계.

---

## 1) 권장 워크스페이스 구조(페이지 트리)

- **🏠 Lynco HQ (Home)**
  - **📌 Roadmap** (뷰: 이번 주/이번 달/다음)
  - **🧱 Product**
    - **PRD Database**
    - **Decisions Database**
  - **🧲 Growth**
    - **Copy Library Database**
    - **Research Log Database**
  - **📚 Playbooks**
    - Demo Script (8-step)
    - Onboarding Checklist
    - Security FAQ / Architecture Notes
  - **🗃️ Archive**

---

## 2) Database Schemas

아래는 Notion DB 속성(프로퍼티) 설계안입니다. 가능한 한 **관계(Relation) + 롤업(Rollup)** 으로 연결하세요.

### A) PRD Database (제품 요구사항)
**DB 이름:** `PRDs`

**권장 프로퍼티**
- `PRD` (Title) — 문서 제목
- `Status` (Select) — Draft / Review / Approved / In Progress / Shipped / Deprecated
- `Owner` (Person)
- `Squad/Team` (Select) — Web / Backend / Ops / Growth 등
- `Priority` (Select) — P0 / P1 / P2
- `Target Release` (Date)
- `Problem` (Text)
- `Success Metrics` (Text) — 예: 리드타임 -30%, 승인 지연 -50%
- `Scope (In)` (Text)
- `Scope (Out)` (Text)
- `Dependencies` (Text)
- `Risks` (Text)
- `Links` (URL)
- `Decisions` (Relation → Decisions)
- `Research` (Relation → Research Log)
- `Copy Assets` (Relation → Copy Library)

**권장 뷰**
- Board by `Status`
- Table (All)
- Calendar by `Target Release`
- “This Week” filter: Status = In Progress AND Target Release within 14 days

**템플릿(페이지 내부 섹션)**
- Context / Problem
- Users & Jobs-to-be-done
- Proposed Flow (Flow Map 링크)
- Functional Requirements
- Non-functional (Security, Multitenancy)
- Rollout Plan
- QA / Analytics

---

### B) Decisions Database (의사결정 로그)
**DB 이름:** `Decisions`

**권장 프로퍼티**
- `Decision` (Title)
- `Date` (Date)
- `Status` (Select) — Proposed / Accepted / Rejected / Superseded
- `Type` (Select) — Product / Tech / Design / GTM / Ops
- `Owner` (Person)
- `Context` (Text)
- `Decision` (Text)
- `Rationale` (Text)
- `Alternatives` (Text)
- `Consequences` (Text)
- `Related PRD` (Relation → PRDs)
- `Related Research` (Relation → Research Log)

**권장 뷰**
- Timeline by `Date`
- Board by `Status`
- “Accepted Only” filter

**운영 룰(짧게)**
- 논쟁이 30분 넘으면 Decision을 먼저 씁니다.
- 결론이 바뀌면 새 Decision을 만들고, 기존 것을 `Superseded` 처리.

---

### C) Copy Library Database (카피 라이브러리)
**DB 이름:** `Copy Library`

**권장 프로퍼티**
- `Asset` (Title) — 예: Hero Headline v3, FAQ Q5
- `Stage` (Select) — Awareness / Consideration / Conversion / Retention
- `Surface` (Select) — Landing / Deck / Email / In-app / Ads
- `Section` (Select) — Hero / How / Features / Lab / Security / FAQ / CTA
- `Tone` (Multi-select) — B2B / Bold / Minimal / Technical / Founder
- `Language` (Select) — KO / EN
- `Status` (Select) — Draft / In Review / Approved / Live / Archived
- `Primary Copy` (Text) — 실제 본문
- `Short Variant` (Text) — 1줄 버전
- `Notes` (Text)
- `Owner` (Person)
- `Source/Insight` (Relation → Research Log)
- `Related PRD` (Relation → PRDs)
- `Last Updated` (Last edited time)

**권장 뷰**
- “Landing Page” filter: Surface = Landing AND Status != Archived
- Board by `Section`
- “A/B 후보” filter: Status = Approved AND Notes contains “test”

---

### D) Research Log Database (리서치/인사이트)
**DB 이름:** `Research Log`

**권장 프로퍼티**
- `Item` (Title) — 인터뷰/콜/리서치 제목
- `Type` (Select) — Customer Call / Interview / Desk Research / Competitor / Support Ticket
- `Date` (Date)
- `Company` (Text)
- `Role` (Text) — CEO/CFO/RevOps 등
- `Pain Points` (Text)
- `Current Stack` (Text) — 스프레드시트/CRM/결제/회계
- `Quotes` (Text)
- `Insights` (Text)
- `Opportunity` (Text)
- `Confidence` (Select) — Low / Medium / High
- `Tags` (Multi-select) — Approval, Contract, Invoice, Reconciliation 등
- `Related PRD` (Relation → PRDs)
- `Related Copy` (Relation → Copy Library)
- `Attachments` (Files & media)

**권장 뷰**
- Table (All)
- Board by `Type`
- “High Confidence” filter
- “By Tag” view (group)

---

## 3) 최소 운영 루틴(주간)

- **월요일 30분:** Research Log 지난주 5개만 정리 → 관련 PRD/Copy 연결
- **수요일 20분:** Decisions 누락 여부 확인(큰 변경/결정은 반드시 기록)
- **금요일 30분:** Copy Library에서 `Live` 카피만 추려 ‘이번 주 배포본’ 스냅샷 생성

---

## 4) 랜딩 페이지(Next.js) 구현 연결 팁

- Notion의 `Copy Library`를 “단일 진실 소스”로 두고,
  - 섹션별 카피를 `Section`으로 구분
  - `Status=Live`인 항목만 Next.js에 반영
- 개발 단계에서는 `docs/landing-copy.md`를 기준으로 하드코딩 → 이후 Notion CMS로 확장
