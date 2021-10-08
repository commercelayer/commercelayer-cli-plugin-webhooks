import Command, { flags } from '@oclif/command'
import chalk from 'chalk'
import path from 'path'
import commercelayer, { CommerceLayerClient, CommerceLayerStatic } from '@commercelayer/sdk'
import { formatError } from './common'
import updateNotifier from 'update-notifier'


const pkg = require('../package.json')


export default abstract class extends Command {

	static flags = {
		organization: flags.string({
			char: 'o',
			description: 'the slug of your organization',
			required: true,
			env: 'CL_CLI_ORGANIZATION',
		}),
		domain: flags.string({
			char: 'd',
			required: false,
			hidden: true,
			dependsOn: ['organization'],
			env: 'CL_CLI_DOMAIN',
		}),
		accessToken: flags.string({
			hidden: true,
			required: true,
			env: 'CL_CLI_ACCESS_TOKEN',
		}),
	}


	static args = [
		{ name: 'fake-arg', description: 'fake argument', required: false, hidden: true },
	]


	// INIT (override)
	async init() {

		const notifier = updateNotifier({ pkg, updateCheckInterval: 1000 * 60 * 60 })

		if (notifier.update) {

			const pluginMode = path.resolve(__dirname).includes(`/@commercelayer/cli/node_modules/${pkg.name}/`)
			const command = pluginMode ? 'commercelayer plugins:update' : '{updateCommand}'

			notifier.notify({
				isGlobal: !pluginMode,
				message: `-= ${chalk.bgWhite.black.bold(` ${pkg.description} `)} =-\n\nNew version available: ${chalk.dim('{currentVersion}')} -> ${chalk.green('{latestVersion}')}\nRun ${chalk.cyanBright(command)} to update`,
			})

		}

		return super.init()

	}


	protected handleError(error: any, flags?: any): void {
		if (CommerceLayerStatic.isApiError(error)) {
			if (error.status === 401) {
				const err = error.errors[0]
				this.error(chalk.bgRed(`${err.title}:  ${err.detail}`),
					{ suggestions: ['Execute login to get access to the organization\'s webhooks'] }
				)
			} else this.error(formatError(error, flags))
		} else throw error
	}


	protected commercelayerInit(flags: any): CommerceLayerClient {

		const organization = flags.organization
		const domain = flags.domain
		const accessToken = flags.accessToken

		// eslint-disable-next-line new-cap
		return commercelayer({
			organization,
			domain,
			accessToken,
		})

	}

}


export { flags }
