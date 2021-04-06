import { FC, useEffect, useRef } from 'react';
import styled from 'styled-components/macro';
import ModeLine from './ModeLine';
import CommandLine from './CommandLine';
import useEditorState from '../../hooks/useEditorState';
import { View } from '../Terminal';

const Editor: FC<{
  isTerminalFocused: boolean;
  fileContent: string;
  setView: React.Dispatch<React.SetStateAction<View>>;
}> = ({ isTerminalFocused, fileContent, setView }) => {
  const [state, dispatch] = useEditorState();
  const fileContentTextAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const commandTextAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const commandRef = useRef<string | null>(null);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  });

  useEffect(() => {
    if (fileContentTextAreaRef.current) {
      fileContentTextAreaRef.current.value = fileContent;
    }
  }, [fileContent]);

  useEffect(() => {
    if (isTerminalFocused) {
      if (commandTextAreaRef.current) {
        commandTextAreaRef.current.focus();
      }
    }
  }, [isTerminalFocused]);

  useEffect(() => {
    if (commandTextAreaRef.current) {
      commandTextAreaRef.current.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const { key } = e;

      // command mode
      if (key === ':') {
        dispatch({ type: 'modeChanged', payload: { mode: 'command' } });
      } else if (stateRef.current.mode === 'command') {
        if (key === 'Enter') {
          if (stateRef.current.command === ':q') {
            setView('terminal');
          }
          commandRef.current = '';
          if (commandTextAreaRef.current) {
            commandTextAreaRef.current.value = '';
          }
          dispatch({ type: 'modeChanged', payload: { mode: 'normal' } });
        } else if (key === 'Escape') {
          commandRef.current = '';
          commandTextAreaRef.current!.value = '';
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
          dispatch({
            type: 'addCommand',
            payload: { command: `${commandRef.current}${key}` },
          });
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const { key } = e;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <>
      <Wrapper>
        <FileContent>{fileContent}</FileContent>
        <ModeLine mode={state.mode} />
        <CommandLine command={state.command} />
        <HiddenTextArea ref={fileContentTextAreaRef} />
        <HiddenTextArea
          ref={commandTextAreaRef}
          onChange={(e) => {
            commandRef.current = e.target.value;
          }}
          onBlur={() => {
            if (isTerminalFocused && commandTextAreaRef.current) {
              commandTextAreaRef.current.focus();
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
`;
const FileContent = styled.pre`
  margin-left: 15px;
  flex: 1;
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
