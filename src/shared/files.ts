import { resume, projects } from './Files/';

const files: {
  [k: string]: {
    display: string;
    content: string;
    type: string;
    searchText: string[];
  };
} = {
  'Resume.js': {
    display: 'Resume.js',
    content: resume,
    type: 'file',
    searchText: ['Resume', 'js'],
  },
  projects: {
    display: 'projects',
    content: projects,
    type: 'file',
    searchText: ['projects'],
  },
  projectsTwo: {
    display: 'projectsTwo',
    content: projects,
    type: 'file',
    searchText: ['projects', 'Two'],
  },
};

export default files;


