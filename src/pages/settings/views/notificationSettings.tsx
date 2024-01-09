import { useEffect, useState } from "react";
import { Flex } from "../../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../../GlobalStyles/theme";
import CustomRadioInput from "../../../components/customRadioInput/customRadioInput";
import { BoxHeading, SettingsBox, ShopTitleCont } from "../settingsComps.style";
import CustomRadioInputWrapper from "../../../components/customRadioInput/radioInputWrapper";
import {
  GET_NOTIFICATION_PREFERENCE,
  UPDATE_NOTIFICATION_PREFERENCE,
} from "../../../schema/settings.schema";
import { useMutation, useQuery } from "@apollo/client";
import { useAppSelector } from "../../../app/hooks";
import { getCurrentShop } from "../../../app/slices/shops";
import { useDispatch } from "react-redux";
import { isLoading } from "../../../app/slices/status";
import set from "date-fns/fp/set/index";
import { IAdditionalFeatures } from "../../../interfaces/subscription.interface";
import { checkPackageLimits } from "../../subscriptions/util/packageUtil";

export type NotificationType =
  | "LowProductAlert"
  | "ExpiryDateAlert"
  | "DailySalesReport"
  | "WeeklySalesReport"
  | "MonthlySalesReport";

type NotificationKey = "push" | "email";

interface INotificationPreference {
  notificationPreferenceId: string;
  userId: string;
  shopId: string;
  key: NotificationType;
  push: boolean;
  email: boolean;
  createdAt: string;
  updatedAt: string;
  DeletedAt: string;
}

