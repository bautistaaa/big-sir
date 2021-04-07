import files from './files';

const commands: { [k: string]: (...args: any[]) => string } = {
  ls: (cwd: string) =>
    Object.values(files)
      .map((x) => x.display)
      .join(' '),
  cat: () => 'Only vim is supported in this terminal',
};

export default commands;
