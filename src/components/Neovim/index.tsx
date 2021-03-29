import { FC, useEffect, useState } from 'react';
import Loading from './Loading';
import Editor from './Editor';

type View = 'loading' | 'nvim';
const Neovim: FC = () => {
  const [view, setView] = useState<View>('loading');
  console.log(view);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setView('nvim');
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (view === 'loading') {
    return (
      <>
        <Loading />
      </>
    );
  }

  if (view === 'nvim') {
    return (
      <>
        <Editor />
      </>
    );
  }

  return <div></div>;
};

export default Neovim;
