import { config } from 'dotenv';
import fs from 'fs'
import fetch from 'node-fetch'

config()

const wf_path = `./workflows`

if (!fs.existsSync(wf_path))
  throw Error(`Папка ${wf_path} не существует`)

Promise.all(fs.readdirSync(wf_path).map(async (f: string) => {
  const exp = await import(`./workflows/${f}`)
  const { wf_id, wf_data } = exp.default
  const r = await fetch(`${process.env.SDBUS_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      event: "workflow_push",
      mode: "sync",
      data: { wf_id, wf_data }
    })
  })
  const s = await r.text()
  return s
}))
.then(console.log)