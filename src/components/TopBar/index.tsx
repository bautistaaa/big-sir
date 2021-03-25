import { FC } from 'react';
import styled from 'styled-components/macro';
import AppleIcon from './AppleIcon';

const TopBar: FC = () => {
  return (
    <Wrapper>
      <LeftSide>
        <AppleIcon />
      </LeftSide>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 25px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  background: rgb(28, 28, 28);
`;

const LeftSide = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const RightSide = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default TopBar;
