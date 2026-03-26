import { runCommand } from '@oclif/test'
import { expect } from 'chai'


describe('webhooks:reset', () => {
  it('runs NoC', async () => {
    const { stdout } = await runCommand<{ name: string }>(['webhooks:noc'])
    expect(stdout).to.contain('-= NoC =-')
  }).timeout(5000)
})
