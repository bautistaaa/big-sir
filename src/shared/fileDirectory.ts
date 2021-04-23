import { resume } from './Files/';

export type Contents = Record<string, File> | string;
type FileType = 'file' | 'directory' | 'html' ;
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
              'narutoql.html': {
                display: 'narutoql.html',
                fileType: 'html',
                contents: `https://www.narutoql.com`,
                searchText: ['naruto'],
              },
              'spotify-city.html': {
                display: 'spotify-city.html',
                fileType: 'html',
                contents: `https://spotify-city.netlify.app/`,
                searchText: ['spotify'],
              },
              'react-coverfl0w.html': {
                display: 'react-coverfl0w.html',
                fileType: 'html',
                contents: `https://bautistaaa.github.io/react-coverfl0w/index.html`,
                searchText: ['react', 'coverflow'],
              },
            },
          },
        },
      },
    },
  },
};

export default fileDirectory;
