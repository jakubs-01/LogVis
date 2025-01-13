import React, { useEffect, useState } from "react";
import axios from "axios";
import WorldFlag from "react-world-flags";
import { TableCell } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import ApiService from "../../service/ApiService";

const FlagCell = ({ ip }) => {
  const [countryCode, setCountryCode] = useState(null);
  const countryCodeMap = {
    Afghanistan: "AF",
    Albania: "AL",
    Algeria: "DZ",
    Andorra: "AD",
    Angola: "AO",
    "Antigua and Barbuda": "AG",
    Argentina: "AR",
    Armenia: "AM",
    Australia: "AU",
    Austria: "AT",
    Azerbaijan: "AZ",
    Bahamas: "BS",
    Bahrain: "BH",
    Bangladesh: "BD",
    Barbados: "BB",
    Belarus: "BY",
    Belgium: "BE",
    Belize: "BZ",
    Benin: "BJ",
    Bhutan: "BT",
    Bolivia: "BO",
    "Bosnia and Herzegovina": "BA",
    Botswana: "BW",
    Brazil: "BR",
    Brunei: "BN",
    Bulgaria: "BG",
    "Burkina Faso": "BF",
    Burundi: "BI",
    "Cabo Verde": "CV",
    Cambodia: "KH",
    Cameroon: "CM",
    Canada: "CA",
    "Central African Republic": "CF",
    Chad: "TD",
    Chile: "CL",
    China: "CN",
    Colombia: "CO",
    Comoros: "KM",
    "Republic of the Congo": "CG", // Updated name
    "Democratic Republic of the Congo": "CD", // Updated name
    "Costa Rica": "CR",
    Croatia: "HR",
    Cuba: "CU",
    Cyprus: "CY",
    Czechia: "CZ", // Updated name
    Denmark: "DK",
    Djibouti: "DJ",
    Dominica: "DM",
    "Dominican Republic": "DO",
    Ecuador: "EC",
    Egypt: "EG",
    "El Salvador": "SV",
    "Equatorial Guinea": "GQ",
    Eritrea: "ER",
    Estonia: "EE",
    Eswatini: "SZ", // Updated name
    Ethiopia: "ET",
    Fiji: "FJ",
    Finland: "FI",
    France: "FR",
    Gabon: "GA",
    Gambia: "GM",
    Georgia: "GE",
    Germany: "DE",
    Ghana: "GH",
    Greece: "GR",
    Grenada: "GD",
    Guatemala: "GT",
    Guinea: "GN",
    "Guinea-Bissau": "GW",
    Guyana: "GY",
    Haiti: "HT",
    Honduras: "HN",
    "Hong Kong": "HK",
    Hungary: "HU",
    Iceland: "IS",
    India: "IN",
    Indonesia: "ID",
    Iran: "IR",
    Iraq: "IQ",
    Ireland: "IE",
    Israel: "IL",
    Italy: "IT",
    Jamaica: "JM",
    Japan: "JP",
    Jordan: "JO",
    Kazakhstan: "KZ",
    Kenya: "KE",
    Kiribati: "KI",
    "North Korea": "KP",
    "South Korea": "KR",
    Kuwait: "KW",
    Kyrgyzstan: "KG",
    Laos: "LA",
    Latvia: "LV",
    Lebanon: "LB",
    Lesotho: "LS",
    Liberia: "LR",
    Libya: "LY",
    Liechtenstein: "LI",
    Lithuania: "LT",
    Luxembourg: "LU",
    Madagascar: "MG",
    Malawi: "MW",
    Malaysia: "MY",
    Maldives: "MV",
    Mali: "ML",
    Malta: "MT",
    "Marshall Islands": "MH",
    Mauritania: "MR",
    Mauritius: "MU",
    Mexico: "MX",
    Micronesia: "FM",
    Moldova: "MD",
    Monaco: "MC",
    Mongolia: "MN",
    Montenegro: "ME",
    Morocco: "MA",
    Mozambique: "MZ",
    Myanmar: "MM", // Updated name
    Namibia: "NA",
    Nauru: "NR",
    Nepal: "NP",
    Netherlands: "NL",
    "New Zealand": "NZ",
    Nicaragua: "NI",
    Niger: "NE",
    Nigeria: "NG",
    "North Macedonia": "MK", // Updated name
    Norway: "NO",
    Oman: "OM",
    Pakistan: "PK",
    Palau: "PW",
    Panama: "PA",
    "Papua New Guinea": "PG",
    Paraguay: "PY",
    Peru: "PE",
    Philippines: "PH",
    Poland: "PL",
    Portugal: "PT",
    Qatar: "QA",
    Romania: "RO",
    Russia: "RU",
    Rwanda: "RW",
    "Saint Kitts and Nevis": "KN",
    "Saint Lucia": "LC",
    "Saint Vincent and the Grenadines": "VC",
    Samoa: "WS",
    "San Marino": "SM",
    "Sao Tome and Principe": "ST",
    "Saudi Arabia": "SA",
    Senegal: "SN",
    Serbia: "RS",
    Seychelles: "SC",
    "Sierra Leone": "SL",
    Singapore: "SG",
    Slovakia: "SK",
    Slovenia: "SI",
    "Solomon Islands": "SB",
    Somalia: "SO",
    "South Africa": "ZA",
    "South Sudan": "SS",
    Spain: "ES",
    "Sri Lanka": "LK",
    Sudan: "SD",
    Suriname: "SR",
    Sweden: "SE",
    Switzerland: "CH",
    Syria: "SY",
    Taiwan: "TW",
    Tajikistan: "TJ",
    Tanzania: "TZ",
    Thailand: "TH",
    "Timor-Leste": "TL",
    Togo: "TG",
    Tonga: "TO",
    "Trinidad and Tobago": "TT",
    Tunisia: "TN",
    Turkey: "TR",
    Turkmenistan: "TM",
    Tuvalu: "TV",
    Uganda: "UG",
    Ukraine: "UA",
    "United Arab Emirates": "AE",
    "United Kingdom": "GB",
    "United States": "US",
    Uruguay: "UY",
    Uzbekistan: "UZ",
    Vanuatu: "VU",
    "Vatican City": "VA",
    Venezuela: "VE",
    Vietnam: "VN",
    Yemen: "YE",
    Zambia: "ZM",
    Zimbabwe: "ZW",
    "American Samoa": "AS",
    Anguilla: "AI",
    Antarctica: "AQ",
    Aruba: "AW",
    Bermuda: "BM",
    "British Indian Ocean Territory": "IO",
    "British Virgin Islands": "VG",
    "Cayman Islands": "KY",
    "Christmas Island": "CX",
    "Cocos (Keeling) Islands": "CC",
    "Cook Islands": "CK",
    Curacao: "CW",
    "Falkland Islands": "FK",
    "Faroe Islands": "FO",
    "French Guiana": "GF",
    "French Polynesia": "PF",
    "French Southern Territories": "TF",
    Greenland: "GL",
    Guam: "GU",
    Guernsey: "GG",
    "Isle of Man": "IM",
    Jersey: "JE",
    Kosovo: "XK",
    Macau: "MO",
    Martinique: "MQ",
    Mayotte: "YT",
    Montserrat: "MS",
    "New Caledonia": "NC",
  };

  function getCountryCode(countryName) {
    return countryCodeMap[countryName] || "Country not found";
  }
  useEffect(() => {
    if (ip) {
      const fetchCountryCode = async () => {
        try {
          const response = await ApiService.getIpInfo(ip);
          // Replace 'your-api-token' with your actual API token from ipinfo.io
          // const response = await axios.get(
          //   `${process.env.REACT_APP_IPINFO_API_URL}?ip=${ip}`,
          //   { withCredentials: true } // Send cookie credentials
          // );
          setCountryCode(getCountryCode(response.data.country));
        } catch (error) {
          console.error("Error fetching IP geolocation:", error);
          setCountryCode(null);
        }
      };

      fetchCountryCode();
    }
  }, [ip]);

  return (
    <TableCell style={{ width: "140px" }}>
      {countryCode ? (
        <>
          <WorldFlag code={countryCode} style={{ width: 22, height: 14 }} />
        </>
      ) : (
        <>
          <CircularProgress size={22} style={{ height: 14 }} />
        </>
      )}
      {ip}
    </TableCell>
  );
};

export default FlagCell;
