import { useState, useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/shadcn/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/shadcn/ui/sidebar";
import { AppRouter } from "@/interfaces/router";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavRoutes({ router }: { router: AppRouter[] }) {
  const path = usePathname();
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const isRouteActive = (routes: { url: string }[]) => {
    return routes.some((route) => path === route.url);
  };

  useEffect(() => {
    const activeCategories: string[] = [];

    router.forEach((route) => {
      if (route.isDroppable) {
        route.routes.forEach((item) => {
          if (isRouteActive(item.routes)) {
            activeCategories.push(item.category);
          }
        });
      }
    });

    setOpenCategories(activeCategories);
  }, [path]);

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  return (
    <>
      {router.map((route) => {
        if (route.isDroppable) {
          return (
            <SidebarGroup key={route.title}>
              <SidebarGroupLabel>{route.title}</SidebarGroupLabel>
              <SidebarMenu>
                {route.routes.map((item) => {
                  return (
                    <Collapsible
                      key={item.category}
                      asChild
                      open={openCategories.includes(item.category)}
                      onOpenChange={() => toggleCategory(item.category)}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            isActive={isRouteActive(item.routes)}
                            tooltip={item.category}
                          >
                            {item.icon && <item.icon />}
                            <span>{item.category}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.routes?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={subItem.url === path}
                                >
                                  <Link href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          );
        }
        return (
          <SidebarGroup
            key={route.title}
            className="group-data-[collapsible=icon]:hidden"
          >
            <SidebarGroupLabel>{route.title}</SidebarGroupLabel>
            <SidebarMenu>
              {route.routes.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={item.url === path} asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        );
      })}
    </>
  );
}
