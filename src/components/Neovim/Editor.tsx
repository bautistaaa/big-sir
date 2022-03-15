import { FC, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import { Controlled as CodeMirror } from 'react-codemirror2';
import ModeLine from './ModeLine';
import CommandLine from './CommandLine';
import { View } from '../Terminal';
import { useMachine } from '@xstate/react';
import editorMachine from './editor.machine';
require('codemirror/mode/htmlmixed/htmlmixed');
require('codemirror/keymap/vim');

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

const options = {
  theme: 'dracula',
  lineNumbers: true,
  keyMap: 'vim',
  mode: 'htmlmixed',
};

const Editor: FC<{
  isTerminalFocused: boolean;
  fileContent: string;
  onViewChanged(view: string): void;
}> = ({ isTerminalFocused, fileContent, onViewChanged }) => {
  // const [state, dispatch] = useEditorState();
  const [{ context: current }, send] = useMachine(editorMachine);
  const [code, setCode] = useState(fileContent);
  const ref = useRef<HTMLDivElement>(null);
  const commandTextAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const commandRef = useRef<string | null>(null);
  const stateRef = useRef(current);

  useEffect(() => {
    stateRef.current = current;
  });

  useEffect(() => {
    if (isTerminalFocused) {
      if (commandTextAreaRef.current) {
        commandTextAreaRef.current.focus();
      }
    }
  }, [isTerminalFocused]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (ref.current) {
        const scrollHeight = ref.current.scrollHeight;
        ref.current.scrollTo(0, scrollHeight);
      }
    }, 3000);

    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { key } = e;

      // command mode
      if (key === ':') {
        if (commandTextAreaRef.current) {
          commandTextAreaRef.current.focus();
        }
        send({ type: 'MODE_CHANGED', payload: { mode: 'command' } });
      } else if (stateRef.current.mode === 'command') {
        if (key === 'Enter') {
          if (stateRef.current.command === ':q') {
            onViewChanged('terminal');
          }
          if (commandTextAreaRef.current) {
            commandRef.current = '';
            commandTextAreaRef.current!.blur();
            commandTextAreaRef.current.value = '';
          }
          send({ type: 'MODE_CHANGED', payload: { mode: 'normal' } });
        } else if (key === 'Escape') {
          commandRef.current = '';

          if (commandTextAreaRef.current) {
            commandTextAreaRef.current!.value = '';
            commandTextAreaRef.current!.blur();
          }
          send({ type: 'MODE_CHANGED', payload: { mode: 'normal' } });
        } else if (key === 'Backspace') {
          const command = commandRef.current ?? '';
          const strippedLastLetter = command.split('');
          strippedLastLetter.pop();

          send({
            type: 'ADD_COMMAND',
            payload: { command: `${strippedLastLetter.join('')}` },
          });
        } else {
          if (!BLOCKED_LIST.includes(key)) {
            send({
              type: 'ADD_COMMAND',
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
            options={options}
            value={code}
            onBeforeChange={(editor, data, value) => {
              setCode(value);
            }}
            onChange={(editor, data, value) => {
              setCode(value);
            }}
          />
        </FileContent>
        <ModeLine mode={current.mode} />
        <CommandLine command={current.command} />
        <HiddenTextArea
          ref={commandTextAreaRef}
          onChange={(e) => {
            if (current.mode === 'command') {
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
  .react-codemirror2,
  .react-codemirror2 > div {
    color: white !important;
    height: 100%;
  }
  .react-codemirror2 * {
    transition: none !important;
  }
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
