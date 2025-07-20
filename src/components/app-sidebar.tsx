import * as React from "react";
import { Link, useLocation } from "react-router-dom";

import { GitPullRequest, Package2, MessageSquareShare } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Logo from "./Logo/Logo";

// This is sample data.
const navMain = [
  {
    title: "Overview",
    url: "/overview",
    items: [],
    icon: Package2,
  },
  {
    title: "Repositories",
    url: "/repositories",
    icon: GitPullRequest,
    items: [
      {
        title: "All Repositories",
        url: "/repositories",
      },
      {
        title: "Active Repositories",
        url: "/repositories/active",
      },
      {
        title: "Starred Repositories",
        url: "/repositories/starred",
      },
      {
        title: "Forked Repositories",
        url: "/repositories/forked",
      },
      {
        title: "Private Repositories",
        url: "/repositories/private",
      },
      {
        title: "Public Repositories",
        url: "/repositories/public",
      },
      {
        title: "Archived Repositories",
        url: "/repositories/archived",
      },
    ],
  },
  {
    title: "AI Comments",
    url: "/ai-comments",
    items: [],
    icon: MessageSquareShare,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();

  const isActive = (url: string) => {
    return location.pathname.includes(url);
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <Logo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive(item.url)}>
                  <Link to={item.url} className="font-medium">
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={location.pathname === subItem.url}
                        >
                          <Link to={subItem.url}>{subItem.title}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
