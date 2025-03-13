"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Settings, 
  LogOut,
  Menu,
  X,
  UserCog,
  ClipboardList,
  Shield,
  AppWindow,
  Workflow,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface RouteItem {
  label: string;
  icon: any; // Using any for simplicity, but ideally would be more specific
  href: string;
  active: boolean;
}

interface RouteSection {
  section: string;
  items: RouteItem[];
}

type Route = RouteItem | RouteSection;

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [adminExpanded, setAdminExpanded] = useState(true);
  const [abopsExpanded, setAbopsExpanded] = useState(true);

  const routes: Route[] = [
    {
      section: "Apps",
      items: [
        {
          label: "ABOps",
          icon: Workflow,
          href: "#",
          active: pathname.startsWith("/apps/abops"),
        },
      ],
    },
    {
      section: "ABOps",
      items: [
        {
          label: "Cluster Dashboard",
          icon: LayoutDashboard,
          href: "/apps/abops/clusters/dashboard",
          active: pathname === "/apps/abops/clusters/dashboard",
        },
        {
          label: "Manage Clusters",
          icon: AppWindow,
          href: "/apps/abops/clusters/manage",
          active: pathname === "/apps/abops/clusters/manage",
        },
        {
          label: "Templates",
          icon: ClipboardList,
          href: "/apps/abops/clusters/templates",
          active: pathname === "/apps/abops/clusters/templates" || pathname.startsWith("/apps/abops/clusters/templates/"),
        },
        {
          label: "Credentials",
          icon: Shield,
          href: "/apps/abops/credentials",
          active: pathname === "/apps/abops/credentials",
        },
      ],
    },
    {
      section: "Admin",
      items: [
        {
          label: "Dashboard",
          icon: LayoutDashboard,
          href: "/dashboard",
          active: pathname === "/dashboard",
        },
        {
          label: "Organizations",
          icon: Building2,
          href: "/organizations",
          active: pathname === "/organizations" || pathname.startsWith("/organizations/"),
        },
        {
          label: "Teams",
          icon: Users,
          href: "/teams",
          active: pathname === "/teams" || pathname.startsWith("/teams/"),
        },
        {
          label: "Users",
          icon: UserCog,
          href: "/users",
          active: pathname === "/users" || pathname.startsWith("/users/"),
        },
        {
          label: "Audit Logs",
          icon: ClipboardList,
          href: "/audit-logs",
          active: pathname === "/audit-logs",
        },
        {
          label: "Site Settings",
          icon: Settings,
          href: "/admin/site-settings",
          active: pathname === "/admin/site-settings",
        },
      ],
    },
    {
      section: "User Settings",
      items: [
        {
          label: "Profile",
          icon: Shield,
          href: "/profile",
          active: pathname === "/profile",
        },
        {
          label: "Settings",
          icon: Settings,
          href: "/settings",
          active: pathname === "/settings",
        },
      ],
    },
  ];

  const onSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className={cn("flex h-full flex-col overflow-hidden border-r", className)}>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 gap-1">
          {routes.map((route, index) => {
            // Type guard to check if route is a RouteSection
            const isRouteSection = (route: Route): route is RouteSection => 
              'section' in route && 'items' in route;
            
            if (isRouteSection(route)) {
              // Add separator before Admin and User Settings sections
              const isAdminSection = route.section === "Admin";
              const isUserSettingsSection = route.section === "User Settings";
              return (
                <div key={`section-${index}`}>
                  {(isAdminSection || isUserSettingsSection) && <div className="my-2 border-t mx-2"></div>}
                  <button 
                    onClick={() => {
                      if (isAdminSection) setAdminExpanded(!adminExpanded);
                      if (route.section === "ABOps") setAbopsExpanded(!abopsExpanded);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground",
                      (isAdminSection || route.section === "ABOps") ? "cursor-pointer hover:text-primary" : ""
                    )}
                  >
                    {route.section}
                    {(isAdminSection || route.section === "ABOps") && (
                      (isAdminSection ? adminExpanded : abopsExpanded) ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {((!isAdminSection && route.section !== "ABOps") || 
                    (isAdminSection && adminExpanded) || 
                    (route.section === "ABOps" && abopsExpanded)) && 
                    route.items.map((item: RouteItem) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                        item.active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              );
            }
            
            // Type guard to check if route is a RouteItem
            const isRouteItem = (route: Route): route is RouteItem => 
              'href' in route && 'label' in route && 'icon' in route;
            
            if (isRouteItem(route)) {
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                    route.active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <route.icon className="h-5 w-5" />
                  {route.label}
                </Link>
              );
            }
            return null;
          })}
        </nav>
      </div>
      <div className="mt-auto px-3 py-2 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
          onClick={onSignOut}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}
