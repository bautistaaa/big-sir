import { resume } from './Files/';

export type Contents = Record<string, File> | string;
type FileType = 'file' | 'directory' ;
export interface File {
  fileType: FileType;
  display: string;
  searchText: string[];
  contents: Contents;
}
const fileDirectory: Record<string, File> = {
  '/': {
    display: '/',
    fileType: 'directory',
    searchText: ['/'],
    contents: {
      home: {
        display: 'home',
        fileType: 'directory',
        searchText: ['home'],
        contents: {
          personal: {
            display: 'personal',
            fileType: 'directory',
            searchText: ['personal'],
            contents: {
              'Resume.js': {
                display: 'Resume.js',
                fileType: 'file',
                contents: resume,
                searchText: ['Resume', 'js'],
              },
            },
          },
          projects: {
            fileType: 'directory',
            display: 'projects',
            searchText: ['projects'],
            contents: {
              NarutoQL: {
                display: 'NarutoQL',
                fileType: 'file',
                contents: `file contents`,
                searchText: ['Naruto'],
              },
              Spotify: {
                display: 'Spotify City',
                fileType: 'file',
                contents: `file contents`,
                searchText: ['Spotify'],
              },
              vimfolio: {
                display: 'Vimfolio',
                fileType: 'file',
                contents: `file contents`,
                searchText: ['vim'],
              },
              vimdaddy: {
                display: 'Vim Daddy',
                fileType: 'file',
                contents: `file contents`,
                searchText: ['vim'],
              },
            },
          },
        },
      },
    },
  },
};

export default fileDirectory;
