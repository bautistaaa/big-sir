import React, { FC, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components/macro';
import { useAppContext } from '../AppContext';
import { Action, Command, PromptState } from '../hooks/usePromptState';
import { View } from './Terminal';
import autocomplete from '../utils/autocomplete';
import { getFileContents } from '../utils';

const Prompt: FC<{
  isTerminalFocused: boolean;
  setView: React.Dispatch<React.SetStateAction<View>>;
  setFileContent: React.Dispatch<React.SetStateAction<string>>;
  promptState: [PromptState, React.Dispatch<Action>];
}> = ({ isTerminalFocused, setView, setFileContent, promptState }) => {
  const { send: sendParent } = useAppContext();
  const [state, dispatch] = promptState;
  const { currentCommand, keysCurrentlyPressed } = state;
  const stateRef = useRef(state);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const commandRef = useRef<string | null>(null);

  useEffect(() => {
    stateRef.current = state;
  });

  useEffect(() => {
    if (isTerminalFocused) {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
      }
    }
  }, [isTerminalFocused]);

  const clearRefs = () => {
    textAreaRef.current!.value = '';
    commandRef.current = '';
  };
  const clear = useCallback(() => {
    clearRefs();
    dispatch({ type: 'clear' });
  }, [dispatch]);

  const getRealCommands = () => {
    return stateRef.current.commands.filter(
      (command) => command.type === 'real' && command.input !== ''
    );
  };

  useEffect(() => {
    if (
      keysCurrentlyPressed.includes('Meta') &&
      keysCurrentlyPressed.includes('k') &&
      textAreaRef.current &&
      textAreaRef.current.value === ''
    ) {
      clear();
    }
    if (
      keysCurrentlyPressed.includes('Control') &&
      keysCurrentlyPressed.includes('c')
    ) {
      const currentInput = textAreaRef.current!.value;
      const currentCommand = `${currentInput}^C`;

      const command: Command = {
        input: currentCommand,
        type: 'fake',
        output: '',
        cwd: stateRef.current.cwd,
      };

      clearRefs();
      dispatch({ type: 'addCommand', payload: { command } });
    }
  }, [keysCurrentlyPressed, clear, dispatch]);

  useEffect(() => {
    const displayFileNotFound = (currentCommand: string, cwd: string) => {
      const command: Command = {
        input: currentCommand,
        type: 'fake',
        output: 'File not found.',
        cwd,
      };

      textAreaRef.current!.value = '';
      commandRef.current = '';
      dispatch({ type: 'addCommand', payload: { command } });
    };
    if (isTerminalFocused) {
      const handleKeyDown = (e: KeyboardEvent) => {
        const { key } = e;
        let output = '';
        const currentCommand = commandRef.current ?? '';
        const [cmd, ...args] = currentCommand.split(' ');

        dispatch({ type: 'keyDown', payload: { key } });

        if (key === 'Tab') {
          e.preventDefault();
          if (
            cmd === 'ls' ||
            cmd === 'cat' ||
            cmd === 'cd' ||
            cmd === 'nvim' ||
            cmd === 'open'
          ) {
            const results = autocomplete(args[0], stateRef.current.cwdContents);
            if (results.length > 1) {
              const output = results.join(' ');
              const command: Command = {
                input: commandRef.current!,
                type: 'real',
                output,
                cwd: stateRef.current.cwd,
              };
              dispatch({ type: 'addCommand', payload: { command } });
              clearRefs();
            } else {
              if (results[0]) {
                const term = args[0].split('/');
                const parts = term.slice(0, term.length - 1);
                const path = [...parts, results[0]].filter(Boolean);
                const newCommand = `${cmd} ${
                  path.length > 1 ? path.join('/') : path
                }`;
                dispatch({
                  type: 'setCurrentCommand',
                  payload: { command: newCommand },
                });
                commandRef.current = newCommand;
                if (textAreaRef.current) {
                  textAreaRef.current.value = newCommand;
                }
              }
            }
          }
        } else if (key === 'ArrowDown') {
          dispatch({ type: 'incrementHistory' });
          const cmd = getRealCommands()[stateRef.current.historyIndex + 1];
          if (cmd) {
            dispatch({
              type: 'setCurrentCommand',
              payload: { command: cmd.input },
            });
            commandRef.current = cmd.input;
            textAreaRef.current!.value = cmd.input;
          }
        } else if (key === 'ArrowUp') {
          e.preventDefault();
          dispatch({ type: 'decrementHistory' });
          const cmd = getRealCommands()[stateRef.current.historyIndex - 1];
          if (cmd) {
            dispatch({
              type: 'setCurrentCommand',
              payload: { command: cmd.input },
            });
            commandRef.current = cmd.input;
            textAreaRef.current!.value = '';
            textAreaRef.current!.value = cmd.input;
          }
        } else if (key === 'Enter') {
          e.preventDefault();
          if (textAreaRef.current) {
            textAreaRef.current.value = '';
          }

          if (cmd === 'cat') {
            if (typeof stateRef.current.cwdContents !== 'string') {
              const term = args[0].split('/');
              const parts = term.slice(0, term.length - 1);
              const last = term.slice(-1)[0];

              if (term.length > 1) {
                output = getFileContents(
                  parts,
                  last,
                  stateRef.current.cwdContents
                ) as string;
              } else {
                output = stateRef.current.cwdContents?.[args[0]]
                  ?.contents as string;
              }

              if (!output) {
                displayFileNotFound(currentCommand, stateRef.current.cwd);
                return;
              }
            }
          } else if (cmd === 'pwd') {
            output = `${stateRef.current.cwd}`;
          } else if (cmd === 'nvim') {
            if (typeof stateRef.current.cwdContents !== 'string') {
              const term = args[0].split('/');
              const parts = term.slice(0, term.length - 1);
              const last = term.slice(-1)[0];
              let nvimInput = '';

              if (term.length > 1) {
                nvimInput = getFileContents(
                  parts,
                  last,
                  stateRef.current.cwdContents
                ) as string;
              } else {
                nvimInput = stateRef.current.cwdContents?.[args[0]]
                  ?.contents as string;
              }

              if (nvimInput) {
                setView('nvim');
                setFileContent(nvimInput);
              } else {
                displayFileNotFound(currentCommand, stateRef.current.cwd);
                return;
              }
            }
          } else if (cmd === 'cd') {
            const path = args[0];
            // try catch change directories
            // if caught means directory doesnt exist and add appropriate command
            // and output and return
            dispatch({
              type: 'changeDirectory',
              payload: { path },
            });
          } else if (cmd === 'ls') {
            output = Object.values(stateRef.current.cwdContents)
              .map((x) => x.display)
              .join(' ');
          } else if (cmd === 'open') {
            const term = args[0].split('/');
            const parts = term.slice(0, term.length - 1);
            const last = term.slice(-1)[0];
            let defaultUrl = '';

            if (term.length > 1) {
              defaultUrl = getFileContents(
                parts,
                last,
                stateRef.current.cwdContents
              ) as string;
            } else if (typeof stateRef.current.cwdContents !== 'string') {
              defaultUrl = stateRef.current.cwdContents?.[args[0]]
                ?.contents as string;
            }
            sendParent({
              type: 'FOCUS_WINDOW',
              payload: {
                name: 'chrome',
                defaultUrl,
              },
            });
          }

          const command: Command = {
            input: commandRef.current!,
            type: 'real',
            output,
            cwd: stateRef.current.cwd,
          };
          dispatch({ type: 'addCommand', payload: { command } });
          commandRef.current = '';
        }
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        const { key } = e;
        dispatch({ type: 'keyUp', payload: { key } });
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [isTerminalFocused, dispatch, setFileContent, setView, sendParent]);

  return (
    <Wrapper>
      {/* <pre */}
      {/*   style={{ */}
      {/*     background: 'white', */}
      {/*     position: 'absolute', */}
      {/*     top: '-100px', */}
      {/*     padding: '10px', */}
      {/*     borderRadius: '10px', */}
      {/*     fontWeight: 'bold', */}
      {/*     fontSize: '20px', */}
      {/*   }} */}
      {/* > */}
      {/*   {state.keysCurrentlyPressed.join(' ')} */}
      {/* </pre> */}
      <HiddenTextArea
        ref={textAreaRef}
        onChange={(e) => {
          commandRef.current = e.target.value;
          dispatch({
            type: 'setCurrentCommand',
            payload: { command: e.target.value },
          });
        }}
        onBlur={() => {
          if (isTerminalFocused && textAreaRef.current) {
            textAreaRef.current.focus();
          }
        }}
      />
      {state.commands.map((line, i) => {
        const { output, cwd } = line;
        return (
          <React.Fragment key={i}>
            <Line>
              <User>[{cwd}]$&nbsp;</User>
              <Input>{line.input}</Input>
            </Line>
            {output && <pre style={{ color: 'white' }}>{output}</pre>}
          </React.Fragment>
        );
      })}
      <Line>
        <User>[{state.cwd}]$&nbsp;</User>
        <Input>
          {currentCommand}
          {isTerminalFocused && (
            <CursorWrapper>
              <Cursor />
            </CursorWrapper>
          )}
        </Input>
      </Line>
    </Wrapper>
  );
};

const Wrapper = styled.div``;
const Line = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  line-height: 25px;
`;
const User = styled.div`
  color: limegreen;
`;
const Input = styled.pre`
  color: white;
  position: relative;
  bottom: 2px;
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
const CursorWrapper = styled.div`
  display: inline-block;
  position: relative;
  margin-left: 2px;
  width: 12px;
  height: 22px;
`;
const Cursor = styled.div`
  position: absolute;
  top: 5px;
  left: 0;
  background: #b6b6b6;
  width: 12px;
  height: 22px;
`;

export default Prompt;
