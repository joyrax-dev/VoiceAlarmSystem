import Store from 'data-store'
import { join } from 'path'
import { access, unlink, constants, PathLike } from 'fs'

const StorePath: PathLike = 'AuthorizedUsers.json'

access(StorePath, constants.F_OK, (err) => {
	if (!err) {
		unlink(StorePath, () => {})
	}
})

export const AuthorizedUsers: Store = new Store(StorePath, {
	path: join(process.cwd(), StorePath)
})