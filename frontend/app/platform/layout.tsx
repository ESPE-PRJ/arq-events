import type { Metadata } from "next";
import "./../globals.css";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/shadcn/ui/sidebar";
import { AppSidebar } from "@/components/ui/nav/app-sidebar";

export const metadata: Metadata = {
  title: "Platform",
  description: "Platform Page",
};

export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
