module.exports = {
    apps: [
      {
        name: 'LD-FMedu',
        script: './node_modules/next/dist/bin/next',
        args: 'start -p 3001',
        automation: false,
      },
    ],
  };