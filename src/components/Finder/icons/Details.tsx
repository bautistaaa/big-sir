import { FC } from 'react';

const Details: FC<{ stroke: string }> = ({ stroke }) => {
  return (
    <svg
      width="29"
      height="18"
      viewBox="0 0 29 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" y="0.5" width="28" height="17" stroke={stroke} />
      <line x1="9.5" x2="9.5" y2="18" stroke={stroke} />
      <line x1="19.5" x2="19.5" y2="18" stroke={stroke} />
    </svg>
  );
};

export default Details;
