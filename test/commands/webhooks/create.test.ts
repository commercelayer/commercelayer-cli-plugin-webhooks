import {expect, test} from '@oclif/test'

describe('seed', () => {
  test
  .stdout()
  .command(['webhooks:noc'])
  .it('runs seed', ctx => {
    expect(ctx.stdout).to.contain('-= NoC =-')
  })

})