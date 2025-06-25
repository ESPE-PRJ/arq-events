"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/shadcn/ui/sidebar";
import { NavUser } from "./nav-user";
import { GalleryVerticalEnd } from "lucide-react";
import { Separator } from "@/components/shadcn/ui/separator";
import { config } from "@/config";
import { NavRoutes } from "./nav-routes";
import { appRoutes } from "@/lib/routes";
import { IUser } from "@/interfaces/User.type";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const version = config.version;
  const appName = config.appName;

  const user: IUser = {
    id: "1",
    name: "Jon",
    surname: "Doe",
    email: "jon.doe@email.com",
    photo_url: "/globe.svg",
    role_id: "admin",
    role: "Administrador",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <div className="flex flex-row items-center py-2 gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <span>{appName}</span>
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <NavRoutes router={appRoutes} />
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <NavUser user={user} />
        <span className="py-1 text-xs text-center text-sidebar-foreground/70">
          {version}
        </span>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
