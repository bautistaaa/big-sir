import fileDirectory, { Contents } from '../shared/fileDirectory';

const getDirectoryContents = (
  path: string[],
  cwdContents?: Contents
): Contents => {
  let root = cwdContents ?? fileDirectory['/']?.contents;

  for (let i = 0; i < path.length; i++) {
    const current = path[i] || '/';
    if (typeof root !== 'string') {
      if (!root?.[current]?.contents) continue;
      root = root?.[current]?.contents;
    }
  }

  return root;
};

export default getDirectoryContents;
