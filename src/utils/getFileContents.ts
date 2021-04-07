import fileDirectory from '../shared/fileDirectory';

const getFileContents = (file: string): string => {
  const root = fileDirectory['/'];
  if (typeof root.contents !== 'string') {
    const f = root?.contents[file];
    if (f.fileType === 'file') {
      return root?.contents[file]?.contents as string;
    }
  }

  return '';
};

export default getFileContents;
