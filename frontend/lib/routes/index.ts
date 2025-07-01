import {
  AppRouter,
  ChildrenRoutes,
  DroppableRoutes,
  SimpleRoutes,
} from "@/interfaces/router";
import { LayoutDashboard } from "lucide-react";

function mapRoutesWithUrls(appRouter: AppRouter[]): AppRouter[] {
  const prefix = "platform";
  const mapRoutes = (
    routes: Array<DroppableRoutes | SimpleRoutes | ChildrenRoutes>,
    parentUrl: string = `/${prefix}`,
  ): Array<DroppableRoutes | SimpleRoutes | ChildrenRoutes> => {
    return routes.map((route) => {
      if ("category" in route) {
        return {
          ...route,
          routes: route.routes.map((childRoute) => ({
            ...childRoute,
            url: `${parentUrl}${childRoute.url}`,
          })),
        };
      }
      return {
        ...route,
        url: `${parentUrl}${route.url}`,
      };
    });
  };

  return appRouter.map((route) => {
    if (route.isDroppable) {
      const baseUrl = `/${prefix}/${route.prefix}`;
      return {
        ...route,
        routes: mapRoutes(route.routes, baseUrl) as DroppableRoutes[],
      };
    }
    return {
      ...route,
      routes: mapRoutes(route.routes, `/${prefix}`) as SimpleRoutes[],
    };
  });
}

export const appRoutes: AppRouter[] = mapRoutesWithUrls([
  {
    title: "General",
    isDroppable: false,
    routes: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: "/dashboard",
      },
    ],
  },
  {
    title: "Facturas",
    isDroppable: false,
    routes: [
      {
        title: "Lista",
        icon: LayoutDashboard,
        url: "/facturas",
      },
      {
        title: "Crear",
        icon: LayoutDashboard,
        url: "/facturas/crear",
      },
    ],
  },
  {
    title: "Pacientes",
    isDroppable: false,
    routes: [
      {
        title: "Lista",
        icon: LayoutDashboard,
        url: "/paciente",
      },
      {
        title: "Crear",
        icon: LayoutDashboard,
        url: "/paciente/crear",
      },
    ],
  },
]);
