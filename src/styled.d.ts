import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    background: string;
    color: string;
    topBarBackground: string;

    //menu
    menuBackground: string;

    //command panel
    commandPanelPanelBackground: string;
    commandPanelSubHeader: string;

    //about
    aboutBackground: string;

    //finder specific colors
    finderBorder: string;
    finderDetailsBorder: string;
    finderBackground: string;
    finderTopBarBackground: string;
    finderSideBarBackground: string;
    finderEvenItemListBackground: string;
    finderOddItemListBackground: string;
    // utility bar buttons
    finderIconFill: string;
    finderModeButtonBackground: string;
    //chrome
    chromeTopBarBackground: string;
    chromeBrowserBarBackground: string;
    chromeUrlInputBackground: string;
    //Dock
    dockBackground: string;
    dockSeparator: string;
  }
}
