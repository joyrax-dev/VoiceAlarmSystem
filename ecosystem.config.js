module.exports = {
  apps : [
    {
      name: 'operator',
      script: './client/index.js',
      args: 'start --type operator',
      max_memory_restart: '2G',
      restart_delay: 5000
    },
    {
      name: 'speaker',
      script: './client/index.js',
      args: 'start --type speaker',
      max_memory_restart: '2G',
      restart_delay: 5000
    },
    {
      name: 'server',
      script: './server/index.js',
      args: '',
      max_memory_restart: '2G',
      restart_delay: 5000
    }
  ]
}
