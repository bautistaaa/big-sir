import { resume } from './Files/';

const fileDirectory = {
  '/': {
    type: 'directory',
    contents: {
      'Resume.js': {
        type: 'file',
        contents: resume,
        searchText: ['Resume', 'js'],
      },
      projects: {
        type: 'directory',
        contents: {
          NarutoQL: {
            type: 'file',
            content: `file contents`,
            searchText: ['Naruto'],
          },
          Spotify: {
            type: 'file',
            content: `file contents`,
            searchText: ['Spotify'],
          },
          vimfolio: {
            type: 'file',
            content: `file contents`,
          },
          vimdaddy: {
            type: 'file',
            content: `file contents`,
          },
        },
      },
    },
  },
};

export default fileDirectory;
