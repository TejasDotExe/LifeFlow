import { DonarIcon, HospitalIcon, NgoIcon } from "../../../shared/Icons";

export const adminMenue = [
  {
    name: "Donors",
    href: "/donar-list",
    icon: DonarIcon,
    current: true,
  },
  {
    name: "Hospitals",
    href: "/hospital-list",
    icon: HospitalIcon,
    current: false,
  },
  {
    name: "Organisations",
    href: "/organisation-list",
    icon: NgoIcon,
    current: false,
  },
];
