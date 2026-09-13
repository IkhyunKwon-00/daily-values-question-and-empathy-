import type { Metadata } from "next";
import DesignSystemShowcase from "@/components/design-system/DesignSystemShowcase";

export const metadata: Metadata = {
  title: "Design System",
};

export default function DesignSystemPage() {
  return <DesignSystemShowcase />;
}