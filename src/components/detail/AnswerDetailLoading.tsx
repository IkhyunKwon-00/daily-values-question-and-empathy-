import LoadingState from "@/components/ui/LoadingState";

export default function AnswerDetailLoading() {
  return (
    <div className="mx-auto max-w-[42rem] py-4" aria-label="생각을 불러오는 중">
      <div className="h-10 w-24 animate-pulse rounded-lg bg-paper-card" />
      <div className="mt-10 h-3 w-20 animate-pulse rounded-full bg-paper-raise" />
      <div className="mt-5 h-8 w-full animate-pulse rounded-full bg-paper-raise" />
      <div className="mt-3 h-8 w-4/5 animate-pulse rounded-full bg-paper-raise" />
      <LoadingState className="mt-12" items={1} />
    </div>
  );
}