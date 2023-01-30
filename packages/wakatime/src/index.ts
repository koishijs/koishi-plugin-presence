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

    logger.info('WakaTime Initializing...')
    const akVertify = apiKeyVertify(config.apiKey ?? '')
    //if(!akVertify) logger.error('Invalid api key... check https://wakatime.com/settings for your key')
    const wakatimeApi = `https://wakatime.com/api/v1/users/current/heartbeats?api_key=${config.apiKey}`

    ctx.setInterval(() => {
        if (ctx.presence.data.visible) sendHeartbeat()
    }, HEARTBEAT_INTERVAL)

    function sendHeartbeat() {
        logger.info('Sending Heartbeat')
        try {
            ctx.http('POST', wakatimeApi, {
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': 'Basic ' + Buffer.from(config.apiKey).toString('base64'),
                    'User-Agent': `Koishi/${version} wakatimeKoishi/${require('../package.json').version}`
                },
                data: {
                    type: 'domain',
                    entity: '',
                    time: Date.now() / 1000,
                    language: 'Koishi'
                }
            }).then(response => {
                if (response.status === 200 || response.status === 201 || response.status === 202) {
                    logger.debug(`last heartbeat sent ${formatDate(new Date())}`)
                }
            })
        } catch (error) {
            logger.error(error)
            // logger.error(`API Error ${error.status}: ${error.data}`)
            // let error_msg
            // if (error && error?.status == 401)
            //     error_msg = 'Invalid WakaTime Api Key';
            // else
            //     error_msg = `Error sending heartbeat (${error.status}).`;
            // logger.error(error_msg);
        }
    }
}
