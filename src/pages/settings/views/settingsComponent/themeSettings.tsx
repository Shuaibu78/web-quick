import { useEffect, useState } from "react";
import { BoxHeading, ChooseSize, FontSizeContainer, SizeSpan } from "../../settingsComps.style";
import { useAppSelector } from "../../../../app/hooks";
import { updateAppSize } from "../../../../app/slices/userPreferences";
import { useDispatch } from "react-redux";

const ThemeSettings = () => {
  const preferences = useAppSelector((state) => state.userPreferences.preferences);
  const currentUserId = useAppSelector((state) => state.user.userId);
  const userPreference = preferences.find((user) => user.userId === currentUserId);
  const [docFont, setDocFont] = useState<string>(userPreference?.appSize as string);
  const dispatch = useDispatch();

  console.log(userPreference);

  const handleFontChange = (font: string) => {
    dispatch(
      updateAppSize({
        userId: currentUserId as string,
        hideSalesNav: userPreference?.hideSalesNav as boolean,
        hideProductsNav: userPreference?.hideProductsNav as boolean,
        appSize: font as string,
      })
    );
    setDocFont(font);
    console.log(font);
  };

  useEffect(() => {
    setDocFont(userPreference?.appSize as string);
  }, []);

  return (
    <>
      <BoxHeading>
        Theme Settings
        <p>
          Make chnages to the theme and improve your <b>Timart</b> experience.
        </p>
      </BoxHeading>
      <FontSizeContainer>
        <h4>Font Size</h4>
        <div>
          <h6>Aa</h6>
          <ChooseSize>
            <SizeSpan
              onClick={() => handleFontChange("12px")}
              active={docFont === "12px"}
              className="font-size-1 active"
            ></SizeSpan>{" "}
            {/* 0.75rem */}
            <SizeSpan
              onClick={() => handleFontChange("14px")}
              active={docFont === "14px"}
              className="font-size-2"
            ></SizeSpan>{" "}
            {/* 0.875rem */}
            <SizeSpan
              onClick={() => handleFontChange("16px")}
              active={docFont === "16px"}
              className="font-size-3"
            ></SizeSpan>{" "}
            {/* 1rem */}
            <SizeSpan
              onClick={() => handleFontChange("18px")}
              active={docFont === "18px"}
              className="font-size-4"
            ></SizeSpan>{" "}
            {/* 1.125rem */}
            <SizeSpan
              onClick={() => handleFontChange("20px")}
              active={docFont === "20px"}
              className="font-size-5"
            ></SizeSpan>{" "}
            {/* 1.25rem */}
          </ChooseSize>
          <h3>Aa</h3>
        </div>
      </FontSizeContainer>
    </>
  );
};

export default ThemeSettings;
