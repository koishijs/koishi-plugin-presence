import { Context, deepEqual, send } from '@koishijs/client'
import type Presence from 'koishi-plugin-presence'

export default (ctx: Context) => {
  let oldValue: Presence.Data
  function update() {
    const value: Presence.Data = {
      visible: document.visibilityState === 'visible',
      userAgent: navigator.userAgent,
    }
    if (deepEqual(value, oldValue)) return
    oldValue = value
    send('presence/update', value)
  }
  const timer = setInterval(update, 1000)
  ctx.on('dispose', () => {
    clearInterval(timer)
  })
}
