import { GlobalKeyboardListener, IConfig } from 'node-global-key-listener'
export { IGlobalKeyEvent, IGlobalKeyDownMap } from 'node-global-key-listener'

class FixGlobalKeyboardListener extends GlobalKeyboardListener {
	constructor(config?: IConfig) {
		super(config)
	}

	public run(): void {
		this.start()
	}
}

export const Keyboard = new FixGlobalKeyboardListener({
	windows: {
		onError: (errorCode) => {
			throw new Error(`Error keyboard [error=${errorCode}]`)
		}
	}
})
