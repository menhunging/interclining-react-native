import React from "react";
import Svg, { Path } from "react-native-svg";

const IconBigCheckCircle: React.FC<{ width?: number; height?: number }> = ({
  width = 66,
  height = 66,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 66 66" fill="none">
      <Path
        d="M33 66C51.2254 66 66 51.2254 66 33C66 14.7746 51.2254 0 33 0C14.7746 0 0 14.7746 0 33C0 51.2254 14.7746 66 33 66Z"
        fill="#99D6C8"
      />
      <Path
        d="M17.7676 38.0792L28.1753 46.4053C28.4548 46.6355 28.7821 46.8005 29.1334 46.8883C29.4846 46.9762 29.8511 46.9846 30.206 46.913C30.5644 46.8458 30.904 46.7022 31.2019 46.4919C31.4998 46.2817 31.7489 46.0097 31.9322 45.6946L48.2291 17.7715"
        fill="#99D6C8"
      />
      <Path
        d="M17.7676 38.0792L28.1753 46.4053C28.4548 46.6355 28.7821 46.8005 29.1334 46.8883C29.4846 46.9762 29.8511 46.9846 30.206 46.913C30.5644 46.8458 30.904 46.7022 31.2019 46.4919C31.4998 46.2817 31.7489 46.0097 31.9322 45.6946L48.2291 17.7715"
        stroke="white"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default IconBigCheckCircle;
