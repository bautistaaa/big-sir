import { FC } from 'react';
import styled from 'styled-components/macro';
import { RED, YELLOW, GREEN } from '../shared/constants';

const ActionBar: FC<{
  handleCloseClick: () => void;
  handleMinimizeClick: () => void;
}> = ({ handleCloseClick, handleMinimizeClick }) => {
  return (
    <>
      <Wrapper>
        <CloseButton onClick={() => handleCloseClick()} />
        <MinimizeButton onClick={() => handleMinimizeClick()} />
        <FullScreenButton />
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  height: 22px;
  padding: 7px;
  background: rgb(56, 56, 56);
`;
const BaseButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  border-radius: 50%;
  height: 10px;
  width: 10px;
  & + & {
    margin-left: 5px;
  }
`;
const CloseButton = styled(BaseButton)`
  background: ${RED};
`;
const MinimizeButton = styled(BaseButton)`
  background: ${YELLOW};
`;
const FullScreenButton = styled(BaseButton)`
  background: ${GREEN};
`;

export default ActionBar;
