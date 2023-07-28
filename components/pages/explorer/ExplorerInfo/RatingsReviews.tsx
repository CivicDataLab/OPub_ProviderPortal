import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Rating } from 'react-simple-star-rating';
import { Button } from 'components/actions';
import { useQuery } from '@apollo/client';
import { GET_RATINGS_REVIEWS } from 'services';
import { Heading, Separator } from 'components/layouts';
import { Text } from 'components/layouts';
import { TextArea } from 'components/form';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { signIn, useSession } from 'next-auth/react';
import { convertDateFormat } from 'utils/helper';
import { Flex } from 'components/layouts/FlexWrapper';
import Captcha from './Captcha';

const RatingsReviews = ({ handleSubmitCallback, datasetID }) => {
  const [rating, setRating] = useState(1);
  const [ratingReviews, setRatingsReviews] = useState([]);
  const [validateCaptcha, setValidateCaptcha] = React.useState<
    'new' | 'mismatch' | 'match'
  >('new');

  const { data: session } = useSession();

  const validationSchema = Yup.object().shape({
    review: Yup.string()
      .required('Required')
      .min(10, 'More than 10 characters'),
  });

  const formik: any = useFormik({
    initialValues: {
      review: '',
    },
    validationSchema,
    validateOnChange: false,
    onSubmit: (values, { resetForm }) => {
      if (validateCaptcha === 'match') {
        setValidateCaptcha('new');
        const submitValues = { ...values };
        handleSubmitCallback(submitValues.review, rating, () => {
          resetForm();
          setRating(1);
        });
      } else {
        setValidateCaptcha('mismatch');
      }
    },
  });

  const RatingsReviewsRes = useQuery(GET_RATINGS_REVIEWS, {
    variables: {
      dataset_id: datasetID,
    },
  });

  useEffect(() => {
    if (RatingsReviewsRes?.data?.dataset_rating?.length > 0) {
      const filteredRatings = RatingsReviewsRes.data.dataset_rating.filter(
        (item) => item.status === 'PUBLISHED'
      );
      setRatingsReviews(filteredRatings);
    }
  }, [RatingsReviewsRes.loading]);

  // Catch Rating value
  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const { errors } = formik;

  return (
    <RatingsReviewsWrapper
      noReviews={ratingReviews.length === 0}
      session={session}
    >
      <div className="ratingsContainer">
        {ratingReviews.length > 0 ? (
          <div className="RatingsReviewsList">
            {ratingReviews.map((reviewItem, index) => (
              <>
                <div key={`ReviewItem-${index}`}>
                  <Flex gap="12px">
                    <Text color={'var(--text-high)'} variant="pt14b">
                      @{reviewItem.user}
                    </Text>
                    <Rating
                      size={15}
                      readonly={true}
                      initialValue={reviewItem.data_quality}
                    />
                  </Flex>
                  <Text color={'var(--text-medium)'} variant="pt14">
                    Reviewed on {convertDateFormat(reviewItem.issued)}
                  </Text>
                  <Text color={'var(--text-high)'} variant="pt16">
                    {reviewItem.review}
                  </Text>
                </div>
                <Separator className="review_list--separator" />
              </>
            ))}
          </div>
        ) : (
          <Text
            variant="pt16b"
            color={'var(--text-medium)'}
            textAlign={'center'}
          >
            {session && 'Be the first one to review'}
          </Text>
        )}
        {session ? (
          <>
            <Heading as={'h3'} variant="h5" className="ratings_submit__wrapper">
              Share Your Rating & Review
            </Heading>
            <Rating
              initialValue={rating}
              key={`stars-${rating}`}
              onClick={handleRating}
            />

            <FeedbackForm onSubmit={formik.handleSubmit}>
              <TextArea
                label="Add your review and submit"
                name="review"
                minLength={10}
                maxLength={500}
                value={formik.values.review}
                onChange={(e) => {
                  formik.setFieldValue('review', e.replaceAll(/[<>]/g, ''));
                  errors.description && formik.validateField('review');
                }}
                errorMessage={errors.review}
                rows={10}
                isRequired
                placeholder="This will be visible to all users. To share your comments directly with the Data Provider, click on Contact Data Provider on the right."
              />

              <Captcha
                setValidateCaptcha={setValidateCaptcha}
                ValidateCaptcha={validateCaptcha}
              />

              <Button size="sm" onPress={(e) => formik.handleSubmit(e)}>
                Submit
              </Button>
            </FeedbackForm>
          </>
        ) : (
          <Flex
            justifyContent={'space-between'}
            alignItems={'center'}
            flexWrap={'wrap'}
            gap="10px"
          >
            <Text variant="pt16" color={'var(--text-medium)'}>
              <SignInText>
                Please sign in or register to share rating and review.
              </SignInText>
            </Text>
            <Button
              kind="primary-outline"
              onPress={() => {
                if (typeof window !== 'undefined') {
                  signIn('keycloak', {
                    callbackUrl: `${window.location.href}?clientLogin=true`,
                  });
                }
              }}
            >
              Sign In / Register
            </Button>
          </Flex>
        )}
      </div>
    </RatingsReviewsWrapper>
  );
};

export default RatingsReviews;

const RatingsReviewsWrapper = styled.div<any>`
  .ratingsContainer {
    background: var(--color-white);
    box-shadow: var(--box-shadow);
    padding: 16px;
    display: flex;
    flex-direction: column;

    .ratings_submit__wrapper {
      margin-top: 24px;
    }

    > div {
      margin-block: 16px;
    }
  }

  .RatingsReviewsList {
    text-align: left;

    > div {
      display: flex;
      flex-direction: column;
    }

    .review_list--separator {
      margin: 16px 0;
    }
  }

  @media (max-width: 640px) {
    .ratingsContainer {
      box-shadow: none;
      padding: 0;

      > div {
        margin-block: 0;
      }
    }
  }
`;

const FeedbackForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 18px;
  > button {
    margin: 16px 0 0 auto;
  }
`;

const CaptchaContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  div:first-child {
    flex: 1 1 auto;
  }
  div:last-child {
    display: flex;
    flex-direction: row;
    margin: auto;
  }
  img {
    padding-right: 10px;
  }
`;

const SignInText = styled.span`
  white-space: break-spaces;
`;
