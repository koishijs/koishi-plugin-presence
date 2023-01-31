import { Card, defineExtension, store } from '@koishijs/client'
import { } from 'koishi-plugin-presence-wakatime/src'
import './icons'

export default defineExtension((ctx) => {
    ctx.slot({
        type: 'numeric',
        component: Card.numeric({
            title: 'Koishi 控制台在线时长',
            icon: 'wakatime',
            fields: [],
            content: () => store.wakatime ?? 'Loading...',
        }),
    })
})
