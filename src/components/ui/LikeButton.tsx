"use client";

import { Heart } from "lucide-react";
import IconButton, { type IconButtonProps } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";

export type LikeButtonProps = Omit<
  IconButtonProps,
  "label" | "icon" | "active"
> & {
  liked: boolean;
};

export default function LikeButton({
  liked,
  className,
  ...props
}: LikeButtonProps) {
  return (
    <IconButton
      label={liked ? "공감 취소" : "공감하기"}
      active={liked}
      icon={
        <Heart
          className={cn(liked && "animate-pop fill-current")}
          strokeWidth={1.8}
        />
      }
      className={className}
      {...props}
    />
  );
}