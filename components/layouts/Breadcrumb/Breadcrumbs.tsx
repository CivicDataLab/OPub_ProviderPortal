import { useRouter } from 'next/router';
import styled from 'styled-components';
import { BreadcrumbItem, Breadcrumbs as BreadWrapper } from './BreadcrumbItem';
import useTranslation from 'next-translate/useTranslation';

type Props = {
  title: string;
  container?: boolean;
  provider?: boolean;
  user?: boolean;
};

export default function Breadcrumbs({
  title,
  container = false,
  provider = false,
  user = false,
}: Props) {
  const router = useRouter();

  const { t } = useTranslation('common');

  // get the url and convert it to an array
  const asPathWithoutQuery = router.asPath.split('?')[0];
  const pathArr = asPathWithoutQuery.split('/').filter((v) => v.length > 0);

  // if provider, start from 3rd position
  const startNum = provider ? 2 : user ? 1 : 0;
  const basePath = provider
    ? `/provider/${router.query.provider}/`
    : user
    ? `/user/`
    : '/';
  // dont use current path, as we need custom name
  const crumblist = pathArr
    .slice(startNum, pathArr.length - 1)
    .map((subpath, idx) => {
      const href =
        basePath + pathArr.slice(startNum, idx + startNum + 1).join('/');

      const title = subpath.split('-').join(' ');
      return { href, title };
    });

  // if provider, dont add home page link
  const breadcrumbs =
    provider || user
      ? [...crumblist]
      : [{ href: '/', title: t('breadcrumb-home') }, ...crumblist];
  breadcrumbs.push({ href: null, title: title });

  return (
    <Wrapper className={container ? 'containerDesktop' : null}>
      <BreadWrapper>
        {breadcrumbs.map((item) => (
          <BreadcrumbItem key={item.href + item.title} href={item.href}>
            {item.title}
          </BreadcrumbItem>
        ))}
      </BreadWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding-block: 8px;
  text-transform: capitalize;
`;
