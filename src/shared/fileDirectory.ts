import { resume } from './Files/';

export type Contents = Record<string, File> | string;
export interface File {
  type: string;
  display: string;
  searchText: string[];
  contents: Contents;
}
const fileDirectory: Record<string, File> = {
  '/': {
    display: '/',
    type: 'directory',
    searchText: ['/'],
    contents: {
      'Resume.js': {
        display: 'Resume.js',
        type: 'file',
        contents: resume,
        searchText: ['Resume', 'js'],
      },
      projects: {
        type: 'directory',
        display: 'projects',
        searchText: ['projects'],
        contents: {
          NarutoQL: {
            display: 'NarutoQL',
            type: 'file',
            contents: `file contents`,
            searchText: ['Naruto'],
          },
          Spotify: {
            display: 'Spotify City',
            type: 'file',
            contents: `file contents`,
            searchText: ['Spotify'],
          },
          vimfolio: {
            display: 'Vimfolio',
            type: 'file',
            contents: `file contents`,
            searchText: ['vim'],
          },
          vimdaddy: {
            display: 'Vim Daddy',
            type: 'file',
            contents: `file contents`,
            searchText: ['vim'],
          },
        },
      },
    },
  },
};

export default fileDirectory;
