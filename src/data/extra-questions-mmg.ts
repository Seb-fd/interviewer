import type { Question } from './questions'

export const extraMultiplayerGameQuestions: Question[] = [
  {
    id: 'mmg-4',
    slug: 'multiplayer-mini-game',
    titleEn: 'Socket.io Room Management',
    titleEs: 'Gestión de Salas con Socket.io',
    descriptionEn: 'Implement a Socket.io room management system: create, join, leave, and clean up empty rooms. Handle reconnection.',
    descriptionEs: 'Implementa un sistema de gestión de salas con Socket.io: crear, unirse, salir, y limpiar salas vacías. Maneja reconexiones.',
    difficulty: 'senior',
    type: 'coding',
    points: 100,
    language: 'typescript',
    hintsEn: [
      'Use io.to(roomId).emit() to broadcast to a room',
      'Listen for "disconnect" event to clean up players',
      'Store room state in memory or Redis for multi-instance'
    ],
    hintsEs: [
      'Usa io.to(roomId).emit() para broadcast a una sala',
      'Escucha el evento "disconnect" para limpiar jugadores',
      'Almacena el estado de la sala en memoria o Redis para multi-instancia'
    ],
    solutionEn: '```typescript\nimport { Server, Socket } from "socket.io"\n\ninterface Room {\n  id: string\n  hostId: string\n  players: Map<string, Player>\n  gameState: "waiting" | "playing" | "finished"\n  maxPlayers: number\n  createdAt: number\n}\n\ninterface Player {\n  id: string\n  name: string\n  ready: boolean\n  score: number\n  position: { x: number; y: number }\n}\n\nconst rooms = new Map<string, Room>()\n\nexport function setupSocketHandlers(io: Server) {\n  io.on("connection", (socket: Socket) => {\n    socket.on("room:create", ({ roomId, playerName, maxPlayers = 4 }) => {\n      const room: Room = {\n        id: roomId,\n        hostId: socket.id,\n        players: new Map(),\n        gameState: "waiting",\n        maxPlayers,\n        createdAt: Date.now(),\n      }\n      room.players.set(socket.id, createPlayer(socket.id, playerName))\n      rooms.set(roomId, room)\n      socket.join(roomId)\n      io.to(roomId).emit("room:update", serializeRoom(room))\n    })\n\n    socket.on("room:join", ({ roomId, playerName }) => {\n      const room = rooms.get(roomId)\n      if (!room) return socket.emit("error", { msg: "Room not found" })\n      if (room.players.size >= room.maxPlayers) return socket.emit("error", { msg: "Room full" })\n\n      room.players.set(socket.id, createPlayer(socket.id, playerName))\n      socket.join(roomId)\n      io.to(roomId).emit("room:update", serializeRoom(room))\n      io.to(roomId).emit("chat:message", { system: true, text: `${playerName} joined` })\n    })\n\n    socket.on("room:leave", () => handleLeave(socket, io))\n\n    socket.on("player:ready", ({ ready }) => {\n      const room = findPlayerRoom(socket.id)\n      if (!room) return\n      const player = room.players.get(socket.id)\n      if (player) player.ready = ready\n      io.to(room.id).emit("room:update", serializeRoom(room))\n    })\n\n    socket.on("disconnect", () => handleLeave(socket, io))\n  })\n\n  // Cleanup empty rooms every 5 min\n  setInterval(() => {\n    const now = Date.now()\n    for (const [id, room] of rooms) {\n      if (room.players.size === 0 && now - room.createdAt > 30 * 60 * 1000) {\n        rooms.delete(id)\n      }\n    }\n  }, 5 * 60 * 1000)\n}\n\nfunction handleLeave(socket: Socket, io: Server) {\n  for (const room of rooms.values()) {\n    if (room.players.has(socket.id)) {\n      const player = room.players.get(socket.id)!\n      room.players.delete(socket.id)\n      socket.leave(room.id)\n      io.to(room.id).emit("room:update", serializeRoom(room))\n      io.to(room.id).emit("chat:message", { system: true, text: `${player.name} left` })\n\n      // If host left, transfer host or close room\n      if (room.hostId === socket.id) {\n        if (room.players.size > 0) {\n          room.hostId = room.players.keys().next().value!\n          io.to(room.id).emit("room:host-changed", { hostId: room.hostId })\n        } else {\n          rooms.delete(room.id)\n        }\n      }\n      break\n    }\n  }\n}\n```',
    solutionEs: 'Map de salas con jugadores, eventos `room:create/join/leave`, cleanup en `disconnect`, transfer de host, garbage collection de salas vacías.',
    explanationEn: 'Room management has three concerns: (1) keep player state consistent across join/leave, (2) handle host migration, (3) clean up empty rooms to prevent memory leaks. For multi-instance deployments, use Redis adapter for socket.io.',
    explanationEs: 'La gestión de salas tiene tres concerns: (1) mantener estado consistente en join/leave, (2) manejar migración de host, (3) limpiar salas vacías para evitar memory leaks. Para multi-instancia, usa el adapter de Redis.',
    starterCode: 'import { Server, Socket } from "socket.io"\n\nexport function setupSocketHandlers(io: Server) {\n  io.on("connection", (socket) => {\n    // Your implementation\n  })\n}',
    tags: ['socket-io', 'realtime', 'rooms'],
    resources: [
      { title: 'Socket.io Rooms', url: 'https://socket.io/docs/v4/rooms/', type: 'documentation' },
    ],
  },
  {
    id: 'mmg-5',
    slug: 'multiplayer-mini-game',
    titleEn: 'Authoritative Game State Sync',
    titleEs: 'Sincronización de Estado de Juego Autoritativo',
    descriptionEn: 'Design an authoritative server architecture where the server is the source of truth for all game state, preventing client cheating.',
    descriptionEs: 'Diseña una arquitectura autoritativa donde el servidor es la fuente de verdad para todo el estado del juego, previniendo trampas.',
    difficulty: 'senior',
    type: 'conceptual',
    points: 100,
    hintsEn: [
      'Server processes all input and updates state',
      'Clients only send intents, never state changes',
      'Validate every action server-side (range checks, cooldown checks, etc.)'
    ],
    hintsEs: [
      'El servidor procesa todo el input y actualiza el estado',
      'Los clientes solo envían intents, nunca cambios de estado',
      'Valida cada acción en el servidor (range checks, cooldown checks, etc.)'
    ],
    solutionEn: '**Architecture**\n\n```\nClient A ──intent──→ ┐\n                     │\nClient B ──intent──→ ├─→ Server (validates, updates, broadcasts)\n                     │\nClient C ──intent──→ ┘\n                     │\n                     ↓\n              ┌──────────────┐\n              │ Game State   │\n              │ (authoritative)│\n              └──────────────┘\n                     │\n                     ↓\n              Broadcast tick (20Hz)\n                     ↓\n              Clients render state\n```\n\n**Example: Player Movement**\n```typescript\n// Client sends INTENT (not position)\nsocket.emit("player:move", { direction: "right", timestamp: 1234567 })\n\n// Server validates and updates\nsocket.on("player:move", ({ direction, timestamp }) => {\n  const player = getPlayer(socket.id)\n  if (!player) return\n\n  // 1. Anti-speedhack: check timestamp delta\n  const dt = (timestamp - player.lastMoveTime) / 1000\n  if (dt < 0 || dt > 0.5) return // reject implausible moves\n\n  // 2. Anti-teleport: compute new position, check bounds\n  const speed = 200 // px/s\n  const newX = player.x + (direction === "right" ? speed * dt : -speed * dt)\n  if (newX < 0 || newX > WORLD_WIDTH) return\n\n  // 3. Apply\n  player.x = newX\n  player.lastMoveTime = timestamp\n\n  // 4. Broadcast state at 20Hz tick\n  io.to(roomId).emit("state:tick", { tick: currentTick, players: getAllPlayers() })\n})\n```\n\n**Why authoritative:**\n- Client can never set position directly\n- Server validates every action\n- Cheating requires modifying client + hacking protocol\n\n**Latency optimization:**\n- Client-side prediction (next question)\n- Server reconciliation on each tick\n- Interpolation for other players',
    solutionEs: 'Cliente envía intent, servidor valida y actualiza estado, broadcast a 20Hz. Validaciones: anti-speedhack por timestamp, anti-teleport por bounds, rate limit.',
    explanationEn: 'Without authoritative state, a client can send `player.x = 99999` and win. With it, the server computes the new position based on validated input. The tradeoff: latency (client must wait for server) vs security.',
    explanationEs: 'Sin estado autoritativo, un cliente puede enviar `player.x = 99999` y ganar. Con él, el servidor computa la nueva posición basado en input validado. El tradeoff: latencia vs seguridad.',
    tags: ['game-dev', 'server', 'anti-cheat'],
    resources: [
      { title: 'Gaffer on Games - Networking', url: 'https://gafferongames.com/categories/networking/', type: 'article' },
    ],
  },
  {
    id: 'mmg-6',
    slug: 'multiplayer-mini-game',
    titleEn: 'Client-Side Prediction and Reconciliation',
    titleEs: 'Predicción y Reconciliación Cliente-Lado',
    descriptionEn: 'Implement client-side prediction: client moves immediately, then reconciles with the authoritative server state when it arrives.',
    descriptionEs: 'Implementa predicción cliente-lado: el cliente se mueve inmediatamente, luego se reconcilia con el estado autoritativo del servidor cuando llega.',
    difficulty: 'senior',
    type: 'coding',
    points: 100,
    language: 'typescript',
    hintsEn: [
      'Keep an input history with sequence numbers',
      'On each server state, replay unconfirmed inputs',
      'Snap to server position if divergence exceeds threshold'
    ],
    hintsEs: [
      'Mantén un historial de inputs con números de secuencia',
      'En cada estado del servidor, replay de inputs no confirmados',
      'Snap a posición del servidor si la divergencia excede el umbral'
    ],
    solutionEn: '```typescript\nclass PredictedPlayer {\n  position = { x: 100, y: 100 }\n  velocity = { x: 0, y: 0 }\n  inputHistory: Array<{ seq: number; input: Input; dt: number }> = []\n  lastConfirmedSeq = 0\n  seq = 0\n\n  // Called locally every frame (60 FPS)\n  predict(input: Input, dt: number) {\n    this.seq++\n    this.inputHistory.push({ seq: this.seq, input, dt })\n    if (this.inputHistory.length > 120) this.inputHistory.shift() // keep last 2s\n    this.applyInput(input, dt)\n  }\n\n  // Called when server state arrives\n  reconcile(serverState: { x: number; y: number; lastSeq: number }) {\n    // Drop inputs confirmed by server\n    this.inputHistory = this.inputHistory.filter(i => i.seq > serverState.lastSeq)\n    this.lastConfirmedSeq = serverState.lastSeq\n\n    // Snap to server position\n    const dx = serverState.x - this.position.x\n    const dy = serverState.y - this.position.y\n    const dist = Math.hypot(dx, dy)\n\n    if (dist > 200) {\n      // Big divergence: snap\n      this.position = { x: serverState.x, y: serverState.y }\n    } else {\n      // Small divergence: replay unconfirmed inputs\n      this.position = { x: serverState.x, y: serverState.y }\n      for (const { input, dt } of this.inputHistory) {\n        this.applyInput(input, dt)\n      }\n    }\n  }\n\n  private applyInput(input: Input, dt: number) {\n    const speed = 200\n    if (input.left) this.position.x -= speed * dt\n    if (input.right) this.position.x += speed * dt\n    if (input.up) this.position.y -= speed * dt\n    if (input.down) this.position.y += speed * dt\n  }\n}\n\n// Game loop\nfunction gameLoop() {\n  const input = readInput()\n  player.predict(input, 1 / 60)\n  renderPlayer(player.position) // render immediately\n}\n\n// On server tick\nsocket.on("state:tick", (state) => {\n  player.reconcile(state)\n})\n```',
    solutionEs: 'Cliente predice inmediatamente con cada input. Servidor confirma con `lastSeq`. Cliente reconcilia: descarta inputs confirmados, replaya los pendientes, snap si divergencia > 200px.',
    explanationEn: 'Without prediction, the player sees their character teleport after each server tick. With prediction, the character moves smoothly locally. Reconciliation handles the case where the server disagrees (e.g., due to lag or anti-cheat).',
    explanationEs: 'Sin predicción, el jugador ve su personaje teleportarse tras cada tick del servidor. Con predicción, el personaje se mueve suavemente local. La reconciliación maneja cuando el servidor discrepa (lag o anti-cheat).',
    starterCode: 'class PredictedPlayer {\n  position = { x: 0, y: 0 }\n  // Your implementation\n  predict(input: any, dt: number) {}\n  reconcile(serverState: any) {}\n}',
    tags: ['game-dev', 'prediction', 'networking'],
    resources: [
      { title: 'Gabriel Gambetta - Client-Server Game Architecture', url: 'https://www.gabrielgambetta.com/client-server-game-architecture.html', type: 'article' },
    ],
  },
  {
    id: 'mmg-7',
    slug: 'multiplayer-mini-game',
    titleEn: 'Server-Side Collision Detection',
    titleEs: 'Detección de Colisiones Servidor-Lado',
    descriptionEn: 'Implement a server-side AABB (axis-aligned bounding box) collision system for a 2D game. Handle projectile hits.',
    descriptionEs: 'Implementa un sistema de colisiones AABB (axis-aligned bounding box) en el servidor para un juego 2D. Maneja impactos de proyectiles.',
    difficulty: 'senior',
    type: 'coding',
    points: 100,
    language: 'typescript',
    hintsEn: [
      'Each entity has x, y, width, height',
      'Two AABBs overlap if all 4 conditions are true',
      'For projectiles, iterate active projectiles and check against enemies'
    ],
    hintsEs: [
      'Cada entidad tiene x, y, width, height',
      'Dos AABBs se superponen si las 4 condiciones son verdaderas',
      'Para proyectiles, itera los proyectiles activos y checkea contra enemigos'
    ],
    solutionEn: '```typescript\ninterface Entity {\n  id: string\n  x: number\n  y: number\n  width: number\n  height: number\n}\n\nfunction aabbOverlap(a: Entity, b: Entity): boolean {\n  return (\n    a.x < b.x + b.width &&\n    a.x + a.width > b.x &&\n    a.y < b.y + b.height &&\n    a.y + a.height > b.y\n  )\n}\n\ninterface Projectile extends Entity {\n  ownerId: string\n  damage: number\n  vx: number\n  vy: number\n}\n\ninterface Player extends Entity {\n  id: string\n  health: number\n  team: "red" | "blue"\n}\n\nfunction gameTick(state: { players: Player[]; projectiles: Projectile[] }) {\n  // 1. Move projectiles\n  for (const p of state.projectiles) {\n    p.x += p.vx\n    p.y += p.vy\n  }\n\n  // 2. Check projectile vs player collisions\n  for (let i = state.projectiles.length - 1; i >= 0; i--) {\n    const proj = state.projectiles[i]\n    for (const player of state.players) {\n      if (player.id === proj.ownerId) continue // no self-damage\n      if (aabbOverlap(proj, player)) {\n        player.health -= proj.damage\n        state.projectiles.splice(i, 1) // remove projectile\n        if (player.health <= 0) {\n          // handle death: respawn, score, etc.\n        }\n        break\n      }\n    }\n  }\n\n  // 3. Check player vs player collisions (push apart)\n  for (let i = 0; i < state.players.length; i++) {\n    for (let j = i + 1; j < state.players.length; j++) {\n      if (aabbOverlap(state.players[i], state.players[j])) {\n        // Simple push-apart\n        const a = state.players[i]\n        const b = state.players[j]\n        const overlapX = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)\n        const overlapY = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y)\n        if (overlapX < overlapY) {\n          const push = overlapX / 2\n          a.x -= push\n          b.x += push\n        } else {\n          const push = overlapY / 2\n          a.y -= push\n          b.y += push\n        }\n      }\n    }\n  }\n\n  // 4. Out-of-bounds projectiles\n  state.projectiles = state.projectiles.filter(\n    p => p.x >= 0 && p.x <= 1920 && p.y >= 0 && p.y <= 1080\n  )\n}\n```',
    solutionEs: 'AABB overlap check con 4 comparaciones, iteración inversa para splice seguro en proyectiles, push-apart en colisión player-player, cleanup OOB.',
    explanationEn: 'AABB collision is the simplest and fastest for rectangular entities. For more complex shapes (rotated rectangles, polygons), use SAT (Separating Axis Theorem). For many entities, use spatial partitioning (quadtree, grid) to avoid O(n*m) checks.',
    explanationEs: 'La colisión AABB es la más simple y rápida para entidades rectangulares. Para formas más complejas usa SAT. Para muchas entidades, usa particionado espacial (quadtree, grid) para evitar O(n*m).',
    starterCode: 'function aabbOverlap(a: any, b: any): boolean {\n  // Your implementation\n  return false\n}',
    tags: ['game-dev', 'collision', 'physics'],
    resources: [
      { title: 'Game Programming Patterns - Collision', url: 'https://gameprogrammingpatterns.com/', type: 'article' },
    ],
  },
  {
    id: 'mmg-8',
    slug: 'multiplayer-mini-game',
    titleEn: 'Latency Compensation with Dead Reckoning',
    titleEs: 'Compensación de Latencia con Dead Reckoning',
    descriptionEn: 'Implement entity interpolation and dead reckoning to hide latency: smooth movement of other players based on last known state and velocity.',
    descriptionEs: 'Implementa interpolación de entidades y dead reckoning para ocultar la latencia: movimiento suave de otros jugadores basado en el último estado conocido y velocidad.',
    difficulty: 'advanced',
    type: 'conceptual',
    points: 50,
    hintsEn: [
      'Buffer 2-3 server snapshots, interpolate between them',
      'For predicted entities (your own), use dead reckoning from last confirmed state',
      'Render time should lag 100-200ms behind server time for smooth interpolation'
    ],
    hintsEs: [
      'Buffer 2-3 snapshots del servidor, interpola entre ellos',
      'Para entidades predichas (las tuyas), usa dead reckoning desde el último estado confirmado',
      'El tiempo de render debe ir 100-200ms detrás del tiempo del servidor para interpolación suave'
    ],
    solutionEn: '**Entity Interpolation (Other Players)**\n\n```typescript\ninterface Snapshot {\n  tick: number\n  timestamp: number\n  entities: { id: string; x: number; y: number; vx: number; vy: number }[]\n}\n\nclass Interpolator {\n  snapshots: Snapshot[] = []\n  renderDelay = 100 // ms behind server\n\n  addSnapshot(snap: Snapshot) {\n    this.snapshots.push(snap)\n    if (this.snapshots.length > 5) this.snapshots.shift()\n  }\n\n  getInterpolatedPosition(entityId: string, renderTime: number) {\n    const target = renderTime - this.renderDelay\n\n    // Find two snapshots that bracket the target time\n    let older: Snapshot | null = null\n    let newer: Snapshot | null = null\n    for (let i = 0; i < this.snapshots.length; i++) {\n      if (this.snapshots[i].timestamp <= target) older = this.snapshots[i]\n      if (this.snapshots[i].timestamp > target && !newer) newer = this.snapshots[i]\n    }\n\n    if (!older || !newer) return null\n\n    const olderE = older.entities.find(e => e.id === entityId)\n    const newerE = newer.entities.find(e => e.id === entityId)\n    if (!olderE || !newerE) return null\n\n    const t = (target - older.timestamp) / (newer.timestamp - older.timestamp)\n    return {\n      x: olderE.x + (newerE.x - olderE.x) * t,\n      y: olderE.y + (newerE.y - olderE.y) * t,\n    }\n  }\n}\n```\n\n**Dead Reckoning (Own Player)**\n\n```typescript\n// For the local player, predict from last confirmed server state\nclass DeadReckoningPlayer {\n  lastConfirmed: { x: number; y: number; vx: number; vy: number; time: number } | null = null\n\n  predict(currentTime: number) {\n    if (!this.lastConfirmed) return { x: 0, y: 0 }\n    const dt = (currentTime - this.lastConfirmed.time) / 1000\n    return {\n      x: this.lastConfirmed.x + this.lastConfirmed.vx * dt,\n      y: this.lastConfirmed.y + this.lastConfirmed.vy * dt,\n    }\n  }\n\n  onServerUpdate(state: { x: number; y: number; vx: number; vy: number; time: number }) {\n    this.lastConfirmed = state\n  }\n}\n```\n\n**Render loop:**\n```typescript\nfunction render(renderTime: number) {\n  for (const entityId in allEntities) {\n    if (entityId === myId) {\n      renderPosition(myPlayer.predict(renderTime)) // dead reckoning\n    } else {\n      renderPosition(interpolator.getInterpolatedPosition(entityId, renderTime))\n    }\n  }\n}\n```',
    solutionEs: 'Interpolación con buffer de 2-3 snapshots, render 100ms detrás del servidor. Dead reckoning para el propio jugador basado en último estado confirmado y velocidad.',
    explanationEn: 'Interpolation adds visual latency (100-200ms) but makes other players move smoothly. Dead reckoning predicts your own position to hide input lag. Together they make the game feel responsive even with 100ms+ ping.',
    explanationEs: 'La interpolación añade latencia visual (100-200ms) pero hace que otros jugadores se muevan suavemente. Dead reckoning predice tu posición para ocultar el lag de input.',
    tags: ['game-dev', 'latency', 'interpolation'],
    resources: [
      { title: 'Valve Developer Wiki - Latency Compensating Methods', url: 'https://developer.valvesoftware.com/wiki/Latency_Compensating_Methods', type: 'article' },
    ],
  },
  {
    id: 'mmg-9',
    slug: 'multiplayer-mini-game',
    titleEn: 'Game Loop with Fixed Timestep',
    titleEs: 'Game Loop con Timestep Fijo',
    descriptionEn: 'Implement a game loop with fixed timestep for physics, and variable rendering. Avoid the spiral of death.',
    descriptionEs: 'Implementa un game loop con timestep fijo para física, y renderizado variable. Evita la espiral de la muerte.',
    difficulty: 'advanced',
    type: 'coding',
    points: 50,
    language: 'typescript',
    hintsEn: [
      'Accumulator pattern: track time since last physics step',
      'Physics step at fixed 1/60s for determinism',
      'Render at variable FPS for smoothness'
    ],
    hintsEs: [
      'Patrón de acumulador: trackea tiempo desde el último step de física',
      'Step de física a 1/60s fijo para determinismo',
      'Render a FPS variable para suavidad'
    ],
    solutionEn: '```typescript\nconst FIXED_DT = 1 / 60 // 60 Hz physics\nconst MAX_DT = 0.25 // max frame time to prevent spiral of death\n\nlet lastTime = performance.now() / 1000\nlet accumulator = 0\n\nfunction gameLoop() {\n  const now = performance.now() / 1000\n  let frameTime = now - lastTime\n  lastTime = now\n\n  // Cap frame time to prevent spiral of death\n  if (frameTime > MAX_DT) frameTime = MAX_DT\n\n  accumulator += frameTime\n\n  // Fixed-step physics\n  while (accumulator >= FIXED_DT) {\n    update(FIXED_DT) // physics, AI, networking\n    accumulator -= FIXED_DT\n  }\n\n  // Variable-step render\n  const alpha = accumulator / FIXED_DT // for interpolation\n  render(alpha)\n\n  requestAnimationFrame(gameLoop)\n}\n\nfunction update(dt: number) {\n  // Physics step at fixed dt\n  for (const entity of entities) {\n    entity.x += entity.vx * dt\n    entity.y += entity.vy * dt\n  }\n  // Networking, AI, etc.\n}\n\nfunction render(alpha: number) {\n  // Interpolate between previous and current physics state using alpha\n  for (const entity of entities) {\n    const renderX = entity.prevX + (entity.x - entity.prevX) * alpha\n    const renderY = entity.prevY + (entity.y - entity.prevY) * alpha\n    drawEntity(entity, renderX, renderY)\n  }\n}\n```',
    solutionEs: 'Acumulador con cap de MAX_DT para evitar spiral, while loop con step fijo de 1/60s, render con alpha interpolation entre estados.',
    explanationEn: 'Fixed timestep is critical for deterministic physics: two clients running the same inputs get the same result. The accumulator pattern catches up missed steps after a frame stall. Cap MAX_DT to prevent the spiral of death (slow frame → more physics → slower frame).',
    explanationEs: 'El timestep fijo es crítico para física determinista: dos clientes con los mismos inputs obtienen el mismo resultado. El acumulador recupera steps perdidos tras un frame stall. Cap MAX_DT previene la espiral de la muerte.',
    starterCode: 'const FIXED_DT = 1 / 60\nlet lastTime = performance.now() / 1000\nlet accumulator = 0\n\nfunction gameLoop() {\n  const now = performance.now() / 1000\n  const frameTime = now - lastTime\n  lastTime = now\n  accumulator += frameTime\n  while (accumulator >= FIXED_DT) {\n    // Your update\n    accumulator -= FIXED_DT\n  }\n  requestAnimationFrame(gameLoop)\n}',
    tags: ['game-dev', 'game-loop', 'physics'],
    resources: [
      { title: 'Fix Your Timestep!', url: 'https://gafferongames.com/post/fix_your_timestep/', type: 'article' },
    ],
  },
  {
    id: 'mmg-10',
    slug: 'multiplayer-mini-game',
    titleEn: 'Matchmaking System Design',
    titleEs: 'Diseño de Sistema de Matchmaking',
    descriptionEn: 'Design a matchmaking system: queue players by skill rating, form balanced teams, scale to thousands of concurrent players.',
    descriptionEs: 'Diseña un sistema de matchmaking: encola jugadores por skill rating, forma equipos balanceados, escala a miles de jugadores concurrentes.',
    difficulty: 'advanced',
    type: 'conceptual',
    points: 50,
    hintsEn: [
      'Use ELO or TrueSkill for skill rating',
      'Expand search range over time (widening the net)',
      'Use Redis Sorted Sets indexed by rating for O(log n) queries'
    ],
    hintsEs: [
      'Usa ELO o TrueSkill para rating de habilidad',
      'Expande el rango de búsqueda con el tiempo',
      'Usa Redis Sorted Sets indexados por rating para queries O(log n)'
    ],
    solutionEn: '**Architecture**\n\n```\n┌────────┐    join queue    ┌──────────────┐\n│ Players│ ───────────────→ │ Redis ZSET   │\n│ (1000s)│                  │ score: rating│\n└────────┘                  │ member: userId│\n                            └──────┬───────┘\n                                   │ poll every 1s\n                                   ↓\n                            ┌──────────────┐\n                            │ Matchmaker   │\n                            │ - find pairs │\n                            │ - balance    │\n                            └──────┬───────┘\n                                   ↓\n                            ┌──────────────┐\n                            │ Game Server  │\n                            │ - assign     │\n                            │ - notify     │\n                            └──────────────┘\n```\n\n**Skill Rating (TrueSkill)**\n- Microsoft Research algorithm, used in Xbox Live\n- Tracks `mu` (mean skill) and `sigma` (uncertainty)\n- New players have high sigma (uncertain), converges over time\n- Conservative rating: `mu - 3*sigma`\n\n**Matching Algorithm**\n```typescript\nasync function findMatch(userId: string) {\n  const player = await getPlayer(userId)\n  let range = 50 // initial range\n  const maxRange = 500\n\n  while (range <= maxRange) {\n    // Find players within rating range, waiting >= 30s\n    const candidates = await redis.zrangebyscore(\n      "queue:by_rating",\n      player.rating - range,\n      player.rating + range,\n      "WITHSCORES",\n      "LIMIT", 0, 100\n    )\n\n    const opponent = candidates.find(c => c !== userId)\n    if (opponent) {\n      // Remove both from queue and start match\n      await redis.zrem("queue:by_rating", userId, opponent)\n      return { players: [userId, opponent] }\n    }\n\n    // Wait and expand range\n    await sleep(5000)\n    range += 50\n  }\n}\n```\n\n**Team Balancing (5v5)**\n- Sort 10 players by rating\n- Snake draft: 1,10,2,9,3,8,4,7,5,6\n- This minimizes total rating difference per team',
    solutionEs: 'TrueSkill (mu + sigma) para rating, Redis ZSET indexado por rating, búsqueda con rango expandible, snake draft para balancear equipos 5v5.',
    explanationEn: 'TrueSkill is better than ELO for team games because it handles team composition and multiple players per match. The expanding search range prevents players from waiting forever at the cost of match quality.',
    explanationEs: 'TrueSkill es mejor que ELO para juegos en equipo porque maneja composición y múltiples jugadores por partida. El rango expandible previene esperas infinitas a costa de calidad de match.',
    tags: ['game-dev', 'matchmaking', 'elo'],
    resources: [
      { title: 'TrueSkill paper', url: 'https://www.microsoft.com/en-us/research/project/trueskill-ranking-system/', type: 'article' },
    ],
  },
  {
    id: 'mmg-11',
    slug: 'multiplayer-mini-game',
    titleEn: 'Anti-Cheat: Speed and Teleport Detection',
    titleEs: 'Anti-Cheat: Detección de Velocidad y Teleport',
    descriptionEn: 'Implement server-side detection for speed hacks and teleport hacks using movement history and statistical analysis.',
    descriptionEs: 'Implementa detección server-side de speed hacks y teleport hacks usando historial de movimiento y análisis estadístico.',
    difficulty: 'advanced',
    type: 'coding',
    points: 50,
    language: 'typescript',
    hintsEn: [
      'Track position history per player',
      'Compare actual movement speed vs allowed max + tolerance',
      'Flag consistent violations (not just network spikes)'
    ],
    hintsEs: [
      'Trackea historial de posiciones por jugador',
      'Compara velocidad real vs máximo permitido + tolerancia',
      'Marca violaciones consistentes (no solo picos de red)'
    ],
    solutionEn: '```typescript\ninterface PlayerMovement {\n  userId: string\n  history: Array<{ x: number; y: number; t: number }>\n  violations: number\n  flagged: boolean\n}\n\nconst MAX_SPEED = 250 // px/s\nconst TOLERANCE = 1.2 // 20% tolerance for network jitter\nconst VIOLATION_THRESHOLD = 5 // flag after 5 consecutive\n\nfunction checkMovement(player: PlayerMovement, newX: number, newY: number) {\n  const now = Date.now()\n  player.history.push({ x: newX, y: newY, t: now })\n  if (player.history.length > 20) player.history.shift()\n\n  if (player.history.length < 2) return\n\n  const prev = player.history[player.history.length - 2]\n  const dt = (now - prev.t) / 1000\n  if (dt < 0.001) return // too close, skip\n\n  const dist = Math.hypot(newX - prev.x, newY - prev.y)\n  const speed = dist / dt\n\n  if (speed > MAX_SPEED * TOLERANCE) {\n    player.violations++\n    if (player.violations >= VIOLATION_THRESHOLD && !player.flagged) {\n      player.flagged = true\n      // Send to anti-cheat review queue\n      reportCheat({\n        userId: player.userId,\n        type: "speed_hack",\n        evidence: { speed, maxSpeed: MAX_SPEED, history: player.history.slice() },\n      })\n    }\n  } else {\n    // Decay violations on legit movement\n    player.violations = Math.max(0, player.violations - 1)\n  }\n\n  // Teleport detection: sudden large jump with no intermediate history\n  if (player.history.length >= 3) {\n    const [a, b, c] = player.history.slice(-3)\n    const abDist = Math.hypot(b.x - a.x, b.y - a.y)\n    const bcDist = Math.hypot(c.x - b.x, c.y - b.y)\n    if (bcDist > MAX_SPEED * 1.5 && abDist < MAX_SPEED * 0.5) {\n      // Big jump from rest → teleport\n      reportCheat({\n        userId: player.userId,\n        type: "teleport",\n        evidence: { from: b, to: c, distance: bcDist },\n      })\n    }\n  }\n}\n```',
    solutionEs: 'Historial de posiciones, velocidad calculada vs MAX_SPEED × tolerance, violaciones acumuladas con decay, detección de teleport (gran salto desde reposo).',
    explanationEn: 'Tolerance prevents false positives from network jitter. The violation counter with decay handles brief spikes. Teleport detection is separate from speed because a teleport is a single large jump, not gradual acceleration.',
    explanationEs: 'La tolerancia previene falsos positivos por jitter de red. El contador con decay maneja picos breves. La detección de teleport es separada porque es un salto único, no aceleración gradual.',
    starterCode: 'function checkMovement(player: any, newX: number, newY: number) {\n  // Your implementation\n}',
    tags: ['anti-cheat', 'game-dev', 'security'],
    resources: [
      { title: 'Game Hacking Academy', url: 'https://gamehacking.academy/', type: 'article' },
    ],
  },
  {
    id: 'mmg-12',
    slug: 'multiplayer-mini-game',
    titleEn: 'State Serialization and Replication',
    titleEs: 'Serialización y Replicación de Estado',
    descriptionEn: 'Design a state replication system: only send changes, not full state. Use deltas, interest management, and bit packing.',
    descriptionEs: 'Diseña un sistema de replicación de estado: solo envía cambios, no estado completo. Usa deltas, interest management, y bit packing.',
    difficulty: 'advanced',
    type: 'conceptual',
    points: 50,
    hintsEn: [
      'Delta compression: only send properties that changed',
      'Interest management: only send entities the client can see',
      'Bit packing: use minimum bits for each field (e.g., angle = 8 bits)'
    ],
    hintsEs: [
      'Delta compression: solo envía propiedades que cambiaron',
      'Interest management: solo envía entidades que el cliente puede ver',
      'Bit packing: usa bits mínimos por campo (ej. angle = 8 bits)'
    ],
    solutionEn: '**1. Delta Compression**\n\nFull state (40 bytes per player × 8 players = 320 bytes per tick @ 20Hz = 51 KB/s)\n\nDelta state (only changed fields, ~5-10 bytes per change):\n```typescript\ninterface StateDelta {\n  tick: number\n  changes: Array<{\n    entityId: string\n    fields: Partial<{ x: number; y: number; hp: number; angle: number }>\n  }>\n}\n```\n\n**2. Interest Management (AOI)**\n\nOnly send entities within the client\'s area of interest:\n```typescript\nfunction getVisibleEntities(player: Player, allEntities: Entity[], aoiRadius = 1000) {\n  return allEntities.filter(e =>\n    Math.hypot(e.x - player.x, e.y - player.y) < aoiRadius\n  )\n}\n```\n\nFor grid-based: divide the world into cells, only send entities in the same and adjacent cells.\n\n**3. Bit Packing**\n\nPosition: instead of 4 bytes per axis, use 2 bytes (16 bits) with quantization:\n```typescript\nfunction packPosition(x: number, worldSize: number): number {\n  // x: 0..worldSize → 0..65535\n  return Math.round((x / worldSize) * 65535)\n}\nfunction unpackPosition(packed: number, worldSize: number): number {\n  return (packed / 65535) * worldSize\n}\n```\n\nAngle: 1 byte (256 values) is enough for visual rotation:\n```typescript\nfunction packAngle(rad: number): number {\n  return Math.round((rad / (2 * Math.PI)) * 255)\n}\n```\n\n**4. Combined: Per-Tick Message**\n```typescript\nfunction buildTickMessage(localPlayer: Player, allEntities: Entity[]) {\n  const visible = getVisibleEntities(localPlayer, allEntities)\n  return {\n    tick: currentTick++,\n    entities: visible.map(e => ({\n      id: e.id,\n      x: packPosition(e.x, WORLD_SIZE),\n      y: packPosition(e.y, WORLD_SIZE),\n      a: packAngle(e.angle),\n      h: e.hp, // small int, 1 byte\n    })),\n  }\n}\n```\n\n**Bandwidth:** 8 entities × (2+2+1+1) bytes = 48 bytes/tick = 7.7 KB/s',
    solutionEs: 'Delta compression (solo cambios), AOI (radio de interés), bit packing (quantize a 16 bits, angle a 8 bits). Reduce bandwidth ~85%.',
    explanationEn: 'For 8 players at 20Hz: full state is 51 KB/s, optimized (delta + AOI + bit packing) is 7.7 KB/s. The savings compound at scale: 1000-player MMO needs every trick.',
    explanationEs: 'Para 8 jugadores a 20Hz: estado completo 51 KB/s, optimizado 7.7 KB/s. El ahorro escala: un MMO de 1000 jugadores necesita cada truco.',
    tags: ['networking', 'optimization', 'replication'],
    resources: [
      { title: 'Quake 3 Networking', url: 'http://trac.bookofhook.com/bookofhook/trac.cgi/wiki/Quake3Networking', type: 'article' },
    ],
  },
  {
    id: 'mmg-13',
    slug: 'multiplayer-mini-game',
    titleEn: 'WebSocket Scaling with Redis Pub/Sub',
    titleEs: 'Escalado de WebSocket con Redis Pub/Sub',
    descriptionEn: 'Scale Socket.io across multiple server instances using the Redis adapter. Ensure messages reach all clients in a room.',
    descriptionEs: 'Escala Socket.io a múltiples instancias usando el adapter de Redis. Asegura que los mensajes llegan a todos los clientes de una sala.',
    difficulty: 'advanced',
    type: 'coding',
    points: 50,
    language: 'typescript',
    hintsEn: [
      'Install @socket.io/redis-adapter',
      'Each instance connects to the same Redis',
      'Adapter handles cross-instance broadcasting via Pub/Sub'
    ],
    hintsEs: [
      'Instala @socket.io/redis-adapter',
      'Cada instancia se conecta al mismo Redis',
      'El adapter maneja el broadcasting cross-instance vía Pub/Sub'
    ],
    solutionEn: '```typescript\nimport { Server } from "socket.io"\nimport { createAdapter } from "@socket.io/redis-adapter"\nimport { createClient } from "redis"\nimport { createServer } from "http"\n\nconst httpServer = createServer()\nconst io = new Server(httpServer, {\n  cors: { origin: "*" },\n  transports: ["websocket"],\n})\n\n// 1. Create two Redis clients (one for pub, one for sub)\nconst pubClient = createClient({ url: process.env.REDIS_URL })\nconst subClient = pubClient.duplicate()\n\nawait Promise.all([pubClient.connect(), subClient.connect()])\n\n// 2. Attach adapter\nio.adapter(createAdapter(pubClient, subClient))\n\n// 3. Standard handlers work transparently\nio.on("connection", (socket) => {\n  socket.on("room:join", ({ roomId }) => {\n    socket.join(roomId)\n  })\n\n  socket.on("chat:send", ({ roomId, text }) => {\n    // This reaches ALL sockets in roomId across ALL instances\n    io.to(roomId).emit("chat:message", {\n      userId: socket.id,\n      text,\n      timestamp: Date.now(),\n    })\n  })\n})\n\nhttpServer.listen(3000)\n```\n\n**How it works:**\n1. Server A receives `chat:send` for `room:abc`\n2. A is connected to sockets: S1, S2 (in room:abc)\n3. B is connected to sockets: S3, S4 (in room:abc)\n4. Adapter publishes to Redis channel `socket.io#room:abc`\n5. Server B receives via subscription, emits to S3 and S4\n\n**Sticky sessions:**\n- Use nginx `ip_hash` or similar to route a client to the same instance\n- Reduces reconnections when a server restarts\n\n**Without sticky sessions:**\n- Each request might hit a different instance\n- WebSocket connection is sticky by default (Upgrade header)\n- HTTP polling would not work',
    solutionEs: 'Crea 2 clientes Redis (pub + sub), usa `createAdapter`, los `io.to(roomId).emit()` funcionan transparentemente cross-instance. Sticky sessions recomendadas.',
    explanationEn: 'The Redis adapter translates Socket.io room operations into Redis Pub/Sub messages. Each instance subscribes to relevant channels and forwards to its connected sockets. This makes multi-instance deployments transparent to your application code.',
    explanationEs: 'El adapter de Redis traduce operaciones de salas de Socket.io a mensajes Pub/Sub. Cada instancia se suscribe a canales relevantes y reenvía a sus sockets conectados. Hace que multi-instancia sea transparente para tu app.',
    starterCode: 'import { Server } from "socket.io"\nimport { createServer } from "http"\n\nconst httpServer = createServer()\nconst io = new Server(httpServer)\n\n// Your scaling setup here',
    tags: ['socket-io', 'redis', 'scaling'],
    resources: [
      { title: 'Socket.io Redis Adapter', url: 'https://socket.io/docs/v4/redis-adapter/', type: 'documentation' },
    ],
  },
  {
    id: 'mmg-14',
    slug: 'multiplayer-mini-game',
    titleEn: 'Game State Persistence and Recovery',
    titleEs: 'Persistencia y Recuperación de Estado de Juego',
    descriptionEn: 'Design persistence: save game state periodically and on disconnect. Allow players to rejoin and continue.',
    descriptionEs: 'Diseña la persistencia: guarda el estado del juego periódicamente y al desconectar. Permite a los jugadores re-joining y continuar.',
    difficulty: 'advanced',
    type: 'conceptual',
    points: 50,
    hintsEn: [
      'Save to Redis for fast access; flush to Postgres for durability',
      'Save on critical events (round end, disconnect) and periodically',
      'On reconnect, look up active session and restore state'
    ],
    hintsEs: [
      'Guarda en Redis para acceso rápido; flush a Postgres para durabilidad',
      'Guarda en eventos críticos (fin de ronda, disconnect) y periódicamente',
      'Al reconectar, busca sesión activa y restaura estado'
    ],
    solutionEn: '**Two-Tier Persistence**\n\n```\nIn-Memory → Redis (5s snapshot) → Postgres (on event)\n```\n\n**Redis Schema**\n```typescript\n// game:{roomId}:state - JSON snapshot of game state\n// game:{roomId}:players - hash of socketId → Player\n// session:{userId}:room - user\'s active room (for reconnect)\n```\n\n**Save Strategy**\n```typescript\n// 1. Periodic snapshot every 5s\nsetInterval(() => {\n  for (const room of rooms.values()) {\n    redis.set(`game:${room.id}:state`, JSON.stringify(room))\n    redis.expire(`game:${room.id}:state`, 3600) // 1h TTL\n  }\n}, 5000)\n\n// 2. Critical events: end of round, disconnect\nasync function onRoundEnd(room: Room) {\n  await redis.set(`game:${room.id}:state`, JSON.stringify(room))\n  await postgres.gameRecord.upsert({\n    where: { id: room.id },\n    create: { id: room.id, state: room, endedAt: new Date() },\n    update: { state: room },\n  })\n}\n\n// 3. On disconnect, save session for reconnect\nasync function onDisconnect(userId: string, roomId: string) {\n  await redis.set(`session:${userId}:room`, roomId, "EX", 300) // 5 min\n}\n```\n\n**Reconnect Flow**\n```typescript\nsocket.on("reconnect", async ({ userId }) => {\n  const roomId = await redis.get(`session:${userId}:room`)\n  if (!roomId) return socket.emit("reconnect:no-session")\n\n  const state = await redis.get(`game:${roomId}:state`)\n  if (!state) return socket.emit("reconnect:expired")\n\n  const room = JSON.parse(state)\n  // Add player back\n  room.players.set(socket.id, room.players.get(userId)) // restore from saved\n  io.to(roomId).emit("room:update", room)\n  socket.emit("reconnect:state", room)\n  await redis.del(`session:${userId}:room`)\n})\n```\n\n**Trade-offs:**\n- Redis only: lose state on Redis crash, but fast\n- Postgres only: durable but slow for live game\n- Two-tier: best of both, slight complexity',
    solutionEs: 'Snapshot a Redis cada 5s + flush a Postgres en eventos críticos. Sesión de usuario en Redis con TTL para reconnect.',
    explanationEn: 'Periodic snapshots handle the common case of crashes. Critical event saves handle the rare case of long-running games that need durability. The session:userId:room pattern enables fast reconnect without querying the database.',
    explanationEs: 'Los snapshots periódicos manejan el caso común de crashes. Los saves en eventos críticos manejan juegos largos. El patrón session permite reconnect rápido sin consultar la BD.',
    tags: ['persistence', 'redis', 'reconnection'],
    resources: [
      { title: 'Redis Persistence', url: 'https://redis.io/docs/manual/persistence/', type: 'documentation' },
    ],
  },
  {
    id: 'mmg-15',
    slug: 'multiplayer-mini-game',
    titleEn: 'Input Lag and Display Lag',
    titleEs: 'Input Lag y Display Lag',
    descriptionEn: 'Explain the difference between input lag (controller to server), display lag (server to screen), and how to measure each.',
    descriptionEs: 'Explica la diferencia entre input lag (controller a servidor), display lag (servidor a pantalla), y cómo medir cada uno.',
    difficulty: 'intermediate',
    type: 'conceptual',
    points: 25,
    hintsEn: [
      'Input lag = client input → server processes it',
      'Display lag = server update → pixels change',
      'Total perceived lag = input lag + network RTT + display lag'
    ],
    hintsEs: [
      'Input lag = input cliente → servidor lo procesa',
      'Display lag = update servidor → píxeles cambian',
      'Lag total percibido = input lag + network RTT + display lag'
    ],
    solutionEn: '**Pipeline**\n\n```\n[Player presses key]\n       ↓ ~5ms (keyboard poll)\n[OS detects input]\n       ↓ ~1-16ms (USB/Bluetooth latency)\n[Game receives input]\n       ↓ ~16ms (client tick rate at 60 FPS)\n[Client sends to server] ──── NETWORK RTT ────→ [Server processes]\n                                                     ↓ ~16ms (server tick)\n[Client receives update] ←──── NETWORK RTT ──── [Server broadcasts]\n       ↓ ~16ms (interpolation buffer)\n[Render frame with new state]\n       ↓ ~5-15ms (display response time)\n[Player sees result]\n```\n\n**Latency budget for "feels responsive":**\n| Component | Target |\n|---|---|\n| Input device | <10ms |\n| Client processing | 16ms (1 frame at 60fps) |\n| Network RTT | <50ms for competitive |\n| Server processing | 16ms |\n| Interpolation buffer | 50-100ms (smooth tradeoff) |\n| Display | <10ms |\n| **Total** | **~100-200ms feels OK, <80ms is competitive** |\n\n**How to measure:**\n- **Input lag**: high-speed camera + LED sensor + oscilloscope\n- **Network lag**: ping tool, RTT measurement\n- **Display lag**: use tools like `time` command in Linux, or display-specific inputs\n- **End-to-end**: capture both input and resulting screen change with high-speed camera\n\n**Optimization:**\n- Client-side prediction (hide input lag)\n- Server-side tick rate of 60-128Hz (reduce server processing time)\n- Lower display response time (1ms monitors)\n- WebRTC data channels for lower latency than WebSockets',
    solutionEs: 'Pipeline: input → OS → client → network → server → broadcast → client render → display. Total < 80ms para competitivo, < 200ms aceptable.',
    explanationEn: 'Players perceive lag as a single number (the delay between action and result), but it is composed of many sources. Optimizing the biggest contributor (usually network RTT) gives the best return.',
    explanationEs: 'Los jugadores perciben el lag como un solo número, pero se compone de muchas fuentes. Optimizar el mayor contribuyente (usualmente RTT) da el mejor retorno.',
    tags: ['game-dev', 'latency', 'performance'],
    resources: [
      { title: 'Blurbusters - Input Lag', url: 'https://blurbusters.com/input-lag-tests/', type: 'article' },
    ],
  },
  {
    id: 'mmg-16',
    slug: 'multiplayer-mini-game',
    titleEn: 'Entity Component System (ECS) Basics',
    titleEs: 'Bases del Entity Component System (ECS)',
    descriptionEn: 'Explain the Entity Component System architecture pattern. Compare with OOP inheritance. When to use ECS?',
    descriptionEs: 'Explica el patrón de arquitectura Entity Component System. Compara con herencia OOP. ¿Cuándo usar ECS?',
    difficulty: 'intermediate',
    type: 'conceptual',
    points: 25,
    hintsEn: [
      'Entities are just IDs (no behavior)',
      'Components are pure data (position, velocity, health)',
      'Systems contain logic that operates on entities with specific components'
    ],
    hintsEs: [
      'Las entidades son solo IDs (sin comportamiento)',
      'Los components son datos puros (position, velocity, health)',
      'Los systems contienen lógica que opera sobre entidades con components específicos'
    ],
    solutionEn: '**OOP Inheritance (traditional)**\n```typescript\nclass Entity {}\nclass Movable extends Entity { x = 0; y = 0 }\nclass Enemy extends Movable { health = 100; attack() {} }\nclass Player extends Movable { health = 100; inventory = []; attack() {} }\n// Problem: deep hierarchies, hard to add cross-cutting features\n```\n\n**ECS Architecture**\n```typescript\n// Entities: just IDs\ntype Entity = number\nconst player: Entity = 1\nconst enemy: Entity = 2\n\n// Components: pure data\nclass Position { constructor(public x = 0, public y = 0) {} }\nclass Velocity { constructor(public vx = 0, public vy = 0) {} }\nclass Health { constructor(public hp = 100) {} }\nclass Inventory { constructor(public items: string[] = []) {} }\n\n// Storage: component attached to entity\nconst components = {\n  position: new Map<Entity, Position>(),\n  velocity: new Map<Entity, Velocity>(),\n  health: new Map<Entity, Health>(),\n  inventory: new Map<Entity, Inventory>(),\n}\n\n// Systems: operate on entities with specific components\nclass MovementSystem {\n  update(dt: number) {\n    for (const [entity, vel] of components.velocity) {\n      const pos = components.position.get(entity)\n      if (!pos) continue\n      pos.x += vel.vx * dt\n      pos.y += vel.vy * dt\n    }\n  }\n}\n\nclass HealthRegenSystem {\n  update() {\n    for (const [entity, health] of components.health) {\n      health.hp = Math.min(100, health.hp + 1)\n    }\n  }\n}\n```\n\n**Advantages over OOP:**\n- ✅ Composition over inheritance\n- ✅ Easy to add cross-cutting features (just add a component)\n- ✅ Cache-friendly: systems iterate contiguous component data\n- ✅ Parallelism: systems are independent\n- ✅ Easy serialization for save/load\n\n**When to use ECS:**\n- Many entities (1000+)\n- Frequent feature additions\n- Performance-critical (use archetype-based ECS like Bevy/Unity DOTS for max perf)\n\n**When NOT to use:**\n- Small games (< 100 entities)\n- Logic-heavy per-entity behavior (AI trees, FSMs)',
    solutionEs: 'Entidades = IDs, Components = datos puros en Maps, Systems = lógica que itera. Composición sobre herencia, cache-friendly, paralelo.',
    explanationEn: 'ECS decouples data from behavior. Components are just data; systems contain all the logic. This makes it easy to add features (e.g., "burning" damage over time) without modifying entity classes — just add a Burning component and a BurnSystem.',
    explanationEs: 'ECS desacopla datos de comportamiento. Los components son solo datos; los systems contienen toda la lógica. Esto facilita añadir features sin modificar clases de entidad.',
    tags: ['game-dev', 'architecture', 'ecs'],
    resources: [
      { title: 'Bevy ECS Book', url: 'https://bevyengine.org/learn/book/', type: 'documentation' },
    ],
  },
  {
    id: 'mmg-17',
    slug: 'multiplayer-mini-game',
    titleEn: 'Particle System Optimization',
    titleEs: 'Optimización de Sistema de Partículas',
    descriptionEn: 'Design a particle system that can render 10,000+ particles at 60 FPS using instanced rendering and object pooling.',
    descriptionEs: 'Diseña un sistema de partículas que pueda renderizar 10,000+ partículas a 60 FPS usando instanced rendering y object pooling.',
    difficulty: 'intermediate',
    type: 'coding',
    points: 25,
    language: 'typescript',
    hintsEn: [
      'Object pool particles: never allocate during gameplay',
      'Update all particles in a tight loop (cache-friendly)',
      'Use Three.js InstancedMesh for GPU instancing'
    ],
    hintsEs: [
      'Object pool de partículas: nunca asignes durante gameplay',
      'Actualiza todas las partículas en un loop tight (cache-friendly)',
      'Usa Three.js InstancedMesh para GPU instancing'
    ],
    solutionEn: '```typescript\n// 1. Particle data: SoA (Structure of Arrays) for cache friendliness\nclass ParticleSystem {\n  // SoA layout\n  positions = new Float32Array(MAX_PARTICLES * 2)\n  velocities = new Float32Array(MAX_PARTICLES * 2)\n  lifetimes = new Float32Array(MAX_PARTICLES)\n  ages = new Float32Array(MAX_PARTICLES)\n  colors = new Float32Array(MAX_PARTICLES * 3)\n  active = new Uint8Array(MAX_PARTICLES)\n\n  nextIndex = 0\n\n  emit(x: number, y: number, vx: number, vy: number, life: number) {\n    // Reuse dead particles first\n    let i = -1\n    for (let j = 0; j < MAX_PARTICLES; j++) {\n      if (this.active[j] === 0) { i = j; break }\n    }\n    if (i === -1) i = this.nextIndex // overwrite oldest\n    this.nextIndex = (this.nextIndex + 1) % MAX_PARTICLES\n\n    this.positions[i * 2] = x\n    this.positions[i * 2 + 1] = y\n    this.velocities[i * 2] = vx\n    this.velocities[i * 2 + 1] = vy\n    this.lifetimes[i] = life\n    this.ages[i] = 0\n    this.active[i] = 1\n  }\n\n  update(dt: number) {\n    let count = 0\n    for (let i = 0; i < MAX_PARTICLES; i++) {\n      if (this.active[i] === 0) continue\n      this.ages[i] += dt\n      if (this.ages[i] >= this.lifetimes[i]) {\n        this.active[i] = 0\n        continue\n      }\n      this.positions[i * 2] += this.velocities[i * 2] * dt\n      this.positions[i * 2 + 1] += this.velocities[i * 2 + 1] * dt\n      count++\n    }\n    this.activeCount = count\n  }\n}\n\n// 2. GPU Instanced rendering (Three.js)\n// In the game loop:\nfunction updateBuffers(particleSystem: ParticleSystem, mesh: THREE.InstancedMesh) {\n  let idx = 0\n  const matrix = new THREE.Matrix4()\n  for (let i = 0; i < MAX_PARTICLES; i++) {\n    if (particleSystem.active[i] === 0) continue\n    matrix.setPosition(\n      particleSystem.positions[i * 2],\n      particleSystem.positions[i * 2 + 1],\n      0\n    )\n    mesh.setMatrixAt(idx, matrix)\n    idx++\n  }\n  mesh.count = idx\n  mesh.instanceMatrix.needsUpdate = true\n}\n```',
    solutionEs: 'SoA (Float32Array por propiedad), object pool con reuse, update tight loop, InstancedMesh para GPU instancing.',
    explanationEn: 'SoA layout is faster than AoS because of CPU cache. Pre-allocated Float32Arrays avoid GC pressure. InstancedMesh sends one draw call for all particles instead of 10,000.',
    explanationEs: 'El layout SoA es más rápido que AoS por la caché de CPU. Los Float32Arrays pre-asignados evitan presión de GC. InstancedMesh envía un solo draw call para todas las partículas.',
    starterCode: 'class Particle {\n  x = 0; y = 0; vx = 0; vy = 0; life = 0; age = 0\n  alive = false\n}\n// Your optimized particle system',
    tags: ['rendering', 'optimization', 'particles'],
    resources: [
      { title: 'Three.js InstancedMesh', url: 'https://threejs.org/docs/#api/en/objects/InstancedMesh', type: 'documentation' },
    ],
  },
  {
    id: 'mmg-18',
    slug: 'multiplayer-mini-game',
    titleEn: 'Spatial Partitioning with Quadtree',
    titleEs: 'Particionado Espacial con Quadtree',
    descriptionEn: 'Implement a quadtree for spatial partitioning to optimize collision detection from O(n²) to O(n log n).',
    descriptionEs: 'Implementa un quadtree para particionado espacial que optimice la detección de colisiones de O(n²) a O(n log n).',
    difficulty: 'intermediate',
    type: 'coding',
    points: 25,
    language: 'typescript',
    hintsEn: [
      'Each node has 4 quadrants (NW, NE, SW, SE)',
      'Recursively subdivide when a quadrant has too many entities',
      'Query: traverse only quadrants that overlap the query area'
    ],
    hintsEs: [
      'Cada nodo tiene 4 cuadrantes (NW, NE, SW, SE)',
      'Subdivide recursivamente cuando un cuadrante tiene demasiadas entidades',
      'Query: atraviesa solo cuadrantes que se superponen con el área de query'
    ],
    solutionEn: '```typescript\ninterface Bounds { x: number; y: number; w: number; h: number }\ninterface Entity { id: string; x: number; y: number; radius: number }\n\nclass QuadTree {\n  bounds: Bounds\n  capacity: number\n  entities: Entity[] = []\n  divided = false\n  children: QuadTree[] = []\n\n  constructor(bounds: Bounds, capacity = 4) {\n    this.bounds = bounds\n    this.capacity = capacity\n  }\n\n  insert(entity: Entity) {\n    if (!this.intersects(entity, this.bounds)) return false\n\n    if (this.entities.length < this.capacity && !this.divided) {\n      this.entities.push(entity)\n      return true\n    }\n\n    if (!this.divided) this.subdivide()\n    return this.children.some(c => c.insert(entity))\n  }\n\n  private subdivide() {\n    const { x, y, w, h } = this.bounds\n    const hw = w / 2, hh = h / 2\n    this.children = [\n      new QuadTree({ x, y, w: hw, h: hh }),                // NW\n      new QuadTree({ x: x + hw, y, w: hw, h: hh }),        // NE\n      new QuadTree({ x, y: y + hh, w: hw, h: hh }),        // SW\n      new QuadTree({ x: x + hw, y: y + hh, w: hw, h: hh }), // SE\n    ]\n    this.divided = true\n    // Re-insert existing entities\n    for (const e of this.entities) this.children.some(c => c.insert(e))\n    this.entities = []\n  }\n\n  query(area: Bounds): Entity[] {\n    const found: Entity[] = []\n    if (!this.intersectsArea(area, this.bounds)) return found\n\n    found.push(...this.entities)\n    if (this.divided) {\n      for (const child of this.children) {\n        found.push(...child.query(area))\n      }\n    }\n    return found\n  }\n\n  private intersects(e: Entity, b: Bounds) {\n    return !(e.x + e.radius < b.x || e.x - e.radius > b.x + b.w ||\n             e.y + e.radius < b.y || e.y - e.radius > b.y + b.h)\n  }\n  private intersectsArea(a: Bounds, b: Bounds) {\n    return !(a.x > b.x + b.w || a.x + a.w < b.x || a.y > b.y + b.h || a.y + a.h < b.y)\n  }\n}\n\n// Usage\nconst tree = new QuadTree({ x: 0, y: 0, w: 1000, h: 1000 })\nfor (const e of entities) tree.insert(e)\n\n// Find entities near player\nconst nearby = tree.query({\n  x: player.x - 50, y: player.y - 50, w: 100, h: 100\n})\nfor (const other of nearby) {\n  if (collides(player, other)) handleCollision()\n}\n```',
    solutionEs: 'Insert recursivo con subdivisión, query que solo atraviesa cuadrantes intersectados. Reduce colisiones de O(n²) a O(n log n).',
    explanationEn: 'For 1000 entities in a 1000x1000 world: brute force is 500K checks/frame. With quadtree (4 capacity), it\'s ~3K checks/frame. The savings grow with entity count.',
    explanationEs: 'Para 1000 entidades en un mundo 1000x1000: fuerza bruta es 500K checks/frame. Con quadtree (capacity 4), son ~3K checks/frame. El ahorro crece con la cantidad.',
    starterCode: 'class QuadTree {\n  // Your implementation\n}',
    tags: ['algorithms', 'spatial', 'optimization'],
    resources: [
      { title: 'Quadtree on Wikipedia', url: 'https://en.wikipedia.org/wiki/Quadtree', type: 'article' },
    ],
  },
  {
    id: 'mmg-19',
    slug: 'multiplayer-mini-game',
    titleEn: 'Reconnection and Session Resumption',
    titleEs: 'Reconexión y Resumen de Sesión',
    descriptionEn: 'Implement a robust reconnection flow: detect disconnection, save state, allow resume within a grace period, otherwise drop.',
    descriptionEs: 'Implementa un flujo robusto de reconexión: detecta desconexión, guarda estado, permite resumir dentro de un período de gracia, sino descarta.',
    difficulty: 'intermediate',
    type: 'coding',
    points: 25,
    language: 'typescript',
    hintsEn: [
      'Use a connection token to identify the user across reconnects',
      'Save session state in Redis with TTL on disconnect',
      'On reconnect, restore state if within grace period'
    ],
    hintsEs: [
      'Usa un connection token para identificar al usuario entre reconnects',
      'Guarda estado de sesión en Redis con TTL al desconectar',
      'Al reconectar, restaura estado si está dentro del período de gracia'
    ],
    solutionEn: '```typescript\nconst GRACE_PERIOD_MS = 60_000 // 1 min\nconst sessions = new Map<string, SessionState>() // userId → state\n\ninterface SessionState {\n  userId: string\n  roomId: string\n  playerData: any\n  disconnectedAt: number\n  timeoutHandle: NodeJS.Timeout\n}\n\nio.on("connection", (socket) => {\n  // Initial connection with auth token\n  socket.on("auth", ({ token, userId }) => {\n    socket.data.userId = userId\n\n    // Check if reconnecting\n    const existing = sessions.get(userId)\n    if (existing && Date.now() - existing.disconnectedAt < GRACE_PERIOD_MS) {\n      clearTimeout(existing.timeoutHandle)\n      sessions.delete(userId)\n      socket.join(existing.roomId)\n      // Restore player data\n      socket.emit("reconnect:success", { roomId: existing.roomId, playerData: existing.playerData })\n      io.to(existing.roomId).emit("player:rejoined", { userId })\n    } else {\n      // New connection or expired session\n      if (existing) {\n        sessions.delete(userId) // expired\n        io.to(existing.roomId).emit("player:dropped", { userId })\n      }\n      socket.emit("auth:success")\n    }\n  })\n\n  socket.on("disconnect", () => {\n    const userId = socket.data.userId\n    if (!userId) return\n\n    const roomId = [...socket.rooms].find(r => r !== socket.id)\n    if (!roomId) return\n\n    // Save session for grace period\n    const playerData = getPlayerData(userId, roomId)\n    const timeoutHandle = setTimeout(() => {\n      sessions.delete(userId)\n      io.to(roomId).emit("player:dropped", { userId })\n    }, GRACE_PERIOD_MS)\n\n    sessions.set(userId, {\n      userId,\n      roomId,\n      playerData,\n      disconnectedAt: Date.now(),\n      timeoutHandle,\n    })\n\n    // Mark as disconnected in game state (but don\'t remove yet)\n    io.to(roomId).emit("player:disconnected", { userId })\n  })\n})\n\n// Client side: persist a reconnect token\nlocalStorage.setItem("ws_token", token)\nconst socket = io({ auth: { token: localStorage.getItem("ws_token") } })\nsocket.on("connect", () => socket.emit("auth", { token, userId }))\n```',
    solutionEs: 'Token de reconnect, estado guardado en Map con timeout de gracia, restore en nueva conexión, drop tras expirar.',
    explanationEn: 'A grace period balances two needs: (1) players with unstable connections can recover without losing progress, (2) truly gone players get cleaned up. The trade-off is how long to keep the slot. 60s is a common default for casual games, 5-10s for competitive.',
    explanationEs: 'Un período de gracia balancea dos necesidades: (1) jugadores con conexiones inestables pueden recuperar sin perder progreso, (2) jugadores realmente fuera se limpian. El trade-off es cuánto tiempo mantener el slot.',
    starterCode: '// Your reconnection handler here',
    tags: ['reconnection', 'socket-io', 'state'],
    resources: [
      { title: 'Socket.io Connection state recovery', url: 'https://socket.io/docs/v4/connection-state-recovery', type: 'documentation' },
    ],
  },
  {
    id: 'mmg-20',
    slug: 'multiplayer-mini-game',
    titleEn: 'Tile-Based Game World Streaming',
    titleEs: 'Streaming de Mundo de Juego Basado en Tiles',
    descriptionEn: 'Design a tile-based world where players see only nearby tiles loaded, with seamless streaming as they move.',
    descriptionEs: 'Diseña un mundo basado en tiles donde los jugadores solo vean los tiles cercanos cargados, con streaming seamless al moverse.',
    difficulty: 'intermediate',
    type: 'conceptual',
    points: 25,
    hintsEn: [
      'Divide the world into fixed-size chunks (e.g., 32x32 tiles)',
      'Load chunks within a radius of the player',
      'Unload distant chunks after a delay (not immediately)'
    ],
    hintsEs: [
      'Divide el mundo en chunks de tamaño fijo (ej. 32x32 tiles)',
      'Carga chunks dentro de un radio del jugador',
      'Descarga chunks lejanos tras un delay (no inmediatamente)'
    ],
    solutionEn: '**Chunk System**\n\n```typescript\nconst CHUNK_SIZE = 32 // tiles per side\nconst VIEW_RADIUS = 3 // chunks around player\nconst UNLOAD_DELAY = 5000 // ms before unloading\n\nclass World {\n  chunks = new Map<string, Chunk>() // "x,y" → chunk\n\n  getChunkKey(cx: number, cy: number) {\n    return `${cx},${cy}`\n  }\n\n  getOrLoadChunk(cx: number, cy: number): Chunk {\n    const key = this.getChunkKey(cx, cy)\n    let chunk = this.chunks.get(key)\n    if (!chunk) {\n      chunk = this.loadChunkFromDisk(cx, cy)\n      this.chunks.set(key, chunk)\n    }\n    chunk.lastAccessed = Date.now()\n    return chunk\n  }\n\n  update(playerX: number, playerY: number) {\n    const pcx = Math.floor(playerX / CHUNK_SIZE)\n    const pcy = Math.floor(playerY / CHUNK_SIZE)\n\n    // Load chunks in view radius\n    for (let dx = -VIEW_RADIUS; dx <= VIEW_RADIUS; dx++) {\n      for (let dy = -VIEW_RADIUS; dy <= VIEW_RADIUS; dy++) {\n        this.getOrLoadChunk(pcx + dx, pcy + dy)\n      }\n    }\n\n    // Unload distant chunks after delay\n    for (const [key, chunk] of this.chunks) {\n      if (Math.abs(chunk.cx - pcx) > VIEW_RADIUS + 1 ||\n          Math.abs(chunk.cy - pcy) > VIEW_RADIUS + 1) {\n        if (Date.now() - chunk.lastAccessed > UNLOAD_DELAY) {\n          this.saveChunkToDisk(chunk)\n          this.chunks.delete(key)\n        }\n      }\n    }\n  }\n\n  // Procedural generation fallback for new chunks\n  loadChunkFromDisk(cx: number, cy: number): Chunk {\n    // First check cache/DB\n    const cached = chunkCache.get(`${cx},${cy}`)\n    if (cached) return cached\n    // Generate procedurally with deterministic seed\n    return generateChunk(cx, cy, hashSeed(cx, cy))\n  }\n}\n```\n\n**Why chunks work:**\n- 32x32 = 1024 tiles per chunk\n- Each chunk is small enough to load/unload in <16ms\n- Player moves smoothly because the same chunk is reused for many frames\n- Procedural generation: infinite world without storage cost',
    solutionEs: 'Chunks de 32x32 tiles, cargar en radio de 3 chunks, unload tras 5s de inactividad, generación procedural con seed determinístico.',
    explanationEn: 'Chunk-based worlds are the standard for open-world games. The chunk size balances memory (smaller = less memory per chunk) with overhead (larger = fewer chunk transitions). 32x32 is a sweet spot for 2D, 16x16x16 for 3D (Minecraft uses 16).',
    explanationEs: 'Los mundos basados en chunks son el estándar para juegos de mundo abierto. El tamaño del chunk balancea memoria vs overhead. 32x32 es un sweet spot para 2D, 16x16x16 para 3D (Minecraft usa 16).',
    tags: ['game-dev', 'streaming', 'procedural'],
    resources: [
      { title: 'Minecraft chunk format', url: 'https://minecraft.wiki/w/Chunk', type: 'article' },
    ],
  },
]
