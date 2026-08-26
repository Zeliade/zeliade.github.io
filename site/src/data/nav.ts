export type NavItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

/**
 * The whole site menu. Editing this array updates the header and the footer
 * on every page — previously this markup was duplicated in all 11 HTML files.
 */
export const nav: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Products & Services',
    children: [
      { label: 'Analytics Library', href: '/zqf/' },
      { label: 'Consulting', href: '/consulting/' },
      { label: 'Model Validation for CCPs', href: '/mvccps/' },
    ],
  },
  { label: 'White Papers', href: '/whitepapers/' },
  { label: 'Clients', href: '/clients/' },
  {
    label: 'About Us',
    children: [
      { label: 'Company', href: '/company/' },
      { label: 'Team', href: '/team/' },
    ],
  },
  { label: 'Contact Us', href: '/contact-us/' },
];
