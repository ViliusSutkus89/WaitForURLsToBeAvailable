import {getInput, info, setFailed} from '@actions/core'
import axios from 'axios'

async function sleep(timeoutMilliseconds: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, timeoutMilliseconds))
}

async function run(): Promise<void> {
  let URLs: string[]
  let timeout: number
  let tries: number

  try {
    URLs = JSON.parse(getInput('URLs', {required: true}))
    timeout = parseInt(getInput('timeoutSeconds', {required: false}))
    tries = parseInt(getInput('tryCount', {required: false}))
  } catch (err) {
    setFailed(err)
    return
  }

  for (const URL of URLs) {
    let exists = false
    while (!exists && tries >= 1) {
      try {
        info(`Checking if ${URL} exists.`)
        await axios.get(URL)
        exists = true
      } catch (err) {
        if (--tries >= 1) {
          info(`Sleeping for ${timeout} seconds. ${tries} tries left.`)
          await sleep(timeout * 1000)
        } else {
          setFailed(`${URL} does not exist and retry limit exhausted!`)
        }
      }
    }
  }
}

run()
