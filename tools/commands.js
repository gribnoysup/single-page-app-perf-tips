module.exports = [
  {
    name: 'update',
    type: null,
  },
  {
    name: 'fetch',
    type: 'multiselect',
    message: 'Which applications do you want to fetch?',
    excludeCurrent: true,
  },
  {
    name: 'clear',
    type: 'multiselect',
    message: 'Which applications do you want to clear?',
    excludeCurrent: false,
  },
  // {
  //   name: 'build',
  //   type: 'multiselect',
  // },
  // {
  //   name: 'run',
  //   type: 'select',
  // },
  // {
  //   name: 'measure',
  //   type: 'multiselect',
  // },
  // {
  //   name: 'compare',
  //   type: 'multiselect',
  // },
  // {
  //   name: 'metrics',
  //   type: 'select',
  // },
];
