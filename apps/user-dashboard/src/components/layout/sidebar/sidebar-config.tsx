import type { ReactElement } from "react";
import {
  ActivityIcon,
  BriefcaseIcon,
  CameraIcon,
  DashboardIcon,
  GearIcon,
  ListChecksIcon,
  MonitorIcon,
  WalletIcon,
} from "@repo/ui/icons";
import { RouteConstants } from "@/shared/constants/routes";

export interface SidebarItem {
  label: string;
  icon: ReactElement;
  path: string;
  /** Extra route patterns that keep this item highlighted, e.g. detail pages. */
  activePaths?: string[];
}

// Ordered by the morning workflow: what's happening now (Pulse), what I'm
// tracking (Watchlist), what I can scan, what I can delegate, what I'm owed.
export const sidebarItems: SidebarItem[] = [
  {
    label: "Overview",
    icon: <DashboardIcon />,
    path: RouteConstants.overview.base.path,
  },
  {
    label: "Court Pulse",
    icon: <ActivityIcon />,
    path: RouteConstants.pulse.base.path,
    activePaths: [RouteConstants.pulse.courtroom.path],
  },
  {
    label: "My Watchlist",
    icon: <ListChecksIcon />,
    path: RouteConstants.watchlist.base.path,
    activePaths: [
      RouteConstants.watchlist.new.path,
      RouteConstants.watchlist.details.path,
    ],
  },
  {
    label: "Cause List Scanner",
    icon: <CameraIcon />,
    path: RouteConstants.causeList.base.path,
    activePaths: [
      RouteConstants.causeList.scan.path,
      RouteConstants.causeList.scanResult.path,
    ],
  },
  {
    label: "Virtual Dock",
    icon: <MonitorIcon />,
    path: RouteConstants.dock.base.path,
    activePaths: [
      RouteConstants.dock.courtroom.path,
      RouteConstants.dock.remoteDate.path,
    ],
  },
  {
    label: "Next-Door Counsel",
    icon: <BriefcaseIcon />,
    path: RouteConstants.briefs.base.path,
    activePaths: [
      RouteConstants.briefs.new.path,
      RouteConstants.briefs.mine.path,
      RouteConstants.briefs.details.path,
    ],
  },
  {
    label: "Wallet & Credits",
    icon: <WalletIcon />,
    path: RouteConstants.wallet.base.path,
    activePaths: [
      RouteConstants.wallet.credits.path,
      RouteConstants.wallet.escrow.path,
    ],
  },
];

/** Rendered in the pinned footer, not the nav list. */
export const settingsNavItem: SidebarItem = {
  label: "Settings",
  icon: <GearIcon />,
  path: RouteConstants.settings.base.path,
  activePaths: [
    RouteConstants.settings.profile.path,
    RouteConstants.settings.notifications.path,
  ],
};
