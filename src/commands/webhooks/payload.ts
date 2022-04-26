import Command, { Flags } from '../../base'
import { clOutput, clColor } from '@commercelayer/cli-core'



export default class WebhooksPayload extends Command {

	static description = 'show the payload associated to an event callback'

	static aliases = ['wh:payload']

	static examples = [
		'$ commercelayer webhooks:payload <event-id>',
		'$ cl wh:payload <event-id> -f',
	]

	static flags = {
		...Command.flags,
		format: Flags.boolean({
			char: 'f',
			description: 'format the payload output',
		}),
	}

	static args = [
		...Command.args,
	]


	async run() {

		const { args, flags } = await this.parse(WebhooksPayload)

		const id = args.id

		const cl = this.commercelayerInit(flags)


		try {

			const events = await cl.event_callbacks.list({ filters: { id_eq: id } })
			if (!events || (events.length === 0)) {
				this.log(`Event with id ${clColor.api.id(id)} not found`)
				return
			}
			const event = events[0]

			if (event.payload) {
				const payload = (typeof event.payload === 'string') ? JSON.parse(event.payload) : event.payload
				this.log(flags.format ? clOutput.printObject(payload) : JSON.stringify(payload, null, 4))
			}

			return event

		} catch (error) {
			this.handleError(error, flags, id)
		}

	}

}
