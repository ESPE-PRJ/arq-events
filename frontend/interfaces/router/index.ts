import { type LucideIcon } from "lucide-react";

interface BaseRoute {
  title: string;
  url: string;
}

export type ChildrenRoutes = BaseRoute;

export interface DroppableRoutes {
  category: string;
  icon: LucideIcon;
  routes: ChildrenRoutes[];
}

export interface SimpleRoutes extends BaseRoute {
  icon: LucideIcon;
}

export type AppRouter =
  | {
      title: string;
      prefix: string;
      isDroppable: true;
      routes: DroppableRoutes[];
    }
  | {
      title: string;
      isDroppable: false;
      routes: SimpleRoutes[];
    };
