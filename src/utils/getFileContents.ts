import fileDirectory, { Contents } from '../shared/fileDirectory';

const getFileContents = (cwd: string, file: string): Contents | undefined => {
  const root = fileDirectory[cwd];
  if (typeof root.contents !== 'string') {
    return root?.contents[file]?.contents;
  }

  return;
};

export default getFileContents;
