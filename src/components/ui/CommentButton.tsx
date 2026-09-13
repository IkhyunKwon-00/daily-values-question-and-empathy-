"use client";

import { MessageCircle } from "lucide-react";
import IconButton, { type IconButtonProps } from "@/components/ui/IconButton";

export type CommentButtonProps = Omit<
  IconButtonProps,
  "label" | "icon" | "active"
> & {
  active?: boolean;
};

export default function CommentButton({
  active = false,
  ...props
}: CommentButtonProps) {
  return (
    <IconButton
      label="답글 보기"
      active={active}
      icon={<MessageCircle strokeWidth={1.8} />}
      {...props}
    />
  );
}