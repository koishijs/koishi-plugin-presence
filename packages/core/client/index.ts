import { Context, deepEqual, send } from '@koishijs/client'
import { Payload } from 'koishi-plugin-presence'

export default (ctx: Context) => {
  let oldValue: Payload
  function update() {
    const value: Payload = {
      visibility: document.visibilityState,
    }
    if (deepEqual(value, oldValue)) return
    oldValue = value
    send('presence/update', value)
  }
  const timer = setTimeout(update, 1000)
  ctx.on('dispose', () => {
    clearTimeout(timer)
  })
}
