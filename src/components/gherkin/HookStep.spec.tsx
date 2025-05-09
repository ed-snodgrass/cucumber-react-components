import * as messages from '@cucumber/messages'
import { Query as CucumberQuery } from '@cucumber/query'
import { expect } from 'chai'
import React from 'react'

import { render } from '../../../test-utils/index.js'
import { HookStep } from './HookStep.js'

describe('<HookStep>', () => {
  class StubCucumberQuery extends CucumberQuery {
    constructor(
      private results: messages.TestStepResult[],
      private hook: messages.Hook
    ) {
      super()
    }

    getTestStepResults(): messages.TestStepResult[] {
      return this.results
    }

    getHook(): messages.Hook {
      return this.hook
    }
  }

  it('doesnt render anything about failure when the hook step passed', () => {
    const step: messages.TestStep = {
      id: '123',
      hookId: '456',
    }

    const { container } = render(<HookStep step={step} />, {
      cucumberQuery: new StubCucumberQuery(
        [
          {
            status: messages.TestStepResultStatus.PASSED,
            message: 'whoops',
            duration: {
              seconds: 1,
              nanos: 0,
            },
          },
        ],
        {
          id: '456',
          sourceReference: {
            uri: 'features/support/hooks.js',
            location: {
              line: 4,
              column: 6,
            },
          },
        }
      ),
    })

    expect(container).not.to.contain.text('Hook failed')
  })

  it('doesnt explode when we cant find a hook message for a failed hook', () => {
    const step: messages.TestStep = {
      id: '123',
      hookId: '456',
    }

    const { container } = render(<HookStep step={step} />, {
      cucumberQuery: new StubCucumberQuery(
        [
          {
            status: messages.TestStepResultStatus.FAILED,
            message: 'whoops',
            duration: {
              seconds: 1,
              nanos: 0,
            },
          },
        ],
        {
          id: 'the-id',
          sourceReference: {},
        }
      ),
    })

    expect(container).to.contain.text('Hook failed: Unknown location')
  })

  it('renders the uri and line number when present for a failed hook', () => {
    const step: messages.TestStep = {
      id: '123',
      hookId: '456',
    }

    const { container } = render(<HookStep step={step} />, {
      cucumberQuery: new StubCucumberQuery(
        [
          {
            status: messages.TestStepResultStatus.FAILED,
            message: 'whoops',
            duration: {
              seconds: 1,
              nanos: 0,
            },
          },
        ],
        {
          id: '456',
          sourceReference: {
            uri: 'features/support/hooks.js',
            location: {
              line: 4,
              column: 6,
            },
          },
        }
      ),
    })

    expect(container).to.contain.text('Hook failed: features/support/hooks.js:4')
  })

  it('renders the method reference when present for a failed hook', () => {
    const step: messages.TestStep = {
      id: '123',
      hookId: '456',
    }

    const { container } = render(<HookStep step={step} />, {
      cucumberQuery: new StubCucumberQuery(
        [
          {
            status: messages.TestStepResultStatus.FAILED,
            message: 'whoops',
            duration: {
              seconds: 1,
              nanos: 0,
            },
          },
        ],
        {
          id: '456',
          sourceReference: {
            javaMethod: {
              className: 'MyHooks',
              methodName: 'doSetup',
              methodParameterTypes: [],
            },
          },
        }
      ),
    })

    expect(container).to.contain.text('Hook failed: MyHooks.doSetup')
  })

  it('renders the name when present for a failed hook', () => {
    const step: messages.TestStep = {
      id: '123',
      hookId: '456',
    }

    const { container } = render(<HookStep step={step} />, {
      cucumberQuery: new StubCucumberQuery(
        [
          {
            status: messages.TestStepResultStatus.FAILED,
            message: 'whoops',
            duration: {
              seconds: 1,
              nanos: 0,
            },
          },
        ],
        {
          id: '456',
          name: 'fancy hook!',
          sourceReference: {
            uri: 'features/support/hooks.js',
            location: {
              line: 4,
              column: 6,
            },
          },
        }
      ),
    })

    expect(container).to.contain.text('Hook "fancy hook!" failed:')
  })
})
