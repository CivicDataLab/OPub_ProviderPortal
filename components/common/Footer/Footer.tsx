import Button from 'components/actions/Button';
import { TextField } from 'components/form';
import IdpLogo from 'components/icons/IdpLogo';
import { Heading } from 'components/layouts';
import { Flex } from 'components/layouts/FlexWrapper';
import { Link } from 'components/layouts/Link';
import { Text } from 'components/layouts/Text';
import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useProviderStore, useUserStore } from 'services/store';
import styled from 'styled-components';
import { subscribeForUpdates } from 'utils/fetch';
import { convertDateFormat } from 'utils/helper';
import {
  creators,
  links,
  otherPLatforms,
  socials,
  validationSchema,
} from './footer.config';

const Title = ({ children, variant }: any) => (
  <Heading
    variant={variant ? variant : 'h6l'}
    color="var(--text-medium)"
    marginBottom="4px"
  >
    {children}
  </Heading>
);

const Footer = () => {
  const { t } = useTranslation('common');
  const user = useUserStore((e) => e.user);

  const initialValues = {
    email: '',
  };

  const { data: session } = useSession();
  const currentOrgRole = useProviderStore((e) => e.org);

  useEffect(() => {
    user.email && setFieldValue('email', user.email);
  }, [user]);

  const formik: any = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: false,
    onSubmit: (values, { resetForm }) => {
      subscribeForUpdates(values.email, session, currentOrgRole?.org_id)
        .then((res) => {
          if (res.Success) {
            toast.success('Subscribed Successfully');
            resetForm();
          } else {
            throw Error();
          }
        })
        .catch(() => {
          toast.error('Error in Subscription');
        });
    },
  });

  const { values, errors, setFieldValue } = formik;

  const SocialElm = (
    <Socials>
      <div>
        <Title>{t('footer-follow-us')}</Title>
        <ul>
          {socials.map((social) => (
            <li key={social.text}>
              <Link
                key={`Logo-${social.text}`}
                href={social.link}
                rel="noopener noreferrer"
                target="_blank"
                title={social.text}
                external
              >
                {social.image}
                <span className="sr-only">{social.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Socials>
  );

  return (
    <footer>
      <FooterLine1>
        <Content className="container">
          <Logos>
            <IDPWrapper title="IDP Logo">
              <IdpLogo alt="IDP Logo" width={336} height={112} />
            </IDPWrapper>
          </Logos>
          <Links>
            {links.map((section) => (
              <div key={section.title}>
                <Title>
                  {t(
                    'footer-' + section.title.toLowerCase() + '-section-title'
                  )}
                </Title>
                <ul>
                  {section.list.map((item) => (
                    <li key={item.name}>
                      <Link href={item.link}>
                        {t(
                          'footer-' +
                            item.name
                              .toLowerCase()
                              .trim()
                              .replace(/[^\w\s-]/g, '')
                              .replace(/[\s_-]+/g, '-')
                              .replace(/^-+|-+$/g, '')
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <MobileSocial>{SocialElm}</MobileSocial>
          </Links>
          <Follow>
            <DesktopSocial>{SocialElm}</DesktopSocial>
            <SubscribeForm
              id="subscribeForm"
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Title variant="h5">{t('footer-subscribe-to-updates')}</Title>
              <div>
                <TextField
                  type="email"
                  name="email"
                  id="email"
                  aria-label={t('footer-subscribe-to-updates')}
                  value={values.email}
                  placeholder={t('footer-subscribe-to-updates-placeholder')}
                  isRequired
                  onChange={(e) => {
                    setFieldValue('email', e);
                    if (errors.email) errors.email = false;
                  }}
                  errorMessage={errors.email}
                />
                <Button type="submit">
                  {t('footer-subscribe-to-updates-submit')}
                </Button>
              </div>
            </SubscribeForm>
          </Follow>
        </Content>
      </FooterLine1>

      <FooterLine3>
        <div className="container">
          <AboutPlatform>
            <PlatformInfo>
              <Text variant="pt14">
                {t('footer-platform-text-1')}
                <strong>{t('footer-platform-text-2')}</strong>
                {t('footer-platform-text-3')}
                <strong>{t('footer-platform-text-4')}</strong>
                {t('footer-platform-text-5')}
              </Text>
            </PlatformInfo>
            <div>
              <Contributors>
                {creators.map((creator) => (
                  <Link
                    key={creator.text}
                    href={creator.link}
                    rel="noopener noreferrer"
                    target="_blank"
                    title={creator.text}
                    external
                  >
                    <Image
                      alt={creator.text}
                      key={creator.text}
                      src={creator.image.url}
                      width={creator.image.width}
                      height={creator.image.height}
                      className="img-contain creator-img"
                    />
                    <span className="sr-only">{creator.text}</span>
                  </Link>
                ))}
              </Contributors>
            </div>
          </AboutPlatform>

          <OtherPlatforms>
            {otherPLatforms.map((creator) => (
              <Link
                key={creator.text}
                href={creator.link}
                rel="noopener noreferrer"
                target="_blank"
                title={creator.text}
                external
              >
                <Image
                  alt={creator.text}
                  key={creator.text}
                  src={creator.image.url}
                  width={creator.image.width}
                  height={creator.image.height}
                  className="img-contain"
                />
                <span className="sr-only">{creator.text}</span>
              </Link>
            ))}
          </OtherPlatforms>
        </div>
      </FooterLine3>
      <FooterLine4>
        <div className="container">
          <Text variant="pt14b">{t('footer-copyright-text')}</Text>
        </div>
      </FooterLine4>
      <FooterLine5>
        <div className="container">
          <Text variant="pt16">
            Last updated on {convertDateFormat(new Date().toISOString())}
          </Text>
        </div>
      </FooterLine5>
    </footer>
  );
};

export { Footer };

const FooterLine1 = styled.div`
  background-color: var(--color-primary-06);
  color: var(--text-medium);
  padding-top: 64px;
  border-top: 2px solid var(--color-gray-02);

  a {
    font-weight: var(--font-bold);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 640px) {
    border-top: none;
    padding-top: 32px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  @media (max-width: 820px) {
    gap: 48px;
  }

  @media (max-width: 640px) {
    gap: 0;
  }
`;

const Follow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 640px) {
    margin-top: 24px;
    width: 100%;
  }
`;

const Logos = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
`;

const IDPWrapper = styled.div`
  max-width: fit-content;

  > svg {
    object-fit: contain;
  }

  @media (max-width: 640px) {
    svg {
      height: 52px;
      width: 188px;
    }
  }
`;

const Contributors = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 40px;

  a {
    font-size: 0;
  }

  @media (max-width: 640px) {
    gap: 20px;

    img {
      height: 68px !important;
    }
  }
`;

const Links = styled.section`
  display: flex;
  gap: 32px;

  h2 {
    text-transform: uppercase;
  }

  @media (max-width: 640px) {
    flex-wrap: wrap;
    margin-top: 28px;
    justify-content: space-between;
    gap: 28px;

    > div:nth-child(2) {
      min-width: 146px;
    }
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  a {
    color: var(--text-high);
  }
`;

const Socials = styled.section`
  h2 {
    margin-bottom: 8px;
  }

  ul {
    display: flex;
    gap: 12px;
    flex-direction: row;

    a,
    button {
      display: block;
      padding: 8px;
      filter: var(--drop-shadow);
      background-color: var(--color-background-dark);
      transition: background-color 200ms ease;
      width: 40px;
      height: 40px;
      border-radius: 50%;

      &:hover,
      &:focus-visible {
        background-color: var(--color-background-darkest);
      }
    }

    svg {
      margin: 0;
    }
  }
`;

const SubscribeForm = styled.form`
  > div {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;

    > div {
      flex-grow: 1;
    }

    input {
      padding: 12px 8px;
      font-weight: var(--font-bold);
      color: var(--text-medium);
      border-radius: 2px;
      border: 1px solid var(--color-gray-05-on-dark);
      height: 48px;
      max-width: 235px;
    }
  }
`;

const FooterLine3 = styled.div`
  background-color: var(--color-primary-06);
  padding-block: 40px;

  @media (max-width: 640px) {
    padding-block: 32px;
  }
`;

const AboutPlatform = styled.div`
  display: flex;
  gap: 46px;
  padding-block: 40px;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--color-gray-01);
  border-top: 2px solid var(--color-gray-01);

  @media (max-width: 640px) {
    padding-block: 32px;
    justify-content: center;
    gap: 32px;
  }
`;

const OtherPlatforms = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 48px;
  padding-top: 40px;
  justify-content: center;

  @media (max-width: 640px) {
    padding-top: 32px;
    gap: 24px;

    img {
      height: 40px !important;
    }
  }
`;

const PlatformInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 654px;
  height: fit-content;
  padding-left: 20px;

  border-left: 4px solid var(--color-background-dark);
`;

const FooterLine4 = styled.div`
  background-color: var(--color-primary-01);
  padding-block: 18px;

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  svg {
    min-width: 24px;
  }

  span {
    color: var(--text-high-on-dark);
  }

  @media (max-width: 640px) {
    text-align: center;

    .container > * {
      max-width: 240px;
    }
  }
`;

const FooterLine5 = styled.div`
  background-color: var(--color-primary-06);
  padding-block: 12px;

  > div {
    display: flex;
    justify-content: center;
  }
`;

const MobileSocial = styled.div`
  display: none;

  @media (max-width: 640px) {
    display: block;
  }
`;

const DesktopSocial = styled.div`
  @media (max-width: 640px) {
    display: none;
  }
`;
