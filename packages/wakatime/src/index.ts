import { Context, Schema, version } from 'koishi'
import { apiKeyVertify, formatDate } from './utils'
import { } from 'koishi-plugin-presence'

export const name = 'presence-wakatime'
export const using = ['presence']

export interface Config {
    apiKey: string
    proxy: string
}

export const Config: Schema<Config> = Schema.object({
    apiKey: Schema.string().required().role('secret').description('Wakatime api key'),
    proxy: Schema.string().role('link').description('配置代理地址')
})

export function apply(ctx: Context, config: Config) {
    const logger = ctx.logger('presence-wakatime')
    const HEARTBEAT_INTERVAL = 15000
    const baseURL = 'https://wakatime.com/api/v1'

    ctx.on('ready', () => {
        logger.info('Initializing...')
        const akVertify = apiKeyVertify(config.apiKey ?? '')
        if (!akVertify) logger.error('Invalid api key... check https://wakatime.com/settings for your key')

        ctx.setInterval(() => {
            if (ctx.presence.data.visible) sendHeartbeat()
        }, HEARTBEAT_INTERVAL)
    })

    async function sendHeartbeat() {
        logger.debug('Sending Heartbeat')
        try {
            await ctx.http('POST', baseURL + '/users/current/heartbeats?api_key=' + config.apiKey, {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': `Koishi/${version} wakatimeKoishi/${require('../package.json').version}`
                },
                data: {
                    type: 'app',
                    entity: 'koishi',
                    time: Date.now() / 1000,
                    project: 'Koishi'
                }
            })
            logger.debug(`last heartbeat sent ${formatDate(new Date())}`)
        } catch (error) {
            const code = error.response.status
            logger.error(`Error sending heartbeat (${code}).`)
            if (error && code === 401) {
                logger.error('Invalid WakaTime Api Key')
            }
        }
    }
}
