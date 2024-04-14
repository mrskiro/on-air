import { run } from "./run.ts"

const CACHE_FILE_PATH = `${import.meta.dirname}/.cache.txt`

const decoder = new TextDecoder()

const cmd = new Deno.Command("system_profiler", {
  args: ["-json", "SPAudioDataType"],
})

const o = await cmd.output()
const stdout = decoder.decode(o.stdout)
const parsed = JSON.parse(stdout)

// deno-lint-ignore no-explicit-any
const existAudioDevice = parsed.SPAudioDataType[0]._items.some((item: any) => {
  return item._name === "外部マイク"
})

if (existAudioDevice) {
  run("on")
  Deno.writeTextFileSync(CACHE_FILE_PATH, "cached")
} else {
  const turnedOn = await (async () => {
    try {
      await Deno.stat(CACHE_FILE_PATH)
      return true
    } catch (err: unknown) {
      if (err instanceof Deno.errors.NotFound) {
        return false
      }
      throw err
    }
  })()

  if (turnedOn) {
    run("off")
    Deno.removeSync(CACHE_FILE_PATH)
  }
}
