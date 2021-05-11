import { DefaultTheme } from 'styled-components';

export const lightTheme: DefaultTheme = {
  background: 'rgb(56,56,56)',
  color: 'rgb(74,74,74)',
  topBarBackground: 'rgb(241,239,245)',

  menuBackground: 'rgb(255 255 255 / 79%)',

  commandPanelPanelBackground: 'rgb(142 142 155 / 50%)',
  commandPanelSubHeader: '#616161',

  aboutBackground: 'rgb(255 255 255 / 70%)',

  finderBorder: '#e3e3e3',
  finderDetailsBorder: '#e3e3e3',
  finderBackground: 'white',
  finderTopBarBackground: 'rgb(241,239,245)',
  finderSideBarBackground: 'white',
  finderEvenItemListBackground: 'white',
  finderOddItemListBackground: '#f1f1f1',

  finderIconFill: 'gray',
  finderModeButtonBackground: '#e3e3e3',

  chromeTopBarBackground: '#e3e3e3',
  chromeBrowserBarBackground: 'white',
  chromeUrlInputBackground: 'rgb(244, 244, 244)',

  dockBackground: 'rgb(200 200 200 / 44%)',
  dockSeparator: 'black',
};

export const darkTheme: DefaultTheme = {
  background: 'rgb(56, 56, 56)',
  color: 'white',
  topBarBackground: 'rgb(56, 56, 56)',

  menuBackground: 'rgb(27 27 29 / 30%)',

  commandPanelPanelBackground: 'rgb(27 27 29 / 50%)',
  commandPanelSubHeader: 'rgb(173,172,172)',

  aboutBackground: 'rgb(27 27 29 / 70%)',

  finderBorder: 'rgb(100, 100, 100)',
  finderDetailsBorder: 'black',
  finderBackground: 'rgb(41, 35, 38)',
  finderTopBarBackground: 'rgb(56, 56, 56)',
  finderSideBarBackground: 'rgb(42 42 42 / 65%)',
  finderEvenItemListBackground: 'rgb(41, 35, 38)',
  finderOddItemListBackground: 'rgb(51, 51, 51)',
  finderIconFill: 'white',
  finderModeButtonBackground: 'rgb(81, 80, 80)',

  chromeTopBarBackground: 'rgb(33, 33, 36)',
  chromeBrowserBarBackground: 'rgb(56, 56, 56)',
  chromeUrlInputBackground: 'rgb(33, 33, 36)',

  dockBackground: 'rgb(51 51 51 / 23%)',
  dockSeparator: 'rgba(255, 255, 255, 0.3)',
};
