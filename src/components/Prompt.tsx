import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import History from '../shared/History';
import Commands from '../shared/Commands';

const Prompt: FC<{ isTerminalFocused: boolean }> = ({ isTerminalFocused }) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const history = useRef(new History());
  const [currentCommand, setCurrentCommand] = useState('');
  const [lines, setLines] = useState<number[]>([1]);

  useEffect(() => {
    if (isTerminalFocused) {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
      }
    }
  }, [isTerminalFocused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { key } = e;
      let output = '';
      if (key === 'Enter') {
        e.preventDefault();
        setCurrentCommand((currentCommand) => {
          if (textAreaRef.current) {
            textAreaRef.current.value = '';
          }
          if (Commands[currentCommand]) {
            const co = Commands[currentCommand];
            console.log(co);
            if (Array.isArray(co)) {
              output = co.join(' ');
            }
          }

          console.log(currentCommand, output);
          history.current.addCommand(currentCommand, output);
          console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
          console.log('AFTER');
          console.log(history);

          return '';
        });
        setLines((lines) => [...lines, 1]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Wrapper>
      <HiddenTextArea
        ref={textAreaRef}
        onChange={(e) => {
          setCurrentCommand(e.target.value);
        }}
        onBlur={(e: React.FocusEventHandler<HTMLTextAreaElement>) => {
          if (isTerminalFocused && textAreaRef.current) {
            textAreaRef.current.focus();
          }
        }}
      />
      {history.current.getList().map((line, i) => {
        const output = history.current.getOutput(i);
        return (
          <React.Fragment key={i}>
            <Line>
              <User>[root ~]$&nbsp;</User>
              <Input>{line}</Input>
            </Line>
            {output && <span style={{ color: 'white' }}>{output}</span>}
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
const User = styled.span`
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
