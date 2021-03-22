import { useEffect, useRef, useState } from 'react';

type CommandType = 'real' | 'fake';

export interface Command {
  input: string;
  type: CommandType;
}

function useHistory() {
  let [index, setIndex] = useState(0);
  let [historyIndex, setHistoryIndex] = useState(0);
  let [commands, setCommands] = useState<Command[]>([]);
  let [output, setOutput] = useState<string[]>([]);
  const previousCommand = useRef<Command>();

  useEffect(() => {
    setHistoryIndex(index);
  }, [index]);
  useEffect(() => {
    const realCommands = commands.filter((command) => command.type === 'real');
    previousCommand.current = realCommands[historyIndex - 1] ?? realCommands[0];
  }, [commands, historyIndex]);

  function decrementIndex() {
    setHistoryIndex((index) => (index - 1 < 0 ? 0 : index - 1));
  }
  function incrementIndex() {
    setIndex((index) => index + 1);
  }

  function addCommand(command: Command, output: string) {
    setCommands((list) => {
      return [...list, command];
    });
    setOutput((oldOut) => {
      return [...oldOut, output];
    });
    if (command.type !== 'fake') {
      setIndex((i) => i + 1);
    }
  }

  function getOutput(i: number) {
    return output[i];
  }

  function clear() {
    setCommands([]);
    setOutput([]);
    setIndex(0);
    setHistoryIndex(0);
  }

  return {
    state: { index, commands, output },
    previousCommand,
    incrementIndex,
    decrementIndex,
    addCommand,
    clear,
    getOutput,
  };
}

export default useHistory;
