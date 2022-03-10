import { FC } from 'react';
import styled from 'styled-components/macro';

const text = `
            NVIM v0.5.0-dev+5ad3288

 Nvim is open source and freely distributable
            https://neovim.io/#chat

type  :help nvim<Enter>       if you are new!
type  :checkhealth<Enter>     to optimize Nvim
type  :q<Enter>               to exit
type  :help<Enter>            for help

         Help poor children in Uganda!
type  :help iccf<Enter>       for information
`;
const Loading: FC = () => {
  return (
    <Wrapper>
      <pre>{text}</pre>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: rgb(38, 38, 38);
  color: rgb(196, 196, 196);
`;

export default Loading;
