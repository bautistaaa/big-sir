import { getDirectoryContents } from '.';
import { Contents } from '../shared/fileDirectory';

const searchForOptions = (
  term: string,
  currentDirectoryContents: Contents
): string[] => {
  const o = Object.values(currentDirectoryContents)
    .filter(
      (x) => x.searchText.filter((x: string) => x.startsWith(term)).length > 0
    )
    .map((x) => x.display);

  return o;
};

const autocomplete = (
  path: string = '',
  currentDirectoryContents: Contents
): string[] => {
  const parts = path.split('/');
  const pathToGrep = parts.slice(0, parts.length - 1);

  const contents = getDirectoryContents(pathToGrep, currentDirectoryContents);
  // must be a directory
  if (contents) {
    const options = searchForOptions(
      parts[parts.length - 1],
      // @ts-ignore
      contents
    );

    return options;
  }

  return [];
};

export default autocomplete;
