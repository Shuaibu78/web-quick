export interface UsersAttr {
  userId?: string;
  businessName?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  mobileNumber?: string | null;
  merchantId?: string;
  isMerchant?: boolean;
  isDisabled?: boolean;
  personalReferralCode?: string;
  isEmailVerified?: boolean;
  isMobileNumberVerified?: boolean;
  countryCode?: string;
  User?: UsersAttr;
  UserShops?: any;
  Cashier?: UsersAttr;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  lastSeen?: Date;
  lastAction?: Date;
}

export interface UserCredentialsAttr {
  userCredentialId?: string;
  userId?: string;
  pin?: string;
  token?: string;
  User?: UsersAttr;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IUserInvite {
  inviteId?: string;
  shopId?: string;
  userId?: string;
  roleId?: string;
  Role: {
    roleId?: string;
    shopId?: string;
    roleName?: string;
    rolePermissions?: string;
    defaultRole?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  };
  email?: string;
  mobileNumber?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ConfirmUserPInAttr {
  pin: string;
  userId: string;
}

export interface IUpdateUser {
  updateUser: {
    userId: string;
    businessName: string;
    firstName: string;
    lastName: string;
    mobileNumber: number;
    fullName: string;
    email: string;
  };
}
