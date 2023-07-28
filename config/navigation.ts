import { platform_name } from 'platform-constants';

export const navList = {
  site: `${platform_name}`,
  logo: '/assets/images/idp_logo.svg',
  links: [
    {
      link: '/',
      name: 'Home',
    },
    {
      link: '/datasets',
      name: 'Datasets',
    },
    {
      link: '/sectors',
      name: 'Sectors',
    },
    {
      link: '/providers',
      name: 'Providers',
    },
    {
      link: '/about',
      name: 'About',
    },
    // TODO add next 2 links on footer
    // {
    //   link: '/about',
    //   name: 'About',
    // },
    // ,
    // {
    //   link: '/connect-with-us',
    //   name: 'Connect with Us',
    // },
    // {
    //   link: '#resources',
    //   name: 'Resources',
    //   submenu: [
    //     {
    //       link: '#',
    //       name: 'Budget Summary',
    //     },
    //     {
    //       link: '#',
    //       name: 'Summary',
    //     },
    //     {
    //       link: '#',
    //       name: 'Data Story',
    //     },
    //   ],
    // },
  ],
};
