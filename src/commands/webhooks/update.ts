import Command, { flags } from '../../base'
import { URL } from 'url'
import CommerceLayer from '@commercelayer/sdk'
import chalk from 'chalk'
import WebhooksDetails from './details'
import { WebhookUpdate } from '@commercelayer/sdk/lib/resources/webhooks'


export default class WebhooksUpdate extends Command {

  static description = 'create a new webhook'

  static flags = {
    ...Command.flags,
    topic: flags.string({
      char: 't',
      description: 'the identifier of the event that will trigger the webhook',
      required: false,
    }),
    url: flags.string({
      char: 'u',
      description: 'the callback URL used to POST data',
      required: false,
    }),
    include: flags.string({
      char: 'i',
      description: 'a comma separated list of related resources to be included',
      multiple: true,
    }),
  }


  static args = [
    ...WebhooksDetails.args,
  ]


  async run() {

    const { args, flags } = this.parse(WebhooksUpdate)

    const organization = flags.organization
    const accessToken = flags.accessToken

    const id = args.id

    if (!flags.topic && !flags.url && !flags.include) {
      this.warn(`No updates defined for webhook ${chalk.bold(id)}`)
      return
    }

    const topic = flags.topic
    const url = flags.url ? new URL(flags.url).toString() : undefined
    const include = flags.include ? flags.include.join(',').split(',') : []


    // eslint-disable-next-line new-cap
    const cl = CommerceLayer({
      organization,
      accessToken,
    })


    try {

      const attributes: WebhookUpdate = { id }

      if (topic) attributes.topic = topic
      if (url) attributes.callback_url = url
      if (include) attributes.include_resources = include

      const webhook = await cl.webhooks.update(attributes)

      this.log(`\n${chalk.greenBright('Successfully')} updated webhook with id ${chalk.bold(webhook.id)}\n`)

      return webhook

    } catch (error) {
      this.printError(error)
    }

  }

}
