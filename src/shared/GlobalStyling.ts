import { createGlobalStyle } from 'styled-components';

const GlobalStyling = createGlobalStyle`
  * {
    box-sizing: border-box;
    transition: background-color 150ms ease-in, color 150ms ease-in, border 150ms ease-in;
  }
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  pre {
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -pre-wrap;
    white-space: -o-pre-wrap;
    word-wrap: break-word;
   }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure, 
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  html, body, #root { height: 100% }
  body {
    font-family: -apple-system,BlinkMacSystemFont,'Inter','Helvetica Neue','Helvetica','Arial',sans-serif;
    line-height: 1;
    overflow: hidden;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  textarea {
    caret-color: transparent;
  }
  iframe {
    position: absolute;
    top: 50px;
    width: 1000px;
    height: 600px;
    z-index: 10000;
  }
`;

export default GlobalStyling;
