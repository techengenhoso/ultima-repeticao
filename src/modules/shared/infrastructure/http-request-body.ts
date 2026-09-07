import "server-only"

export class HttpRequestBodyError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly retryAfter?: number
  ) {
    super(message)
  }
}

export async function readLimitedJson(
  body: ReadableStream<Uint8Array> | null,
  limit: number,
  signal: AbortSignal
): Promise<unknown> {
  if (!body) throw new HttpRequestBodyError(400, "Envie os dados do formulário")
  const reader = body.getReader()
  const chunks: Uint8Array[] = []
  let length = 0
  const abort = () => {
    void reader.cancel().catch(() => undefined)
  }
  signal.addEventListener("abort", abort, { once: true })
  try {
    while (true) {
      signal.throwIfAborted()
      const { value, done } = await reader.read()
      if (done) break
      length += value.byteLength
      if (length > limit)
        throw new HttpRequestBodyError(413, "A solicitação excedeu o tamanho permitido")
      chunks.push(value)
    }
    signal.throwIfAborted()
    return JSON.parse(Buffer.concat(chunks).toString("utf8"))
  } finally {
    signal.removeEventListener("abort", abort)
    await reader.cancel().catch(() => undefined)
    reader.releaseLock()
  }
}
