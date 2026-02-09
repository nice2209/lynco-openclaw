import Link from "next/link";

import LeadCaptureForm from "@/components/LeadCaptureForm";

const valueChips = [
  "Sales → Cash 전 과정 자동화",
  "승인/계약/청구 누락 방지",
  "팀/고객사별 권한 분리",
];

const howSteps = [
  {
    title: "리드/딜 입력",
    description:
      "리드가 들어오면 필요한 정보만 정리해 다음 단계로 넘깁니다.",
  },
  {
    title: "견적·승인 자동화",
    description:
      "템플릿과 승인 규칙으로 견적을 빠르게 만들고, 승인 지연을 줄입니다.",
  },
  {
    title: "계약·청구·결제 연결",
    description:
      "계약서 생성부터 인보이스 발행, 결제까지 끊김 없이 이어집니다.",
  },
  {
    title: "정산·대시보드",
    description:
      "입금/미수/정산 상태가 한 화면에 모여, 결산 스트레스가 줄어듭니다.",
  },
];

const features = [
  {
    title: "견적 템플릿 & 버전 관리",
    description:
      "자주 쓰는 조건/가격/납기 문구를 템플릿으로 관리하고, 변경 이력을 남깁니다.",
  },
  {
    title: "승인 라우팅(금액/고객/조건 기반)",
    description:
      "규칙에 따라 승인 요청이 자동 배정되어, ‘누가 봐야 하죠?’가 사라집니다.",
  },
  {
    title: "계약 생성 & 전자서명 연동",
    description:
      "견적에서 계약으로 이어지는 정보를 재입력 없이 가져오고, 서명 단계까지 연결합니다.",
  },
  {
    title: "인보이스 발행 & 발송 자동화",
    description:
      "발행·발송·리마인드까지 한 번에. 미수 발생 전 선제적으로 관리합니다.",
  },
  {
    title: "결제 상태 추적(부분/분할/지연 포함)",
    description:
      "결제 이벤트를 기준으로 상태가 업데이트되어, 재무팀/영업팀 간 핑퐁이 줄어듭니다.",
  },
  {
    title: "정산·입금 매칭(리컨실리에이션)",
    description:
      "입금 내역과 거래를 맞춰보는 반복 작업을 줄이고, 누락 리스크를 낮춥니다.",
  },
  {
    title: "권한/역할 기반 접근제어(RBAC)",
    description:
      "팀/역할/고객사별로 접근 범위를 분리해, 정보 노출을 통제합니다.",
  },
  {
    title: "감사 로그 & 변경 추적",
    description:
      "누가/언제/무엇을 바꿨는지 기록되어, 운영 안정성과 내부 통제가 강화됩니다.",
  },
  {
    title: "운영 대시보드(매출·미수·전환·리드타임)",
    description:
      "KPI를 한 화면에서 확인하고, 병목이 어디인지 바로 드러납니다.",
  },
];

const labCards = [
  {
    title: "워크플로우 빌더",
    description:
      "“이 조건이면 이 단계로” 같은 규칙을 시각적으로 설계합니다.",
  },
  {
    title: "템플릿 스튜디오",
    description:
      "견적/계약/청구 문서 템플릿을 표준화해, 팀 전체 속도를 끌어올립니다.",
  },
  {
    title: "자동화 레시피(프리셋)",
    description:
      "자주 쓰는 자동화 패턴을 레시피로 저장해, 신규 멤버도 동일하게 일합니다.",
  },
];

const securityPoints = [
  "테넌트 분리(Multitenancy): 고객사/조직 단위로 데이터가 논리적으로 분리됩니다.",
  "역할 기반 권한(RBAC): 영업/재무/관리자 등 역할별 권한을 세밀하게 설정.",
  "감사 로그(Audit Log): 주요 이벤트/변경 이력을 추적 가능.",
  "데이터 보관/내보내기: 운영에 필요한 백업/내보내기 경로를 지원(정책에 맞춰 구성).",
  "보안 운영 프로세스: 권한 설계·온보딩·오프보딩 체크리스트 제공.",
];

