import {
  ArchiveBoxArrowDownIcon,
  DonarIcon,
  HospitalIcon,
  AnalyticsIcon,
} from "../../../shared/Icons";

export const OrganistionMenue = [
  {
    name: "Inventory",
    href: "/home",
    icon: ArchiveBoxArrowDownIcon,
    current: true,
  },
  { name: "Donors", href: "/donar", icon: DonarIcon, current: false },
  { name: "Hospitals", href: "/hospital", icon: HospitalIcon, current: false },
  {
    name: "Analytics",
    href: "/analytics",
    icon: AnalyticsIcon,
    current: false,
  },
];
