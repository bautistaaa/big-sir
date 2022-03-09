import { FC, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components/macro';
import { BsBrightnessAltHigh } from 'react-icons/bs';
import { Menu } from '@headlessui/react';
import CircleButton from './CircleButton';
import ClearButton from '../../../components/ClearButton';
import { Mirroring, Settings } from '../icons';
import ButtonItem, {
  ButtonItemProps as BaseButtonItemProps,
  Settings as SettingsEnum,
} from './ButtonItem';
import { useAppContext } from '../../../AppContext';
import { useActor } from '@xstate/react';

export interface ButtonItemProps extends BaseButtonItemProps {}
const buttonListItems: ButtonItemProps[] = [
  {
    type: SettingsEnum.wifi,
    mainText: 'Wi-Fi',
    activeText: 'bautistaaa',
    inactiveText: 'Not Connected',
  },
  {
    type: SettingsEnum.bluetooth,
    mainText: 'Bluetooth',
    activeText: 'On',
    inactiveText: 'Off',
  },
  {
    type: SettingsEnum.airdrop,
    mainText: 'AirDrop',
    activeText: 'Contacts Only',
    inactiveText: 'Off',
  },
];
const CommandPanel: FC = () => {
  const service = useAppContext();
  const [currentParent, sendParent] = useActor(service);
  const themeContext = useContext(ThemeContext);
  return (
    <Wrapper>
      <Menu as={StyledMenu}>
        <Menu.Button as={StyledMenuButton}>
          <Settings />
        </Menu.Button>
        <Menu.Items as={StyledMenuItems}>
          <StyledMenuItem>
            <Grid>
              <LeftColumn>
                <ButtonList>
                  {buttonListItems.map((bli) => {
                    return (
                      <ButtonListItem key={bli.type}>
                        <ButtonItem {...bli} />
                      </ButtonListItem>
                    );
                  })}
                </ButtonList>
              </LeftColumn>
              <RightColumnTop>
                <ClearButton
                  onClick={() => {
                    const mode =
                      currentParent.context.mode === 'dark' ? 'light' : 'dark';
                    sendParent({
                      type: 'TOGGLE_MODE',
                      payload: { mode },
                    });
                  }}
                >
                  <DnDCircleButton
                    active={currentParent.context.mode === 'dark'}
                    icon={SettingsEnum.dnd}
                  />
                  <DndText>Dark Mode</DndText>
                </ClearButton>
              </RightColumnTop>
              <LeftItem>
                <BsBrightnessAltHigh size={25} fill={themeContext.color} />
                <BrightnessText>Keyboard Brightness</BrightnessText>
              </LeftItem>
              <RightItem>
                <Mirroring fill={themeContext.color} />
                <MirroringText>Screen Mirroring</MirroringText>
              </RightItem>
            </Grid>
          </StyledMenuItem>
        </Menu.Items>
      </Menu>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-right: 10px;
  position: relative;
  top: 2px;
`;
const StyledMenu = styled.div`
  position: relative;
`;
const StyledMenuButton = styled.button`
  background: transparent;
  border: none;
  outline: none;
`;
const StyledMenuItems = styled.ul`
  outline: none;
  position: absolute;
  background: ${({ theme }) => theme.menuBackground};
  backdrop-filter: blur(25px);
  box-shadow: inset 0px 0px 0px 0.4px rgb(255 255 255 / 35%);
  right: -136px;
  top: 24px;
  padding: 10px;
  border-radius: 10px;
  width: 320px;
`;
const StyledMenuItem = styled.li``;
const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(4, 1fr);
  grid-template-areas:
    'left-side left-side right-top right-top'
    'left-side left-side right-top right-top'
    'left-side left-side keyboard mirroring';
`;
const BasePanel = styled.div`
  border-radius: 5px;
  background: ${({ theme }) => theme.commandPanelPanelBackground};
  backdrop-filter: blur(75px);
`;
const LeftColumn = styled(BasePanel)`
  padding: 12px 10px;
  grid-area: left-side;
`;
const DnDCircleButton = styled(CircleButton)`
  cursor: default;
  flex-shrink: 0;
`;
const RightColumnTop = styled(BasePanel)`
  display: flex;
  align-items: center;
  justify-content: center;
  grid-area: right-top;
  padding: 12px 10px;
`;
const DndText = styled.div`
  cursor: default;
  line-height: 15px;
  margin-left: 7px;
  color: ${({ theme }) => theme.color};
`;
const BrightnessText = styled.div`
  color: ${({ theme }) => theme.color};
  text-align: center;
  margin-top: 5px;
  line-height: 12px;
  font-size: 10px;
`;
const MirroringText = styled.div`
  color: ${({ theme }) => theme.color};
  text-align: center;
  margin-top: 5px;
  line-height: 12px;
  font-size: 10px;
`;
const LeftItem = styled(BasePanel)`
  padding: 12px 10px;
  grid-area: keyboard;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: default;
`;
const RightItem = styled(BasePanel)`
  padding: 12px 10px;
  grid-area: keyboard;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  grid-area: mirroring;
  cursor: default;
`;
const ButtonList = styled.ul``;
const ButtonListItem = styled.li`
  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

export default CommandPanel;
