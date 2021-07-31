import { FC } from 'react';
import styled from 'styled-components';

const UtilityBar: FC = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 24px 32px;
`;

export default UtilityBar;
