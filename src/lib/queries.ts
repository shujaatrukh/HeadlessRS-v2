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

/* ---------------- Navigation ---------------- */

export const GET_PRIMARY_MENU = gql`
  query GetPrimaryMenu {
    menuItems(where: { location: PRIMARY }, first: 100) {
      nodes {
        id
        databaseId
        parentId
        parentDatabaseId
        label
        uri
        url
        target
      }
    }
  }
`;

/* ---------------- Products / Shop ---------------- */

export const PRODUCT_CARD_FIELDS = gql`
  fragment ProductCardFields on Product {
    id
    databaseId
    slug
    name
    shortDescription
    image {
      sourceUrl
      altText
    }
    ... on SimpleProduct {
      price
      regularPrice
      salePrice
    }
  }
`;

export const GET_PRODUCTS = gql`
  ${PRODUCT_CARD_FIELDS}
  query GetProducts {
    products(first: 24, where: { status: "publish" }) {
      nodes {
        ...ProductCardFields
      }
    }
  }
`;

export const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      databaseId
      slug
      name
      description
      shortDescription
      image {
        sourceUrl
        altText
      }
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
        virtual
      }
    }
  }
`;

/* ---------------- Cart ---------------- */

export const GET_CART = gql`
  query GetCart {
    cart {
      isEmpty
      subtotal
      total
      contents {
        nodes {
          key
          quantity
          total
          product {
            node {
              id
              databaseId
              name
              slug
              image {
                sourceUrl
                altText
              }
              ... on SimpleProduct {
                price
              }
            }
          }
        }
      }
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($productId: Int!, $quantity: Int!) {
    addToCart(input: { productId: $productId, quantity: $quantity }) {
      cart {
        isEmpty
        subtotal
        total
        contents {
          nodes {
            key
            quantity
            total
          }
        }
      }
    }
  }
`;

export const UPDATE_CART_ITEM_QUANTITIES = gql`
  mutation UpdateCartItemQuantities($items: [CartItemQuantityInput]) {
    updateItemQuantities(input: { items: $items }) {
      cart {
        isEmpty
        subtotal
        total
        contents {
          nodes {
            key
            quantity
            total
          }
        }
      }
    }
  }
`;

export const REMOVE_ITEMS_FROM_CART = gql`
  mutation RemoveItemsFromCart($keys: [ID]) {
    removeItemsFromCart(input: { keys: $keys }) {
      cart {
        isEmpty
        subtotal
        total
        contents {
          nodes {
            key
            quantity
            total
          }
        }
      }
    }
  }
`;

/* ---------------- Checkout ---------------- */

export const CHECKOUT = gql`
  mutation Checkout($input: CheckoutInput!) {
    checkout(input: $input) {
      result
      redirect
      order {
        id
        databaseId
        orderNumber
        status
        total
      }
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($id: ID!) {
    order(id: $id, idType: DATABASE_ID) {
      orderNumber
      status
      total
      date
      lineItems {
        nodes {
          product {
            node {
              slug
              name
            }
          }
        }
      }
    }
  }
`;
