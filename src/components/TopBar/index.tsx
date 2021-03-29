import { FC } from 'react';
import styled from 'styled-components/macro';
import AppleIcon from './AppleIcon';
import Clock from './Clock';

const TopBar: FC = () => {
  return (
    <Wrapper>
      <LeftSide>
        <AppleIcon />
      </LeftSide>
      <RightSide>
        <Clock />
      </RightSide>
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
  background: rgb(51 51 51 / 25%);
  padding: 0 15px;
  font-size: 12px;
  letter-spacing: 0.3px;
  font-weight: 500;
  backdrop-filter: blur(72px);
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
