import { WebSocketServer } from 'ws'
import type { WebSocket } from 'ws'
import type { Server } from 'http'

type UserInfo = {
  id: number
  login: string
}

type ExtWebSocket = {
  user: UserInfo
  rooms: Set<string>
} & WebSocket

export const setupWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ server })
  const rooms = new Map<string, Set<ExtWebSocket>>()

  /** Add socket to a room and notify clients */
  function joinRoom(room: string, ws: ExtWebSocket) {
    if (!rooms.has(room)) rooms.set(room, new Set())
    rooms.get(room)!.add(ws)

    const users = getRoomUsers(room)

    // Notify all clients in room of updated users
    broadcast(
      room,
      JSON.stringify({
        type: 'room-users',
        room,
        users,
      })
    )
  }

  /** Remove socket from room and notify clients */
  function leaveRoom(room: string, ws: ExtWebSocket) {
    const set = rooms.get(room)
    if (!set) return
    set.delete(ws)
    if (set.size === 0) rooms.delete(room)

    const users = getRoomUsers(room)

    broadcast(
      room,
      JSON.stringify({
        type: 'room-users',
        room,
        users,
      })
    )
  }

  /** Broadcast message to all clients in a room */
  function broadcast(room: string, message: string, exclude?: ExtWebSocket) {
    const clients = rooms.get(room)
    if (!clients) return
    for (const client of clients) {
      if (client.readyState === client.OPEN && client !== exclude) {
        client.send(message)
      }
    }
  }

  /** Get user info for everyone in a room */
  function getRoomUsers(room: string) {
    return Array.from(rooms.get(room) || [])
      .filter(c => !!c.user)
      .map(c => c.user)
  }

  wss.on('connection', ws => {
    const socket = ws as ExtWebSocket
    socket.rooms = new Set()

    ws.on('message', msg => {
      try {
        const data = JSON.parse(msg.toString())

        switch (data.type) {
          case 'join': {
            const { room, user } = data
            if (!room || !user?.id || !user?.login) {
              ws.send(JSON.stringify({ error: 'Invalid join payload' }))
              return
            }

            socket.user = user
            joinRoom(room, socket)
            socket.rooms.add(room)

            console.log(`👋 ${user.login} joined ${room}`)
            break
          }

          case 'leave': {
            const { room } = data
            if (!room) return
            leaveRoom(room, socket)
            socket.rooms.delete(room)
            console.log(`👋 ${socket.user?.login} left ${room}`)
            break
          }

          case 'message': {
            const { room, text } = data
            if (!room || !text) return

            broadcast(
              room,
              JSON.stringify({
                type: 'message',
                room,
                user: socket.user,
                text,
              }),
              socket
            )
            break
          }

          default:
            ws.send(JSON.stringify({ error: 'Unknown message type' }))
        }
      } catch (err) {
        ws.send(JSON.stringify({ error: 'Invalid JSON format' }))
      }
    })

    ws.on('close', () => {
      for (const room of socket.rooms) {
        leaveRoom(room, socket)
      }
      console.log(`❌ ${socket.user?.login || 'Unknown user'} disconnected`)
    })
  })

  console.log('✅ WebSocket server ready')
  return wss
}
