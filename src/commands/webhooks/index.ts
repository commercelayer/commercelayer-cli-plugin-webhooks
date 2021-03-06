/* eslint-disable new-cap */
import Command from '../../base'
import ListCommand from './list'
import DetailsCommand from './details'


export default class WebhooksIndex extends Command {

	static description = 'list all the registered webhooks'

	static flags = {
		...Command.flags,
		...ListCommand.flags,
		...DetailsCommand.flags,
	}

	static args = [
		Object.assign({ ...DetailsCommand.args[0] }, { required: false }),
	]


	async run() {

		const { args } = await this.parse(WebhooksIndex)

		const command = args.id ? DetailsCommand : ListCommand
		const result = command.run(this.argv, this.config)

		return result

	}

}
