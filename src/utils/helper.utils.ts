/* eslint-disable max-len */
import { increaseSyncCount } from "../app/slices/shops";
import { IInventory } from "../interfaces/inventory.interface";

export const moneyStandard = (val: number) =>
  val?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const getInventoryType = (inventory: IInventory) => {
  const { isVariation, TrackableItem } = inventory;
  if (isVariation) {
    return "Variation";
  }
  if (TrackableItem?.packPrice && TrackableItem?.unitPrice) {
    return "Pieces and pack";
  }
  if (TrackableItem?.packPrice && !TrackableItem?.unitPrice) {
    return "Pack";
  }
  if (!TrackableItem?.packPrice && TrackableItem?.unitPrice) {
    return "Pieces";
  }
};

export const getInventoryPrice = (
  inventory: IInventory,
  variationIndex?: number,
  returnPackPrice?: boolean
) => {
  let price: number = 0;
  const { trackable, isVariation, Variations, TrackableItem, NonTrackableItem } = inventory;
  if (trackable) {
    if (isVariation) {
      price = Variations![variationIndex ?? 0]?.price ?? 0;
    } else {
      switch (getInventoryType(inventory)) {
        case "Pieces":
          price = TrackableItem?.unitPrice ?? 0;
          break;
        case "Pack":
          price = TrackableItem?.packPrice ?? 0;
          break;
        case "Pieces and pack":
          price = returnPackPrice ? TrackableItem?.packPrice ?? 0 : TrackableItem?.unitPrice ?? 0;
          break;
      }
    }
  } else {
    if (isVariation) {
      price = Variations![variationIndex ?? 0]?.price ?? 0;
    } else {
      price = NonTrackableItem?.sellingPrice ?? 0;
    }
  }

  return price;
};
interface IDate {
  createdAt?: string;
}

export const sortList = <T extends IDate>(list: T[]): T[] => {
  const listCopy = [...list];
  return listCopy.sort((a, b) => {
    return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
  });
};

export const isPositive = (number: any) => {
  if (number < 0) {
    return false; // Return false for non-numeric inputs
  }

  return true;
};

export const modifySelectedProducts = (prods: any[]) => {
  const modifiedProducts = prods.map((product) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { inventoryName, ...rest } = product;
    return rest;
  });
  return modifiedProducts;
};

export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getDefaultDate = (initialDate: string) => {
  if (initialDate) {
    const sevenDaysAfter = new Date(initialDate);
    sevenDaysAfter.setDate(sevenDaysAfter.getDate() + 7);
    return formatDate(sevenDaysAfter);
  } else {
    return getCurrentDate();
  }
};

export const isDesktop = () => {
  const platform = `${process.env.REACT_APP_PLATFORM}`;
  return platform?.toLowerCase() === "desktop";
};

export const dispatchIncreaseSyncCount = (dispatch: any, args: string[]) =>
  dispatch(increaseSyncCount(args));

