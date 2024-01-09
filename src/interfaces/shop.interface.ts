export interface IShop {
  userId?: string;
  shopId?: string;
  shopName?: string;
  shopAddress?: string;
  isPublished?: boolean;
  city?: string;
  state?: string;
  shopPhone?: string;
  distance?: number;
  latitude?: number;
  longitude?: number;
  createdAt?: string;
  shopCategoryId?: string;
  shopCategoryName?: string;
  checkoutMethod?: string;
  shopApprovalStatus?: string;
  ShopURL?: ShopURL;
  discountEnabled?: boolean;
  isExpiryDateEnabled?: boolean;
  currencyCode?: string;
  maximumDiscount?: number;
  Images?: [Images];
  isSurplusEnabled?: boolean;
  shouldMakeSalesWithoutCashier?: boolean;
}

interface Images {
  largeImageOnlineURL?: string;
  mediumImageOnlineURL?: string;
  smallImageOnlineURL?: string;
}

export interface ShopURL {
  shopTag: string;
  shopId: string;
}

export interface Shop {
  shopId?: string;
  shopName?: string;
  shopAddress?: string;
  shopPhone?: string;
  distance?: number;
  latitude?: number;
  longitude?: number;
  ShopURL?: ShopURL;
  Images?: [
    {
      largeImageOnlineURL: string;
      mediumImageOnlineURL: string;
      smallImageOnlineURL: string;
    }
  ];
}

export interface PushNotificationPayload {
  shopId?: string;
  title?: string;
  message?: string;
  data: Record<string, any>;
}

export interface DEVICE_UUID {
  generateDeviceId: {
    deviceUUID: string;
  };
}
