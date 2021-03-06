import { Command, CliUx } from '@oclif/core'


export default class WebhooksTopics extends Command {

  static description = 'show online documentation for supported events'

  static aliases = ['wh:topics']

  static examples = [
		'$ commercelayer webhooks:topics',
		'$ cl wh:topics',
	]


  async run() {

    await CliUx.ux.open('https://docs.commercelayer.io/api/real-time-webhooks#supported-events')

  }

}
