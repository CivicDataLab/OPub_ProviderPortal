import { ChevronLeft, ChevronRight } from '@opub-icons/workflow';
import { Carousel } from 'components/layouts';
import { Link } from 'components/layouts/Link';
import Image from 'next/image';
import styled from 'styled-components';
import { useWindowSize } from 'utils/hooks';

export const HomeCarousel = ({ homeBannerImages }) => {
  const { width } = useWindowSize();

  return (
    homeBannerImages.length > 0 && (
      <BannerContainer>
        <Carousel
          prevBtn={<ChevronLeft aria-label="Previous Image" />}
          nextBtn={<ChevronRight aria-label="Next Image" />}
          label={'Home Banner Carousal'}
        >
          {homeBannerImages?.map((banner, index) => (
            <div key={`Banner-${index}`}>
              {banner?.link ? (
                <Link
                  external
                  href={banner?.link}
                  target="_blank"
                  style={{ minWidth: '100%' }}
                >
                  <Image
                    src={
                      width > 800
                        ? `${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URL}/cms${banner?.desktop?.url}`
                        : `${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URL}/cms${banner?.mobile?.url}`
                    }
                    alt={banner.desktop.alternativeText}
                    width={width > 800 ? 1600 : 480}
                    height={300}
                    className="img-cover"
                  />
                </Link>
              ) : (
                <Image
                  src={
                    width > 800
                      ? `${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URL}/cms${banner?.desktop?.url}`
                      : `${process.env.NEXT_PUBLIC_INTERNAL_BACKEND_URL}/cms${banner?.mobile?.url}`
                  }
                  alt={banner.desktop.alternativeText}
                  width={width > 800 ? 1600 : 480}
                  height={300}
                  className="img-cover"
                />
              )}
            </div>
          ))}
        </Carousel>
      </BannerContainer>
    )
  );
};

const BannerContainer = styled.div`
  span,
  img {
    min-width: 100%;
  }
`;
