"use client";

import { useState, type ReactNode } from "react";
import {
  Bell,
  Bookmark,
  Compass,
  Heart,
  Home,
  MessageCircle,
  MoreHorizontal,
  PenLine,
  UserRound,
} from "lucide-react";
import BrandMark from "@/components/layout/BrandMark";
import {
  AnswerCard,
  Avatar,
  BottomNavigation,
  BottomSheet,
  Button,
  CommentButton,
  EmptyState,
  ExploreCard,
  IconButton,
  LikeButton,
  LoadingState,
  Modal,
  ProfileHeader,
  QuestionCard,
  Tag,
  Toast,
  TopNavigation,
} from "@/components/ui";

function ComponentSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-10">
      <p className="mb-5 text-xs font-semibold uppercase text-clay">{title}</p>
      {children}
    </section>
  );
}

export default function DesignSystemShowcase() {
  const [liked, setLiked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const navigationItems = [
    { href: "/design-system#navigation", label: "홈", icon: <Home />, active: true },
    { href: "/design-system#cards", label: "탐색", icon: <Compass /> },
    { href: "/design-system#question", label: "오늘", icon: <PenLine /> },
    { href: "/design-system#feedback", label: "대화", icon: <MessageCircle /> },
    { href: "/design-system#profile", label: "기록", icon: <UserRound /> },
  ];

  return (
    <div className="min-h-dvh bg-paper pb-16">
      <TopNavigation
        sticky={false}
        leading={<BrandMark />}
        actions={<IconButton label="알림" icon={<Bell />} />}
        className="border-b border-line/70"
      />

      <main className="mx-auto w-full max-w-3xl px-5 sm:px-8">
        <header className="max-w-2xl pb-10 pt-14 sm:pt-20">
          <Tag tone="accent">Design System</Tag>
          <h1 className="mt-5 text-4xl font-bold leading-tight text-ink sm:text-5xl">
            생각이 먼저 보이는 인터페이스
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft">
            따뜻한 노란색은 중요한 순간에만 사용하고, 넉넉한 여백과 읽기 좋은
            타이포그래피로 사람의 생각에 집중합니다.
          </p>
        </header>

        <div className="divide-y divide-line/60">
          <ComponentSection id="actions" title="Actions">
            <div className="flex flex-wrap items-center gap-3">
              <Button>답변 남기기</Button>
              <Button variant="secondary">다음에 하기</Button>
              <Button variant="ghost">취소</Button>
              <Button loading>저장 중</Button>
              <Button disabled>비활성</Button>
              <IconButton label="저장" icon={<Bookmark />} />
              <LikeButton liked={liked} onClick={() => setLiked((value) => !value)} />
              <CommentButton />
            </div>
          </ComponentSection>

          <ComponentSection id="identity" title="Identity">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar label="여성" size="sm" />
              <Avatar label="남성" />
              <Avatar label="익명" size="lg" online />
              <Tag tone="accent">오늘의 질문</Tag>
              <Tag tone="warm">진솔함</Tag>
            </div>
          </ComponentSection>

          <ComponentSection id="question" title="Question Card">
            <QuestionCard
              question="누군가를 오래 좋아하게 만드는 건 어떤 마음이라고 생각하나요?"
              meta="오늘 자정까지 답할 수 있어요"
            />
          </ComponentSection>

          <ComponentSection id="cards" title="Content Cards">
            <AnswerCard
              authorLabel="익명의 여성"
              meta="조금 전"
              answer="서로를 바꾸려 하기보다, 그 사람이 바라보는 세상을 궁금해하는 마음인 것 같아요. 익숙해진 뒤에도 계속 질문하고 귀 기울이는 태도요."
              actions={
                <>
                  <LikeButton liked={liked} onClick={() => setLiked((value) => !value)} />
                  <CommentButton />
                  <IconButton className="ml-auto" label="더보기" icon={<MoreHorizontal />} />
                </>
              }
            />

            <div className="mt-5 columns-2 gap-3 sm:gap-4">
              <ExploreCard
                question="당신을 편안하게 만드는 사소한 순간은?"
                answer="아무 약속 없는 토요일 오전, 커피가 식는 줄도 모르고 책을 읽을 때."
                authorLabel="익명의 남성"
                action={<LikeButton liked={false} size="sm" />}
              />
              <ExploreCard
                className="mt-3 sm:mt-4"
                question="좋은 어른이 된다는 건 무엇일까요?"
                answer="모르는 것을 모른다고 말할 수 있고, 뒤늦게라도 사과할 줄 아는 사람. 자신의 확신보다 다른 사람의 마음을 한 번 더 살피는 사람이라고 생각해요."
                authorLabel="익명의 여성"
                action={<LikeButton liked size="sm" />}
              />
            </div>
          </ComponentSection>

          <ComponentSection id="profile" title="Profile Header">
            <ProfileHeader
              title="나의 기록"
              description="얼굴을 드러내지 않고 차곡차곡 모은 생각들"
              avatarLabel="나"
              meta="답변 12개"
              action={<IconButton label="프로필 메뉴" icon={<MoreHorizontal />} />}
            />
          </ComponentSection>

          <ComponentSection id="navigation" title="Navigation">
            <div className="overflow-hidden rounded-lg bg-paper-card">
              <TopNavigation
                sticky={false}
                title="오늘의 질문"
                subtitle="9월 13일"
                leading={<IconButton label="홈" icon={<Home />} />}
                actions={<IconButton label="더보기" icon={<MoreHorizontal />} />}
              />
              <BottomNavigation items={navigationItems} position="static" />
            </div>
          </ComponentSection>

          <ComponentSection id="feedback" title="Feedback & Overlays">
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => setModalOpen(true)}>
                모달 열기
              </Button>
              <Button variant="secondary" onClick={() => setSheetOpen(true)}>
                바텀 시트 열기
              </Button>
              <Button variant="secondary" onClick={() => setToastOpen(true)}>
                토스트 보기
              </Button>
            </div>

            <div className="mt-8 bg-paper-card">
              <EmptyState
                title="아직 도착한 생각이 없어요"
                description="오늘의 질문에 먼저 답하면 다른 사람의 생각을 만날 수 있어요."
                action={<Button size="sm">답변하러 가기</Button>}
              />
            </div>

            <div className="mt-8">
              <LoadingState items={2} />
            </div>
          </ComponentSection>
        </div>
      </main>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="이 생각에 공감할까요?"
        description="공감은 상대에게 조용히 전달돼요."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>취소</Button>
            <Button onClick={() => setModalOpen(false)}>공감하기</Button>
          </>
        }
      >
        상대의 답변을 다시 읽고 마음이 머무는지 천천히 살펴보세요.
      </Modal>

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="답변 메뉴"
        description="이 답변에 할 수 있는 일을 선택하세요."
      >
        <div className="grid gap-2">
          <Button variant="secondary" className="w-full">답변 저장하기</Button>
          <Button variant="ghost" className="w-full">신고하기</Button>
        </div>
      </BottomSheet>

      <Toast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        duration={0}
        tone="success"
        message="공감이 조용히 전달됐어요."
      />
    </div>
  );
}