import { randomUUID } from "https://deno.land/std@0.177.0/node/crypto.ts"
import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts"

export class Client {
  headers: Headers = new Headers({ "Content-Type": "application/json" })

  constructor(token: string, secret: string) {
    const t = Date.now()
    const nonce = randomUUID()
    const sign = hmac(
      "sha256",
      secret,
      `${token}${t}${nonce}`,
      "utf8",
      "base64"
    )
    this.headers.append("Authorization", token)
    this.headers.append("sign", sign.toString())
    this.headers.append("nonce", nonce)
    this.headers.append("t", `${t}`)
  }

  async getDevices(): Promise<{
    body: { deviceList: { deviceId: string; deviceName: string }[] }
  }> {
    const res = await fetch("https://api.switch-bot.com/v1.1/devices", {
      method: "GET",
      headers: this.headers,
    })

    if (!res.ok) {
      throw new Error("Failed to fetch devices")
    }
    return res.json()
  }

  async sendCommand(deviceId: string, command: "turnOn" | "turnOff") {
    const res = await fetch(
      `https://api.switch-bot.com/v1.1/devices/${deviceId}/commands`,
      {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({
          commandType: "command",
          command,
          parameter: "default",
        }),
      }
    )

    if (!res.ok) {
      throw new Error("Failed to send command", { cause: res })
    }
    return res.json()
  }
}