const faqs = [
  {
    question: "Lynco는 어떤 팀에 가장 잘 맞나요?",
    answer:
      "견적과 계약이 반복되고, 인보이스/수금/정산에서 병목이 생기는 B2B 세일즈 조직에 특히 효과적입니다.",
  },
  {
    question: "지금도 스프레드시트로 운영 중인데, 바로 바꿔야 하나요?",
    answer:
      "아닙니다. 현재 프로세스를 기준으로 가장 병목이 큰 단계부터 연결해 시작할 수 있습니다.",
  },
  {
    question: "승인 플로우는 우리 회사 기준으로 커스터마이즈 가능한가요?",
    answer:
      "가능합니다. 금액/고객사/조건에 따른 승인 규칙을 설정해, 팀의 운영 방식에 맞게 구성합니다.",
  },
  {
    question: "전자서명/결제/회계 시스템과 연동되나요?",
    answer:
      "필요한 연동 범위를 기준으로 단계적으로 연결합니다. 데모에서 현재 사용 중인 스택을 확인 후 제안합니다.",
  },
  {
    question: "도입까지 얼마나 걸리나요?",
    answer:
      "기본 템플릿으로는 빠르게 시작할 수 있고, 승인/문서/정산 규칙이 복잡할수록 온보딩 설계가 중요합니다. 보통 우선순위 1~2개 흐름부터 론칭하는 방식이 가장 빠릅니다.",
  },
  {
    question: "데이터/권한은 어떻게 보호되나요?",
    answer:
      "멀티테넌시 분리, RBAC, 감사 로그 등 기본 보안 요소를 기반으로 운영 환경을 설계합니다.",
  },
  {
    question: "가격은 어떻게 책정되나요?",
    answer:
      "조직 규모, 사용 모듈, 연동 범위에 따라 달라집니다. 데모 요청 시 범위에 맞춰 안내드립니다.",
  },
];

