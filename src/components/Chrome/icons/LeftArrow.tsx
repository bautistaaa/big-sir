import { FC } from 'react';

const LeftArrow: FC = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="white"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <line x1="5" y1="12" x2="11" y2="18"></line>
      <line x1="5" y1="12" x2="11" y2="6"></line>
    </svg>
  );
};

export default LeftArrow;