export const currencyList = [
  {
    Country: "Afghanistan",
    Code: "AFN",
    Symbol: "؋",
  },
  {
    Country: "Albania",
    Code: "ALL",
    Symbol: "Lek",
  },
  {
    Country: "Algeria",
    Code: "DZD",
    Symbol: "دج",
  },
  {
    Country: "American Samoa",
    Code: "USD",
    Symbol: "$",
  },
  {
    Country: "Andorra",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "Angola",
    Code: "AOA",
    Symbol: "Kz",
  },
  {
    Country: "Anguilla",
    Code: "XCD",
    Symbol: "$",
  },
  {
    Country: "Antigua and Barbuda",
    Code: "XCD",
    Symbol: "$",
  },
  {
    Country: "Argentina",
    Code: "ARS",
    Symbol: "$",
  },
  {
    Country: "Armenia",
    Code: "AMD",
    Symbol: "֏",
  },
  {
    Country: "Aruba",
    Code: "AWG",
    Symbol: "ƒ",
  },
  {
    Country: "Australia",
    Code: "AUD",
    Symbol: "$",
  },
  {
    Country: "Austria",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "Azerbaijan",
    Code: "AZN",
    Symbol: "₼",
  },
  {
    Country: "Bahamas",
    Code: "BSD",
    Symbol: "$",
  },
  {
    Country: "Bahrain",
    Code: "BHD",
    Symbol: ".د.ب",
  },
  {
    Country: "Bangladesh",
    Code: "BDT",
    Symbol: "৳",
  },
  {
    Country: "Barbados",
    Code: "BBD",
    Symbol: "$",
  },
  {
    Country: "Belarus",
    Code: "BYN",
    Symbol: "Br",
  },
  {
    Country: "Belgium",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "Belize",
    Code: "BZD",
    Symbol: "$",
  },
  {
    Country: "Benin",
    Code: "XOF",
    Symbol: "CFA",
  },
  {
    Country: "Bermuda",
    Code: "BMD",
    Symbol: "$",
  },
  {
    Country: "Bhutan",
    Code: "BTN",
    Symbol: "Bhutanese rupee",
  },
  {
    Country: "Bolivia",
    Code: "BOB",
    Symbol: "Bs",
  },
  {
    Country: "Bosnia and Herzegovina",
    Code: "BAM",
    Symbol: "KM",
  },
  {
    Country: "Botswana",
    Code: "BWP",
    Symbol: "P",
  },
  {
    Country: "Brazil",
    Code: "BRL",
    Symbol: "R$",
  },
  {
    Country: "British Virgin Islands",
    Code: "USD",
    Symbol: "$",
  },
  {
    Country: "Brunei",
    Code: "BND",
    Symbol: "$",
  },
  {
    Country: "Bulgaria",
    Code: "BGN",
    Symbol: "лв.",
  },
  {
    Country: "Burkina Faso",
    Code: "XOF",
    Symbol: "CFA",
  },
  {
    Country: "Burundi",
    Code: "BIF",
    Symbol: "FBu",
  },
  {
    Country: "Cambodia",
    Code: "KHR",
    Symbol: "៛",
  },
  {
    Country: "Cameroon",
    Code: "XAF",
    Symbol: "FCFA",
  },
  {
    Country: "Canada",
    Code: "CAD",
    Symbol: "$",
  },
  {
    Country: "Cape Verde",
    Code: "CVE",
    Symbol: "Esc",
  },
  {
    Country: "Cayman Islands",
    Code: "KYD",
    Symbol: "$",
  },
  {
    Country: "Central African Republic",
    Code: "XAF",
    Symbol: "FCFA",
  },
  {
    Country: "Chad",
    Code: "XAF",
    Symbol: "FCFA",
  },
  {
    Country: "Chile",
    Code: "CLP",
    Symbol: "$",
  },
  {
    Country: "China",
    Code: "CNY",
    Symbol: "¥",
  },
  {
    Country: "Colombia",
    Code: "COP",
    Symbol: "$",
  },
  {
    Country: "Comoros",
    Code: "KMF",
    Symbol: "CF",
  },
  {
    Country: "Congo, Democratic Republic of the",
    Code: "CDF",
    Symbol: "Fr",
  },
  {
    Country: "Congo, Republic of the",
    Code: "XAF",
    Symbol: "FCFA",
  },
  {
    Country: "Cook Islands",
    Code: "NZD",
    Symbol: "$",
  },
  {
    Country: "Costa Rica",
    Code: "CRC",
    Symbol: "₡",
  },
  {
    Country: "Côte d'Ivoire",
    Code: "XOF",
    Symbol: "CFA",
  },
  {
    Country: "Croatia",
    Code: "HRK",
    Symbol: "kn",
  },
  {
    Country: "Cuba",
    Code: "CUP",
    Symbol: "$",
  },
  {
    Country: "Curaçao",
    Code: "ANG",
    Symbol: "ƒ",
  },
  {
    Country: "Cyprus",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "Czech Republic",
    Code: "CZK",
    Symbol: "Kč",
  },
  {
    Country: "Denmark",
    Code: "DKK",
    Symbol: "kr",
  },
  {
    Country: "Djibouti",
    Code: "DJF",
    Symbol: "Fdj",
  },
  {
    Country: "Dominica",
    Code: "XCD",
    Symbol: "$",
  },
  {
    Country: "Dominican Republic",
    Code: "DOP",
    Symbol: "$",
  },
  {
    Country: "East Timor",
    Code: "USD",
    Symbol: "$",
  },
  {
    Country: "Ecuador",
    Code: "USD",
    Symbol: "$",
  },
  {
    Country: "Egypt",
    Code: "EGP",
    Symbol: "£",
  },
  {
    Country: "El Salvador",
    Code: "USD",
    Symbol: "$",
  },
  {
    Country: "Equatorial Guinea",
    Code: "XAF",
    Symbol: "FCFA",
  },
  {
    Country: "Eritrea",
    Code: "ERN",
    Symbol: "Nfa",
  },
  {
    Country: "Estonia",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "Eswatini",
    Code: "SZL",
    Symbol: "SZL",
  },
  {
    Country: "Ethiopia",
    Code: "ETB",
    Symbol: "ብር",
  },
  {
    Country: "Falkland Islands (Malvinas)",
    Code: "FKP",
    Symbol: "£",
  },
  {
    Country: "Faroe Islands",
    Code: "DKK",
    Symbol: "kr",
  },
  {
    Country: "Fiji",
    Code: "FJD",
    Symbol: "$",
  },
  {
    Country: "Finland",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "France",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "French Guiana",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "French Polynesia",
    Code: "XPF",
    Symbol: "CFPF",
  },
  {
    Country: "Gabon",
    Code: "XAF",
    Symbol: "FCFA",
  },
  {
    Country: "Gambia",
    Code: "GMD",
    Symbol: "D",
  },
  {
    Country: "Georgia",
    Code: "GEL",
    Symbol: "₾",
  },
  {
    Country: "Germany",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "Ghana",
    Code: "GHS",
    Symbol: "₵",
  },
  {
    Country: "Gibraltar",
    Code: "GIP",
    Symbol: "£",
  },
  {
    Country: "Greece",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "Greenland",
    Code: "DKK",
    Symbol: "kr",
  },
  {
    Country: "Grenada",
    Code: "XCD",
    Symbol: "$",
  },
  {
    Country: "Guadeloupe",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "Guatemala",
    Code: "GTQ",
    Symbol: "Q",
  },
  {
    Country: "Guernsey",
    Code: "GBP",
    Symbol: "£",
  },
  {
    Country: "Guinea",
    Code: "GNF",
    Symbol: "₣",
  },
  {
    Country: "Guinea-Bissau",
    Code: "XOF",
    Symbol: "CFA",
  },
  {
    Country: "Guyana",
    Code: "GYD",
    Symbol: "$",
  },
  {
    Country: "Haiti",
    Code: "HTG",
    Symbol: "G",
  },
  {
    Country: "Honduras",
    Code: "HNL",
    Symbol: "L",
  },
  {
    Country: "Hong Kong",
    Code: "HKD",
    Symbol: "$",
  },
  {
    Country: "Hungary",
    Code: "HUF",
    Symbol: "Ft",
  },
  {
    Country: "Iceland",
    Code: "ISK",
    Symbol: "kr",
  },
  {
    Country: "India",
    Code: "INR",
    Symbol: "₹",
  },
  {
    Country: "Indonesia",
    Code: "IDR",
    Symbol: "Rp",
  },
  {
    Country: "Iran",
    Code: "IRR",
    Symbol: "﷼",
  },
  {
    Country: "Iraq",
    Code: "IQD",
    Symbol: "ع.د",
  },
  {
    Country: "Ireland",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "Isle of Man",
    Code: "GBP",
    Symbol: "£",
  },
  {
    Country: "Israel",
    Code: "ILS",
    Symbol: "₪",
  },
  {
    Country: "Italy",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "Jamaica",
    Code: "JMD",
    Symbol: "$",
  },
  {
    Country: "Japan",
    Code: "JPY",
    Symbol: "¥",
  },
  {
    Country: "Jersey",
    Code: "GBP",
    Symbol: "£",
  },
  {
    Country: "Jordan",
    Code: "JOD",
    Symbol: "د.ا",
  },
  {
    Country: "Kazakhstan",
    Code: "KZT",
    Symbol: "₸",
  },
  {
    Country: "Kenya",
    Code: "KES",
    Symbol: "KSh",
  },
  {
    Country: "Kiribati",
    Code: "AUD",
    Symbol: "$",
  },
  {
    Country: "Kosovo",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "Kuwait",
    Code: "KWD",
    Symbol: "د.ك",
  },
  {
    Country: "Kyrgyzstan",
    Code: "KGS",
    Symbol: "сом",
  },
  {
    Country: "Laos",
    Code: "LAK",
    Symbol: "₭",
  },
  {
    Country: "Latvia",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "Lebanon",
    Code: "LBP",
    Symbol: "ل.ل",
  },
  {
    Country: "Lesotho",
    Code: "LSL",
    Symbol: "L",
  },
  {
    Country: "Liberia",
    Code: "LRD",
    Symbol: "$",
  },
  {
    Country: "Libya",
    Code: "LYD",
    Symbol: "LD",
  },
  {
    Country: "Liechtenstein",
    Code: "CHF",
    Symbol: "Fr.",
  },
  {
    Country: "Lithuania",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "Luxembourg",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "Macau",
    Code: "MOP",
    Symbol: "$",
  },
  {
    Country: "Madagascar",
    Code: "MGA",
    Symbol: "Ar",
  },
  {
    Country: "Malawi",
    Code: "MWK",
    Symbol: "MK",
  },
  {
    Country: "Malaysia",
    Code: "MYR",
    Symbol: "RM",
  },
  {
    Country: "Maldives",
    Code: "MVR",
    Symbol: "MVR",
  },
  {
    Country: "Mali",
    Code: "XOF",
    Symbol: "CFA",
  },
  {
    Country: "Malta",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "Marshall Islands",
    Code: "USD",
    Symbol: "$",
  },
  {
    Country: "Martinique",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "Mauritania",
    Code: "MRU",
    Symbol: "рующие",
  },
  {
    Country: "Mauritius",
    Code: "MUR",
    Symbol: "₨",
  },
  {
    Country: "Mayotte",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "Mexico",
    Code: "MXN",
    Symbol: "$",
  },
  {
    Country: "Micronesia, Federated States of",
    Code: "USD",
    Symbol: "$",
  },
  {
    Country: "Moldova",
    Code: "MDL",
    Symbol: "L",
  },
  {
    Country: "Monaco",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "Mongolia",
    Code: "MNT",
    Symbol: "₮",
  },
  {
    Country: "Montenegro",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "Montserrat",
    Code: "XCD",
    Symbol: "$",
  },
  {
    Country: "Morocco",
    Code: "MAD",
    Symbol: "dirham",
  },
  {
    Country: "Mozambique",
    Code: "MZN",
    Symbol: "Mt",
  },
  {
    Country: "Myanmar (Burma)",
    Code: "MMK",
    Symbol: "K",
  },
  {
    Country: "Namibia",
    Code: "NAD",
    Symbol: "$",
  },
  {
    Country: "Nauru",
    Code: "AUD",
    Symbol: "$",
  },
  {
    Country: "Nepal",
    Code: "NPR",
    Symbol: "₨",
  },
  {
    Country: "Netherlands",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "New Caledonia",
    Code: "XPF",
    Symbol: "CFPF",
  },
  {
    Country: "New Zealand",
    Code: "NZD",
    Symbol: "$",
  },
  {
    Country: "Nicaragua",
    Code: "NIO",
    Symbol: "C$",
  },
  {
    Country: "Niger",
    Code: "XOF",
    Symbol: "CFA",
  },
  {
    Country: "Nigeria",
    Code: "NGN",
    Symbol: "₦",
  },
  {
    Country: "Niue",
    Code: "NZD",
    Symbol: "$",
  },
  {
    Country: "North Korea",
    Code: "KPW",
    Symbol: "₩",
  },
  {
    Country: "North Macedonia",
    Code: "MKD",
    Symbol: "den",
  },
  {
    Country: "Northern Mariana Islands",
    Code: "USD",
    Symbol: "$",
  },
  {
    Country: "Norway",
    Code: "NOK",
    Symbol: "kr",
  },
  {
    Country: "Oman",
    Code: "OMR",
    Symbol: "﷼",
  },
  {
    Country: "Pakistan",
    Code: "PKR",
    Symbol: "₨",
  },
  {
    Country: "Palau",
    Code: "USD",
    Symbol: "$",
  },
  {
    Country: "Palestine",
    Code: "ILS",
    Symbol: "₪",
  },
  {
    Country: "Panama",
    Code: "PAB",
    Symbol: "B/.",
  },
  {
    Country: "Papua New Guinea",
    Code: "PGK",
    Symbol: "K",
  },
  {
    Country: "Paraguay",
    Code: "PYG",
    Symbol: "₲",
  },
  {
    Country: "Peru",
    Code: "PEN",
    Symbol: "S/.",
  },
  {
    Country: "Philippines",
    Code: "PHP",
    Symbol: "₱",
  },
  {
    Country: "Pitcairn Islands",
    Code: "NZD",
    Symbol: "$",
  },
  {
    Country: "Poland",
    Code: "PLN",
    Symbol: "zł",
  },
  {
    Country: "Portugal",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "Puerto Rico",
    Code: "USD",
    Symbol: "$",
  },
  {
    Country: "Qatar",
    Code: "QAR",
    Symbol: "﷼",
  },
  {
    Country: "Republic of the Congo",
    Code: "XAF",
    Symbol: "FCFA",
  },
  {
    Country: "Réunion",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "Romania",
    Code: "RON",
    Symbol: "L",
  },
  {
    Country: "Russia",
    Code: "RUB",
    Symbol: "₽",
  },
  {
    Country: "Rwanda",
    Code: "RWF",
    Symbol: "R₣",
  },
  {
    Country: "Saint Barthélemy",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "Saint Helena, Ascension and Tristan da Cunha",
    Code: "SHP",
    Symbol: "£",
  },
  {
    Country: "Saint Kitts and Nevis",
    Code: "XCD",
    Symbol: "$",
  },
  {
    Country: "Saint Lucia",
    Code: "XCD",
    Symbol: "$",
  },
  {
    Country: "Saint Martin (French part)",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "Saint Martin (Dutch part)",
    Code: "ANG",
    Symbol: "ƒ",
  },
  {
    Country: "Saint Pierre and Miquelon",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "Saint Vincent and the Grenadines",
    Code: "XCD",
    Symbol: "$",
  },
  {
    Country: "Samoa",
    Code: "WST",
    Symbol: "T",
  },
  {
    Country: "San Marino",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "São Tomé and Príncipe",
    Code: "STD",
    Symbol: "Db",
  },
  {
    Country: "Saudi Arabia",
    Code: "SAR",
    Symbol: "ر.س",
  },
  {
    Country: "Senegal",
    Code: "XOF",
    Symbol: "CFA",
  },
  {
    Country: "Serbia",
    Code: "RSD",
    Symbol: "дин.",
  },
  {
    Country: "Seychelles",
    Code: "SCR",
    Symbol: "₨",
  },
  {
    Country: "Sierra Leone",
    Code: "SLL",
    Symbol: "Le",
  },
  {
    Country: "Singapore",
    Code: "SGD",
    Symbol: "$",
  },
  {
    Country: "Sint Maarten (Dutch part)",
    Code: "ANG",
    Symbol: "ƒ",
  },
  {
    Country: "Slovakia",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "Slovenia",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "Solomon Islands",
    Code: "SBD",
    Symbol: "$",
  },
  {
    Country: "Somalia",
    Code: "SOS",
    Symbol: "Sh.So.",
  },
  {
    Country: "South Africa",
    Code: "ZAR",
    Symbol: "R",
  },
  {
    Country: "South Korea",
    Code: "KRW",
    Symbol: "₩",
  },
  {
    Country: "South Sudan",
    Code: "SSP",
    Symbol: "£SS",
  },
  {
    Country: "Spain",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "Sri Lanka",
    Code: "LKR",
    Symbol: "රු",
  },
  {
    Country: "Sudan",
    Code: "SDG",
    Symbol: "SDG",
  },
  {
    Country: "Suriname",
    Code: "SRD",
    Symbol: "$",
  },
  {
    Country: "Sweden",
    Code: "SEK",
    Symbol: "kr",
  },
  {
    Country: "Switzerland",
    Code: "CHF",
    Symbol: "Fr.",
  },
  {
    Country: "Syria",
    Code: "SYP",
    Symbol: "£",
  },
  {
    Country: "Taiwan",
    Code: "TWD",
    Symbol: "$",
  },
  {
    Country: "Tajikistan",
    Code: "TJS",
    Symbol: "Сом",
  },
  {
    Country: "Tanzania",
    Code: "TZS",
    Symbol: "TSh",
  },
  {
    Country: "Thailand",
    Code: "THB",
    Symbol: "฿",
  },
  {
    Country: "Togo",
    Code: "XOF",
    Symbol: "CFA",
  },
  {
    Country: "Tokelau",
    Code: "NZD",
    Symbol: "$",
  },
  {
    Country: "Tonga",
    Code: "TOP",
    Symbol: "T$",
  },
  {
    Country: "Trinidad and Tobago",
    Code: "TTD",
    Symbol: "$",
  },
  {
    Country: "Tunisia",
    Code: "TND",
    Symbol: "د.ت",
  },
  {
    Country: "Turkey",
    Code: "TRY",
    Symbol: "₺",
  },
  {
    Country: "Turkmenistan",
    Code: "TMT",
    Symbol: "T",
  },
  {
    Country: "Turks and Caicos Islands",
    Code: "USD",
    Symbol: "$",
  },
  {
    Country: "Tuvalu",
    Code: "AUD",
    Symbol: "$",
  },
  {
    Country: "Uganda",
    Code: "UGX",
    Symbol: "USh",
  },
  {
    Country: "Ukraine",
    Code: "UAH",
    Symbol: "₴",
  },
  {
    Country: "United Arab Emirates",
    Code: "AED",
    Symbol: "د.إ",
  },
  {
    Country: "United Kingdom",
    Code: "GBP",
    Symbol: "£",
  },
  {
    Country: "United States",
    Code: "USD",
    Symbol: "$",
  },
  {
    Country: "Uruguay",
    Code: "UYU",
    Symbol: "$",
  },
  {
    Country: "Uzbekistan",
    Code: "UZS",
    Symbol: "Ўзс",
  },
  {
    Country: "Vanuatu",
    Code: "VUV",
    Symbol: "Vt",
  },
  {
    Country: "Vatican City",
    Code: "EUR",
    Symbol: "€",
  },
  {
    Country: "Venezuela",
    Code: "VES",
    Symbol: "Bs.S",
  },
  {
    Country: "Vietnam",
    Code: "VND",
    Symbol: "₫",
  },
  {
    Country: "Virgin Islands, British",
    Code: "USD",
    Symbol: "$",
  },
  {
    Country: "Virgin Islands, U.S.",
    Code: "USD",
    Symbol: "$",
  },
  {
    Country: "Wallis and Futuna",
    Code: "XPF",
    Symbol: "CFPF",
  },
  {
    Country: "Yemen",
    Code: "YER",
    Symbol: "﷼",
  },
  {
    Country: "Zambia",
    Code: "ZMW",
    Symbol: "K",
  },
  {
    Country: "Zimbabwe",
    Code: "ZWL",
    Symbol: "$",
  },
];
