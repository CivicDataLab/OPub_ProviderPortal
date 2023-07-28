import { IconFacebook, IconLinkedin, IconTwitter } from 'components/icons';
import * as Yup from 'yup';

export const links = [
  {
    title: 'About',
    list: [
      {
        name: 'About IDP',
        link: '/about',
      },
      {
        name: 'Policies',
        link: '/policies',
      },
      {
        name: 'Connect with IDP',
        link: '/connect-with-idp',
      },
      {
        name: 'Sitemap',
        link: '/sitemap',
      },
    ],
  },
  {
    title: 'Explore',
    list: [
      {
        name: 'Data & APIs',
        link: '/datasets',
      },
      {
        name: 'Data Providers',
        link: '/providers',
      },
      {
        name: 'Sectors',
        link: '/sectors',
      },
    ],
  },
  {
    title: 'Resources',
    list: [
      {
        name: 'Glossary',
        link: '/glossary',
      },
      {
        name: 'Terms of Use',
        link: '/terms-of-use',
      },
      {
        name: 'Frequently Asked Questions',
        link: '/faqs?category=all',
      },
      {
        name: 'Help',
        link: '/help?category=all',
      },
    ],
  },
];
export const creators = [
  {
    text: 'Logo of MEITY',
    link: 'https://www.meity.gov.in/',
    image: {
      url: '/assets/images/Meity_logo_old.png',
      width: 184,
      height: 92,
    },
  },
  {
    text: 'Logo of NIC',
    link: 'https://www.nic.in/',
    image: {
      url: '/assets/images/nic_logo.svg',
      width: 80,
      height: 80,
    },
  },
];
export const otherPLatforms = [
  {
    text: 'Logo of MyGov',
    link: 'https://www.mygov.in/',
    image: {
      url: '/assets/images/my-gov.svg',
      width: 64,
      height: 56,
    },
  },
  {
    text: 'Logo of Data.gov.in',
    link: 'https://data.gov.in/',
    image: {
      url: '/assets/images/data-gov-in.svg',
      width: 140,
      height: 56,
    },
  },

  {
    text: 'Logo of Digital India',
    link: 'https://www.digitalindia.gov.in/',
    image: {
      url: '/assets/images/digital-india.svg',
      width: 120,
      height: 56,
    },
  },
  {
    text: 'Logo of PMIndia',
    link: 'https://www.pmindia.gov.in/en/',
    image: {
      url: '/assets/images/pm-india.svg',
      width: 136,
      height: 56,
    },
  },
  {
    text: 'Logo of India.gov.in',
    link: 'https://www.india.gov.in/',
    image: {
      url: '/assets/images/india-gov-in.svg',
      width: 176,
      height: 56,
    },
  },
];
export const socials = [
  {
    text: 'Facebook',
    image: <IconFacebook />,
    link: 'https://www.facebook.com/dataportalofindia',
  },
  {
    text: 'LinkedIn',
    image: <IconLinkedin />,
    link: 'https://www.linkedin.com/company/dataportalindia/',
  },
  {
    text: 'Twitter',
    image: <IconTwitter />,
    link: 'https://twitter.com/DataPortalIndia',
  },
];

export const validationSchema = Yup.object().shape({
  email: Yup.string().email('Please enter correct email').required('Required'),
});
