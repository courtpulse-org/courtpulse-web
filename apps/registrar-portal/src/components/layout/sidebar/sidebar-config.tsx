import type { ReactElement } from "react";
import {
  ActivityIcon,
  BellIcon,
  BookIcon,
  BuildingIcon,
  CalendarIcon,
  DashboardIcon,
  GavelIcon,
  GearIcon,
  MegaphoneIcon,
  ScaleIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "@repo/ui/icons";
import { RouteConstants } from "@/shared/constants/routes";

export type BadgeKey = "dateRequests" | "unposted";

export interface SidebarItem {
  label: string;
  icon: ReactElement;
  path: string;
  activePaths?: string[];
  /** Live count shown beside the label. */
  badge?: BadgeKey;
  /** Match only the exact path (for "/"). */
  exact?: boolean;
}

// Ordered by how often a registrar reaches for them on a sitting day.
export const registrarItems: SidebarItem[] = [
  {
    label: "Today",
    icon: <ActivityIcon />,
    path: RouteConstants.today.base.path,
    exact: true,
    badge: "unposted",
  },
  {
    label: "Courtrooms",
    icon: <GavelIcon />,
    path: RouteConstants.courtrooms.base.path,
    activePaths: [RouteConstants.courtrooms.details.path],
  },
  {
    label: "Broadcasts",
    icon: <MegaphoneIcon />,
    path: RouteConstants.broadcasts.base.path,
  },
  {
    label: "Date requests",
    icon: <CalendarIcon />,
    path: RouteConstants.dateRequests.base.path,
    badge: "dateRequests",
  },
  {
    label: "Judge's diary",
    icon: <BookIcon />,
    path: RouteConstants.diary.base.path,
  },
  {
    label: "Alert log",
    icon: <BellIcon />,
    path: RouteConstants.alerts.base.path,
  },
];

export const adminItems: SidebarItem[] = [
  {
    label: "Overview",
    icon: <DashboardIcon />,
    path: RouteConstants.admin.base.path,
    exact: true,
  },
  {
    label: "Registrars",
    icon: <ShieldCheckIcon />,
    path: RouteConstants.admin.registrars.path,
  },
  {
    label: "Courts & judges",
    icon: <BuildingIcon />,
    path: RouteConstants.admin.courts.path,
  },
  {
    label: "Legal calendar",
    icon: <CalendarIcon />,
    path: RouteConstants.admin.calendar.path,
  },
  {
    label: "Lawyers",
    icon: <UsersIcon />,
    path: RouteConstants.admin.lawyers.path,
  },
  {
    label: "Consensus rules",
    icon: <ScaleIcon />,
    path: RouteConstants.admin.consensus.path,
  },
];

export const settingsNavItem: SidebarItem = {
  label: "Settings",
  icon: <GearIcon />,
  path: RouteConstants.settings.base.path,
};

/** Bottom tab bar on phones: the four things a registrar does most. */
export const mobileTabs: SidebarItem[] = [
  registrarItems[0]!,
  registrarItems[1]!,
  registrarItems[2]!,
  registrarItems[3]!,
];
