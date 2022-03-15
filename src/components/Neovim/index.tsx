import Loading from './Loading';
import Editor from './Editor';
import { useMachine } from '@xstate/react';
import { neovimMachine } from './neovim.machine';

interface Props {
  isTerminalFocused: boolean;
  fileContent: string;
  onViewChanged(view: string): void;
}
const Neovim = ({ isTerminalFocused, fileContent, onViewChanged }: Props) => {
  const [current] = useMachine(neovimMachine);

  if (current.matches('loading')) {
    return <Loading />;
  }

  if (current.matches('neovim')) {
    return (
      <Editor
        fileContent={fileContent}
        onViewChanged={onViewChanged}
        isTerminalFocused={isTerminalFocused}
      />
    );
  }

  return null;
};

export default Neovim;
