import React from "react";

export const CartIcon = ({ color }: { color?: string }) => {
  return (
    <svg width="37" height="34" viewBox="0 0 37 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M25.0697 13.7759C24.6066 13.2294 23.9334 12.9151 23.2253 12.9151H10.6898C10.2068 12.9151 9.81478 13.3151 9.81478 13.808C9.81478 14.3009 10.2068 14.7009 10.6898 14.7009H23.2253C23.4994 14.7009 23.6698 14.8533 23.7468 14.9438C23.8238 15.0355 23.9474 15.2295 23.9078 15.5057L22.8006 23.3145C22.7131 23.9264 22.1905 24.3884 21.5838 24.3884H8.85464C8.20949 24.3884 7.68333 23.8943 7.62967 23.2395L6.5062 9.58161C6.47353 9.17682 6.17604 8.84466 5.78405 8.77561L3.35628 8.34583C2.87445 8.26725 2.42647 8.58751 2.3448 9.07444C2.26314 9.56018 2.58163 10.0221 3.05762 10.1066L4.81924 10.4174L5.88555 23.3883C6.01621 24.9765 7.29251 26.1742 8.85464 26.1742H21.5838C23.0549 26.1742 24.3219 25.0551 24.5319 23.5705L25.6402 15.7617C25.7417 15.045 25.5329 14.3223 25.0697 13.7759ZM6.8913 29.8648C6.8913 28.8707 7.68462 28.0612 8.65876 28.0612C9.6329 28.0612 10.425 28.8707 10.425 29.8648C10.425 30.8589 9.6329 31.6673 8.65876 31.6673C7.68462 31.6673 6.8913 30.8589 6.8913 29.8648ZM20.0195 29.8648C20.0195 28.8707 20.8116 28.0612 21.7858 28.0612C22.7599 28.0612 23.5532 28.8707 23.5532 29.8648C23.5532 30.8589 22.7599 31.6673 21.7858 31.6673C20.8116 31.6673 20.0195 30.8589 20.0195 29.8648ZM20.5889 18.209C20.5889 18.7019 20.1969 19.1019 19.7139 19.1019H16.4788C15.9947 19.1019 15.6039 18.7019 15.6039 18.209C15.6039 17.7161 15.9947 17.3161 16.4788 17.3161H19.7139C20.1969 17.3161 20.5889 17.7161 20.5889 18.209Z"
        fill={color || "#E47D05"}
      />
      <rect x="30.4297" width="1.03702" height="11.7529" rx="0.518512" fill={color || "#E47D05"} />
      <rect
        x="37"
        y="5.53125"
        width="1.03702"
        height="11.7529"
        rx="0.518512"
        transform="rotate(90 37 5.53125)"
        fill={color || "#E47D05"}
      />
    </svg>
  );
};

