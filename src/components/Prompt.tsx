import React, { FC, useEffect, useReducer, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import commandsList from '../shared/commands';
import files from '../shared/files';
import { reducer, Command } from '../prompt.reducer';

const searchForOptions = (term: string): string[] => {
  const o = Object.values(files)
    .filter((x) => x.searchText.filter((x) => x.startsWith(term)).length > 0)
    .map((x) => x.display);

  return o;
};

const Prompt: FC<{ isTerminalFocused: boolean }> = ({ isTerminalFocused }) => {
  const [state, dispatch] = useReducer(reducer, {
    index: 0,
    historyIndex: 0,
    commands: [],
  });
  const stateRef = useRef(state);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const commandRef = useRef<string | null>(null);
  const [currentCommand, setCurrentCommand] = useState('');
  const [keysCurrentlyPressed, setKeysCurrentlyPressed] = useState<string[]>(
    []
  );

  // update ref every time state changes
  // so we can access in event listener callbacks
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (isTerminalFocused) {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
      }
    }
  }, [isTerminalFocused]);

  const clear = () => {
    textAreaRef.current!.value = '';
    setCurrentCommand('');
    commandRef.current = '';
    dispatch({ type: 'clear' });
  };

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
      };

      textAreaRef.current!.value = '';
      commandRef.current = '';
      dispatch({ type: 'addCommand', payload: { command } });
      setCurrentCommand('');
    }
  }, [keysCurrentlyPressed]);

  useEffect(() => {
    if (isTerminalFocused) {
      const handleKeyDown = (e: KeyboardEvent) => {
        const { key } = e;
        let output = '';
        const currentCommand = commandRef.current ?? '';
        const [cmd, ...args] = currentCommand.split(' ');

        setKeysCurrentlyPressed((keys) => [
          ...keys.filter((k) => k !== key),
          key,
        ]);

        if (key === 'Tab') {
          e.preventDefault();
          if (cmd === 'ls' || cmd === 'cat') {
            const results = searchForOptions(args[0]);
            if (results.length > 1) {
              const output = results.join(' ');
              const command: Command = {
                input: commandRef.current!,
                type: 'real',
                output,
              };
              dispatch({ type: 'addCommand', payload: { command } });
              setCurrentCommand('');
              commandRef.current = '';
              textAreaRef.current!.value = '';
              commandRef.current = '';
            } else {
              if (results[0]) {
                const newCommand = `${cmd} ${results[0]}`;
                setCurrentCommand(newCommand);
                commandRef.current = newCommand;
              }
            }
          }
        } else if (key === 'ArrowDown') {
          dispatch({ type: 'incrementHistory' });
          const cmd = getRealCommands()[stateRef.current.historyIndex + 1];
          if (cmd) {
            setCurrentCommand(cmd.input);
            commandRef.current = cmd.input;
            textAreaRef.current!.value = cmd.input;
          }
        } else if (key === 'ArrowUp') {
          dispatch({ type: 'decrementHistory' });
          const cmd = getRealCommands()[stateRef.current.historyIndex - 1];
          if (cmd) {
            setCurrentCommand(cmd.input);
            commandRef.current = cmd.input;
            textAreaRef.current!.value = cmd.input;
          }
        } else if (key === 'Enter') {
          e.preventDefault();
          if (textAreaRef.current) {
            textAreaRef.current.value = '';
          }
          if (commandsList[currentCommand!]) {
            const co = commandsList[currentCommand ?? ''];
            output = co();
          } else if (cmd === 'cat') {
            const file = args[0];
            output = files[file].content;
          }
          const command: Command = {
            input: commandRef.current!,
            type: 'real',
            output,
          };
          dispatch({ type: 'addCommand', payload: { command } });
          setCurrentCommand('');
          commandRef.current = '';
        }
      };
      const handleKeyUp = (e: KeyboardEvent) => {
        const { key } = e;
        if (key === 'Meta') {
          // blow it all away
          setKeysCurrentlyPressed([]);
        }
        setKeysCurrentlyPressed((keys) => keys.filter((k) => k !== key));
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [isTerminalFocused]);

  return (
    <Wrapper>
      <pre
        style={{
          background: 'white',
          position: 'absolute',
          top: '-100px',
          padding: '10px',
          borderRadius: '10px',
          fontWeight: 'bold',
          fontSize: '20px',
        }}
      >
        {keysCurrentlyPressed.join(' ')}
      </pre>
      <HiddenTextArea
        ref={textAreaRef}
        onChange={(e) => {
          commandRef.current = e.target.value;
          setCurrentCommand(e.target.value);
        }}
        onBlur={() => {
          if (isTerminalFocused && textAreaRef.current) {
            textAreaRef.current.focus();
          }
        }}
      />
      {state.commands.map((line, i) => {
        const { output } = line;
        return (
          <React.Fragment key={i}>
            <Line>
              <User>[root ~]$&nbsp;</User>
              <Input>{line.input}</Input>
            </Line>
            {output && <pre style={{ color: 'white' }}>{output}</pre>}
          </React.Fragment>
        );
      })}
      <Line>
        <User>[root ~]$&nbsp;</User>
        <Input>{currentCommand}</Input>
        {isTerminalFocused && <Cursor />}
      </Line>
    </Wrapper>
  );
};

const Wrapper = styled.div``;
const Line = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  line-height: 25px;
`;
const User = styled.div`
  color: limegreen;
`;
const Input = styled.pre`
  color: white;
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
const Cursor = styled.span`
  display: inline-block;
  background: #b6b6b6;
  margin-left: 2px;
  width: 12px;
  height: 22px;
`;

export default Prompt;
