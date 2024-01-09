import { gql, useQuery } from "@apollo/client";
import { useAppSelector } from "../../app/hooks";
import { getCurrentShop } from "../../app/slices/shops";

const GetShopDetails = () => {
  const currentShop = useAppSelector(getCurrentShop);

  const GET_SHOP = gql`
    query GetShop($shopId: ID) {
      getShop(shopId: $shopId) {
        result {
          shopId
          shopName
          shopAddress
          shopPhone
          isPublished
          city
          state
          userId
          shopApprovalStatus
          rejectionReason
          updatedAt
          createdAt
          Images {
            smallImageOnlineURL
            mediumImageOnlineURL
            largeImageOnlineURL
          }
          User {
            firstName
            lastName
            fullName
            email
            mobileNumber
            Images {
              smallImageOnlineURL
              mediumImageOnlineURL
              largeImageOnlineURL
            }
          }
          shopCategoryId
          shopCategoryName
          checkoutMethod
          latitude
          longitude
          currencyCode
          distance
          isDisabled
          discountEnabled
          maximumDiscount
          deviceLocked
          isExpiryDateEnabled
          ShopURL {
            shopTag
          }
        }
      }
    }
  `;

  const { data, error, loading } = useQuery(GET_SHOP, {
    variables: {
      shopId: currentShop.shopId,
    },
  });
  return { data, error, loading };
};

export default GetShopDetails;
