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
    while (tries >= 1) {
      try {
        info(`Checking if ${URL} exists.`)
        await axios.get(URL)
      } catch (err) {
        if (--tries >= 1) {
          info(`Sleeping for ${timeout} seconds. ${tries} tries left.`)
          await sleep(timeout * 1000)
        } else {
          setFailed('Retry limit exhausted!')
        }
      }
    }
  }
}

run()
