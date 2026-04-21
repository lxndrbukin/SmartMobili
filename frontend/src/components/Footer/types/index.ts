export type NavLink = {
  label: string;
  href: string;
};

export type NavSection = {
  label: string;
  links: NavLink[];
};

export type FooterTranslations = Record<string, NavSection>;
