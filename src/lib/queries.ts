import { gql } from "@apollo/client";

export const SEO_FRAGMENT = gql`
  fragment SeoFields on PostTypeSEO {
    title
    metaDesc
    canonical
    opengraphTitle
    opengraphDescription
    opengraphImage {
      sourceUrl
    }
  }
`;

export const GET_PAGE_BY_URI = gql`
  ${SEO_FRAGMENT}
  query GetPageByUri($uri: String!) {
    nodeByUri(uri: $uri) {
      __typename
      ... on Page {
        id
        title
        content
        seo {
          ...SeoFields
        }
      }
      ... on Post {
        id
        title
        content
        date
        seo {
          ...SeoFields
        }
      }
    }
  }
`;

export const GET_FRONT_PAGE = gql`
  ${SEO_FRAGMENT}
  query GetFrontPage {
    generalSettings {
      title
      description
    }
    nodeByUri(uri: "/") {
      __typename
      ... on Page {
        id
        title
        content
        seo {
          ...SeoFields
        }
      }
    }
  }
`;

export const GET_ALL_URIS = gql`
  query GetAllUris {
    pages(first: 100) {
      nodes {
        uri
      }
    }
    posts(first: 100) {
      nodes {
        uri
      }
    }
  }
`;
