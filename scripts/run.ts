import { load } from "https://deno.land/std@0.220.1/dotenv/mod.ts"
import { Client } from "./client.ts"

export const run = async (cmd: "on" | "off") => {
  // plist からの実行だと Deno.cwd()や pwd が `/` になるので、 `./.env`が読み込めない。
  // そのため、 `import.meta.dirname` を使っている
  const env = await load({ envPath: `${import.meta.dirname}/.env` })
  const { TOKEN, SECRET, DEVICE_NAME, DEVICE_ID } = env

  if (!TOKEN) {
    console.error("TOKEN is required.")
    Deno.exit(1)
  }
  if (!SECRET) {
    console.error("SECRET is required.")
    Deno.exit(1)
  }

  if (!DEVICE_NAME) {
    console.error("DEVICE_NAME is required.")
    Deno.exit(1)
  }

  console.info("Run:", cmd)

  const client = new Client(TOKEN, SECRET)

  const deviceId = await (async () => {
    if (DEVICE_ID) {
      return DEVICE_ID
    }
    const { body } = await client.getDevices()
    const dId = body.deviceList.find(
      (v) => v.deviceName === DEVICE_NAME
    )?.deviceId
    if (!dId) {
      console.error("deviceId is not found.")
      Deno.exit(1)
    }
    console.info("Your device id:", dId)
    return dId
  })()

  if (cmd === "on") {
    await client.sendCommand(deviceId, "turnOn")
  } else {
    await client.sendCommand(deviceId, "turnOff")
  }

  console.info("Done.")
}
