import { Context, Logger, Schema, version } from 'koishi'
import { apiKeyVertify, formatDate, formatToDay } from './utils'
import { } from 'koishi-plugin-presence'
import { resolve } from 'path'
import { DataService } from '@koishijs/plugin-console'

declare module '@koishijs/plugin-console' {
    namespace Console {
        interface Services {
            wakatime: wakatimeProvider
        }
    }
}

const baseURL = 'https://wakatime.com/api/v1'
const logger = new Logger('wakatime')

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

class wakatimeProvider extends DataService<string>{
    constructor(ctx: Context, private config: Config) {
        super(ctx, 'wakatime')
    }

    async get() {
        return await this.getAllTimeSinceToday()
    }

    private async getAllTimeSinceToday() {
        const toDay = formatToDay()
        try {
            const summariesPayload = await this.ctx.http('GET', baseURL + `/users/current/summaries?api_key=${this.config.apiKey}&project=Koishi&start=${toDay}&end=${toDay}`)
            return summariesPayload.data[0].grand_total.text ?? `Fail request (${summariesPayload.status}).`
        } catch (error) {
            logger.error(error)
            return 'Request error.'
        }
    }
}

export function apply(ctx: Context, config: Config) {
    const HEARTBEAT_INTERVAL = 15000

    ctx.plugin(wakatimeProvider, config)

    ctx.using(['console'], () => {
        ctx.console.addEntry({
            dev: resolve(__dirname, '../client/index.ts'),
            prod: resolve(__dirname, '../dist'),
        })
    })

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
            const code = error.response.status ?? 40001
            logger.error(`Error sending heartbeat (${code}).`)
            if (error && code === 401) {
                logger.error('Invalid WakaTime Api Key')
            }
        }
    }
}
