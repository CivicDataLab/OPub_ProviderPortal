import {
  DataEdit,
  DataSetting,
  FileData,
  FileJson,
  FolderUser,
  JourneyData,
  Key,
  ModernGridView,
  Organisation,
  PasteList,
  UserEdit,
  FileTemplate,
  FileTxt,
  Document,
  Link,
  LinkNav,
  User,
} from '@opub-icons/workflow';
import {
  CSVIcon,
  IconOpen,
  IconRegistered,
  IconRestricted,
  JSONIcon,
  XLSIcon,
  PdfIcon,
  XMLIcon,
  External,
} from 'components/icons';
import create from 'zustand';

interface UserProps {
  user: any;
  access: any;
  setUser: (by: any) => void;
  setAccess: (by: any) => void;
}

export const useUserStore = create<UserProps>((set) => ({
  user: {},
  access: {},
  setUser: (e) => set(() => ({ user: e })),
  setAccess: (e) => set(() => ({ access: e })),
}));

interface ProviderProps {
  org: any;
  setOrg: (by: any) => void;
}

export const useProviderStore = create<ProviderProps>((set) => ({
  org: null,
  setOrg: (e) => set(() => ({ org: e })),
}));

interface GuestProps {
  openDAMIDs: any;
  setOpenDAMIDs: (by: any) => void;
}

export const useGuestStore = create<GuestProps>((set) => ({
  openDAMIDs: {},
  setOpenDAMIDs: (e) => set(() => ({ openDAMIDs: e })),
}));

interface ConstantsProps {
  durationFormat: any;
  formatIcons: any;
  formatColor: any;
  datasetTypeIcons: any;
  dashboardIcons: any;
  damIcons: any;
}
export const useConstants = create<ConstantsProps>(() => ({
  durationFormat: {
    daily: 'day',
    weekly: 'week',
    quartly: 'quarter',
    monthly: 'month',
    yearly: 'year',
  },

  formatColor: {
    CSV: 'var(--color-white)',
    XLSX: 'var(--color-white)',
    XLS: 'var(--color-white)',
    XML: 'var(--color-white)',
    JSON: 'var(--color-white)',
    PDF: 'var(--color-white)',
    GEOJSON: 'var(--color-white)',
  },

  formatIcons: {
    CSV: <CSVIcon width={'24'} aria-hidden="true" />,
    XLSX: <XLSIcon width={'24'} aria-hidden="true" fill="#196661" />,
    XLS: <XLSIcon width={'24'} aria-hidden="true" fill="#196661" />,
    XML: <XMLIcon width={'24'} aria-hidden="true" />,
    JSON: <JSONIcon width={'24'} aria-hidden="true" />,
    GEOJSON: <FileJson size={24} aria-hidden="true" fill="#AE5816" />,
    PDF: <PdfIcon width={'24'} aria-hidden="true" />,
    DOCX: <Document size={24} aria-hidden="true" fill="#3e5cc7" />,
    TXT: <FileTxt size={24} aria-hidden="true" fill="#AE5816" />,
    OTHER: <FileTemplate size={24} fill="#196661" aria-hidden="true" />,
    EXTERNAL: (
      <External
        width={'24'}
        aria-hidden="true"
        fill={'var(--color-secondary-00)'}
      />
    ),
  },

  dashboardIcons: {
    analytics: <ModernGridView />,
    Datasets: <DataEdit />,
    'my-datasets': <DataEdit />,
    activity: <PasteList />,
    Consumers: <FolderUser />,
    Licenses: <Key />,
    licenses: <Key />,
    'api-sources': <Link />,
    'data-access-model': <DataSetting />,
    Providers: <UserEdit />,
    'providers-management': <UserEdit />,
    policy: <FileTemplate />,
    'organization-info': <Organisation />,
    entities: <Organisation />,
    profile: <User />,
  },

  damIcons: {
    RESTRICTED: <IconRestricted fill="#E08A48" />,
    REGISTERED: <IconRegistered fill="#E08A48" />,
    OPEN: <IconOpen fill="#E08A48" />,
  },

  datasetTypeIcons: {
    file: {
      name: 'File',
      id: 'FILE',
      image: <FileData width={30} />,
    },
    api: {
      name: 'API',
      id: 'API',
      image: <JourneyData width={30} />,
    },
    external: {
      name: 'External',
      id: 'EXTERNAL',
      image: <LinkNav width={30} />,
    },
  },
}));

export const store = () => <></>;

export const sortOptions = [
  {
    value: 'modified_asc',
    label: 'Last Updated Ascending',
  },
  {
    value: 'modified_desc',
    label: 'Last Updated Descending',
  },
  {
    value: '',
    label: 'Relevance',
  },
  {
    value: 'rating_asc',
    label: 'Rating Ascending',
  },
  {
    value: 'rating_desc',
    label: 'Rating Descending',
  },
  {
    value: 'provider_asc',
    label: 'Data Provider Ascending',
  },
  {
    value: 'provider_desc',
    label: 'Data Provider Descending',
  },
  {
    value: 'recent',
    label: 'Most Recent',
  },
];