export const ShopIcon = ({ color }: { color?: string }) => {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.6667 5.10242C16.6707 5.04971 16.6707 4.99678 16.6667 4.94407L15 0.777085C14.9349 0.612369 14.819 0.472676 14.6692 0.378268C14.5194 0.28386 14.3433 0.239648 14.1667 0.252045H2.5C2.3331 0.251883 2.17 0.301844 2.03182 0.395456C1.89364 0.489069 1.78675 0.622019 1.725 0.777085L0.0583333 4.94407C0.0543164 4.99678 0.0543164 5.04971 0.0583333 5.10242C0.0306423 5.14881 0.0109246 5.19952 0 5.25243C0.00927549 5.82851 0.167688 6.39235 0.459787 6.88896C0.751886 7.38556 1.1677 7.79798 1.66667 8.08598V16.0866C1.66667 16.3076 1.75446 16.5196 1.91074 16.6759C2.06702 16.8322 2.27899 16.92 2.5 16.92H14.1667C14.3877 16.92 14.5996 16.8322 14.7559 16.6759C14.9122 16.5196 15 16.3076 15 16.0866V8.11932C15.5038 7.82845 15.9227 7.41078 16.2151 6.90784C16.5075 6.4049 16.6632 5.83419 16.6667 5.25243C16.6745 5.20273 16.6745 5.15212 16.6667 5.10242ZM9.16667 15.2532H7.5V11.9196H9.16667V15.2532ZM13.3333 15.2532H10.8333V11.0862C10.8333 10.8652 10.7455 10.6532 10.5893 10.4969C10.433 10.3406 10.221 10.2528 10 10.2528H6.66667C6.44565 10.2528 6.23369 10.3406 6.07741 10.4969C5.92113 10.6532 5.83333 10.8652 5.83333 11.0862V15.2532H3.33333V8.58602C3.80789 8.58334 4.27641 8.47936 4.70754 8.28102C5.13868 8.08268 5.5225 7.79456 5.83333 7.43593C6.14614 7.79065 6.53084 8.07474 6.96187 8.26933C7.39291 8.46392 7.86042 8.56456 8.33333 8.56456C8.80625 8.56456 9.27376 8.46392 9.70479 8.26933C10.1358 8.07474 10.5205 7.79065 10.8333 7.43593C11.1442 7.79456 11.528 8.08268 11.9591 8.28102C12.3903 8.47936 12.8588 8.58334 13.3333 8.58602V15.2532ZM13.3333 6.91923C12.8913 6.91923 12.4674 6.74362 12.1548 6.43103C11.8423 6.11845 11.6667 5.69449 11.6667 5.25243C11.6667 5.0314 11.5789 4.81942 11.4226 4.66313C11.2663 4.50684 11.0543 4.41903 10.8333 4.41903C10.6123 4.41903 10.4004 4.50684 10.2441 4.66313C10.0878 4.81942 10 5.0314 10 5.25243C10 5.69449 9.82441 6.11845 9.51184 6.43103C9.19928 6.74362 8.77536 6.91923 8.33333 6.91923C7.89131 6.91923 7.46738 6.74362 7.15482 6.43103C6.84226 6.11845 6.66667 5.69449 6.66667 5.25243C6.66667 5.0314 6.57887 4.81942 6.42259 4.66313C6.26631 4.50684 6.05435 4.41903 5.83333 4.41903C5.61232 4.41903 5.40036 4.50684 5.24408 4.66313C5.0878 4.81942 5 5.0314 5 5.25243C5.00821 5.47132 4.97323 5.68968 4.89705 5.89504C4.82088 6.10041 4.705 6.28876 4.55604 6.44934C4.40708 6.60992 4.22795 6.73959 4.02888 6.83094C3.82981 6.92228 3.6147 6.97352 3.39583 6.98173C2.95381 6.99831 2.5233 6.8386 2.19902 6.53774C2.03845 6.38876 1.90879 6.20962 1.81745 6.01054C1.72611 5.81145 1.67487 5.59633 1.66667 5.37744L3.06667 1.91884H13.6L15 5.37744C14.9684 5.79749 14.779 6.19 14.4698 6.47603C14.1606 6.76207 13.7545 6.92041 13.3333 6.91923Z"
        fill={color || "#607087"}
      />
    </svg>
  );
};

export const CustomDropDownIcon = ({ color }: { color?: string }) => {
  return (
    <svg width="12" height="10" viewBox="0 0 15 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1.03442 0.453331C1.30235 0.182843 1.73671 0.180984 2.00465 0.45519L7.98516 6.56022C8.25309 6.8335 8.25218 7.27502 7.98333 7.54644C7.84982 7.68122 7.67424 7.75 7.49958 7.75C7.32309 7.75 7.14752 7.68122 7.01401 7.54458L1.0335 1.43954C0.765568 1.16627 0.766482 0.724748 1.03442 0.453331ZM12.9938 0.455283C13.2617 0.181077 13.6961 0.182936 13.964 0.453424C14.2329 0.724841 14.2338 1.16636 13.9668 1.43964L9.9953 5.49417C9.86179 5.63081 9.6853 5.69959 9.50973 5.69959C9.33507 5.69959 9.15949 5.63081 9.02598 5.49603C8.75714 5.22461 8.75622 4.78309 9.02324 4.50981L12.9938 0.455283Z"
        fill={color || "#607087"}
      />
    </svg>
  );
};