import { useState } from 'react';

function useHistory() {
  let [index, setIndex] = useState(0);
  let [actualCommands, setActualCommands] = useState<string[]>([]);
  let [notActualCommands, setNotActualCommands] = useState<string[]>([]);
  let [output, setOutput] = useState<string[]>([]);

  function addCommand(command: string, output: string) {
    setActualCommands((list) => {
      return [...list, command];
    });
    setOutput((oldOut) => {
      return [...oldOut, output];
    });
    setIndex((i) => i + 1);
  }

  function getOutput(i: number) {
    return output[i];
  }

  function getPreviousCommand() {
    return actualCommands[index - 1] ?? actualCommands[0];
  }

  function getNextCommand() {
    return (
      actualCommands[index + 1] ?? actualCommands[actualCommands.length - 1]
    );
  }

  function clear() {
    setActualCommands([]);
    setOutput([]);
  }

  return {
    state: { index, actualCommands, output },
    addCommand,
    clear,
    getOutput,
    getPreviousCommand,
    getNextCommand,
  };
}

export default useHistory;
