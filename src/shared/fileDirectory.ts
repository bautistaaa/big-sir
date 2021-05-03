import formatDateForFinder from '../utils/formatDateForFinder';
import { resume } from './Files/';

export type Contents = Record<string, File> | string;
type FileType = 'file' | 'directory' | 'html';
export interface File {
  fileType: FileType;
  display: string;
  searchText: string[];
  contents: Contents;
  created?: string;
  modified?: string;
  lastOpened?: string;
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
                created: formatDateForFinder(
                  new Date('April 1, 2000 04:20:00')
                ),
                modified: formatDateForFinder(
                  new Date('April 1, 2000 04:20:00')
                ),
                lastOpened: formatDateForFinder(
                  new Date('April 1, 2000 04:20:00')
                ),
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
                created: formatDateForFinder(
                  new Date('December 17, 1995 03:24:00')
                ),
                modified: formatDateForFinder(
                  new Date('April 1, 2000 04:20:00')
                ),
                lastOpened: formatDateForFinder(
                  new Date('April 1, 2000 04:20:00')
                ),
              },
              'spotify-city.html': {
                display: 'spotify-city.html',
                fileType: 'html',
                contents: `https://spotify-city.netlify.app/`,
                searchText: ['spotify'],
                created: formatDateForFinder(
                  new Date('December 17, 1995 03:24:00')
                ),
                modified: formatDateForFinder(
                  new Date('April 1, 2000 04:20:00')
                ),
                lastOpened: formatDateForFinder(
                  new Date('April 1, 2000 04:20:00')
                ),
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
