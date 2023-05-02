import { FC, useEffect, useRef } from 'react';
import styled from 'styled-components';
import CodeMirror from '@uiw/react-codemirror';
import { basicSetup } from '@uiw/codemirror-extensions-basic-setup';
import { View } from '../Terminal';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { Vim, vim } from '@replit/codemirror-vim';

const Editor: FC<{
  fileContent: string;
  setView: React.Dispatch<React.SetStateAction<View>>;
}> = ({ fileContent, setView }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Vim.defineEx('quit', 'q', (cm) => {
      setView('terminal');
    });
  });

  useEffect(() => {
    setTimeout(() => {
      if (ref.current) {
        const scrollHeight = ref.current.scrollHeight;
        ref.current.scrollTo(0, scrollHeight);
      }
    }, 3000);
  }, []);

  return (
    <>
      <Wrapper ref={ref}>
        <FileContent>
          <CodeMirror
            autoFocus
            extensions={[vim({ status: true }), basicSetup()]}
            theme={dracula}
            value={fileContent}
          />
        </FileContent>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  height: 100%;
  background: #282a36;
`;
const FileContent = styled.div`
  overflow: auto;

  .ͼ1 .cm-vim-panel input {
    color: white;
  }
`;

export default Editor;
