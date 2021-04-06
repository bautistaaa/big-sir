import fileDirectory, { File } from '../shared/fileDirectory';

const searchForOptions = (
  term: string,
  files: Record<string, File>
): string[] => {
  const o = Object.values(files)
    .filter(
      (x) => x.searchText.filter((x: string) => x.startsWith(term)).length > 0
    )
    .map((x) => x.display);

  return o;
};

const autocomplete = (cwd: string, term: string) => {
  const root = fileDirectory[cwd];
  const options = searchForOptions(term, root.contents as Record<string, File>);

  return options;
};

export default autocomplete;
