import { expect, test } from '@oclif/test'

describe('webhooks:disable', () => {
  test
    .timeout(5000)
    .stdout()
    .command(['webhooks:noc'])
    .it('runs NoC', ctx => {
      expect(ctx.stdout).to.contain('-= NoC =-')
    })

})
