import { Context, Schema, Service } from 'koishi'
import {} from '@koishijs/plugin-console'
import { resolve } from 'path'

declare module 'koishi' {
  interface Console {
    presence: Presence
  }

  interface Events {
    'presence/update'(): void
  }
}

declare module '@koishijs/plugin-console' {
  interface Events {
    'presence/update'(payload: Payload): void
  }
}

export interface Payload {
  visibility: DocumentVisibilityState
}

interface Presence extends Payload {}

class Presence extends Service {
  static using = ['console'] as const

  constructor(ctx: Context) {
    super(ctx, 'presence', true)

    this.visibility = 'hidden'

    ctx.console.addEntry({
      dev: resolve(__dirname, '../client/index.ts'),
      prod: resolve(__dirname, '../dist'),
    })

    ctx.console.addListener('presence/update', (payload: Payload) => {
      Object.assign(this, payload)
      ctx.emit('presence/update')
    })
  }
}

namespace Presence {
  export interface Config {}

  export const Config: Schema<Config> = Schema.object({})
}

export default Presence
