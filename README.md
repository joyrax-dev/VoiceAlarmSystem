## VOICE ALARM SYSTEM

## Installation

Download releases/latest scripts.

> It is mandatory to run all scripts with administrator rights.
> And also note that the default installation location of the scripts: ``` C:/Users/admin/Desktop ```.

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

> You are considered to be in the project folder.

| Script | Functionality |
| ------ | ------------- |
| Scripts/ConfigClient.ps1 | Client Configuration |
| Scripts/ConfigServer.ps1 | Server Configuration |

- Client configuration
```json
{
	{
		"Host": "localhost",         /* Server IP or Hostname */
		"Port": 9909,                /* Server port */
		"Client": {                  /* Client setup */
			"Location": "RESEPTION", /* Client location */
			"Type": "OPERATOR"       /*  Client type */
		},
		"RecorderPath": "C:/Program Files (x86)/sox-14-4-1/sox.exe" /* path to installed SoX */
	}
}
```

- Server configuration
```json
{
    "Host": "192.168.91.148",    /* Server IP or Hostname */
    "Port": 9909,                /* Server port */
    "LogFile": "Logs/Server.log" /* Relative path logs file (In development) */
}
```

- Shortcut configuration
```json
{
	"Shortcuts": {
		/* "ALL" - For all clients */
		"NUMPAD 0": "ALL",

		/* For specific client */
		"NUMPAD 1":   ["1HOTEL"],
		"NUMPAD DOT": ["3HOTEL"],

		/* For specific clients */
		"NUMPAD MULTIPLY": ["1MODUL", "2MODUL", "3MODUL", "4MODUL", "5MODUL", "6MODUL", "7MODUL"]
	}
}
```

##### Start

After a clean installation, it is absolutely necessary to compile the project.

```sh
npm run build
```

Next, you can start both client and server in two ways.

1) The first way is to run it with ``` npm run ```.

| Command | Functionality |
| ------ | ------------- |
| ``` npm run client ``` | Startup Client |
| ``` npm run server ``` | Startup Server |

2) The second method involves the use of a process manager ``` pm2 ```.

| Command | Functionality |
| ------ | ------------- |
| ``` npm run client_pm2 ``` | Startup Client with pm2 |
| ``` npm run server_pm2 ``` | Startup Server with pm2 |

##### Auto startup

Automatic boot after system boot in easy accessibility thanks to process manager (pm2).

Process manager is automatically installed when you run the script ``` InstallProject.ps1 ```.

To make it work you need to install the global package without which most likely auto startup will not work.

```sh
npm install pm2-windows-startup -g
pm2-startup install
```

PM2 will now automatically revive the saved processes on startup. To save the current list of processes execute:

```sh
pm2 save
```

##### Logs (In development)