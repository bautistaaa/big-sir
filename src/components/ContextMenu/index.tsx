import { FC } from 'react';
import styled from 'styled-components/macro';

interface ContextMenuProps {
  xPos: string;
  yPos: string;
  handleCleanUpClick(): void;
}
const ContextMenu: FC<ContextMenuProps> = ({
  xPos,
  yPos,
  handleCleanUpClick,
}) => {
  return (
    <StyledMenu style={{ position: 'absolute', left: xPos, top: yPos }}>
      <StyledMenuItems>
        <StyledMenuItem>
          <MenuButton onClick={handleCleanUpClick}>Clean Up</MenuButton>
        </StyledMenuItem>
      </StyledMenuItems>
    </StyledMenu>
  );
};

const StyledMenu = styled.div`
  position: relative;
`;
const MenuButton = styled.div`
  padding: 5px 9px;
  position: relative;
  border-radius: 4px;
  &:hover {
    background: rgb(26, 109, 196);
  }
`;
const StyledMenuItems = styled.ul`
  color: white;
  outline: none;
  position: absolute;
  background: rgb(27 27 29 / 30%);
  backdrop-filter: blur(72px);
  box-shadow: inset 0px 0px 0px 0.4px rgb(255 255 255 / 35%);
  left: 0;
  border-radius: 5px;
  width: 260px;
  padding: 2px 0;
`;
const StyledMenuItem = styled.li`
  cursor: default;
  position: relative;
  padding: 3px 0;
  margin: 0 5px;
  }
`;

export default ContextMenu;
