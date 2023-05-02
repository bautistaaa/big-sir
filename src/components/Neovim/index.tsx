import { FC, useEffect, useState } from 'react';
import Loading from './Loading';
import Editor from './Editor';
import { View } from '../Terminal';

type EditorState = 'loading' | 'nvim';
const Neovim: FC<{
  fileContent: string;
  setView: React.Dispatch<React.SetStateAction<View>>;
}> = ({ fileContent, setView }) => {
  const [editorState, setEditorState] = useState<EditorState>('loading');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setEditorState('nvim');
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (editorState === 'loading') {
    return <Loading />;
  }

  if (editorState === 'nvim') {
    return (
      <Editor
        fileContent={fileContent}
        setView={setView}
      />
    );
  }

  return <></>;
};

export default Neovim;
