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

const autocomplete = (currentDirectoryContents: Contents, term: string) => {
  console.log(currentDirectoryContents);
  const options = searchForOptions(term, currentDirectoryContents);

  return options;
};

export default autocomplete;
