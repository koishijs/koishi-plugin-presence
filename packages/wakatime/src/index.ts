import { Context, Schema } from 'koishi'

export const name = 'presence-wakatime'
export const using = ['presence']

export interface Config {
    apiKey: string
 }

export const Config: Schema<Config> = Schema.object({
    apiKey: Schema.string().required().role('secret').description('Wakatime api key')
})

export function apply(ctx: Context, config: Config) {

}
