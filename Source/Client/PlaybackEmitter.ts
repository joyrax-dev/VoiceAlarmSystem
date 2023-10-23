import { EventEmitter } from 'events'

export class PlaybackEmitter extends EventEmitter {
	constructor() {
		super()

		this.on('start_record', () => {})
		this.on('end_record', () => {})
	}
} // StartRecord, EndRecord

export const Playback: PlaybackEmitter = new PlaybackEmitter()