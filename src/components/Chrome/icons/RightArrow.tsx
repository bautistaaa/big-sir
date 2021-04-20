import { FC } from 'react';

const RightArrow: FC = () => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="white"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <line x1="13" y1="18" x2="19" y2="12"></line>
      <line x1="13" y1="6" x2="19" y2="12"></line>
    </svg>
  );
};

export default RightArrow;
