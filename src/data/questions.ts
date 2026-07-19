export interface Question {
  id: string
  slug: string
  titleEn: string
  titleEs: string
  descriptionEn: string
  descriptionEs: string
  difficulty: 'basic' | 'intermediate' | 'advanced' | 'senior'
  type: 'conceptual' | 'coding' | 'multiple_choice'
  points: number
  language?: string
  hintsEn: string[]
  hintsEs: string[]
  solutionEn: string
  solutionEs: string
  tags?: string[]
  contextEn?: string
  contextEs?: string
  starterCode?: string
  explanationEn?: string
  explanationEs?: string
  resources?: Resource[]
  completed?: boolean
  correct?: boolean
}

export interface Resource {
  title: string
  url: string
  type: 'documentation' | 'tutorial' | 'article' | 'video'
}

export const mockQuestions: Question[] = [
  {
    id: 'pm-1',
    slug: 'password-manager',
    titleEn: 'Implement Argon2id Hashing',
    titleEs: 'Implementar Hashing Argon2id',
    descriptionEn: 'Write a function that hashes a password using Argon2id with appropriate parameters for secure password storage. Include salt generation and proper error handling.',
    descriptionEs: 'Escribe una función que haga hash de una contraseña usando Argon2id con parámetros apropiados para almacenamiento seguro. Incluye generación de salt y manejo de errores.',
    difficulty: 'senior',
    type: 'coding',
    points: 100,
    language: 'typescript',
    hintsEn: [
      'Argon2id is part of the `argon2` library',
      'Use `argon2.hash()` with options: { type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 4 }',
      'Always handle errors in production code'
    ],
    hintsEs: [
      'Argon2id es parte de la librería `argon2`',
      'Usa `argon2.hash()` con opciones: { type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 4 }',
      'Siempre maneja errores en código de producción'
    ],
    solutionEn: '```typescript\nimport argon2 from "argon2";\n\nasync function hashPassword(password: string): Promise<string> {\n  try {\n    const hash = await argon2.hash(password, {\n      type: argon2.argon2id,\n      memoryCost: 65536,\n      timeCost: 3,\n      parallelism: 4,\n    });\n    return hash;\n  } catch (error) {\n    throw new Error("Failed to hash password");\n  }\n}\n```',
    solutionEs: '```typescript\nimport argon2 from "argon2";\n\nasync function hashPassword(password: string): Promise<string> {\n  try {\n    const hash = await argon2.hash(password, {\n      type: argon2.argon2id,\n      memoryCost: 65536,\n      timeCost: 3,\n      parallelism: 4,\n    });\n    return hash;\n  } catch (error) {\n    throw new Error("Error al hacer hash");\n  }\n}\n```',
  },
  {
    id: 'pm-2',
    slug: 'password-manager',
    titleEn: 'SRP-6a Protocol Flow',
    titleEs: 'Flujo del protocolo SRP-6a',
    descriptionEn: 'Explain the Salted Challenge Response Authentication Mechanism (SCRAM) and how it provides mutual authentication without transmitting passwords.',
    descriptionEs: 'Explica el Mecanismo de Autenticación de Desafío con Salt (SCRAM) y cómo proporciona autenticación mutua sin transmitir contraseñas.',
    difficulty: 'senior',
    type: 'conceptual',
    points: 100,
    hintsEn: [
      'SCRAM uses a challenge-response mechanism',
      'The server never sees the plaintext password',
      'Both client and server prove knowledge of the shared secret'
    ],
    hintsEs: [
      'SCRAM usa un mecanismo de desafío-respuesta',
      'El servidor nunca ve la contraseña en texto plano',
      'Ambos cliente y servidor prueban conocimiento del secreto compartido'
    ],
    solutionEn: '**SCRAM (Salted Challenge Response Authentication Mechanism)**\n\n1. **Client Hello**: Client sends username\n2. **Server Hello**: Server sends salt + iteration count + ServerKey\n3. **Client Proof**: Client derives StoredKey from password, computes AuthMessage, signs with ClientKey\n4. **Server Verify**: Server computes its own signature, compares with client\'s\n\n**Key Properties**:\n- Mutual authentication (both parties prove identity)\n- No password stored or transmitted\n- Resistant to replay attacks (uses nonce)\n- Password stored as SaltedPasswordDigest = HMAC(salt, password)',
    solutionEs: '**SCRAM (Mecanismo de Autenticación de Desafío con Salt)**\n\n1. **Client Hello**: Cliente envía nombre de usuario\n2. **Server Hello**: Servidor envía salt + conteo de iteraciones + ServerKey\n3. **Client Proof**: Cliente deriva StoredKey de la contraseña, calcula AuthMessage, firma con ClientKey\n4. **Server Verify**: Servidor calcula su propia firma, compara con la del cliente\n\n**Propiedades clave**:\n- Autenticación mutua (ambas partes prueban identidad)\n- Contraseña nunca almacenada o transmitida\n- Resistente a ataques replay (usa nonce)',
  },
  {
    id: 'pm-3',
    slug: 'password-manager',
    titleEn: 'AES-256-GCM Encryption',
    titleEs: 'Cifrado AES-256-GCM',
    descriptionEn: 'Implement a function that encrypts data using AES-256-GCM with a secure key derivation function. Include IV/nonce generation and authentication tag handling.',
    descriptionEs: 'Implementa una función que cifre datos usando AES-256-GCM con una función de derivación de clave segura. Incluye generación de IV/nonce y manejo del tag de autenticación.',
    difficulty: 'senior',
    type: 'coding',
    points: 100,
    language: 'typescript',
    hintsEn: [
      'AES-256-GCM provides both confidentiality and authenticity',
      'Use a unique IV/nonce for each encryption operation',
      'The authentication tag ensures the ciphertext hasn\'t been tampered with'
    ],
    hintsEs: [
      'AES-256-GCM proporciona confidencialidad y autenticidad',
      'Usa un IV/nonce único para cada operación de cifrado',
      'El tag de autenticación asegura que el texto cifrado no ha sido manipulado'
    ],
    solutionEn: '```typescript\nimport crypto from \'crypto\';\n\nconst ALGORITHM = \'aes-256-gcm\';\nconst IV_LENGTH = 12;\n\nfunction encrypt(plaintext: string, password: string): string {\n  const salt = crypto.randomBytes(16);\n  const key = crypto.scryptSync(password, salt, 32);\n  const iv = crypto.randomBytes(IV_LENGTH);\n  \n  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);\n  let encrypted = cipher.update(plaintext, \'utf8\', \'hex\');\n  encrypted += cipher.final(\'hex\');\n  const tag = cipher.getAuthTag();\n  \n  return Buffer.concat([salt, iv, tag, Buffer.from(encrypted, \'hex\')]).toString(\'base64\');\n}\n```',
    solutionEs: '```typescript\nimport crypto from \'crypto\';\n\nconst ALGORITHM = \'aes-256-gcm\';\nconst IV_LENGTH = 12;\n\nfunction encrypt(plaintext: string, password: string): string {\n  const salt = crypto.randomBytes(16);\n  const key = crypto.scryptSync(password, salt, 32);\n  const iv = crypto.randomBytes(IV_LENGTH);\n  \n  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);\n  let encrypted = cipher.update(plaintext, \'utf8\', \'hex\');\n  encrypted += cipher.final(\'hex\');\n  const tag = cipher.getAuthTag();\n  \n  return Buffer.concat([salt, iv, tag, Buffer.from(encrypted, \'hex\')]).toString(\'base64\');\n}\n```',
  },
  {
    id: 'pm-4',
    slug: 'password-manager',
    titleEn: 'Zero-Knowledge Password Check',
    titleEs: 'Verificación zero-knowledge',
    descriptionEn: 'Design a mechanism that allows a server to verify a user\'s password without ever receiving or storing the plaintext password.',
    descriptionEs: 'Diseña un mecanismo que permita al servidor verificar la contraseña de un usuario sin recibir ni almacenar la contraseña en texto plano.',
    difficulty: 'senior',
    type: 'conceptual',
    points: 100,
    hintsEn: [
      'The server stores a derivative of the password, not the password itself',
      'The user proves knowledge by performing a calculation with the password',
      'The server can verify the result without knowing the original password'
    ],
    hintsEs: [
      'El servidor almacena un derivado de la contraseña, no la contraseña misma',
      'El usuario prueba conocimiento realizando un cálculo con la contraseña',
      'El servidor puede verificar el resultado sin conocer la contraseña original'
    ],
    solutionEn: '**Zero-Knowledge Password Proof (ZKPP)**\n\n1. **Setup**: User creates password P, server stores H(P) where H is a cryptographic hash\n2. **Login**: Server sends random challenge C\n3. **Response**: User computes f(P, C) and returns result\n4. **Verify**: Server computes same function with stored H(P) and verifies result\n\n**Key Insight**: The server NEVER receives P, only H(P).',
    solutionEs: '**Prueba de Contraseña de Conocimiento Cero (ZKPP)**\n\n1. **Setup**: Usuario crea contraseña P, servidor almacena H(P) donde H es un hash criptográfico\n2. **Login**: Servidor envía desafío aleatorio C\n3. **Respuesta**: Usuario calcula f(P, C) y devuelve el resultado\n4. **Verificar**: Servidor calcula la misma función con H(P) almacenado y verifica el resultado',
  },
  {
    id: 'pm-5',
    slug: 'password-manager',
    titleEn: 'Rate Limiter Implementation',
    titleEs: 'Implementar rate limiter',
    descriptionEn: 'Implement a rate limiter middleware that prevents brute force attacks on the login endpoint. Should allow 5 attempts per minute per IP address.',
    descriptionEs: 'Implementa un middleware de rate limiting que prevenga ataques de fuerza bruta en el endpoint de login. Debe permitir 5 intentos por minuto por dirección IP.',
    difficulty: 'advanced',
    type: 'coding',
    points: 50,
    language: 'typescript',
    hintsEn: [
      'Use a sliding window algorithm for accurate rate limiting',
      'Consider using Redis for distributed rate limiting',
      'Return appropriate HTTP status codes (429 Too Many Requests)'
    ],
    hintsEs: [
      'Usa un algoritmo de ventana deslizante para rate limiting preciso',
      'Considera usar Redis para rate limiting distribuido',
      'Devuelve códigos de estado HTTP apropiados (429 Too Many Requests)'
    ],
    solutionEn: '```typescript\nconst rateLimitStore = new Map<string, { count: number; resetTime: number }>();\nconst WINDOW_MS = 60000;\nconst MAX_REQUESTS = 5;\n\nfunction rateLimiter(req: Request): Response | null {\n  const ip = req.headers.get(\'X-Forwarded-For\') || req.ip;\n  const now = Date.now();\n  \n  const record = rateLimitStore.get(ip);\n  \n  if (!record || now > record.resetTime) {\n    rateLimitStore.set(ip, { count: 1, resetTime: now + WINDOW_MS });\n    return null;\n  }\n  \n  if (record.count >= MAX_REQUESTS) {\n    return new Response(\'Too Many Requests\', { status: 429 });\n  }\n  \n  record.count++;\n  return null;\n}\n```',
    solutionEs: '```typescript\nconst rateLimitStore = new Map<string, { count: number; resetTime: number }>();\nconst WINDOW_MS = 60000;\nconst MAX_REQUESTS = 5;\n\nfunction rateLimiter(req: Request): Response | null {\n  const ip = req.headers.get(\'X-Forwarded-For\') || req.ip;\n  const now = Date.now();\n  \n  const record = rateLimitStore.get(ip);\n  \n  if (!record || now > record.resetTime) {\n    rateLimitStore.set(ip, { count: 1, resetTime: now + WINDOW_MS });\n    return null;\n  }\n  \n  if (record.count >= MAX_REQUESTS) {\n    return new Response(\'Too Many Requests\', { status: 429 });\n  }\n  \n  record.count++;\n  return null;\n}\n```',
  },

  {
    id: 'sma-1',
    slug: 'social-media-app',
    titleEn: 'Design a News Feed System',
    titleEs: 'Diseñar un Sistema de News Feed',
    descriptionEn: 'Design the architecture for a social media news feed that displays posts from followed users. Consider pagination, real-time updates, and ranking.',
    descriptionEs: 'Diseña la arquitectura para un news feed de redes sociales que muestre publicaciones de usuarios seguidos. Considera paginación, actualizaciones en tiempo real y ranking.',
    difficulty: 'senior',
    type: 'conceptual',
    points: 100,
    hintsEn: [
      'Consider pull vs push models for feed generation',
      'Think about fan-out on write vs fan-out on read',
      'Ranking algorithms like EdgeRank consider affinity, decay, and weight'
    ],
    hintsEs: [
      'Considera modelos pull vs push para generación de feeds',
      'Piensa en fan-out en escritura vs fan-out en lectura',
      'Algoritmos de ranking como EdgeRank consideran afinidad, decaimiento y peso'
    ],
    solutionEn: '**News Feed Architecture**\n\n1. **Pull Model**: On each request, fetch posts from all followed users, merge, and sort. Simple but slow.\n\n2. **Push Model**: When user posts, push to followers\' feeds immediately. Fast reads but costly writes and duplication.\n\n3. **Hybrid**: Push to active users, pull for inactive users.\n\n**Ranking (EdgeRank-like)**:\n- Score = Affinity × Weight × Decay\n- Affinity: closeness between viewer and creator\n- Weight: type of interaction (comment > like > view)\n- Decay: time since creation\n\n**Pagination**: Cursor-based using timestamp or seek keys, never offset-based for consistency.',
    solutionEs: '**Arquitectura de News Feed**\n\n1. **Modelo Pull**: En cada request, obtener posts de todos los usuarios seguidos, mezclar y ordenar. Simple pero lento.\n\n2. **Modelo Push**: Cuando un usuario publica, empujar a los feeds de sus seguidores inmediatamente. Lecturas rápidas pero escrituras costosas.\n\n3. **Híbrido**: Push para usuarios activos, pull para inactivos.\n\n**Ranking (tipo EdgeRank)**:\n- Score = Afinidad × Peso × Decaimiento',
  },
  {
    id: 'sma-2',
    slug: 'social-media-app',
    titleEn: 'Implement WebSocket Connection Manager',
    titleEs: 'Implementar Gestor de Conexiones WebSocket',
    descriptionEn: 'Implement a WebSocket connection manager that handles multiple concurrent connections, automatically reconnects on failure, and manages presence indicators.',
    descriptionEs: 'Implementa un gestor de conexiones WebSocket que maneje múltiples conexiones concurrentes, se reconecte automáticamente en caso de fallo, y maneje indicadores de presencia.',
    difficulty: 'advanced',
    type: 'coding',
    points: 50,
    language: 'typescript',
    hintsEn: [
      'Use exponential backoff for reconnection attempts',
      'Keep track of connection state (connecting, open, closing, closed)',
      'Consider using a message queue for broadcasting'
    ],
    hintsEs: [
      'Usa backoff exponencial para intentos de reconexión',
      'Mantén registro del estado de la conexión (conectando, abierto, cerrando, cerrado)',
      'Considera usar una cola de mensajes para broadcast'
    ],
    solutionEn: '```typescript\nclass ConnectionManager {\n  private ws: WebSocket | null = null;\n  private reconnectAttempts = 0;\n  private maxReconnectAttempts = 5;\n  private reconnectDelay = 1000;\n\n  connect(url: string) {\n    this.ws = new WebSocket(url);\n    \n    this.ws.onopen = () => {\n      this.reconnectAttempts = 0;\n      this.reconnectDelay = 1000;\n    };\n\n    this.ws.onclose = () => {\n      this.scheduleReconnect(url);\n    };\n\n    this.ws.onerror = (error) => {\n      console.error(\'WebSocket error\', error);\n    };\n  }\n\n  private scheduleReconnect(url: string) {\n    if (this.reconnectAttempts < this.maxReconnectAttempts) {\n      setTimeout(() => {\n        this.reconnectAttempts++;\n        this.reconnectDelay *= 2;\n        this.connect(url);\n      }, this.reconnectDelay);\n    }\n  }\n\n  send(data: any) {\n    if (this.ws?.readyState === WebSocket.OPEN) {\n      this.ws.send(JSON.stringify(data));\n    }\n  }\n}\n```',
    solutionEs: '```typescript\nclass ConnectionManager {\n  private ws: WebSocket | null = null;\n  private reconnectAttempts = 0;\n  private maxReconnectAttempts = 5;\n  private reconnectDelay = 1000;\n\n  connect(url: string) {\n    this.ws = new WebSocket(url);\n    \n    this.ws.onopen = () => {\n      this.reconnectAttempts = 0;\n      this.reconnectDelay = 1000;\n    };\n\n    this.ws.onclose = () => {\n      this.scheduleReconnect(url);\n    };\n\n    this.ws.onerror = (error) => {\n      console.error(\'WebSocket error\', error);\n    };\n  }\n\n  private scheduleReconnect(url: string) {\n    if (this.reconnectAttempts < this.maxReconnectAttempts) {\n      setTimeout(() => {\n        this.reconnectAttempts++;\n        this.reconnectDelay *= 2;\n        this.connect(url);\n      }, this.reconnectDelay);\n    }\n  }\n\n  send(data: any) {\n    if (this.ws?.readyState === WebSocket.OPEN) {\n      this.ws.send(JSON.stringify(data));\n    }\n  }\n}\n```',
  },
  {
    id: 'sma-3',
    slug: 'social-media-app',
    titleEn: 'Implement Like/Unlike Functionality',
    titleEs: 'Implementar Funcionalidad de Like/Unlike',
    descriptionEn: 'Implement optimistic UI updates for a like/unlike button that shows immediate feedback while the API request is in flight, with rollback on failure.',
    descriptionEs: 'Implementa actualizaciones optimistas de UI para un botón de like/unlike que muestre retroalimentación inmediata mientras la petición API está en vuelo, con rollback en caso de fallo.',
    difficulty: 'intermediate',
    type: 'coding',
    points: 30,
    language: 'typescript',
    hintsEn: [
      'Store the previous state before optimistic update',
      'Use a try-catch to handle failures and rollback',
      'Consider debouncing rapid clicks'
    ],
    hintsEs: [
      'Guarda el estado anterior antes de la actualización optimista',
      'Usa try-catch para manejar fallos y rollback',
      'Considera debounce para clics rápidos'
    ],
    solutionEn: '```typescript\nasync function toggleLike(postId: string, isLiked: boolean) {\n  const previousState = isLiked;\n  \n  optimisticUpdate(postId, { isLiked: !isLiked, likeCount: likeCount + (isLiked ? -1 : 1) });\n\n  try {\n    await api.toggleLike(postId);\n  } catch (error) {\n    optimisticUpdate(postId, { isLiked: previousState, likeCount: likeCount + (previousState ? -1 : 1) });\n    toast.error(\'Failed to update like\');\n  }\n}\n```',
    solutionEs: '```typescript\nasync function toggleLike(postId: string, isLiked: boolean) {\n  const previousState = isLiked;\n  \n  optimisticUpdate(postId, { isLiked: !isLiked, likeCount: likeCount + (isLiked ? -1 : 1) });\n\n  try {\n    await api.toggleLike(postId);\n  } catch (error) {\n    optimisticUpdate(postId, { isLiked: previousState, likeCount: likeCount + (previousState ? -1 : 1) });\n    toast.error(\'Error al actualizar like\');\n  }\n}\n```',
  },

  {
    id: 'mmg-1',
    slug: 'multiplayer-mini-game',
    titleEn: 'Game State Synchronization',
    titleEs: 'Sincronización de Estado del Juego',
    descriptionEn: 'Design a game state synchronization protocol for a multiplayer game where multiple clients need to stay in sync. Discuss authoritative server vs peer-to-peer approaches.',
    descriptionEs: 'Diseña un protocolo de sincronización de estado para un juego multiplayer donde múltiples clientes necesitan mantenerse sincronizados. Discute enfoques de servidor autoritativo vs peer-to-peer.',
    difficulty: 'senior',
    type: 'conceptual',
    points: 100,
    hintsEn: [
      'Consider client-side prediction and server reconciliation',
      'Think about latency compensation techniques',
      'Discuss the role of input timestamping'
    ],
    hintsEs: [
      'Considera predicción del lado del cliente y reconciliación con el servidor',
      'Piensa en técnicas de compensación de latencia',
      'Discute el rol del timestamp de inputs'
    ],
    solutionEn: '**Game State Sync Approaches**\n\n1. **Authoritative Server**: Server is single source of truth. Clients send inputs, server simulates and broadcasts state.\n\n2. **Client-Side Prediction**: Client predicts results locally, reconciles with server state when authoritative result arrives.\n\n3. **Entity Interpolation**: Client interpolates between recent server states to hide network jitter.\n\n**Latency Compensation**:\n- Client-side prediction + server reconciliation\n- Input delay compensation (client waits before applying local input)\n- Rollback and replay for conflict resolution\n\n**Protocol**: Use UDP for real-time data, TCP for reliable state changes.',
    solutionEs: '**Enfoques de Sincronización**\n\n1. **Servidor Autoritativo**: El servidor es la única fuente de verdad. Clientes envían inputs, servidor simula y transmite estado.\n\n2. **Predicción del Cliente**: Cliente predice resultados localmente, reconcilia con estado del servidor.\n\n3. **Interpolación de Entidades**: Cliente interpola entre estados recientes del servidor.',
  },
  {
    id: 'mmg-2',
    slug: 'multiplayer-mini-game',
    titleEn: 'Implement Lobby System',
    titleEs: 'Implementar Sistema de Lobby',
    descriptionEn: 'Implement a lobby system where players can create/join game rooms, see other players, and the host can start the game when ready.',
    descriptionEs: 'Implementa un sistema de lobby donde los jugadores pueden crear/unirse a salas, ver otros jugadores, y el host puede iniciar el juego cuando esté listo.',
    difficulty: 'advanced',
    type: 'coding',
    points: 50,
    language: 'typescript',
    hintsEn: [
      'Use unique room codes for joining',
      'Handle player disconnect during lobby',
      'Implement host migration if host leaves'
    ],
    hintsEs: [
      'Usa códigos únicos para unirse a salas',
      'Maneja desconexión durante el lobby',
      'Implementa migración de host si el host se va'
    ],
    solutionEn: '```typescript\ninterface Room {\n  code: string;\n  players: Player[];\n  hostId: string;\n  status: \'waiting\' | \'starting\' | \'playing\';\n}\n\nclass LobbyManager {\n  private rooms = new Map<string, Room>();\n\n  createRoom(host: Player): Room {\n    const code = this.generateCode();\n    const room: Room = {\n      code,\n      players: [host],\n      hostId: host.id,\n      status: \'waiting\',\n    };\n    this.rooms.set(code, room);\n    return room;\n  }\n\n  joinRoom(code: string, player: Player): Room | null {\n    const room = this.rooms.get(code);\n    if (!room || room.status !== \'waiting\') return null;\n    if (room.players.length >= 8) return null;\n    \n    room.players.push(player);\n    return room;\n  }\n\n  private generateCode(): string {\n    return Math.random().toString(36).substring(2, 8).toUpperCase();\n  }\n}\n```',
    solutionEs: '```typescript\ninterface Room {\n  code: string;\n  players: Player[];\n  hostId: string;\n  status: \'waiting\' | \'starting\' | \'playing\';\n}\n\nclass LobbyManager {\n  private rooms = new Map<string, Room>();\n\n  createRoom(host: Player): Room {\n    const code = this.generateCode();\n    const room: Room = {\n      code,\n      players: [host],\n      hostId: host.id,\n      status: \'waiting\',\n    };\n    this.rooms.set(code, room);\n    return room;\n  }\n\n  joinRoom(code: string, player: Player): Room | null {\n    const room = this.rooms.get(code);\n    if (!room || room.status !== \'waiting\') return null;\n    if (room.players.length >= 8) return null;\n    \n    room.players.push(player);\n    return room;\n  }\n\n  private generateCode(): string {\n    return Math.random().toString(36).substring(2, 8).toUpperCase();\n  }\n}\n```',
  },
  {
    id: 'mmg-3',
    slug: 'multiplayer-mini-game',
    titleEn: 'Handle Concurrent Game Actions',
    titleEs: 'Manejar Acciones Concurrentes en el Juego',
    descriptionEn: 'How would you handle two players clicking the same card in a card game at exactly the same time? Design a conflict resolution strategy.',
    descriptionEs: '¿Cómo manejarías dos jugadores haciendo clic en la misma carta en un juego de cartas exactamente al mismo tiempo? Diseña una estrategia de resolución de conflictos.',
    difficulty: 'advanced',
    type: 'conceptual',
    points: 50,
    hintsEn: [
      'Server should be the authority on who gets what',
      'Consider first-come-first-served with timestamps',
      'Compensate the loser with something else'
    ],
    hintsEs: [
      'El servidor debe ser la autoridad sobre quién obtiene qué',
      'Considera first-come-first-served con timestamps',
      'Compensa al perdedor con algo más'
    ],
    solutionEn: '**Conflict Resolution Strategies**\n\n1. **Server Authority**: Server processes events in received order. First timestamp wins.\n\n2. **Random Tiebreaker**: Server randomly selects winner when timestamps are equal (within margin).\n\n3. **Compensation Model**: Loser receives compensation (extra turn, points, etc.) to feel fair.\n\n4. **Optimistic Locking**: Each action has a version number, conflicts return error for retry.\n\n**Implementation**:\n- Client sends action with client timestamp\n- Server adds server timestamp on receipt\n- Server processes in strict order, loser gets compensation\n- Broadcast result to all clients',
    solutionEs: '**Estrategias de Resolución de Conflictos**\n\n1. **Autoridad del Servidor**: Servidor procesa eventos en orden recibido. Primero en timestamp gana.\n\n2. **Desempate Aleatorio**: Servidor selecciona aleatoriamente cuando timestamps son iguales.\n\n3. **Modelo de Compensación**: El perdedor recibe compensación para sentirse justo.',
  },

  {
    id: 'ecom-1',
    slug: 'gitanas-ecommerce',
    titleEn: 'Shopping Cart State Management',
    titleEs: 'Gestión de Estado del Carrito',
    descriptionEn: 'Design a shopping cart system that persists across sessions, handles inventory reservations, and supports both guest and authenticated user flows.',
    descriptionEs: 'Diseña un sistema de carrito que persista entre sesiones, maneje reservas de inventario, y soporte flujos de usuarios invitados y autenticados.',
    difficulty: 'senior',
    type: 'conceptual',
    points: 100,
    hintsEn: [
      'Consider localStorage for guest carts + server sync on login',
      'Inventory reservation should have expiration',
      'Merge carts when guest logs in'
    ],
    hintsEs: [
      'Considera localStorage para carritos de invitados + sync al servidor al login',
      'Reservas de inventario deben tener expiración',
      'Mezcla carritos cuando el invitado inicia sesión'
    ],
    solutionEn: '**Cart Architecture**\n\n1. **Guest Cart**: Stored in localStorage with unique ID, synced to server on login.\n\n2. **Authenticated Cart**: Stored in database, synced across devices.\n\n3. **Inventory Reservation**: Reserve stock when added to cart, release after timeout (15-30 min).\n\n4. **Cart Merge on Login**:\n   - Fetch guest cart from localStorage\n   - Fetch user cart from database\n   - Merge: combine quantities, keep higher, resolve conflicts\n\n**Cart Item Schema**:\n```\n{\n  cartId,\n  userId,\n  productId,\n  quantity,\n  reservedAt,\n  expiresAt\n}\n```',
    solutionEs: '**Arquitectura del Carrito**\n\n1. **Carrito Invitado**: En localStorage con ID único, sync al servidor al hacer login.\n\n2. **Carrito Autenticado**: En base de datos, sync entre dispositivos.\n\n3. **Reserva de Inventario**: Reservar stock al agregar, liberar después de timeout (15-30 min).\n\n4. **Mezcla al Login**: Combinar cantidades, mantener mayor, resolver conflictos.',
  },
  {
    id: 'ecom-2',
    slug: 'gitanas-ecommerce',
    titleEn: 'Implement Order Processing Pipeline',
    titleEs: 'Implementar Pipeline de Procesamiento de Órdenes',
    descriptionEn: 'Design an order processing system that handles payment, inventory, fulfillment, and notifications. Consider error handling and retries.',
    descriptionEs: 'Diseña un sistema de procesamiento de órdenes que maneje pago, inventario, cumplimiento y notificaciones. Considera manejo de errores y reintentos.',
    difficulty: 'senior',
    type: 'conceptual',
    points: 100,
    hintsEn: [
      'Use a state machine for order lifecycle',
      'Implement idempotency keys for payment processing',
      'Consider event-driven architecture with message queue'
    ],
    hintsEs: [
      'Usa una máquina de estados para el ciclo de vida de la orden',
      'Implementa claves de idempotencia para procesamiento de pagos',
      'Considera arquitectura event-driven con cola de mensajes'
    ],
    solutionEn: '**Order Processing Pipeline**\n\n1. **Order Created** → Validate inventory, create reservation\n2. **Payment Pending** → Process payment (idempotency key!)\n3. **Payment Confirmed** → Capture payment, update inventory\n4. **Fulfillment** → Generate order, notify warehouse\n5. **Shipped** → Update tracking, notify customer\n6. **Delivered** → Mark complete, request review\n\n**Error Handling**:\n- Retry with exponential backoff (max 3 attempts)\n- Dead letter queue for failed orders\n- Compensating transactions for rollback\n\n**Idempotency**: Use payment intent ID + order ID as composite key.',
    solutionEs: '**Pipeline de Procesamiento**\n\n1. **Orden Creada** → Validar inventario, crear reserva\n2. **Pago Pendiente** → Procesar pago (¡clave de idempotencia!)\n3. **Pago Confirmado** → Capturar pago, actualizar inventario\n4. **Cumplimiento** → Generar orden, notificar almacén',
  },
  {
    id: 'ecom-3',
    slug: 'gitanas-ecommerce',
    titleEn: 'Build Price Calculation Service',
    titleEs: 'Construir Servicio de Cálculo de Precios',
    descriptionEn: 'Implement a price calculation service that handles discounts, taxes, shipping costs, and promo codes. Make it extensible for future promotions.',
    descriptionEs: 'Implementa un servicio de cálculo de precios que maneje descuentos, impuestos, costos de envío y códigos promocionales. Hazlo extensible para futuras promociones.',
    difficulty: 'advanced',
    type: 'coding',
    points: 50,
    language: 'typescript',
    hintsEn: [
      'Use the strategy pattern for different discount types',
      'Apply discounts in specific order (percentage before fixed)',
      'Consider promotional code validation'
    ],
    hintsEs: [
      'Usa el patrón strategy para diferentes tipos de descuentos',
      'Aplica descuentos en orden específico (porcentaje antes de fijo)',
      'Considera validación de códigos promocionales'
    ],
    solutionEn: '```typescript\ninterface Discount {\n  apply(price: number): number;\n}\n\nclass PercentageDiscount implements Discount {\n  constructor(private percent: number) {}\n  apply(price: number): number {\n    return price * (1 - this.percent / 100);\n  }\n}\n\nclass FixedDiscount implements Discount {\n  constructor(private amount: number) {}\n  apply(price: number): number {\n    return Math.max(0, price - this.amount);\n  }\n}\n\nclass PriceCalculator {\n  private discounts: Discount[] = [];\n\n  addDiscount(discount: Discount) {\n    this.discounts.push(discount);\n  }\n\n  calculate(itemPrice: number, quantity: number, promoCode?: string): number {\n    let price = itemPrice * quantity;\n    \n    for (const discount of this.discounts) {\n      price = discount.apply(price);\n    }\n\n    if (promoCode) {\n      price = this.applyPromoCode(price, promoCode);\n    }\n\n    return Math.round(price * 100) / 100;\n  }\n}\n```',
    solutionEs: '```typescript\ninterface Discount {\n  apply(price: number): number;\n}\n\nclass PercentageDiscount implements Discount {\n  constructor(private percent: number) {}\n  apply(price: number): number {\n    return price * (1 - this.percent / 100);\n  }\n}\n\nclass PriceCalculator {\n  private discounts: Discount[] = [];\n\n  addDiscount(discount: Discount) {\n    this.discounts.push(discount);\n  }\n\n  calculate(itemPrice: number, quantity: number, promoCode?: string): number {\n    let price = itemPrice * quantity;\n    \n    for (const discount of this.discounts) {\n      price = discount.apply(price);\n    }\n\n    return Math.round(price * 100) / 100;\n  }\n}\n```',
  },

  {
    id: 'hb-1',
    slug: 'hermit-bar',
    titleEn: 'Implement i18n Translation System',
    titleEs: 'Implementar Sistema de Traducción i18n',
    descriptionEn: 'Implement a translation system that supports pluralization, interpolation, and nested keys. Handle missing translations gracefully.',
    descriptionEs: 'Implementa un sistema de traducciones que soporte pluralización, interpolación y claves anidadas. Maneja traducciones faltantes gracefully.',
    difficulty: 'advanced',
    type: 'coding',
    points: 50,
    language: 'typescript',
    hintsEn: [
      'Use nested object structure for translation keys',
      'Handle plural forms with count parameter',
      'Return key as fallback for missing translations'
    ],
    hintsEs: [
      'Usa estructura de objetos anidados para claves',
      'Maneja formas plurales con parámetro de conteo',
      'Retorna clave como fallback para traducciones faltantes'
    ],
    solutionEn: '```typescript\ntype TranslationData = Record<string, any>;\n\nfunction t(key: string, params?: Record<string, string | number>, count?: number): string {\n  const keys = key.split(\'.\');\n  let value: any = translations;\n  \n  for (const k of keys) {\n    value = value?.[k];\n  }\n  \n  if (typeof value !== \'string\') {\n    return key;\n  }\n  \n  if (count !== undefined) {\n    const pluralKey = count === 1 ? \'one\' : \'other\';\n    value = value[pluralKey] || value.other || value;\n  }\n  \n  if (params) {\n    Object.entries(params).forEach(([k, v]) => {\n      value = value.replace(new RegExp(`{{${k}}}`, \'g\'), String(v));\n    });\n  }\n  \n  return value;\n}\n```',
    solutionEs: '```typescript\ntype TranslationData = Record<string, any>;\n\nfunction t(key: string, params?: Record<string, string | number>, count?: number): string {\n  const keys = key.split(\'.\');\n  let value: any = translations;\n  \n  for (const k of keys) {\n    value = value?.[k];\n  }\n  \n  if (typeof value !== \'string\') {\n    return key;\n  }\n  \n  if (count !== undefined) {\n    const pluralKey = count === 1 ? \'one\' : \'other\';\n    value = value[pluralKey] || value.other || value;\n  }\n  \n  if (params) {\n    Object.entries(params).forEach(([k, v]) => {\n      value = value.replace(new RegExp(`{{${k}}}`, \'g\'), String(v));\n    });\n  }\n  \n  return value;\n}\n```',
  },
  {
    id: 'hb-2',
    slug: 'hermit-bar',
    titleEn: 'SEO Meta Tags Generator',
    titleEs: 'Generador de Meta Tags SEO',
    descriptionEn: 'Create a function that generates dynamic SEO meta tags including title, description, Open Graph, and Twitter cards based on page content.',
    descriptionEs: 'Crea una función que genere meta tags SEO dinámicos incluyendo título, descripción, Open Graph y Twitter cards basado en el contenido de la página.',
    difficulty: 'intermediate',
    type: 'coding',
    points: 30,
    language: 'typescript',
    hintsEn: [
      'Include og:title, og:description, og:image, og:url',
      'Add Twitter card meta tags',
      'Make image URL absolute'
    ],
    hintsEs: [
      'Incluye og:title, og:description, og:image, og:url',
      'Agrega meta tags de Twitter card',
      'Haz la URL de imagen absoluta'
    ],
    solutionEn: '```typescript\ninterface SEOMeta {\n  title: string;\n  description: string;\n  image?: string;\n  url?: string;\n  type?: \'website\' | \'article\';\n}\n\nfunction generateSEOMeta(meta: SEOMeta): string {\n  const siteName = \'Hermit Bar\';\n  const baseUrl = \'https://hermitbar.com\';\n  \n  return `\n    <title>${meta.title} | ${siteName}</title>\n    <meta name="description" content="${meta.description}" />\n    <meta property="og:title" content="${meta.title}" />\n    <meta property="og:description" content="${meta.description}" />\n    <meta property="og:image" content="${meta.image ? new URL(meta.image, baseUrl) : \'\'}" />\n    <meta property="og:url" content="${meta.url ? new URL(meta.url, baseUrl) : \'\'}" />\n    <meta property="og:type" content="${meta.type || \'website\'}" />\n    <meta name="twitter:card" content="summary_large_image" />\n    <meta name="twitter:title" content="${meta.title}" />\n    <meta name="twitter:description" content="${meta.description}" />\n  `.trim();\n}\n```',
    solutionEs: '```typescript\ninterface SEOMeta {\n  title: string;\n  description: string;\n  image?: string;\n  url?: string;\n  type?: \'website\' | \'article\';\n}\n\nfunction generateSEOMeta(meta: SEOMeta): string {\n  const siteName = \'Hermit Bar\';\n  const baseUrl = \'https://hermitbar.com\';\n  \n  return `\n    <title>${meta.title} | ${siteName}</title>\n    <meta name="description" content="${meta.description}" />\n    <meta property="og:title" content="${meta.title}" />\n    <meta property="og:description" content="${meta.description}" />\n  `.trim();\n}\n```',
  },
  {
    id: 'hb-3',
    slug: 'hermit-bar',
    titleEn: 'Animation Performance Optimization',
    titleEs: 'Optimización de Rendimiento de Animaciones',
    descriptionEn: 'How would you optimize animations on a website to ensure 60fps? Discuss CSS vs JavaScript animations and when to use each.',
    descriptionEs: '¿Cómo optimizarías las animaciones en un sitio web para asegurar 60fps? Discute animaciones CSS vs JavaScript y cuándo usar cada una.',
    difficulty: 'advanced',
    type: 'conceptual',
    points: 50,
    hintsEn: [
      'Use transform and opacity for compositor-only animations',
      'Avoid animating layout-triggering properties',
      'Use will-change sparingly'
    ],
    hintsEs: [
      'Usa transform y opacity para animaciones solo de compositor',
      'Evita animar propiedades que disparen layout',
      'Usa will-change con moderación'
    ],
    solutionEn: '**Animation Performance**\n\n**CSS Animations (Use when)**:\n- Simple state changes (hover, focus)\n- Known duration and easing\n- Offloaded to compositor thread (transform, opacity)\n\n**JavaScript Animations (Use when)**:\n- Complex sequencing\n- Physics-based motion\n- Need precise control\n\n**Optimization Techniques**:\n1. **Compositor-only**: Animate only `transform` and `opacity`\n2. **Avoid layout thrashing**: Don\'t animate `width`, `height`, `top`, `left`\n3. **`will-change`**: Hint browser before animation starts\n4. **Debounce scroll handlers** for scroll-linked animations\n5. **Use `requestAnimationFrame`** for JS animations\n\n**Rule of thumb**: Target 60fps = 16.67ms per frame.',
    solutionEs: '**Rendimiento de Animaciones**\n\n**Animaciones CSS (Usar cuando)**:\n- Cambios de estado simples (hover, focus)\n- Duración y easing conocidos\n- Offloaded a thread del compositor (transform, opacity)\n\n**Animaciones JavaScript (Usar cuando)**:\n- Secuenciación compleja\n- Movimiento basado en física\n\n**Técnicas**:\n1. Solo animar `transform` y `opacity`\n2. Evitar propiedades que disparen layout\n3. Usar `will-change` con moderación',
  },

  {
    id: 'rh-1',
    slug: 'react-hooks',
    titleEn: 'useState vs useReducer',
    titleEs: 'useState vs useReducer',
    descriptionEn: 'Explain when you would use useReducer over useState. Provide a concrete example where useReducer is clearly superior.',
    descriptionEs: 'Explica cuándo usarías useReducer en lugar de useState. Proporciona un ejemplo concreto donde useReducer es claramente superior.',
    difficulty: 'intermediate',
    type: 'conceptual',
    points: 30,
    hintsEn: [
      'useReducer is better for complex state logic',
      'Consider when state transitions are interdependent',
      'useReducer can avoid prop drilling'
    ],
    hintsEs: [
      'useReducer es mejor para lógica de estado compleja',
      'Considera cuando las transiciones de estado son interdependientes',
      'useReducer puede evitar prop drilling'
    ],
    solutionEn: '**When to use useReducer**:\n\n1. **Complex state logic**: When state updates depend on previous state or multiple sub-values\n\n2. **Interdependent state**: When changing one state value affects others\n\n3. **Complex transitions**: When state changes follow patterns/rules\n\n**Example: Form Validation**\n```tsx\nconst formReducer = (state, action) => {\n  switch (action.type) {\n    case \'SET_FIELD\':\n      return { ...state, [action.field]: action.value, errors: { ...state.errors, [action.field]: null } };\n    case \'VALIDATE\':\n      return { ...state, errors: validate(state.values) };\n    case \'SUBMIT\':\n      return { ...state, isSubmitting: true };\n    case \'SUCCESS\':\n      return { ...state, isSubmitting: false, isSubmitted: true };\n    default:\n      return state;\n  }\n};\n```\n\n**vs useState**: Would require multiple setState calls, harder to test, error-prone.',
    solutionEs: '**Cuándo usar useReducer**:\n\n1. **Lógica de estado compleja**: Cuando actualizaciones dependen del estado anterior\n\n2. **Estado interdependiente**: Cuando cambiar un valor afecta otros\n\n3. **Transiciones complejas**: Cuando cambios siguen patrones',
  },
  {
    id: 'rh-2',
    slug: 'react-hooks',
    titleEn: 'Custom Hook for Data Fetching',
    titleEs: 'Custom Hook para Fetching de Datos',
    descriptionEn: 'Create a custom hook that handles data fetching with loading, error, and success states. Include caching and deduplication.',
    descriptionEs: 'Crea un custom hook que maneje fetching de datos con estados de loading, error y éxito. Incluye caching y deduplicación.',
    difficulty: 'advanced',
    type: 'coding',
    points: 50,
    language: 'typescript',
    hintsEn: [
      'Use AbortController for cleanup',
      'Consider using React Query for production',
      'Cache responses to avoid refetching'
    ],
    hintsEs: [
      'Usa AbortController para cleanup',
      'Considera usar React Query para producción',
      'Caché respuestas para evitar refetching'
    ],
    solutionEn: '```typescript\nfunction useFetch<T>(url: string) {\n  const [data, setData] = useState<T | null>(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<Error | null>(null);\n\n  useEffect(() => {\n    const controller = new AbortController();\n    \n    setLoading(true);\n    fetch(url, { signal: controller.signal })\n      .then(res => {\n        if (!res.ok) throw new Error(res.statusText);\n        return res.json();\n      })\n      .then(setData)\n      .catch(err => {\n        if (err.name !== \'AbortError\') setError(err);\n      })\n      .finally(() => setLoading(false));\n\n    return () => controller.abort();\n  }, [url]);\n\n  return { data, loading, error };\n}\n```\n\n**For production**, prefer React Query which handles caching, deduplication, and background refetching.',
    solutionEs: '```typescript\nfunction useFetch<T>(url: string) {\n  const [data, setData] = useState<T | null>(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<Error | null>(null);\n\n  useEffect(() => {\n    const controller = new AbortController();\n    \n    fetch(url, { signal: controller.signal })\n      .then(res => res.json())\n      .then(setData)\n      .catch(err => {\n        if (err.name !== \'AbortError\') setError(err);\n      })\n      .finally(() => setLoading(false));\n\n    return () => controller.abort();\n  }, [url]);\n\n  return { data, loading, error };\n}\n```',
  },
  {
    id: 'rh-3',
    slug: 'react-hooks',
    titleEn: 'useEffect Cleanup Function',
    titleEs: 'Función de Cleanup en useEffect',
    descriptionEn: 'Why is it important to return a cleanup function from useEffect? Give examples of what needs cleanup and what happens without it.',
    descriptionEs: '¿Por qué es importante retornar una función de cleanup de useEffect? Da ejemplos de qué necesita cleanup y qué pasa sin él.',
    difficulty: 'intermediate',
    type: 'conceptual',
    points: 30,
    hintsEn: [
      'Memory leaks are a common issue without cleanup',
      'Subscriptions, timers, and event listeners need cleanup',
      'Cleanup runs before the next effect or unmount'
    ],
    hintsEs: [
      'Memory leaks son un problema común sin cleanup',
      'Suscripciones, timers y event listeners necesitan cleanup',
      'Cleanup corre antes del siguiente effect o unmount'
    ],
    solutionEn: '**Why Cleanup is Important**\n\n1. **Prevent Memory Leaks**: Components unmounting while async operations pending\n\n2. **Cancel Subscriptions**: WebSockets, event listeners, timers\n\n3. **Avoid Stale Closures**: Cleanup ensures fresh values in effects\n\n**Examples needing cleanup:**\n```tsx\n// Timer\nuseEffect(() => {\n  const id = setInterval(() => tick(), 1000);\n  return () => clearInterval(id);\n}, []);\n\n// Event Listener\nuseEffect(() => {\n  const handler = () => setWidth(window.innerWidth);\n  window.addEventListener(\'resize\', handler);\n  return () => window.removeEventListener(\'resize\', handler);\n}, []);\n\n// Subscription\nuseEffect(() => {\n  const sub = api.subscribe(handler);\n  return () => sub.unsubscribe();\n}, []);\n```\n\n**Without cleanup**: Memory leaks, stale state, duplicate subscriptions, Timer buildup.',
    solutionEs: '**Por qué el Cleanup es Importante**\n\n1. **Prevenir Memory Leaks**: Componentes desmontándose mientras operaciones async pending\n\n2. **Cancelar Suscripciones**: WebSockets, event listeners, timers\n\n3. **Evitar Stale Closures**: Cleanup asegura valores frescos en effects',
  },

  {
    id: 'nx-1',
    slug: 'nextjs',
    titleEn: 'Server Components vs Client Components',
    titleEs: 'Server Components vs Client Components',
    descriptionEn: 'Explain the difference between Server and Client Components in Next.js. When would you choose one over the other?',
    descriptionEs: 'Explica la diferencia entre Server y Client Components en Next.js. ¿Cuándo elegirías uno sobre el otro?',
    difficulty: 'intermediate',
    type: 'conceptual',
    points: 30,
    hintsEn: [
      'Server Components run only on the server',
      'Client Components use JavaScript on the client',
      'Use "use client" directive for Client Components'
    ],
    hintsEs: [
      'Server Components corren solo en el servidor',
      'Client Components usan JavaScript en el cliente',
      'Usa la directiva "use client" para Client Components'
    ],
    solutionEn: '**Server Components**\n- Run only on the server\n- Can access databases, file system directly\n- Reduce client-side JavaScript bundle\n- Can\'t use hooks or browser APIs\n- Default in Next.js App Router\n\n**Client Components**\n- Ship JavaScript to the client\n- Can use hooks, state, effects\n- Interactive UI (onClick, useState)\n- Add to bundle size\n- Use "use client" directive\n\n**Decision Tree**:\n1. Need interactivity? → Client Component\n2. Need hooks? → Client Component\n3. Only display data? → Server Component\n4. Access backend directly? → Server Component',
    solutionEs: '**Server Components**\n- Corren solo en el servidor\n- Pueden acceder a bases de datos, sistema de archivos\n- Reducen el bundle de JavaScript del cliente\n- No pueden usar hooks o APIs del navegador\n\n**Client Components**\n- Envían JavaScript al cliente\n- Pueden usar hooks, estado, effects\n- UI interactiva (onClick, useState)',
  },
  {
    id: 'nx-2',
    slug: 'nextjs',
    titleEn: 'Implement Server Action',
    titleEs: 'Implementar Server Action',
    descriptionEn: 'Create a Server Action that handles form submission with validation, updates a database, and returns proper errors.',
    descriptionEs: 'Crea una Server Action que maneje submission de formulario con validación, actualice una base de datos, y retorne errores apropiados.',
    difficulty: 'advanced',
    type: 'coding',
    points: 50,
    language: 'typescript',
    hintsEn: [
      'Use "use server" directive',
      'Return serialized data or errors',
      'Validate on both client and server'
    ],
    hintsEs: [
      'Usa la directiva "use server"',
      'Retorna datos serializados o errores',
      'Valida en cliente y servidor'
    ],
    solutionEn: '```typescript\n// app/actions.ts\n\'use server\'\n\nimport { z } from \'zod\'\n\nconst schema = z.object({\n  email: z.string().email(),\n  name: z.string().min(2),\n})\n\nexport async function submitForm(prevState: any, formData: FormData) {\n  const data = {\n    email: formData.get(\'email\'),\n    name: formData.get(\'name\'),\n  }\n\n  const result = schema.safeParse(data);\n  \n  if (!result.success) {\n    return { \n      errors: result.error.flatten().fieldErrors,\n      message: \'Validation failed\' \n    };\n  }\n\n  try {\n    await db.create({\n      email: result.data.email,\n      name: result.data.name,\n    });\n    return { message: \'Success!\' };\n  } catch (error) {\n    return { \n      message: \'Database error\',\n      errors: { email: [\'Failed to save\'] }\n    };\n  }\n}\n```',
    solutionEs: '```typescript\n// app/actions.ts\n\'use server\'\n\nconst schema = z.object({\n  email: z.string().email(),\n  name: z.string().min(2),\n})\n\nexport async function submitForm(formData: FormData) {\n  const data = {\n    email: formData.get(\'email\'),\n    name: formData.get(\'name\'),\n  }\n\n  const result = schema.safeParse(data);\n  \n  if (!result.success) {\n    return { errors: result.error.flatten().fieldErrors };\n  }\n\n  return { message: \'Success!\' };\n}\n```',
  },
  {
    id: 'nx-3',
    slug: 'nextjs',
    titleEn: 'Static Generation vs SSR',
    titleEs: 'Static Generation vs SSR',
    descriptionEn: 'What is the difference between getStaticProps and getServerSideProps? When would you use each?',
    descriptionEs: '¿Cuál es la diferencia entre getStaticProps y getServerSideProps? ¿Cuándo usarías cada uno?',
    difficulty: 'intermediate',
    type: 'conceptual',
    points: 30,
    hintsEn: [
      'getStaticProps builds at build time',
      'getServerSideProps runs on every request',
      'ISR combines both approaches'
    ],
    hintsEs: [
      'getStaticProps construye al momento de build',
      'getServerSideProps corre en cada request',
      'ISR combina ambos enfoques'
    ],
    solutionEn: '**getStaticProps**\n- Runs at build time\n- Pages are pre-rendered and cached\n- Data is static until next build/revalidation\n- Great for blog posts, product pages\n- Use revalidate for ISR\n\n**getServerSideProps**\n- Runs on every request\n- Always fresh data\n- Higher server load\n- Use for personalized content, auth-dependent data\n\n**ISR (Incremental Static Regeneration)**\n- Static by default\n- Revalidate in background\n- Best of both worlds\n\n```tsx\nexport async function getStaticProps() {\n  const data = await fetchData();\n  return { props: { data }, revalidate: 60 };\n}\n```',
    solutionEs: '**getStaticProps**\n- Corre al momento de build\n- Páginas pre-renderizadas y cacheadas\n- Genial para blog posts, páginas de productos\n\n**getServerSideProps**\n- Corre en cada request\n- Siempre datos frescos\n- Mayor carga en servidor',
  },

  {
    id: 'db-1',
    slug: 'database-prisma',
    titleEn: 'Design Database Schema',
    titleEs: 'Diseñar Schema de Base de Datos',
    descriptionEn: 'Design a database schema for a multi-tenant SaaS application where each tenant has their own data isolation.',
    descriptionEs: 'Diseña un schema de base de datos para una aplicación SaaS multi-tenant donde cada tenant tiene su propio aislamiento de datos.',
    difficulty: 'senior',
    type: 'conceptual',
    points: 100,
    hintsEn: [
      'Consider row-level security for tenant isolation',
      'Shared schema vs separate schemas',
      'Index design for tenant queries'
    ],
    hintsEs: [
      'Considera row-level security para aislamiento de tenant',
      'Schema compartido vs schemas separados',
      'Diseño de índices para queries por tenant'
    ],
    solutionEn: '**Multi-Tenant Schema Design**\n\n**Option 1: Shared Schema (Recommended for most)**\n```sql\nCREATE TABLE users (\n  id UUID PRIMARY KEY,\n  tenant_id UUID NOT NULL,\n  email VARCHAR NOT NULL,\n  ...\n);\n\nCREATE INDEX idx_users_tenant ON users(tenant_id);\n```\n\n**Option 2: Separate Schemas** (for strict isolation)\n- One schema per tenant\n- Better isolation but harder to manage\n\n**Row Level Security (RLS)**:\n```sql\nALTER TABLE users ENABLE ROW LEVEL SECURITY;\nCREATE POLICY tenant_isolation ON users\n  USING (tenant_id = current_setting(\'app.tenant_id\'));\n```\n\n**Key Considerations**:\n1. Always index tenant_id\n2. Use UUID for tenant_id to prevent enumeration\n3. Set tenant context at connection level',
    solutionEs: '**Diseño Multi-Tenant**\n\n**Opción 1: Schema Compartido**\n```sql\nCREATE TABLE users (\n  id UUID PRIMARY KEY,\n  tenant_id UUID NOT NULL,\n  email VARCHAR NOT NULL,\n  ...\n);\n```\n\n**Row Level Security**:\n```sql\nALTER TABLE users ENABLE ROW LEVEL SECURITY;\n```',
  },
  {
    id: 'db-2',
    slug: 'database-prisma',
    titleEn: 'Prisma Include vs Join',
    titleEs: 'Prisma Include vs Join',
    descriptionEn: 'Explain the difference between using include and manually joining in Prisma. When would you choose one over the other?',
    descriptionEs: 'Explica la diferencia entre usar include y hacer join manualmente en Prisma. ¿Cuándo elegirías uno sobre el otro?',
    difficulty: 'intermediate',
    type: 'conceptual',
    points: 30,
    hintsEn: [
      'include uses separate queries under the hood',
      'Use select for specific fields',
      'Nested include for relations of relations'
    ],
    hintsEs: [
      'include usa queries separadas internamente',
      'Usa select para campos específicos',
      'Nested include para relaciones de relaciones'
    ],
    solutionEn: `**Prisma Include vs Manual Join**\n\n**Using Include**:\n\`\`\`tsx\nconst users = await prisma.user.findMany({\n  include: {\n    posts: true,\n    profile: true,\n  },\n});\n\`\`\`\n- Uses separate queries (N+1 safe)\n- Returns nested structure\n- Easy to use, less control\n\n**Manual Join**:\n\`\`\`tsx\nconst users = await prisma.$queryRaw\`\n  SELECT u.*, p.* FROM users u\n  LEFT JOIN posts p ON u.id = p.user_id\n\`;\n\`\`\`\n- Single query, better performance for large datasets\n- Returns flat structure, need to group manually\n- More control over SQL\n\n**When to use each**:\n- Small/medium datasets: include\n- Large datasets, need aggregation: manual join\n- Need specific SQL features: manual join`,
    solutionEs: '**Prisma Include vs Join Manual**\n\n**Usando Include**:\n```tsx\nconst users = await prisma.user.findMany({\n  include: { posts: true },\n});\n```\n- Usa queries separadas (seguro contra N+1)\n\n**Join Manual**:\n- Query única, mejor rendimiento\n- Más control sobre SQL',
  },
  {
    id: 'db-3',
    slug: 'database-prisma',
    titleEn: 'Transaction with Rollback',
    titleEs: 'Transacción con Rollback',
    descriptionEn: 'How do you implement a transaction with rollback in Prisma when one of the operations fails?',
    descriptionEs: '¿Cómo implementas una transacción con rollback en Prisma cuando una de las operaciones falla?',
    difficulty: 'advanced',
    type: 'coding',
    points: 50,
    language: 'typescript',
    hintsEn: [
      'Use prisma.$transaction',
      'All operations succeed or none do',
      'Handle errors with try-catch'
    ],
    hintsEs: [
      'Usa prisma.$transaction',
      'Todas las operaciones succeed o ninguna',
      'Maneja errores con try-catch'
    ],
    solutionEn: '```typescript\nasync function createOrderWithUser(userId: string, orderData: OrderData) {\n  try {\n    const result = await prisma.$transaction(async (tx) => {\n      const user = await tx.user.findUnique({ where: { id: userId } });\n      if (!user) throw new Error(\'User not found\');\n      \n      const order = await tx.order.create({\n        data: {\n          userId,\n          total: orderData.total,\n          items: {\n            create: orderData.items,\n          },\n        },\n      });\n\n      await tx.user.update({\n        where: { id: userId },\n        data: { orderCount: { increment: 1 } },\n      });\n\n      return order;\n    });\n\n    return { success: true, order: result };\n  } catch (error) {\n    return { success: false, error: error.message };\n  }\n}\n```',
    solutionEs: '```typescript\nasync function createOrderWithUser(userId: string, orderData: OrderData) {\n  try {\n    const result = await prisma.$transaction(async (tx) => {\n      const order = await tx.order.create({\n        data: { userId, ...orderData },\n      });\n      return order;\n    });\n    return { success: true, order: result };\n  } catch (error) {\n    return { success: false, error: error.message };\n  }\n}\n```',
  },

  {
    id: 'sec-1',
    slug: 'security-auth',
    titleEn: 'JWT vs Session Authentication',
    titleEs: 'JWT vs Autenticación por Sessión',
    descriptionEn: 'Compare JWT and session-based authentication. What are the trade-offs and when would you choose each?',
    descriptionEs: 'Compara autenticación JWT y basada en sesiones. ¿Cuáles son los trade-offs y cuándo elegirías cada una?',
    difficulty: 'intermediate',
    type: 'conceptual',
    points: 30,
    hintsEn: [
      'JWT is stateless, sessions are stateful',
      'JWT can be vulnerable to XSS, sessions to CSRF',
      'Consider token revocation complexity'
    ],
    hintsEs: [
      'JWT es stateless, sesiones son stateful',
      'JWT puede ser vulnerable a XSS, sesiones a CSRF',
      'Considera complejidad de revocación de tokens'
    ],
    solutionEn: '**JWT Authentication**\n- Stateless, self-contained token\n- Token stored client-side (localStorage/cookies)\n- Scalable (no server-side state)\n- Harder to revoke (need blocklist)\n- Vulnerable to XSS if in localStorage\n\n**Session Authentication**\n- Stateful, session stored server-side (Redis/DB)\n- Session ID in HTTP-only cookie\n- Easy to revoke\n- CSRF vulnerability (mitigate with tokens)\n- Less scalable (session storage needed)\n\n**When to use JWT**:\n- Microservices architecture\n- Mobile apps\n- Need stateless API\n\n**When to use Sessions**:\n- Traditional web apps\n- Need instant revocation\n- Sensitive applications',
    solutionEs: '**Autenticación JWT**\n- Stateless, token autocontenido\n- Almacenado client-side\n- Escalable\n- Más difícil de revocar\n\n**Autenticación por Sessión**\n- Stateful, sessión en servidor\n- Session ID en cookie HTTP-only\n- Fácil de revocar',
  },
  {
    id: 'sec-2',
    slug: 'security-auth',
    titleEn: 'Implement Password Reset Flow',
    titleEs: 'Implementar Flujo de Reset de Contraseña',
    descriptionEn: 'Design a secure password reset flow including token generation, expiration, and rate limiting.',
    descriptionEs: 'Diseña un flujo seguro de reset de contraseña incluyendo generación de token, expiración, y rate limiting.',
    difficulty: 'advanced',
    type: 'conceptual',
    points: 50,
    hintsEn: [
      'Use cryptographically secure random tokens',
      'Token should expire (15-30 minutes)',
      'One-time use only'
    ],
    hintsEs: [
      'Usa tokens aleatorios criptográficamente seguros',
      'Token debe expirar (15-30 minutos)',
      'Uso único'
    ],
    solutionEn: '**Password Reset Flow**\n\n1. **Request Reset**:\n   - Validate email exists\n   - Generate secure random token (32+ bytes)\n   - Store hash in DB with expiration\n   - Send email with reset link\n   - Rate limit (3 requests per hour)\n\n2. **Token Structure**:\n```sql\npassword_resets (\n  email,\n  token_hash,\n  expires_at,\n  used_at\n)\n```\n\n3. **Reset Password**:\n   - Verify token hash and not expired\n   - Verify not already used\n   - Update password (hash with Argon2)\n   - Mark token as used\n   - Invalidate all existing sessions\n\n4. **Security Measures**:\n   - Token in URL is short-lived\n   - Email token, not user ID\n   - Hash token before storage\n   - Log all reset attempts',
    solutionEs: '**Flujo de Reset de Contraseña**\n\n1. **Request Reset**:\n   - Validar email existe\n   - Generar token aleatorio seguro\n   - Almacenar hash en DB con expiración\n   - Enviar email con link de reset\n\n2. **Reset Password**:\n   - Verificar token y no expirado\n   - Actualizar contraseña\n   - Marcar token como usado',
  },
  {
    id: 'sec-3',
    slug: 'security-auth',
    titleEn: 'OAuth 2.0 Flow Explanation',
    titleEs: 'Explicación del Flujo OAuth 2.0',
    descriptionEn: 'Explain the OAuth 2.0 authorization code flow. What is the purpose of each step?',
    descriptionEs: 'Explica el flujo de authorization code de OAuth 2.0. ¿Cuál es el propósito de cada paso?',
    difficulty: 'intermediate',
    type: 'conceptual',
    points: 30,
    hintsEn: [
      'Authorization code is more secure than implicit',
      'Redirect URI must be registered',
      'Tokens never exposed to browser'
    ],
    hintsEs: [
      'Authorization code es más seguro que implicit',
      'Redirect URI debe estar registrado',
      'Tokens nunca expuestos al navegador'
    ],
    solutionEn: '**OAuth 2.0 Authorization Code Flow**\n\n1. **User clicks "Login with Google"**\n   - App redirects to Google with client_id, scope, redirect_uri, state\n\n2. **User authenticates with Google**\n   - Google shows login form if not logged in\n   - Asks user to authorize the requested permissions\n\n3. **Google redirects back with code**\n   - URL: redirect_uri?code=AUTH_CODE&state=STATE\n   - Code is short-lived (minutes)\n   - State prevents CSRF\n\n4. **App exchanges code for tokens**\n   - Server-to-server request\n   - Sends code + client_secret\n   - Receives access_token, refresh_token, id_token\n\n5. **App uses access_token**\n   - Fetches user info from Google API\n   - Creates/updates local user session\n\n**Why not implicit flow?**:\n- Tokens in URL can leak\n- No refresh tokens\n- Susceptible to intercept attacks',
    solutionEs: '**Flujo OAuth 2.0 Authorization Code**\n\n1. Usuario hace clic en "Login with Google"\n2. Usuario autentica con Google\n3. Google redirige con authorization code\n4. App intercambia code por tokens (servidor a servidor)\n5. App usa access_token para obtener datos del usuario',
  },

  {
    id: 'rt-1',
    slug: 'realtime-systems',
    titleEn: 'WebSocket vs Server-Sent Events',
    titleEs: 'WebSocket vs Server-Sent Events',
    descriptionEn: 'Compare WebSocket and Server-Sent Events (SSE) for real-time communication. When would you choose each?',
    descriptionEs: 'Compara WebSocket y Server-Sent Events (SSE) para comunicación en tiempo real. ¿Cuándo elegirías cada uno?',
    difficulty: 'intermediate',
    type: 'conceptual',
    points: 30,
    hintsEn: [
      'SSE is unidirectional, WebSocket is bidirectional',
      'SSE works over HTTP/2, WebSocket is its own protocol',
      'SSE automatic reconnection, WebSocket needs manual'
    ],
    hintsEs: [
      'SSE es unidireccional, WebSocket es bidireccional',
      'SSE trabaja sobre HTTP/2, WebSocket es su propio protocolo',
      'SSE tiene reconexión automática, WebSocket necesita manual'
    ],
    solutionEn: '**WebSocket**\n- Bidirectional communication\n- Single TCP connection for full-duplex\n- Works with any protocol\n- Requires manual reconnection logic\n- Good for: chat, gaming, collaborative tools\n\n**Server-Sent Events (SSE)**\n- Unidirectional (server → client only)\n- Built on HTTP/2\n- Automatic reconnection\n- Simple implementation\n- Good for: notifications, feeds, progress updates\n\n**Decision**:\n- Need client → server messages? → WebSocket\n- Server → client only? → SSE\n- Behind strict proxies? → SSE (HTTP-based)\n- Low latency gaming? → WebSocket',
    solutionEs: '**WebSocket**\n- Comunicación bidireccional\n- Conexión TCP única full-duplex\n- Bueno para: chat, gaming\n\n**SSE**\n- Unidireccional (servidor → cliente)\n- Basado en HTTP/2\n- Reconexión automática\n- Bueno para: notificaciones, feeds',
  },
  {
    id: 'rt-2',
    slug: 'realtime-systems',
    titleEn: 'Socket.io Room Management',
    titleEs: 'Gestión de Rooms en Socket.io',
    descriptionEn: 'Implement a Socket.io room system where users can join/leave rooms and receive messages only from their current room.',
    descriptionEs: 'Implementa un sistema de rooms en Socket.io donde usuarios pueden unirse/salir de rooms y recibir mensajes solo de su room actual.',
    difficulty: 'advanced',
    type: 'coding',
    points: 50,
    language: 'typescript',
    hintsEn: [
      'Use socket.join() and socket.leave()',
      'Emit to room with io.to(room).emit()',
      'Handle disconnect and cleanup'
    ],
    hintsEs: [
      'Usa socket.join() y socket.leave()',
      'Emite a room con io.to(room).emit()',
      'Maneja desconexión y cleanup'
    ],
    solutionEn: '```typescript\nimport { Server } from \'socket.io\';\n\nconst io = new Server(3000);\n\nio.on(\'connection\', (socket) => {\n  console.log(\'User connected:\', socket.id);\n\n  socket.on(\'join_room\', (roomId: string) => {\n    socket.join(roomId);\n    socket.to(roomId).emit(\'user_joined\', {\n      userId: socket.id,\n      roomId,\n    });\n  });\n\n  socket.on(\'leave_room\', (roomId: string) => {\n    socket.leave(roomId);\n    socket.to(roomId).emit(\'user_left\', {\n      userId: socket.id,\n      roomId,\n    });\n  });\n\n  socket.on(\'message\', (data: { roomId: string; message: string }) => {\n    io.to(data.roomId).emit(\'message\', {\n      userId: socket.id,\n      message: data.message,\n      timestamp: Date.now(),\n    });\n  });\n\n  socket.on(\'disconnect\', () => {\n    console.log(\'User disconnected:\', socket.id);\n  });\n});\n```',
    solutionEs: '```typescript\nimport { Server } from \'socket.io\';\n\nconst io = new Server(3000);\n\nio.on(\'connection\', (socket) => {\n  socket.on(\'join_room\', (roomId) => {\n    socket.join(roomId);\n    socket.to(roomId).emit(\'user_joined\', socket.id);\n  });\n\n  socket.on(\'message\', (data) => {\n    io.to(data.roomId).emit(\'message\', data.message);\n  });\n});\n```',
  },
  {
    id: 'rt-3',
    slug: 'realtime-systems',
    titleEn: 'Handle WebSocket Disconnection',
    titleEs: 'Manejar Desconexión de WebSocket',
    descriptionEn: 'Design a strategy for handling WebSocket disconnections gracefully, including reconnection, state recovery, and missed message handling.',
    descriptionEs: 'Diseña una estrategia para manejar desconexiones de WebSocket gracefully, incluyendo reconexión, recuperación de estado, y manejo de mensajes perdidos.',
    difficulty: 'senior',
    type: 'conceptual',
    points: 100,
    hintsEn: [
      'Exponential backoff for reconnection',
      'Sync missed messages on reconnect',
      'Heartbeat to detect dead connections'
    ],
    hintsEs: [
      'Backoff exponencial para reconexión',
      'Sync mensajes perdidos al reconectar',
      'Heartbeat para detectar conexiones muertas'
    ],
    solutionEn: `**WebSocket Disconnection Strategy**\n\n1. **Detection**:\n   - Heartbeat/ping-pong every 30 seconds\n   - WebSocket close event\n   - Browser offline event\n\n2. **Reconnection**:\n\`\`\`typescript\nconst RECONNECT_DELAYS = [1000, 2000, 4000, 8000, 16000, 30000];\n\nfunction reconnect() {\n  const delay = RECONNECT_DELAYS[attempt] || 30000;\n  setTimeout(connect, delay);\n}\n\`\`\`\n\n3. **State Recovery**:\n   - Store last event ID received\n   - On reconnect, request missed events from server\n   - Server maintains event log with IDs\n\n4. **Optimistic UI**:\n   - Show "reconnecting" indicator\n   - Queue messages while disconnected\n   - Replay queue on reconnect\n\n5. **Cleanup**:\n   - Unsubscribe from all rooms\n   - Clear local state\n   - Cancel pending requests`,
    solutionEs: '**Estrategia de Desconexión**\n\n1. **Detección**: Heartbeat/ping-pong\n2. **Reconexión**: Backoff exponencial\n3. **Recuperación**: Solicitar eventos perdidos al reconectar',
  },

  {
    id: 'sm-1',
    slug: 'state-management',
    titleEn: 'Zustand vs Context API',
    titleEs: 'Zustand vs Context API',
    descriptionEn: 'Compare Zustand and React Context for state management. When would you choose each?',
    descriptionEs: 'Compara Zustand y React Context para gestión de estado. ¿Cuándo elegirías cada uno?',
    difficulty: 'intermediate',
    type: 'conceptual',
    points: 30,
    hintsEn: [
      'Context causes re-renders on any change',
      'Zustand has minimal re-renders by default',
      'Consider bundle size difference'
    ],
    hintsEs: [
      'Context causa re-renders en cualquier cambio',
      'Zustand tiene re-renders mínimos por defecto',
      'Considera diferencia de tamaño de bundle'
    ],
    solutionEn: '**Context API**\n- Built into React\n- Simple API\n- Triggers re-render on ANY value change\n- Good for truly global, rarely changing data (theme, auth)\n- No boilerplate\n\n**Zustand**\n- Minimal re-renders (only subscribed components)\n- Built-in devtools\n- Middleware support (persist, devtools)\n- Smaller bundle than Redux\n- Better for complex or frequently changing state\n\n**When Context**:\n- Theme, locale, auth state\n- Data rarely updates\n- Simpler apps\n\n**When Zustand**:\n- Complex state logic\n- Frequently updating state\n- Need for devtools/debugging\n- Performance-critical apps',
    solutionEs: '**Context API**\n- Incluido en React\n- Simple API\n- Trigged re-render en CUALQUIER cambio\n- Bueno para datos globales que rara vez cambian\n\n**Zustand**\n- Re-renders mínimos (solo componentes suscritos)\n- Devtools integrado\n- Mejor para estado complejo o frecuentemente actualizado',
  },
  {
    id: 'sm-2',
    slug: 'state-management',
    titleEn: 'Optimistic Updates Pattern',
    titleEs: 'Patrón de Actualizaciones Optimistas',
    descriptionEn: 'Implement an optimistic update pattern with rollback for a todo list where items can be marked complete.',
    descriptionEs: 'Implementa un patrón de actualización optimista con rollback para una lista de todos donde items pueden marcarse como completos.',
    difficulty: 'advanced',
    type: 'coding',
    points: 50,
    language: 'typescript',
    hintsEn: [
      'Store previous state before update',
      'Apply update immediately',
      'Rollback on error'
    ],
    hintsEs: [
      'Guarda estado anterior antes de actualizar',
      'Aplica actualización inmediatamente',
      'Rollback en error'
    ],
    solutionEn: '```typescript\ninterface Todo {\n  id: string;\n  text: string;\n  completed: boolean;\n}\n\nconst useTodoStore = create<{\n  todos: Todo[];\n  toggleTodo: (id: string) => Promise<void>;\n}>((set, get) => ({\n  todos: [],\n\n  toggleTodo: async (id: string) => {\n    const previousTodos = get().todos;\n    \n    set({\n      todos: get().todos.map(t =>\n        t.id === id ? { ...t, completed: !t.completed } : t\n      ),\n    });\n\n    try {\n      await api.toggleTodo(id);\n    } catch (error) {\n      set({ todos: previousTodos });\n      toast.error(\'Failed to update todo\');\n    }\n  },\n}));\n```',
    solutionEs: '```typescript\nconst useTodoStore = create<{\n  todos: Todo[];\n  toggleTodo: (id: string) => Promise<void>;\n}>((set, get) => ({\n  todos: [],\n\n  toggleTodo: async (id: string) => {\n    const previousTodos = get().todos;\n    \n    set({\n      todos: get().todos.map(t =>\n        t.id === id ? { ...t, completed: !t.completed } : t\n      ),\n    });\n\n    try {\n      await api.toggleTodo(id);\n    } catch (error) {\n      set({ todos: previousTodos });\n    }\n  },\n}));\n```',
  },
  {
    id: 'sm-3',
    slug: 'state-management',
    titleEn: 'Derived/Selectors Pattern',
    titleEs: 'Patrón de Selectors/Derived State',
    descriptionEn: 'How do you handle derived/computed state in Zustand without recomputing on every render?',
    descriptionEs: '¿Cómo manejas estado derivado/computado en Zustand sin recalcular en cada render?',
    difficulty: 'advanced',
    type: 'conceptual',
    points: 50,
    hintsEn: [
      'Use shallow comparison for selectors',
      'Consider useMemo for expensive computations',
      'Zustand has built-in selector optimization'
    ],
    hintsEs: [
      'Usa comparación superficial para selectors',
      'Considera useMemo para cómputos costosos',
      'Zustand tiene optimización de selectors integrada'
    ],
    solutionEn: '**Derived State in Zustand**\n\n**1. Inline Selector** (re-renders on any change):\n```tsx\nconst { todos } = useStore();\nconst completedCount = todos.filter(t => t.completed).length;\n```\n\n**2. Shallow Selector** (re-renders only when result changes):\n```tsx\nconst completedCount = useStore(\n  state => state.todos.filter(t => t.completed).length,\n  shallow\n);\n```\n\n**3. Memoized Selector with useMemo**:\n```tsx\nconst selectCompleted = (state) => state.todos.filter(t => t.completed);\n\nconst completedTodos = useStore(selectCompleted);\nconst completedCount = useMemo(\n  () => completedTodos.length,\n  [completedTodos]\n);\n```\n\n**4. With zustand/react/shallow**:\n```tsx\nimport { shallow } from \'zustand/shallow\';\nconst { completed, total } = useStore(\n  state => ({\n    completed: state.todos.filter(t => t.completed).length,\n    total: state.todos.length,\n  }),\n  shallow\n);\n```',
    solutionEs: '**Estado Derivado en Zustand**\n\n**1. Selector Inline**:\n```tsx\nconst completedCount = useStore(\n  state => state.todos.filter(t => t.completed).length\n);\n```\n\n**2. Con shallow**:\n```tsx\nimport { shallow } from \'zustand/shallow\';\nconst count = useStore(selector, shallow);\n```',
  },

  {
    id: 'tc-1',
    slug: 'testing-cicd',
    titleEn: 'Unit vs Integration Testing',
    titleEs: 'Testing Unitario vs Integración',
    descriptionEn: 'What is the difference between unit tests and integration tests? How do you decide what to test at each level?',
    descriptionEs: '¿Cuál es la diferencia entre tests unitarios y tests de integración? ¿Cómo decides qué testear en cada nivel?',
    difficulty: 'intermediate',
    type: 'conceptual',
    points: 30,
    hintsEn: [
      'Unit tests test single functions in isolation',
      'Integration tests test multiple units together',
      'Use test pyramids principle'
    ],
    hintsEs: [
      'Tests unitarios testean funciones aisladas',
      'Tests de integración testean múltiples unidades juntas',
      'Usa el principio de pirámide de tests'
    ],
    solutionEn: '**Unit Tests**\n- Test single function/component in isolation\n- Mock all dependencies\n- Fast execution\n- Easy to pinpoint failures\n- Use for: business logic, pure functions, utilities\n\n**Integration Tests**\n- Test multiple units working together\n- Real dependencies (or highly mocked)\n- Slower execution\n- Test contracts between units\n- Use for: API routes, database operations, component interactions\n\n**Test Pyramid**:\n```\n      /\\      E2E (few)\n     /  \\\n    /    \\    Integration (some)\n   /______\\\n  /        \\  Unit (many)\n```\n\n**Decision Framework**:\n- Does it involve external systems? → Integration\n- Does it test business rules? → Unit\n- Does it test user flows? → E2E',
    solutionEs: '**Tests Unitarios**\n- Testean función/componente aislado\n- Rápidos, fáciles de debuggear\n- Para lógica de negocio\n\n**Tests de Integración**\n- Testean múltiples unidades juntas\n- Más lentos\n- Para APIs, base de datos',
  },
  {
    id: 'tc-2',
    slug: 'testing-cicd',
    titleEn: 'Test React Components',
    titleEs: 'Testear Componentes React',
    descriptionEn: 'Write tests for a React component that displays a list of items with filtering. Include testing user interactions.',
    descriptionEs: 'Escribe tests para un componente React que muestra una lista de items con filtrado. Incluye testing de interacciones de usuario.',
    difficulty: 'advanced',
    type: 'coding',
    points: 50,
    language: 'typescript',
    hintsEn: [
      'Use Testing Library',
      'Test behavior, not implementation',
      'Use userEvent for interactions'
    ],
    hintsEs: [
      'Usa Testing Library',
      'Testea comportamiento, no implementación',
      'Usa userEvent para interacciones'
    ],
    solutionEn: '```typescript\nimport { render, screen, waitFor } from \'@testing-library/react\';\nimport userEvent from \'@testing-library/user-event\';\nimport { FilterableList } from \'./FilterableList\';\n\nconst items = [\n  { id: \'1\', name: \'Apple\', category: \'fruit\' },\n  { id: \'2\', name: \'Carrot\', category: \'vegetable\' },\n  { id: \'3\', name: \'Banana\', category: \'fruit\' },\n];\n\ndescribe(\'FilterableList\', () => {\n  it(\'renders all items initially\', () => {\n    render(<FilterableList items={items} />);\n    expect(screen.getAllByRole(\'listitem\')).toHaveLength(3);\n  });\n\n  it(\'filters items when user types\', async () => {\n    const user = userEvent.setup();\n    render(<FilterableList items={items} />);\n    \n    await user.type(screen.getByRole(\'textbox\'), \'apple\');\n    \n    await waitFor(() => {\n      expect(screen.getAllByRole(\'listitem\')).toHaveLength(1);\n    });\n    expect(screen.getByText(\'Apple\')).toBeInTheDocument();\n  });\n\n  it(\'shows empty state when no matches\', async () => {\n    const user = userEvent.setup();\n    render(<FilterableList items={items} />);\n    \n    await user.type(screen.getByRole(\'textbox\'), \'xyz\');\n    \n    expect(screen.getByText(/no items/i)).toBeInTheDocument();\n  });\n});\n```',
    solutionEs: '```typescript\nimport { render, screen } from \'@testing-library/react\';\nimport userEvent from \'@testing-library/user-event\';\n\ndescribe(\'FilterableList\', () => {\n  it(\'renders items\', () => {\n    render(<FilterableList items={items} />);\n    expect(screen.getAllByRole(\'listitem\')).toHaveLength(3);\n  });\n\n  it(\'filters items\', async () => {\n    const user = userEvent.setup();\n    render(<FilterableList items={items} />);\n    await user.type(screen.getByRole(\'textbox\'), \'apple\');\n    expect(screen.getByText(\'Apple\')).toBeInTheDocument();\n  });\n});\n```',
  },
  {
    id: 'tc-3',
    slug: 'testing-cicd',
    titleEn: 'CI/CD Pipeline Design',
    titleEs: 'Diseño de Pipeline CI/CD',
    descriptionEn: 'Design a CI/CD pipeline for a React application that includes linting, testing, building, and deployment.',
    descriptionEs: 'Diseña un pipeline CI/CD para una aplicación React que incluya linting, testing, building y deployment.',
    difficulty: 'advanced',
    type: 'conceptual',
    points: 50,
    hintsEn: [
      'Use stages for sequential execution',
      'Cache node_modules for faster builds',
      'Deploy only on main branch'
    ],
    hintsEs: [
      'Usa stages para ejecución secuencial',
      'Caché node_modules para builds más rápidos',
      'Deploy solo en branch main'
    ],
    solutionEn: '**GitHub Actions CI/CD Pipeline**\n\n```yaml\nname: CI/CD\n\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\njobs:\n  lint:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: \'20\'\n          cache: \'npm\'\n      - run: npm ci\n      - run: npm run lint\n\n  test:\n    runs-on: ubuntu-latest\n    needs: lint\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: \'20\'\n          cache: \'npm\'\n      - run: npm ci\n      - run: npm run test\n      - uses: actions/upload-artifact@v4\n        if: always()\n        with:\n          name: coverage\n          path: coverage\n\n  build:\n    runs-on: ubuntu-latest\n    needs: test\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: \'20\'\n          cache: \'npm\'\n      - run: npm ci\n      - run: npm run build\n\n  deploy:\n    runs-on: ubuntu-latest\n    needs: build\n    if: github.ref == \'refs/heads/main\'\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm run deploy\n```',
    solutionEs: '**Pipeline CI/CD**\n\n1. **Lint**: Verificar código\n2. **Test**: Correr tests\n3. **Build**: Compilar aplicación\n4. **Deploy**: Desplegar a producción',
  },
]

export function getQuestionsBySlug(slug: string): Question[] {
  return mockQuestions.filter(q => q.slug === slug)
}

export function getQuestionById(id: string): Question | undefined {
  return mockQuestions.find(q => q.id === id)
}

export function getQuestionsByDifficulty(difficulty: string): Question[] {
  return mockQuestions.filter(q => q.difficulty === difficulty)
}
