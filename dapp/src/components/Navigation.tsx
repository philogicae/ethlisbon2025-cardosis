// import Link from "next/link";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "./ui/sidebar";
import {
  Home,
  // PiggyBank,
  CreditCard,
  Settings,
  Wallet,
} from "lucide-react";
import { FloatingDock } from "./ui/animations/FloatingDock";

const items = [
  {
    title: "Dashboard",
    href: "/",
    icon: <Home />,
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: <Wallet />,
  },
  {
    title: "Pay",
    href: "/pay",
    icon: <CreditCard />,
  },
  {
    title: "Settings",
    href: "#",
    icon: <Settings />,
  },
];

const Navigation = ({ className }: { className?: string }) => {
  //   return (
  //     <Sidebar
  //       style={{
  //         background:
  //           "linear-gradient(351deg,rgba(39, 46, 27, 1) 0%, rgba(57, 71, 36, 1) 48%, rgba(67, 83, 40, 1) 100%)",
  //       }}
  //     >
  //       <SidebarHeader className="gap-1 items-center px-2 py-8">
  //         <PiggyBank size={44} />
  //         <h1 className="text-2xl font-bold">CARDOSIS</h1>
  //       </SidebarHeader>
  //       <SidebarContent>
  //         <SidebarGroup>
  //           <SidebarMenu>
  //             {items.map((item) => (
  //               <SidebarMenuItem key={item.title} className="py-1">
  //                 <SidebarMenuButton asChild className="text-lg">
  //                   <Link href={item.href}>
  //                     {item.icon}
  //                     <span>{item.title}</span>
  //                   </Link>
  //                 </SidebarMenuButton>
  //               </SidebarMenuItem>
  //             ))}
  //           </SidebarMenu>
  //         </SidebarGroup>
  //         <SidebarGroup />
  //       </SidebarContent>
  //     </Sidebar>
  //   );

  return (
    // <Sidebar>
    <FloatingDock items={items} desktopClassName={className} />
    // </Sidebar>
  );
};

export default Navigation;
