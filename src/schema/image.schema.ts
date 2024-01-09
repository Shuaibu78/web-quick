import { gql } from "@apollo/client";

export const UPLOAD_IMAGE = gql`
  mutation uploadImage($shopId: ID!, $inventoryId: ID, $key: String, $userId: ID, $files: Upload!) {
    uploadImage(
      shopId: $shopId
      inventoryId: $inventoryId
      key: $key
      userId: $userId
      files: $files
    ) {
      imageId
      shopId
      userId
      inventoryId
      localURL
      smallImageOnlineURL
      mediumImageOnlineURL
      largeImageOnlineURL
      imageApprovalStatus
      rejectionReason
      createdAt
      updatedAt
    }
  }
`;

export const PRODUCT_IMAGE_SEARCH = gql`
  query ProductImageSearch($searchQuery: String!) {
    productImageSearch(searchQuery: $searchQuery) {
      _id
      title
      link
      height
      width
      byteSize
      thumbnailLink
      thumbnailHeight
      thumbnailWidth
      productId
    }
  }
`;

export const DOWNLOAD_IMAGE = gql`
  query DownloadSelectedImage($url: String!, $productName: String!) {
    downloadSelectedImage(url: $url, productName: $productName) {
      relativePath
      absolutePath
    }
  }
`;

export const REMOVE_IMAGE = gql`
  query RemoveImage($imageId: String!) {
    removeImage(imageId: $imageId) {
      success
      message
    }
  }
`;
