module.exports = {
  apps : [
    {
      name: 'server',
      script: './Build/App.js',
      args: '--which server',
      max_memory_restart: '2G',
      restart_delay: 5000
    },
    {
      name: 'client',
      script: './Build/App.js',
      args: '--which client',
      max_memory_restart: '2G',
      restart_delay: 5000
    }
  ]
}
