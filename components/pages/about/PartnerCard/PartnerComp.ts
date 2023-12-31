import styled from 'styled-components';

const PartnersCard = styled.div`
  background-color: #fff;
  padding: 1.5rem !important;
  border-radius: 12px;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08));
  border: 1px solid #f1eef1;

  .partners__header {
    display: flex;
    align-items: flex-start;

    img, h4 {
      cursor: pointer;
    }
  }

  h4 {
    font-size: 1.3rem;
    font-weight: 500;
    line-height: 133%;
  }

  small {
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: $text-light-light;
    font-weight: 500;
  }

  .partners__image {
    object-fit: contain;
    border-radius: 4px;
    background: black;
  }

  section {
    border-bottom: 1px solid #f1eef1;
    width: 100%;
    padding-bottom: 10px;
    margin-left: 1.25rem;

  }

  .partners__social {
    margin-top: 1rem;
  }

  .partners--dark-img {
    background-color: #222;
  }

  .partners__body {
    padding: 1.25rem 0;
    border-bottom: 1px solid #f1eef1;

    p {
      line-height: 137%;
      margin-bottom: 0.5rem;
    }
  }

  .partners__footer {
    line-height: 137%;
    padding-top: 0.8rem;
    display: block;
    color: #076775;
    text-decoration: none;
  }
`;

export default PartnersCard;
