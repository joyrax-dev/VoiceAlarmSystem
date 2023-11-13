import blessed from 'blessed'
import { Socket, connect } from 'socket.io-client'
import fs from 'fs'
import { Host, Port } from '../monitor.json'

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
			height: '60%',
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
			top: '60%',
			left: '0',
			width: '100%',
			height: '40%',
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

	public Loop() {
		this.Table = this.CreateTable()
		this.Log = this.CreateLog()

		this.Screen.append(this.Table)
		this.Screen.append(this.Log)

		this.Update()
		this.Screen.render()
	}

	public Update() {
		function load_log(): string[] {
			const file_path = 'Logs/vas.log'

			const raw = fs.readFileSync(file_path, 'utf8')
			const lines = raw.split('\n')
			const last10Lines = lines.slice(-10)

			return last10Lines
		}

		const lastLogs = load_log()

		for(const log of lastLogs) {
			this.Log.log(log)
		}

		this.Table.setData(this.TableData)

		this._socket.volatile.emit('get_stats', (data) => {
			this.TableData = [ ['id', 'location', 'type'] ]
			
			for(const stat in data) {
				const temp_arr = []
				temp_arr.push(stat, data[stat].Location, data[stat].Type)
				this.TableData.push(temp_arr)
			}
		})
	}
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

	setInterval(() => {
		monitor.Loop()
	}, 2000)
}