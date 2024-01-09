export interface IImage {
  imageId?: string;
  shopId?: string;
  userId?: string;
  inventoryId?: string;
  localURL?: string;
  smallImageOnlineURL?: string;
  mediumImageOnlineURL?: string;
  largeImageOnlineURL?: string;
  imageApprovalStatus?: string;
  rejectionReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
