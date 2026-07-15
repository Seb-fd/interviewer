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
      'Always handle errors in production code',
    ],
    hintsEs: [
      'Argon2id es parte de la librería `argon2`',
      'Usa `argon2.hash()` con opciones: { type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 4 }',
      'Siempre maneja errores en código de producción',
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
      'Both client and server prove knowledge of the shared secret',
    ],
    hintsEs: [
      'SCRAM usa un mecanismo de desafío-respuesta',
      'El servidor nunca ve la contraseña en texto plano',
      'Ambos cliente y servidor prueban conocimiento del secreto compartido',
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
      'The authentication tag ensures the ciphertext hasn\'t been tampered with',
    ],
    hintsEs: [
      'AES-256-GCM proporciona confidencialidad y autenticidad',
      'Usa un IV/nonce único para cada operación de cifrado',
      'El tag de autenticación asegura que el texto cifrado no ha sido manipulado',
    ],
    solutionEn: '```typescript\nimport crypto from \'crypto\';\n\nconst ALGORITHM = \'aes-256-gcm\';\nconst IV_LENGTH = 12;\nconst TAG_LENGTH = 16;\n\nfunction encrypt(plaintext: string, password: string): string {\n  const salt = crypto.randomBytes(16);\n  const key = crypto.scryptSync(password, salt, 32);\n  const iv = crypto.randomBytes(IV_LENGTH);\n  \n  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);\n  let encrypted = cipher.update(plaintext, \'utf8\', \'hex\');\n  encrypted += cipher.final(\'hex\');\n  const tag = cipher.getAuthTag();\n  \n  return Buffer.concat([salt, iv, tag, Buffer.from(encrypted, \'hex\')]).toString(\'base64\');\n}\n```',
    solutionEs: '```typescript\nimport crypto from \'crypto\';\n\nconst ALGORITHM = \'aes-256-gcm\';\nconst IV_LENGTH = 12;\nconst TAG_LENGTH = 16;\n\nfunction encrypt(plaintext: string, password: string): string {\n  const salt = crypto.randomBytes(16);\n  const key = crypto.scryptSync(password, salt, 32);\n  const iv = crypto.randomBytes(IV_LENGTH);\n  \n  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);\n  let encrypted = cipher.update(plaintext, \'utf8\', \'hex\');\n  encrypted += cipher.final(\'hex\');\n  const tag = cipher.getAuthTag();\n  \n  return Buffer.concat([salt, iv, tag, Buffer.from(encrypted, \'hex\')]).toString(\'base64\');\n}\n```',
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
      'The server can verify the result without knowing the original password',
    ],
    hintsEs: [
      'El servidor almacena un derivado de la contraseña, no la contraseña misma',
      'El usuario prueba conocimiento realizando un cálculo con la contraseña',
      'El servidor puede verificar el resultado sin conocer la contraseña original',
    ],
    solutionEn: '**Zero-Knowledge Password Proof (ZKPP)**\n\n1. **Setup**: User creates password P, server stores H(P) where H is a cryptographic hash\n2. **Login**: Server sends random challenge C\n3. **Response**: User computes f(P, C) and returns result\n4. **Verify**: Server computes same function with stored H(P) and verifies result\n\n**Key Insight**: The server NEVER receives P, only H(P). If the database is compromised, attackers still cannot recover P.\n\n**Alternatives**:\n- SRP (Secure Remote Password) protocol\n- Password-based Key Derivation Functions (PBKDF2, Argon2)\n- Homomorphic encryption for password comparison',
    solutionEs: '**Prueba de Contraseña de Conocimiento Cero (ZKPP)**\n\n1. **Setup**: Usuario crea contraseña P, servidor almacena H(P) donde H es un hash criptográfico\n2. **Login**: Servidor envía desafío aleatorio C\n3. **Respuesta**: Usuario calcula f(P, C) y devuelve el resultado\n4. **Verificar**: Servidor calcula la misma función con H(P) almacenado y verifica el resultado\n\n**Idea Clave**: El servidor NUNCA recibe P, solo H(P). Si la base de datos es comprometida, los atacantes aún no pueden recuperar P.',
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
      'Return appropriate HTTP status codes (429 Too Many Requests)',
    ],
    hintsEs: [
      'Usa un algoritmo de ventana deslizante para rate limiting preciso',
      'Considera usar Redis para rate limiting distribuido',
      'Devuelve códigos de estado HTTP apropiados (429 Too Many Requests)',
    ],
    solutionEn: '```typescript\nconst rateLimitStore = new Map<string, { count: number; resetTime: number }>();\nconst WINDOW_MS = 60000;\nconst MAX_REQUESTS = 5;\n\nfunction rateLimiter(req: Request): Response | null {\n  const ip = req.headers.get(\'X-Forwarded-For\') || req.ip;\n  const now = Date.now();\n  \n  const record = rateLimitStore.get(ip);\n  \n  if (!record || now > record.resetTime) {\n    rateLimitStore.set(ip, { count: 1, resetTime: now + WINDOW_MS });\n    return null;\n  }\n  \n  if (record.count >= MAX_REQUESTS) {\n    return new Response(\'Too Many Requests\', { status: 429, headers: { \'Retry-After\': String(record.resetTime - now) } });\n  }\n  \n  record.count++;\n  return null;\n}\n```',
    solutionEs: '```typescript\nconst rateLimitStore = new Map<string, { count: number; resetTime: number }>();\nconst WINDOW_MS = 60000;\nconst MAX_REQUESTS = 5;\n\nfunction rateLimiter(req: Request): Response | null {\n  const ip = req.headers.get(\'X-Forwarded-For\') || req.ip;\n  const now = Date.now();\n  \n  const record = rateLimitStore.get(ip);\n  \n  if (!record || now > record.resetTime) {\n    rateLimitStore.set(ip, { count: 1, resetTime: now + WINDOW_MS });\n    return null;\n  }\n  \n  if (record.count >= MAX_REQUESTS) {\n    return new Response(\'Too Many Requests\', { status: 429, headers: { \'Retry-After\': String(record.resetTime - now) } });\n  }\n  \n  record.count++;\n  return null;\n}\n```',
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
