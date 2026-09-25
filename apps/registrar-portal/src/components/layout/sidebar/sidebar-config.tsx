import type { ReactElement } from "react";
import {
  ActivityIcon,
  BriefcaseIcon,
  CalendarIcon,
  CameraIcon,
  GearIcon,
  MegaphoneIcon,
  MonitorIcon,
  ScaleIcon,
  ShieldCheckIcon,
  UsersIcon,
  WalletIcon,
} from "@repo/ui/icons";
import { RouteConstants } from "@/shared/constants/routes";

export interface SidebarItem {
  label: string;
  icon: ReactElement;
  path: string;
  activePaths?: string[];
}

export const registrarItems: SidebarItem[] = [
  {
    label: "Court Console",
    icon: <ActivityIcon />,
    path: RouteConstants.console.base.path,
  },
  {
    label: "Broadcasts",
    icon: <MegaphoneIcon />,
    path: RouteConstants.broadcasts.base.path,
    activePaths: [RouteConstants.broadcasts.new.path],
  },
  {
    label: "Virtual Dock",
    icon: <MonitorIcon />,
    path: RouteConstants.dock.base.path,
    activePaths: [RouteConstants.dock.courtroom.path],
  },
  {
    label: "Remote Dates",
    icon: <CalendarIcon />,
    path: RouteConstants.dock.remoteDates.path,
  },
  {
    label: "Cause List",
    icon: <CameraIcon />,
    path: RouteConstants.causeList.base.path,
  },
];

export const adminItems: SidebarItem[] = [
  {
    label: "Registrars",
    icon: <UsersIcon />,
    path: RouteConstants.admin.registrars.path,
  },
  {
    label: "Lawyers",
    icon: <ShieldCheckIcon />,
    path: RouteConstants.admin.lawyers.path,
  },
  {
    label: "Disputes",
    icon: <ScaleIcon />,
    path: RouteConstants.admin.disputes.path,
  },
  {
    label: "Escrow",
    icon: <WalletIcon />,
    path: RouteConstants.admin.escrow.path,
  },
  {
    label: "Consensus Rules",
    icon: <BriefcaseIcon />,
    path: RouteConstants.admin.consensus.path,
  },
];

export const settingsNavItem: SidebarItem = {
  label: "Settings",
  icon: <GearIcon />,
  path: RouteConstants.settings.base.path,
};
