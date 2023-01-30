import { Context, Schema, Service } from 'koishi'
import { } from '@koishijs/plugin-console'
import { resolve } from 'path'

declare module 'koishi' {
  interface Context {
    presence: Presence
  }

  interface Events {
    'presence/update'(): void
  }
}

declare module '@koishijs/plugin-console' {
  interface Client {
    presence: Presence.Data
  }

  interface Events {
    'presence/update'(this: Client, payload: Presence.Data): void
  }
}

class Presence extends Service {
  static using = ['console'] as const

  public queue: string[] = []
  public data: Presence.Data = {}

  constructor(ctx: Context) {
    super(ctx, 'presence', true)

    ctx.console.addEntry({
      dev: resolve(__dirname, '../client/index.ts'),
      prod: resolve(__dirname, '../dist'),
    })

    const self = this
    ctx.console.addListener('presence/update', function (data: Presence.Data) {
      this.presence = data
      const index = self.queue.indexOf(this.id)
      if (index > 0) self.queue.splice(index, 1)
      if (data.visible) self.queue.unshift(this.id)
      if (data.visible || index === 0) self.update()
    })

    ctx.on('console/connection', (client) => {
      if (client.id in ctx.console.clients) return
      const index = this.queue.indexOf(client.id)
      if (index >= 0) this.queue.splice(index, 1)
      if (index === 0) this.update()
    })
  }

  update() {
    this.data = this.ctx.console.clients[this.queue[0]]?.presence || {}
    this.ctx.emit('presence/update')
  }
}

namespace Presence {
  export interface Config {}

  export const Config: Schema<Config> = Schema.object({})

  export interface Data {
    visible?: boolean
    userAgent?: string
  }
}

export default Presence
