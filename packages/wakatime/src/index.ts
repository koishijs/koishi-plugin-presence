import { Context, Schema } from 'koishi'

export const name = 'wakatime-presence'
export const using = ['presence']

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context, config: Config) {
}
