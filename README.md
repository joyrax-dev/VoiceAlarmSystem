## VOICE ALARM SYSTEM

## Installation

Download releases/latest scripts

> It is mandatory to run all scripts with administrator rights

##### Setting up windows
- AccessPowerShell.bat
- WindowsSetup.ps1

| Script | Functionality |
| ------ | ------------- |
| AccessPowerShell.bat | Permission to execute scripts in windows |
| WindowsSetup.ps1     | Setting up windows auto user login |

##### Project installation
- InstallSoft.ps1
- InstallProject.ps1
- UpdateProject.ps1

| Script | Functionality |
| ------ | ------------- |
| InstallSoft.ps1    | Installing node, git, and sox, and adding sox to the system PATH variable, and installing TypeScript and pm2 |
| InstallProject.ps1 | Cloning the project from the git repository and installing the pre-compiled Speaker module |
| UpdateProject.ps1  | Updating the project with the configuration intact and afterwards compiling it |


## Project launch

##### Configuration

Also before starting the project you need to make the initial configuration of the client, or the server, depending on what you need.

> You are considered to be in the project folder

| Script | Functionality |
| ------ | ------------- |
| Scripts/ConfigClient.ps1 | Client Configuration |
| Scripts/ConfigServer.ps1 | Server Configuration |

##### Startup

After a clean installation, it is absolutely necessary to compile the project

```sh
npm run build
```

Next, you can start both client and server in two ways

1) The first way is to run it with ``` npm run ```

| Command | Functionality |
| ------ | ------------- |
| ``` npm run client ``` | Startup Client |
| ``` npm run server ``` | Startup Server |

2) The second method involves the use of a process manager ``` pm2 ```

| Script | Functionality |
| ------ | ------------- |
| Scripts/StartClient.ps1 | Startup Client with pm2 |
| Scripts/StartServer.ps1 | Startup Server with pm2 |


