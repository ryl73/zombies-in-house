export type WSMessage = {
  chat_id: number
  content: string
  id: number
  is_read: boolean
  time: string
  type: WSMessageType
  user_id: number
}

export type UserInfo = {
  id: number
  login: string
}

export const WSMessageType = {
  MESSAGE: 'message',
  FILE: 'file',
  STICKER: 'sticker',
  GET_OLD: 'get old',
  PING: 'ping',
  PONG: 'pong',
  USER_CONNECTED: 'user connected',
} as const

export type WSMessageType = typeof WSMessageType[keyof typeof WSMessageType]

export const WSEvents = {
  OPEN: 'open',
  CLOSE: 'close',
  MESSAGE: 'message',
  ERROR: 'error',
} as const

class WebSocketService {
  private socket: WebSocket | null = null
  private readonly url: string
  roomId = ''
  private _interval: NodeJS.Timeout | null = null
  public onConnect?: () => void
  public onMessage?: (data: any) => void

  constructor(url: string) {
    this.url = url
  }

  public connect(roomId: string): void {
    this.socket = new WebSocket(this.url)
    this.roomId = roomId

    this.socket.addEventListener(WSEvents.OPEN, () => {
      setTimeout(() => {
        this.socket?.send(JSON.stringify({ type: 'join', room: this.roomId }))
        this.onConnect?.()
      }, 100)
    })

    this.socket.addEventListener(WSEvents.MESSAGE, (event: MessageEvent) => {
      const data = JSON.parse(event.data)
      console.log(data)
      this.onMessage?.(data)
    })

    this.socket.addEventListener(WSEvents.ERROR, (event: Event) => {
      console.log(event)
    })

    this.socket.addEventListener(WSEvents.CLOSE, (event: CloseEvent) => {
      console.log(event)
    })
  }

  public disconnect(): void {
    this.socket?.close()
    if (this._interval) {
      clearInterval(this._interval)
      this._interval = null
    }
    this.socket = null
  }

  public send(
    type: WSMessageType = WSMessageType.MESSAGE,
    content?: string
  ): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const data = {
        content,
        type,
      }
      this.socket.send(JSON.stringify(data))
    } else {
      console.log({ message: 'WebSocket is not connected' })
    }
  }

  public isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN
  }
}

export default new WebSocketService('ws://localhost:3001')
