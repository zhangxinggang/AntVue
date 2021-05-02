import fastEqual from 'fast-deep-equal'
import deepMerge from 'deepmerge'
import {setting} from '@/config/default'
import sysConfig from '@/config/config'
import store from '@/store'
export function extractConfig(local = false) {
    let config = {}
    let mySetting = store.state.setting
    let dftSetting = local ? deepMerge(setting, sysConfig) : setting
    Object.keys(mySetting).forEach(key => {
        const dftValue = dftSetting[key], myValue = mySetting[key]
        if (dftValue != undefined && !fastEqual(dftValue, myValue)) {
            config[key] = myValue
        }
    })
    return config
}