import { type RawData, WebSocketServer } from 'ws'
import type { WebSocket } from 'ws'
import type { Server, IncomingMessage } from 'http'
import cookieParser from 'cookie-parser'
import { authMiddleware } from './middleware/AuthMiddleware'
import runMiddleware from './helpers/runMiddleware'
import UserController from './controllers/user/userController'

type UserInfo = {
  id: number
  login: string
}

type ExtWebSocket = WebSocket & {
  user?: UserInfo
  rooms: Set<string>
}

class WebSocketService {
  private wss?: WebSocketServer
  private rooms = new Map<string, Set<ExtWebSocket>>()
  private server?: Server

  public init(server: Server) {
    this.server = server
    this.wss = new WebSocketServer({ noServer: true })

    this.setupUpgradeHandler()
    this.setupConnectionHandler()

    console.log('✅ WebSocketService initialized')
  }

  private setupUpgradeHandler() {
    if (!this.server || !this.wss) return

    this.server.on('upgrade', async (req, socket, head) => {
      try {
        await runMiddleware(req as any, cookieParser())
        await runMiddleware(req as any, authMiddleware)

        this.wss!.handleUpgrade(req, socket, head, ws => {
          this.wss!.emit('connection', ws, req)
        })
      } catch {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
        socket.destroy()
      }
    })
  }

  private setupConnectionHandler() {
    if (!this.wss) return

    this.wss.on('connection', async (ws, req) => {
      const socket = ws as ExtWebSocket
      socket.rooms = new Set()

      const user = await this.fetchUser(req)
      if (!user) {
        ws.close(4001, 'Unauthorized')
        return
      }

      socket.user = user
      console.log(`👤 WS user connected: ${user.login}`)

      ws.on('message', msg => this.handleMessage(socket, msg))
      ws.on('close', () => this.handleClose(socket))
    })
  }

  private async fetchUser(req: IncomingMessage): Promise<UserInfo | null> {
    try {
      const result = await UserController.get(req as any, () => {
        console.log('111')
      })
      if (result?.id && result?.login) {
        return { id: result.id, login: result.login }
      }
      return null
    } catch {
      return null
    }
  }

  private handleMessage(ws: ExtWebSocket, raw: RawData) {
    try {
      const data = JSON.parse(raw.toString())

      switch (data.type) {
        case 'join':
          this.joinRoom(ws, data.room)
          break
        case 'leave':
          this.leaveRoom(ws, data.room)
          break
        case 'message':
          this.sendMessage(ws, data.room, data.text)
          break
        default:
          ws.send(JSON.stringify({ error: 'Unknown message type' }))
      }
    } catch {
      ws.send(JSON.stringify({ error: 'Invalid JSON format' }))
    }
  }

  private joinRoom(ws: ExtWebSocket, room: string) {
    if (!room) return
    if (!this.rooms.has(room)) this.rooms.set(room, new Set())
    this.rooms.get(room)!.add(ws)
    ws.rooms.add(room)
    console.log(`➕ ${ws.user?.login} joined ${room}`)
    this.broadcastRoomUsers(room)
  }

  private leaveRoom(ws: ExtWebSocket, room: string) {
    if (!room) return
    const clients = this.rooms.get(room)
    if (!clients) return

    clients.delete(ws)
    ws.rooms.delete(room)

    if (clients.size === 0) this.rooms.delete(room)
    console.log(`➖ ${ws.user?.login} left ${room}`)
    this.broadcastRoomUsers(room)
  }

  private sendMessage(ws: ExtWebSocket, room: string, text: string) {
    if (!room || !text) return

    this.broadcast(
      room,
      JSON.stringify({
        type: 'message',
        room,
        user: ws.user,
        text,
      }),
      ws
    )
  }

  private handleClose(ws: ExtWebSocket) {
    for (const room of ws.rooms) {
      this.leaveRoom(ws, room)
    }
    console.log(`❌ ${ws.user?.login || 'Unknown'} disconnected`)
  }

  private broadcast(
    room: string,
    message: string,
    exclude?: ExtWebSocket | number
  ) {
    const clients = this.rooms.get(room)
    if (!clients) return

    for (const client of clients) {
      if (client.readyState !== client.OPEN) continue

      if (typeof exclude === 'object' && client === exclude) continue
      if (typeof exclude === 'number' && client.user?.id === exclude) continue

      client.send(message)
    }
  }

  private broadcastRoomUsers(room: string) {
    const users = Array.from(this.rooms.get(room) || [])
      .filter(c => !!c.user)
      .map(c => c.user)
    this.broadcast(
      room,
      JSON.stringify({
        type: 'room-users',
        room,
        users,
      })
    )
  }

  public sendToRoom(room: string, data: unknown, excludeUserId?: number) {
    this.broadcast(room, JSON.stringify(data), excludeUserId)
  }

  public getRoomUsers(room: string): UserInfo[] {
    return Array.from(this.rooms.get(room) || [])
      .filter(c => !!c.user)
      .map(c => c.user!)
  }
}

export default new WebSocketService()
