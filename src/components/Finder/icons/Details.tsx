import { FC } from 'react';

const Details: FC<{ fill: string }> = ({ fill }) => {
  return (
    <svg
      width="31"
      height="28"
      viewBox="0 0 31 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1.97348"
        y="2.05299"
        width="27"
        height="24"
        rx="3"
        transform="rotate(-0.21561 1.97348 2.05299)"
        stroke={fill}
        strokeWidth="2"
      />
      <path d="M11.0675 2.5L11.0675 25" stroke={fill} strokeWidth="2" />
      <path d="M20.0674 2.5L20.0674 25" stroke={fill} strokeWidth="2" />
    </svg>
  );
};

export default Details;
