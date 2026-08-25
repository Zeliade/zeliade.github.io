/** Single source of truth for company details repeated across pages. */
export const site = {
  name: 'Zeliade Systems',
  tagline: 'Quantitative analytics, consulting and model validation for financial institutions',
  founded: 2003,
  email: 'contact@zeliade.com',
  phone: '+33 9 52 18 62 61',
  phoneHref: '+33952186261',
  address: {
    street: '56, Rue Jean-Jacques Rousseau',
    postalCode: '75001',
    city: 'Paris',
    country: 'France',
  },
} as const;
