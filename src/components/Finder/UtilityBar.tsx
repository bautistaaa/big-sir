import { FC, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components/macro';
import { Details, Icons, List } from './icons';
import { Context, FinderEvent } from './finder.machine';
import { State } from 'xstate';

interface Props {
  folderName: string;
  current: State<
    Context,
    FinderEvent,
    any,
    {
      value: any;
      context: Context;
    }
  >;
  send: any;
}

const UtilityBar: FC<Props> = ({ folderName, current, send }) => {
  const themeContext = useContext(ThemeContext);

  return (
    <Bar className="action-bar">
      <FolderName>{folderName}</FolderName>
      <ButtonsWrapper>
        <LeftButton
          onClick={() => send('ICONS')}
          isActive={current.matches('icons')}
        >
          <Icons
            fill={themeContext.finderIconFill}
            backgroundFill={themeContext.finderModeButtonBackground}
          />
        </LeftButton>
        <MiddleButton
          onClick={() => send('LISTS')}
          isActive={current.matches('lists')}
        >
          <List fill={themeContext.finderIconFill} />
        </MiddleButton>
        <RightButton
          onClick={() => send('DETAILS')}
          isActive={current.matches('details')}
        >
          <Details fill={themeContext.finderIconFill} />
        </RightButton>
      </ButtonsWrapper>
    </Bar>
  );
};

const Bar = styled.div`
  height: 50px;
  min-height: 50px;
  width: 100%;
  display: flex;
  flex-direction: row;
`;
const FolderName = styled.div`
  font-size: 17px;
  font-weight: 500;
  color: rgb(177, 177, 177);
  align-self: center;
  padding-left: 35px;
`;
const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  border-top-right-radius: 12px;
`;
const BaseUtilButton = styled.button<{ isActive: boolean; theme: any }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  outline: none;
  width: 30px;
  height: 22px;
  margin-right: 1px;
  z-index: 120;
  border-radius: 5px;
  ${({ isActive, theme }) =>
    isActive &&
    `
    background: ${theme.finderModeButtonBackground};
    `}
`;
const LeftButton = styled(BaseUtilButton)``;
const MiddleButton = styled(BaseUtilButton)``;
const RightButton = styled(BaseUtilButton)``;

export default UtilityBar;
