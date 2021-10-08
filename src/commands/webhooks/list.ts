import Command, { flags } from '../../base'
import chalk from 'chalk'
import Table, { HorizontalAlignment } from 'cli-table3'
import { QueryParamsList } from '@commercelayer/sdk/lib/query'


export default class WebhooksList extends Command {

	static description = 'list all the registered webhooks'

	static aliases = ['wh:list']

	static examples = [
		'$ commercelayer webhooks',
		'$ cl webhooks:list -c open',
		'$ cl wh:list',
	]

	static flags = {
		...Command.flags,
		circuit: flags.string({
			char: 'c',
			description: 'show only webhooks with circuit in the decalred state',
			options: ['open', 'closed'],
		}),
	}


	async run() {

		const { flags } = this.parse(WebhooksList)

		const cl = this.commercelayerInit(flags)


		try {

			let tableData = []
			let currentPage = 0
			let pageCount = 1

			while (currentPage < pageCount) {

				const params: QueryParamsList = {
					pageSize: 25,
					pageNumber: ++currentPage,
				}

				// eslint-disable-next-line no-await-in-loop
				const webhooks = await cl.webhooks.list(params)

				if (webhooks?.length) {
					tableData.push(...webhooks)
					currentPage = webhooks.meta.currentPage
					pageCount = webhooks.meta.pageCount
				}

			}


			if (flags.circuit && tableData?.length) tableData = tableData.filter(w => (w.circuit_state === flags.circuit))

			this.log()

			if (tableData?.length) {

				const table = new Table({
					head: ['ID', 'Name', 'Topic', 'Circuit state', 'Recent failures'],
					// colWidths: [100, 200],
					style: {
						head: ['brightYellow'],
						compact: false,
					},
				})

				// let index = 0
				table.push(...tableData.map(w => [
					// { content: ++index, hAlign: 'right' as HorizontalAlignment },
					chalk.blueBright(w.id || ''),
					w.name || '',
					w.topic || '',
					{ content: ((w.circuit_state === 'closed') ? chalk.green : chalk.red)(w.circuit_state || ''), hAlign: 'center' as HorizontalAlignment },
					{ content: w.circuit_failure_count, hAlign: 'center' as HorizontalAlignment },
				]))

				this.log(table.toString())

			} else this.log(chalk.italic(`No webhooks found${flags.circuit ? (' with circuit state ' + chalk.white.bold(flags.circuit)) : ''}`))

			this.log()

			return tableData

		} catch (error) {
			this.handleError(error, flags)
		}

	}

}
