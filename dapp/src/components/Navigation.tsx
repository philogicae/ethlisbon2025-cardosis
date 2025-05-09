import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Home, PiggyBank, Search, Settings, Wallet } from "lucide-react";

const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: Home,
  },
  {
    title: "Transactions",
    url: "#",
    icon: Wallet,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

const Navigation = () => {
  return (
    <Sidebar
      style={{
        background:
          "linear-gradient(351deg,rgba(39, 46, 27, 1) 0%, rgba(57, 71, 36, 1) 48%, rgba(67, 83, 40, 1) 100%)",
      }}
    >
      <SidebarHeader className="items-center py-8 px-2 gap-1">
        <PiggyBank size={44} />
        <h1 className="font-bold text-2xl">CARDOSIS</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title} className="py-1">
                <SidebarMenuButton asChild className="text-lg">
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
    </Sidebar>
  );
};

export default Navigation;
