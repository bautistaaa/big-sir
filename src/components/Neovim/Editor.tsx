import { FC, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import CodeMirror from '@uiw/react-codemirror';
import { basicSetup } from '@uiw/codemirror-extensions-basic-setup';
import ModeLine from './ModeLine';
import CommandLine from './CommandLine';
import useEditorState from '../../hooks/useEditorState';
import { View } from '../Terminal';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { vim } from '@replit/codemirror-vim';

const BLOCKED_LIST = [
  'Backspace',
  'Shift',
  'Meta',
  'Escape',
  'Control',
  'Alt',
  'Enter',
  'Tab',
  'ArrowUp',
  'ArrowDown',
];

const Editor: FC<{
  isTerminalFocused: boolean;
  fileContent: string;
  setView: React.Dispatch<React.SetStateAction<View>>;
}> = ({ isTerminalFocused, fileContent, setView }) => {
  const [state, dispatch] = useEditorState();
  const [code, setCode] = useState(fileContent);
  const ref = useRef<HTMLDivElement>(null);
  const commandTextAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const commandRef = useRef<string | null>(null);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  });

  useEffect(() => {
    if (isTerminalFocused) {
      if (commandTextAreaRef.current) {
        commandTextAreaRef.current.focus();
      }
    }
  }, [isTerminalFocused]);

  useEffect(() => {
    setTimeout(() => {
      if (ref.current) {
        const scrollHeight = ref.current.scrollHeight;
        ref.current.scrollTo(0, scrollHeight);
      }
    }, 3000);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { key } = e;

      // command mode
      if (key === ':') {
        if (commandTextAreaRef.current) {
          commandTextAreaRef.current.focus();
        }
        dispatch({ type: 'modeChanged', payload: { mode: 'command' } });
      } else if (stateRef.current.mode === 'command') {
        if (key === 'Enter') {
          if (stateRef.current.command === ':q') {
            setView('terminal');
          }
          if (commandTextAreaRef.current) {
            commandRef.current = '';
            commandTextAreaRef.current!.blur();
            commandTextAreaRef.current.value = '';
          }
          dispatch({ type: 'modeChanged', payload: { mode: 'normal' } });
        } else if (key === 'Escape') {
          commandRef.current = '';

          if (commandTextAreaRef.current) {
            commandTextAreaRef.current!.value = '';
            commandTextAreaRef.current!.blur();
          }
          dispatch({ type: 'modeChanged', payload: { mode: 'normal' } });
        } else if (key === 'Backspace') {
          const command = commandRef.current ?? '';
          const strippedLastLetter = command.split('');
          strippedLastLetter.pop();

          dispatch({
            type: 'addCommand',
            payload: { command: `${strippedLastLetter.join('')}` },
          });
        } else {
          if (!BLOCKED_LIST.includes(key)) {
            dispatch({
              type: 'addCommand',
              payload: { command: `${commandRef.current}${key}` },
            });
          }
        }
      }
    };

    const handleKeyUp = () => {};

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Wrapper ref={ref}>
        <FileContent>
          <CodeMirror
            autoFocus
            extensions={[vim(), basicSetup()]}
            theme={dracula}
            value={code}
            onChange={(value) => {
              setCode(value);
            }}
          />
        </FileContent>
        <ModeLine mode={state.mode} />
        <CommandLine command={state.command} />
        <HiddenTextArea
          ref={commandTextAreaRef}
          onChange={(e) => {
            if (state.mode === 'command') {
              commandRef.current = e.target.value;
            }
          }}
        />
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
  height: calc(100% - 50px);
  overflow: auto;
`;
const HiddenTextArea = styled.textarea`
  position: absolute;
  left: -16px;
  top: 0;
  width: 20px;
  height: 16px;
  background: transparent;
  border: none;
  color: transparent;
  outline: none;
  padding: 0;
  resize: none;
  z-index: 1;
  overflow: hidden;
  white-space: pre;
  text-indent: -9999em;
`;

export default Editor;
