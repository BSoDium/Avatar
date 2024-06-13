import { ComponentProps } from "react";
import colors from "./colors.json";

export type Colors = typeof colors;

export default function Model(props: Colors & ComponentProps<"svg">) {
  return (<svg {...props} width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g id="model" clipPath="url(#clip0_19_5)">
    <rect width="500" height="500" fill={props.background} />
    <path id="jacket"
      d="M54.1249 311.165L0 373.5V500H500V401.276L406.747 298.198C385.751 274.989 356.519 260.902 325.284 258.939L278.5 256L142.027 266.803C108.043 269.493 76.4756 285.424 54.1249 311.165Z"
      fill={props.secondary} />
    <path id="neck" d="M279.5 338L186.5 343.5L195.5 246L280 233L279.5 338Z" fill={props.tonal} />
    <path id="collar"
      d="M186.5 343.5L188.5 321L234 318.25C252.5 317.132 262.813 314.235 269.5 310C276.435 305.027 278.44 301.441 279.5 294.5V315.5V338L186.5 343.5Z"
      fill="white" />
    <path id="shirt"
      d="M171.5 499.5L186.5 343.5L233 340.75C251.5 339.656 263 337 270 333C277 329 278 325.5 279.5 319V338V499.5H171.5Z"
      fill={props.primary} />
    <path id="head"
      d="M187 81.5L156.5 175C150 198.5 151.1 246 195.5 246L280 233C280 233 285.423 229.5 299.712 221.5C314 213.5 321 203 318.5 185.5C317.049 175.341 312.227 139.736 308.437 111.653C305.644 90.9565 287.409 75.8978 266.557 77.0612L187 81.5Z"
      fill={props.tonal} />
    <path id="chin-shadow"
      d="M193.9 262.7L195.5 246C221.762 242.7 236.276 239.428 262 232.5C236.231 250.617 221.388 258.141 193.9 262.7Z"
      fill="black" />
    <g id="eyes">
      <path id="eye-right" d="M234 140L233 159" stroke="black" strokeWidth="5"
        strokeLinecap="round" />
      <path id="eye-left" d="M185 140L184 159" stroke="black" strokeWidth="5"
        strokeLinecap="round" />
      <path id="eyebrow-left" d="M177.5 130.5C183.5 122.5 191.5 121.5 200.5 125" stroke="black"
        strokeWidth="5" strokeLinecap="round" />
      <path id="eyebrow-right" d="M252 136C251 124 235.5 121.072 227 126.032" stroke="black"
        strokeWidth="5" strokeLinecap="round" />
    </g>
    <path id="nose"
      d="M194.709 146C194.709 146 188.709 175 187.209 181.5C185.709 188 192.58 188.913 198.209 189.5"
      stroke="black" strokeWidth="5" strokeLinecap="round" />
    <path id="mouth" d="M203.5 212.5C216.5 212 224 208.5 230 200.5" stroke="black" strokeWidth="5"
      strokeLinecap="round" />
    <path id="hair"
      d="M188 81.5L166 145C147.456 144.892 145 143 139.5 138C134 133 131.813 123.783 134 118C136.187 112.217 159.5 61.5 159.5 61.5C161.943 56.6031 166 54.5 170 54.5C174 54.5 177.673 55.8539 181.5 60.5L276 56.5C285.889 57.2831 291.5 58.5 298.5 64C305.5 69.5 310.488 76.2643 313.5 84.5L329.5 126C337.194 127.365 340 129.5 342.5 136C345 142.5 342.874 148.713 339.5 155L319.025 201.697C313.873 213.447 304.402 222.767 292.57 227.729L280 233L280.5 214C289.203 219.699 297.954 217.5 305.5 214.5C313.046 211.5 319.047 197.179 316 180C312.953 162.821 291.669 160.172 285.5 163C268.5 171.5 249.5 172.5 249.5 143.5V106C249.5 87 238.5 80 223 80.5C207.5 81 188 81.5 188 81.5Z"
      fill="black" />
    <path id="ear" d="M276 190.5L284.5 184.5M297.5 175.5L284.5 184.5M284.5 184.5L302 192"
      stroke="black" strokeWidth="5" strokeLinecap="round" />
    <g id="glasses">
      <circle id="glasses-rim-left" cx="170" cy="147" r="22.5" stroke="white" strokeWidth="5" />
      <circle id="glasses-rim-right" cx="229" cy="147" r="22.5" stroke="white" strokeWidth="5" />
      <path id="glasses-bridge" d="M211 147H192.5" stroke="white" strokeWidth="5"
        strokeLinecap="round" />
      <path id="glasses-temple" d="M251.5 148.5C278.759 148.934 288.32 152.361 298.5 162.5"
        stroke="white" strokeWidth="5" strokeLinecap="round" />
    </g>
  </g>
  <defs>
    <clipPath id="clip0_19_5">
      <rect width="500" height="500" fill="white" />
    </clipPath>
  </defs>
</svg>);
}
