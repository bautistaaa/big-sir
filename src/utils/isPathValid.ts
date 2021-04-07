import fileDirectory from '../shared/fileDirectory';

const isPathValid = (cwd: string, path: string): boolean => {
  const currentDirectory = fileDirectory[cwd];

  return false;
};

export default isPathValid;