const NotificationSettings = () => {
  const currentShop = useAppSelector(getCurrentShop);
  const [pushNotifications, setPushNotifications] = useState<boolean>(false);
  const [lowProductAlert, setLowProductAlert] = useState<boolean>(false);
  const [expiryDate, setExpiryDate] = useState<boolean>(false);
  const [salesReport, setSalesReport] = useState<boolean>(false);
  const [weeklySalesReport, setWeeklySalesReport] = useState<boolean>(false);
  const [monthlySalesReport, setMonthlySalesReport] = useState<boolean>(false);

  const [emailNotifications, setEmailNotifications] = useState<boolean>(false);
  const [emailLowProductAlert, setEmailLowProductAlert] = useState<boolean>(false);
  const [EmailExpiryDate, setEmailExpiryDate] = useState<boolean>(false);
  const [emailSalesReport, setEmailSalesReport] = useState<boolean>(false);
  const [emailWeeklySalesReport, setEmailOWeeklySalesReport] = useState<boolean>(false);
  const [emailMonthlySalesReport, setEmailOMonthlySalesReport] = useState<boolean>(false);

  const { subscriptions } = useAppSelector((state) => state);
  const userSubscriptions = subscriptions?.subscriptions[0] || [];
  const subscriptionPackages = subscriptions?.subscriptionPackages || [];
  const featureCount = subscriptions?.featureCount || {};
  const dispatch = useDispatch();

  const checkPackageLimit = (check: IAdditionalFeatures["check"]) =>
    checkPackageLimits(
      userSubscriptions.packageNumber,
      subscriptionPackages,
      featureCount,
      dispatch,
      check
    );

  const { data, refetch } = useQuery(GET_NOTIFICATION_PREFERENCE, {
    variables: { shopId: currentShop?.shopId },
  });

  const preferences = (data?.getAllNotificationPreference as INotificationPreference[]) || [];

  useEffect(() => {
    for (let index = 0; index < preferences.length; index++) {
      const element = preferences[index];
      if (element.key === "LowProductAlert") {
        setLowProductAlert(element.push);
        setEmailLowProductAlert(element.email);
      } else if (element.key === "ExpiryDateAlert") {
        setExpiryDate(element.push);
        setEmailExpiryDate(element.email);
      } else if (element.key === "DailySalesReport") {
        setSalesReport(element.push);
        setEmailSalesReport(element.email);
      } else if (element.key === "WeeklySalesReport") {
        setWeeklySalesReport(element.push);
        setEmailOWeeklySalesReport(element.email);
      } else if (element.key === "MonthlySalesReport") {
        setMonthlySalesReport(element.push);
        setEmailOMonthlySalesReport(element.email);
      }

      if (element.push) {
        setPushNotifications(element.push);
      }
      if (element.email) {
        setEmailNotifications(element.email);
      }
    }
  }, [preferences, data]);

  const [updateNotificationPreference] = useMutation(UPDATE_NOTIFICATION_PREFERENCE);

  const handleChangeStatus = (
    setChangeStatus: React.Dispatch<React.SetStateAction<boolean>>,
    value: boolean,
    key: string,
    type: string
  ) => {
    const isProgress = checkPackageLimit("WeeklyAndMonthlyReport");
    if (!isProgress) return;
    setChangeStatus(value);
    updateNotificationPreference({
      variables: {
        shopId: currentShop?.shopId,
        key: type,
        type: key,
        value,
      },
    }).then((datum: any) => {
      console.log(datum?.data?.updateNotificationPreference?.successful);
      if (datum?.data?.updateNotificationPreference?.successful) {
        refetch();
      }
    });
  };

  const handleChangeNotificationMode = async (key: string, value: boolean, index = 0) => {
    try {
      const isProgress = checkPackageLimit("WeeklyAndMonthlyReport");
      if (!isProgress) return;
      dispatch(isLoading(true));
      await updateNotificationPreference({
        variables: {
          shopId: currentShop?.shopId,
          key: "LowProductAlert",
          type: key,
          value: value,
        },
      });

      await updateNotificationPreference({
        variables: {
          shopId: currentShop?.shopId,
          key: "ExpiryDateAlert",
          type: key,
          value: value,
        },
      });

      await updateNotificationPreference({
        variables: {
          shopId: currentShop?.shopId,
          key: "DailySalesReport",
          type: key,
          value: value,
        },
      });

      await updateNotificationPreference({
        variables: {
          shopId: currentShop?.shopId,
          key: "WeeklySalesReport",
          type: key,
          value: value,
        },
      });

      await updateNotificationPreference({
        variables: {
          shopId: currentShop?.shopId,
          key: "MonthlySalesReport",
          type: key,
          value: value,
        },
      });

      refetch();
      if (key === "push") {
        setPushNotifications(value);
      } else {
        setEmailNotifications(value);
      }
      dispatch(isLoading(false));
    } catch (error) {
      refetch();
      console.error(error);
      dispatch(isLoading(false));
    }
  };

  return (
    <SettingsBox overflow>
      <BoxHeading>
        Notification
        <p>Select the kind of notifications you want to get on your activities and our services</p>
      </BoxHeading>

      <Flex
        border={`1px solid ${Colors.borderGreyColor}`}
        margin="1.25rem 0px"
        borderRadius="0.75rem"
        width="80%"
        direction="column"
        padding="0.3125rem 0 0.625rem 0"
      >
        <Flex margin="0 0 0.3125rem 0" alignItems="flex-start">
          <div style={{ display: "flex", flexDirection: "column", rowGap: "1.5rem", width: "45%" }}>
            {/* TODO: change design */}
            <CustomRadioInputWrapper
              radioValue={pushNotifications}
              handleChange={() => handleChangeNotificationMode("push", !pushNotifications)}
              radioText="Push Notifications"
              radioHelperText="Get push notifactions in-app to get infomation from Timart and your business on the
                following."
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", rowGap: "" }}>
            <CustomRadioInputWrapper
              radioValue={lowProductAlert}
              handleChange={() =>
                handleChangeStatus(setLowProductAlert, !lowProductAlert, "push", "LowProductAlert")
              }
              radioText="Low product alert"
              radioHelperText="Get notified when product quantity is low."
            />
            <CustomRadioInputWrapper
              radioValue={expiryDate}
              handleChange={() =>
                handleChangeStatus(setExpiryDate, !expiryDate, "push", "ExpiryDateAlert")
              }
              radioText="Expiry date alert"
              radioHelperText="Recieve notification on products with expiry date set on them."
            />
            <CustomRadioInputWrapper
              radioValue={salesReport}
              handleChange={() =>
                handleChangeStatus(setSalesReport, !salesReport, "push", "DailySalesReport")
              }
              radioText="Daily Sales report"
              radioHelperText="Recieve notification on daily sales report."
            />
            <CustomRadioInputWrapper
              radioValue={weeklySalesReport}
              handleChange={() =>
                handleChangeStatus(
                  setWeeklySalesReport,
                  !weeklySalesReport,
                  "push",
                  "WeeklySalesReport"
                )
              }
              radioText="Weekly Sales report"
              radioHelperText="Recieve notification on weekly sales report"
            />
            <CustomRadioInputWrapper
              radioValue={monthlySalesReport}
              handleChange={() =>
                handleChangeStatus(
                  setMonthlySalesReport,
                  !monthlySalesReport,
                  "push",
                  "MonthlySalesReport"
                )
              }
              radioText="Monthly Sales report"
              radioHelperText="Get notified on monthly sales report."
            />
          </div>
        </Flex>
      </Flex>

      <Flex
        border={`1px solid ${Colors.borderGreyColor}`}
        margin="1.25rem 0px"
        borderRadius="0.75rem"
        width="80%"
        direction="column"
        padding="0.3125rem 0 0.625rem 0"
      >
        <Flex margin="0 0 0.3125rem 0" alignItems="flex-start">
          <div style={{ display: "flex", flexDirection: "column", rowGap: "1.5rem", width: "45%" }}>
            {/* TODO: change design */}
            <CustomRadioInputWrapper
              radioValue={emailNotifications}
              handleChange={() => handleChangeNotificationMode("email", !emailNotifications)}
              radioText="Email Notifications"
              radioHelperText="Get push notifactions to your mail on infomation from Timart and
your business on the following."
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", rowGap: "" }}>
            <CustomRadioInputWrapper
              radioValue={emailLowProductAlert}
              handleChange={() =>
                handleChangeStatus(
                  setEmailLowProductAlert,
                  !emailLowProductAlert,
                  "email",
                  "LowProductAlert"
                )
              }
              radioText="Low product alert"
              radioHelperText="Get notified when product quantity is low."
            />
            <CustomRadioInputWrapper
              radioValue={EmailExpiryDate}
              handleChange={() =>
                handleChangeStatus(setEmailExpiryDate, !EmailExpiryDate, "email", "ExpiryDateAlert")
              }
              radioText="Expiry date alert"
              radioHelperText="Recieve notification on products with expiry date set on them."
            />
            <CustomRadioInputWrapper
              radioValue={emailSalesReport}
              handleChange={() =>
                handleChangeStatus(
                  setEmailSalesReport,
                  !emailSalesReport,
                  "email",
                  "DailySalesReport"
                )
              }
              radioText="Sales report"
              radioHelperText="Recieve notification on daily sales report."
            />
            <CustomRadioInputWrapper
              radioValue={emailWeeklySalesReport}
              handleChange={() =>
                handleChangeStatus(
                  setEmailOWeeklySalesReport,
                  !emailWeeklySalesReport,
                  "email",
                  "WeeklySalesReport"
                )
              }
              radioText="Weekly sales report"
              radioHelperText="Get notified on weekly sales report"
            />
            <CustomRadioInputWrapper
              radioValue={emailMonthlySalesReport}
              handleChange={() =>
                handleChangeStatus(
                  setEmailOMonthlySalesReport,
                  !emailMonthlySalesReport,
                  "email",
                  "MonthlySalesReport"
                )
              }
              radioText="Monthly sales report"
              radioHelperText="Get notified on monthly sales report"
            />
          </div>
        </Flex>
      </Flex>
    </SettingsBox>
  );
};

export default NotificationSettings;
