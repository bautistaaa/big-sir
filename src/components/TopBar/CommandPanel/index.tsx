import { FC } from 'react';
import styled from 'styled-components/macro';
import { Menu } from '@headlessui/react';
import CircleButton from './CircleButton';
import { Brightness, Mirroring, Settings } from '../icons';
import ButtonItem, {
  ButtonItemProps,
  Settings as SettingsEnum,
} from './ButtonItem';

export interface ButtonListItem extends ButtonItemProps {}
const buttonListItems: ButtonListItem[] = [
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
                      <ButtonListItem>
                        <ButtonItem {...bli} />
                      </ButtonListItem>
                    );
                  })}
                </ButtonList>
              </LeftColumn>
              <RightColumnTop>
                <DnDCircleButton icon={SettingsEnum.dnd} />
                <DndText>Do Not Disturb</DndText>
              </RightColumnTop>
              <LeftItem>
                <Brightness />
                <BrightnessText>Keyboard Brightness</BrightnessText>
              </LeftItem>
              <RightItem>
                <Mirroring />
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
  background: rgb(27 27 29 / 30%);
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
  // grid-template-rows: 80px;
  grid-template-areas:
    'left-side left-side right-top right-top'
    'left-side left-side right-top right-top'
    'left-side left-side keyboard mirroring';
`;
const BasePanel = styled.div`
  border-radius: 5px;
  // background: rgb(51, 50, 55);
  background: rgb(27 27 29 / 50%);
  backdrop-filter: blur(75px);
`;
const LeftColumn = styled(BasePanel)`
  padding: 12px 10px;
  grid-area: left-side;
`;
const DnDCircleButton = styled(CircleButton)`
  flex-shrink: 0;
  background: rgb(94, 92, 230);
`;
const RightColumnTop = styled(BasePanel)`
  display: flex;
  align-items: center;
  justify-content: center;
  grid-area: right-top;
  padding: 12px 10px;
`;
const DndText = styled.div`
  line-height: 15px;
  margin-left: 7px;
`;
const BrightnessText = styled.div`
  text-align: center;
  margin-top: 5px;
  line-height: 12px;
  font-size: 10px;
`;
const MirroringText = styled.div`
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
`;
const RightItem = styled(BasePanel)`
  padding: 12px 10px;
  grid-area: keyboard;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  grid-area: mirroring;
`;
const ButtonList = styled.ul``;
const ButtonListItem = styled.li`
  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

export default CommandPanel;