const navLinks = [
  { label: "How it works", href: "#how" },
  { label: "Features", href: "#features" },
  { label: "Flow Map", href: "#flow" },
  { label: "Lynco Lab", href: "#lab" },
  { label: "Security", href: "#security" },
  { label: "FAQ", href: "#faq" },
];

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-[#0b1512] text-slate-100">
      <header className="sticky top-0 z-50 border-b border-emerald-500/10 bg-[#0b1512]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400 text-sm font-semibold text-emerald-950">
              L
            </span>
            <span className="text-lg font-semibold tracking-wide">Lynco</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                className="transition hover:text-emerald-200"
                href={link.href}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <Link
              className="rounded-full border border-emerald-400/40 px-4 py-2 text-sm text-emerald-100 transition hover:border-emerald-300 hover:text-white"
              href="#flow"
            >
              Flow Map 보기
            </Link>
            <Link
              className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
              href="#cta"
            >
              데모 요청
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section
          id="hero"
          className="relative overflow-hidden border-b border-emerald-500/10"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(20,90,64,0.45),_transparent_60%)]" />
          <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 py-20 md:flex-row md:items-center md:py-28">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs text-emerald-100">
                Lead → Cash 자동화 플랫폼
              </div>
              <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
                리드부터 정산까지, 하루 걸리던 일을 10분으로.
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-200">
                Lynco는 견적·승인·계약·청구·결제·정산을 한 흐름으로 연결해
                업무 속도를 올리고 누락을 줄입니다. 결국 창업자와 팀의 시간을
                매출에 더 가까운 일에 다시 투자하게 만듭니다.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="#cta"
                  className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
                >
                  데모 요청하기
                </Link>
                <Link
                  href="#flow"
                  className="rounded-full border border-emerald-400/40 px-6 py-3 text-sm text-emerald-100 transition hover:border-emerald-300 hover:text-white"
                >
                  8단계 플로우 보기
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {valueChips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-emerald-500/20 bg-[#0f1f19] px-4 py-1 text-xs text-emerald-100"
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <div className="mt-6 text-sm text-emerald-100/70">
                도입 상담 15분 · 내부 데이터/권한 설계 지원 · 현재 사용 중인
                스프레드시트/툴 기반으로도 시작 가능
              </div>
            </div>
            <div className="flex-1">
              <div className="rounded-3xl border border-emerald-500/20 bg-[#0f1d18] p-6 shadow-2xl shadow-emerald-900/30">
                <div className="flex items-center justify-between text-xs text-emerald-100/70">
                  <span>Live Flow Snapshot</span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-1">
                    8-Step Demo
                  </span>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-2xl border border-emerald-500/20 bg-[#0b1512] p-4">
                    <p className="text-emerald-200">승인 속도</p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      -42%
                    </p>
                    <p className="mt-1 text-xs text-emerald-100/70">
                      승인 지연 감소
                    </p>
                  </div>
                  <div className="rounded-2xl border border-emerald-500/20 bg-[#0b1512] p-4">
                    <p className="text-emerald-200">정산 리드타임</p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      3.1일
                    </p>
                    <p className="mt-1 text-xs text-emerald-100/70">
                      평균 10일 → 3일
                    </p>
                  </div>
                  <div className="rounded-2xl border border-emerald-500/20 bg-[#0b1512] p-4">
                    <p className="text-emerald-200">미수 리스크</p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      -28%
                    </p>
                    <p className="mt-1 text-xs text-emerald-100/70">
                      상태 추적 자동화
                    </p>
                  </div>
                  <div className="rounded-2xl border border-emerald-500/20 bg-[#0b1512] p-4">
                    <p className="text-emerald-200">팀 집중도</p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      +2.4x
                    </p>
                    <p className="mt-1 text-xs text-emerald-100/70">
                      반복 업무 감소
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between rounded-2xl border border-emerald-500/10 bg-[#10231c] px-4 py-3 text-xs text-emerald-100/80">
                  <span>Next Action: Contract & Invoice sync</span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-1">
                    running
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how" className="border-b border-emerald-500/10">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-emerald-200">
                How it works
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-white">
                흐름만 연결하면, 속도는 자동으로 따라옵니다.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-200">
                툴을 하나 더 추가하는 게 아니라, 흩어진 업무를 한 플로우로
                묶어 반복 작업을 없앱니다.
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {howSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-emerald-500/20 bg-[#0f1d18] p-6"
                >
                  <div className="flex items-center gap-3 text-sm text-emerald-200">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-sm font-semibold text-emerald-950">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-white">
                      {step.title}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-200">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="bg-[#0f1a16]">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-emerald-200">
                Features
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-white">
                속도는 기능이 아니라, 설계에서 나옵니다.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-200">
                Lynco는 “문서”가 아니라 “흐름”을 기준으로 설계되어,
                단계마다 필요한 자동화가 자연스럽게 붙습니다.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-emerald-500/20 bg-[#0b1512] p-6"
                >
                  <h3 className="text-base font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-200">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="flow" className="border-y border-emerald-500/10">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.05fr_1fr]">
            <div>
              <p className="text-sm font-semibold text-emerald-200">Flow Map</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">
                리드 → 매출까지의 실제 경로를 한 장으로.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-200">
                Flow Map은 단계의 입력과 출력을 고정하고, 핸드오프 지점을
                명확히 해 반복되는 일을 자동화할 수 있는 지점을 찾습니다.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-200">
                <li>
                  “한 번 입력 → 끝까지 재사용”: 견적 정보가 계약/인보이스/정산까지
                  이어집니다.
                </li>
                <li>
                  “상태가 한 곳에서 정의됨”: 누가 어떤 단계에 있는지 팀 전체가
                  동일하게 봅니다.
                </li>
                <li>
                  “승인 지연이 비용”: 승인 시간을 줄이는 것이 곧 매출 회수
                  속도입니다.
                </li>
                <li>
                  “창업자 시간 회복”: 운영 확인 시간을 의사결정·세일즈·채용에
                  다시 씁니다.
                </li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="#cta"
                  className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
                >
                  데모 요청하기
                </Link>
                <Link
                  href="#features"
                  className="rounded-full border border-emerald-400/40 px-6 py-3 text-sm text-emerald-100 transition hover:border-emerald-300 hover:text-white"
                >
                  자동화 기능 보기
                </Link>
              </div>
            </div>
            <FlowMapGraphic />
          </div>
        </section>

        <section id="lab" className="bg-[#0f1a16]">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-emerald-200">Lynco Lab</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">
                Lynco Lab: 우리 회사 방식으로 자동화를 ‘실험’하고, 바로 적용합니다.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-200">
                회사마다 승인 기준, 계약 템플릿, 청구 주기가 다릅니다. Lynco Lab은
                그 차이를 코드 없이(또는 최소한으로) 반영할 수 있게 돕는 실험실입니다.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {labCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-emerald-500/20 bg-[#0b1512] p-6"
                >
                  <h3 className="text-base font-semibold text-white">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-200">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm text-emerald-100/80">
              자동화는 ‘큰 프로젝트’가 아니라, 작은 개선을 빠르게 반복할 때 가장
              강력합니다.
            </p>
          </div>
        </section>

        <section id="security" className="border-y border-emerald-500/10">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-emerald-200">
                Security & Multitenancy
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-white">
                보안과 분리는 기본값. 운영은 더 가볍게.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-200">
                B2B 운영에서 중요한 건 ‘기능’만이 아니라 신뢰입니다. Lynco는
                멀티테넌시 환경에서도 데이터와 권한을 안전하게 분리하도록 설계합니다.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {securityPoints.map((point) => (
                <div
                  key={point}
                  className="rounded-2xl border border-emerald-500/20 bg-[#0f1d18] p-5 text-sm text-slate-200"
                >
                  {point}
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-emerald-100/70">
              보안 체크리스트/아키텍처 설명 자료는 데모 후 공유 가능합니다.
            </p>
          </div>
        </section>

        <section id="faq" className="bg-[#0f1a16]">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-emerald-200">FAQ</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">
                가장 자주 묻는 질문
              </h2>
            </div>
            <div className="mt-10 space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-emerald-500/20 bg-[#0b1512] p-6"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold text-white">
                    {faq.question}
                    <span className="ml-4 text-emerald-200 transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-sm leading-6 text-slate-200">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.25),_transparent_70%)]" />
          <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-20 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="text-sm font-semibold text-emerald-200">Final CTA</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">
                업무를 더 늘리기 전에, 흐름부터 정리하세요.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-200">
                속도와 정확도가 올라가면, 결국 창업자가 해야 할 일은 ‘관리’가 아니라
                의사결정과 성장으로 돌아옵니다.
              </p>
              <p className="mt-4 text-sm text-emerald-100/70">
                데모에서 귀사 플로우(리드→정산)를 함께 그려드립니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="#cta"
                className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
              >
                데모 요청하기
              </Link>
              <Link
                href="#flow"
                className="rounded-full border border-emerald-400/40 px-6 py-3 text-sm text-emerald-100 transition hover:border-emerald-300 hover:text-white"
              >
                Flow Map 먼저 보기
              </Link>
            </div>
          </div>
        
          <div className="relative mx-auto flex max-w-6xl justify-start px-6 pb-24">
            <LeadCaptureForm />
          </div>
</section>
      </main>
    </div>
  );
}

function FlowMapGraphic() {
  return (
    <div className="relative rounded-3xl border border-emerald-500/20 bg-[#0f1d18] p-6 shadow-xl shadow-emerald-900/20">
      <div className="flex items-center justify-between text-xs text-emerald-100/70">
        <span>8-Step Demo Flow</span>
        <span className="rounded-full bg-emerald-500/20 px-2 py-1">prototype</span>
      </div>
      <svg
        viewBox="0 0 800 260"
        className="mt-6 h-64 w-full"
        role="img"
        aria-label="Flow map showing nodes from lead to dashboard with a highlighted handoff bottleneck"
      >
        <defs>
          <linearGradient id="flowLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#34d399" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          d="M60 70 L200 70 L340 70 L470 120 L620 150 L740 150 L640 230 L460 230 L280 230"
          fill="none"
          stroke="url(#flowLine)"
          strokeWidth="3"
        />
        <path
          d="M60 70 L200 70 L340 70 L470 120 L620 150 L740 150 L640 230 L460 230 L280 230"
          fill="none"
          stroke="#34d399"
          strokeOpacity="0.65"
          strokeWidth="2"
          strokeDasharray="8 12"
          className="animate-[flow_8s_linear_infinite]"
        />
        <FlowNode cx={60} cy={70} label="Lead" />
        <FlowNode cx={200} cy={70} label="Quote" />
        <FlowNode cx={340} cy={70} label="Approval" />
        <FlowNode cx={470} cy={120} label="핸드오프" highlight />
        <FlowNode cx={620} cy={150} label="Contract" />
        <FlowNode cx={740} cy={150} label="Invoice" />
        <FlowNode cx={640} cy={230} label="Payment" />
        <FlowNode cx={460} cy={230} label="Recon" />
        <FlowNode cx={280} cy={230} label="Dashboard" />
      </svg>
      <div className="mt-4 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-100">
        “핸드오프” 구간에서 승인 지연과 재입력이 발생하기 쉬워 자동화
        우선순위가 됩니다.
      </div>
    </div>
  );
}

type FlowNodeProps = {
  cx: number;
  cy: number;
  label: string;
  highlight?: boolean;
};

function FlowNode({ cx, cy, label, highlight }: FlowNodeProps) {
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={highlight ? 18 : 16}
        className={
          highlight
            ? "fill-amber-300/90 stroke-amber-200 animate-pulse"
            : "fill-emerald-400/90 stroke-emerald-200"
        }
        strokeWidth="2"
      />
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        className={
          highlight
            ? "fill-amber-900 text-[11px] font-semibold"
            : "fill-emerald-950 text-[11px] font-semibold"
        }
      >
        {label}
      </text>
    </g>
  );
}

