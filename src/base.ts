/* eslint-disable unicorn/prefer-module */
import Command, { flags } from '@oclif/command'
import chalk from 'chalk'
import commercelayer, { CommerceLayerClient, CommerceLayerStatic } from '@commercelayer/sdk'
import { clOutput, clUpdate } from '@commercelayer/cli-core'


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
    clUpdate.checkUpdate(pkg)
		return super.init()
	}


	protected handleError(error: any, flags?: any): void {
		if (CommerceLayerStatic.isApiError(error)) {
			if (error.status === 401) {
				const err = error.first()
				this.error(chalk.bgRed(`${err.title}:  ${err.detail}`),
					{ suggestions: ['Execute login to get access to the organization\'s webhooks'] }
				)
			} else this.error(clOutput.formatError(error, flags))
		} else throw error
	}


	protected commercelayerInit(flags: any): CommerceLayerClient {

		const organization = flags.organization
		const domain = flags.domain
		const accessToken = flags.accessToken

		return commercelayer({
			organization,
			domain,
			accessToken,
		})

	}

}


export { flags }
