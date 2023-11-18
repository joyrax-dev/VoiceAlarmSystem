import blessed from 'blessed'
import { Socket, connect } from 'socket.io-client'
import fs from 'fs'
import { Host, Port } from '../monitor.json'
import { IClientInfo } from '../Shared/IClientInfo'

class Monitor {
	private _socket: Socket
	private Screen
	private Table
	private Log
	private TableData = []

	constructor(socket: Socket) {
		this.Screen = this.CreateScreen({
			fullscreen: true,
			smartCSR: true,
			cursor: {
				hidden: true
			},
			title: 'Vas Monitor'
		})

		this._socket = socket
	}

	private CreateTable() {
		return blessed.table({
			top: '0',
			left: '0',
			width: '100%',
			height: '65%',
			align: 'center',
			tags: true,
			border: {
				type: 'line'
			},
			style: {
				border: {
					fg: 'white'
				},
				header: {
					fg: 'white',
					bold: true
				}
			}
		})
	}

	private CreateLog() {
		return blessed.log({
			top: '65%',
			left: '0',
			width: '100%',
			height: '35%',
			scrollable: true,
			tags: true,
			border: {
				type: 'line'
			},
			scrollbar: {
				style: {
					bg: 'yellow'
				}
			}
		})
	}

	private CreateScreen(options) {
		return blessed.screen({
			smartCSR: true,
			...options
		})
	}

	public Start() {
		setInterval(() => {
			this.UpdateStatus()
			this.UpadateLogs()
			this.Screen.render()
		}, 2000)
	}

	public UpadateLogs() {
		this.Log = this.CreateLog()
		this.Screen.append(this.Log)

		function load_log(): string[] {
			const file_path = 'Logs/vas.log'

			const raw = fs.readFileSync(file_path, 'utf8')
			const lines = raw.split('\n')
			const last10Lines = lines.slice(-7)

			return last10Lines
		}

		const lastLogs = load_log()

		for(const log of lastLogs) {
			this.Log.log(log)
		}
	}

	public UpdateStatus() { //AuthorizedUsers.json
		this.Table = this.CreateTable()
		this.Screen.append(this.Table)

		const data = [ ['id', 'location', 'type'] ]

		function load_auth(): Record<string, IClientInfo> {
			const file_path = 'AuthorizedUsers.json'

			const raw = fs.readFileSync(file_path, 'utf8')

			return JSON.parse(raw)
		}

		const auths = load_auth()

		const sortedAuths = Object.entries(auths).sort((a: [string, IClientInfo], b: [string, IClientInfo]) => {
			// Сортировка по Location
			if (a[1].Location < b[1].Location) {
				return -1
			}
			if (a[1].Location > b[1].Location) {
				return 1
			}

			// Если Location одинаковый, сортировка по Type
			if (a[1].Type < b[1].Type) {
				return 1
			}
			if (a[1].Type > b[1].Type) {
				return -1
			}

			return 0
		})

		sortedAuths.forEach(([key, value]) => {
			const temp_arr = []
			temp_arr.push(key, value.Location, value.Type)
			data.push(temp_arr)
		})

		this.Table.setData(data)
	}

	// public Update() {
		
		

	// 	this._socket.volatile.emit('get_stats', (data) => {
	// 		this.TableData = [ ['id', 'location', 'type'] ]
			
	// 		for(const stat in data) {
	// 			const temp_arr = []
	// 			temp_arr.push(stat, data[stat].Location, data[stat].Type)
	// 			this.TableData.push(temp_arr)
	// 		}
	// 	})
	// }
}

export default function Start() {
	const socket: Socket = connect(`http://${Host}:${Port}`, {
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 5000
    })

	const monitor = new Monitor(socket)
	
	socket.connect()

	monitor.Start()
}