import type { Question } from './questions'

export const extraPasswordManagerQuestions: Question[] = [
  {
    id: 'pm-6',
    slug: 'password-manager',
    titleEn: 'PBKDF2 Key Derivation Implementation',
    titleEs: 'Implementación de Derivación de Claves PBKDF2',
    descriptionEn: 'Implement a function to derive a 256-bit encryption key from a master password using PBKDF2-HMAC-SHA512 with at least 600,000 iterations and a unique salt per user.',
    descriptionEs: 'Implementa una función para derivar una clave de cifrado de 256 bits desde una contraseña maestra usando PBKDF2-HMAC-SHA512 con al menos 600,000 iteraciones y un salt único por usuario.',
    difficulty: 'senior',
    type: 'coding',
    points: 100,
    language: 'typescript',
    hintsEn: [
      'Use the `crypto` module: crypto.pbkdf2Sync',
      'Iteration count should be ≥ 600,000 per OWASP 2023 guidelines',
      'Salt should be at least 16 random bytes'
    ],
    hintsEs: [
      'Usa el módulo `crypto`: crypto.pbkdf2Sync',
      'El conteo de iteraciones debe ser ≥ 600,000 según OWASP 2023',
      'El salt debe ser de al menos 16 bytes aleatorios'
    ],
    solutionEn: '```typescript\nimport { pbkdf2Sync, randomBytes } from "crypto";\n\nfunction deriveKey(masterPassword: string, salt: Buffer): Buffer {\n  return pbkdf2Sync(\n    masterPassword,\n    salt,\n    600_000,\n    64,\n    "sha512"\n  );\n}\n\n// Usage\nconst salt = randomBytes(32);\nconst key = deriveKey("master-password-123", salt);\n// key is a 64-byte buffer (512 bits) suitable for AES-256\n```',
    solutionEs: 'Usa `pbkdf2Sync` del módulo `crypto` con 600k iteraciones y SHA-512 para derivar una clave segura. El salt debe ser aleatorio y único por usuario.',
    explanationEn: 'PBKDF2 (Password-Based Key Derivation Function 2) applies a pseudorandom function (HMAC-SHA512) iteratively to slow down brute-force attacks. The high iteration count (600k) makes each guess expensive (~250ms) without affecting legitimate users. The salt prevents rainbow table attacks.',
    explanationEs: 'PBKDF2 aplica una función pseudoaleatoria (HMAC-SHA512) iterativamente para ralentizar ataques de fuerza bruta. El alto conteo de iteraciones hace que cada intento sea costoso (~250ms) sin afectar a usuarios legítimos. El salt previene ataques de rainbow table.',
    starterCode: 'import { pbkdf2Sync, randomBytes } from "crypto";\n\nfunction deriveKey(masterPassword: string, salt: Buffer): Buffer {\n  // Your implementation here\n}',
    tags: ['security', 'crypto', 'pbkdf2', 'key-derivation'],
    resources: [
      { title: 'OWASP Password Storage Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html', type: 'documentation' },
      { title: 'NIST SP 800-132', url: 'https://csrc.nist.gov/publications/detail/sp/800-132/final', type: 'documentation' },
    ],
  },
  {
    id: 'pm-7',
    slug: 'password-manager',
    titleEn: 'Master Password Pepper Strategy',
    titleEs: 'Estrategia de Pepper para Contraseña Maestra',
    descriptionEn: 'Design a pepper storage strategy for the master password. Explain the trade-offs between HSM, KMS, environment variables, and a separate config file.',
    descriptionEs: 'Diseña una estrategia de almacenamiento de pepper para la contraseña maestra. Explica los trade-offs entre HSM, KMS, variables de entorno y un archivo de configuración separado.',
    difficulty: 'senior',
    type: 'conceptual',
    points: 100,
    hintsEn: [
      'A pepper is a secret added to the password before hashing, stored separately from the database',
      'Unlike salt, pepper must be kept secret',
      'Hardware-based solutions provide the strongest guarantees'
    ],
    hintsEs: [
      'El pepper es un secreto añadido a la contraseña antes del hash, almacenado separado de la BD',
      'A diferencia del salt, el pepper debe mantenerse secreto',
      'Las soluciones hardware ofrecen las garantías más fuertes'
    ],
    solutionEn: '**Recommended approach: HSM/KMS-backed pepper with environment fallback**\n\n```typescript\n// Pepper comes from secure storage, never from code\nconst PEPPER = await secretsManager.getSecret("master-pepper");\n\nfunction hashWithPepper(password: string, salt: string): string {\n  return argon2.hashSync(password + PEPPER, {\n    salt: Buffer.from(salt, "hex"),\n    type: argon2.argon2id,\n  });\n}\n```\n\n**Trade-offs:**\n- **HSM/KMS** (AWS KMS, GCP KMS): strongest, but adds latency and cost\n- **Environment variable**: easy but leaks if .env is committed\n- **Separate config file**: better than code, worse than KMS\n- **Never in source code**: hardcoded pepper is a disaster waiting to happen',
    solutionEs: '**Approach recomendado: Pepper respaldado por HSM/KMS con fallback a env**\n\n```typescript\nconst PEPPER = await secretsManager.getSecret("master-pepper");\n\nfunction hashWithPepper(password: string, salt: string): string {\n  return argon2.hashSync(password + PEPPER, { salt: Buffer.from(salt, "hex") });\n}\n```\n\n**Trade-offs:**\n- **HSM/KMS**: más fuerte, añade latencia\n- **Variable de entorno**: fácil pero se filtra si se commitea\n- **Archivo separado**: mejor que en código, peor que KMS',
    explanationEn: 'A pepper is a server-side secret concatenated with the password before hashing. Unlike salts (which can be public), peppers must be protected. The key insight: even if the entire database is stolen, attackers cannot brute-force without the pepper, which lives in a different security boundary.',
    explanationEs: 'El pepper es un secreto del lado del servidor concatenado con la contraseña antes del hash. A diferencia de los salts (públicos), los peppers deben protegerse. Insight clave: incluso si roban toda la BD, los atacantes no pueden hacer fuerza bruta sin el pepper.',
    tags: ['security', 'pepper', 'key-management'],
    resources: [
      { title: 'OWASP Cryptographic Storage Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html', type: 'documentation' },
    ],
  },
  {
    id: 'pm-8',
    slug: 'password-manager',
    titleEn: 'Zero-Knowledge Authentication Flow',
    titleEs: 'Flujo de Autenticación Zero-Knowledge',
    descriptionEn: 'Design a zero-knowledge authentication system where the server never sees the user\'s master password. Include registration and login flows.',
    descriptionEs: 'Diseña un sistema de autenticación zero-knowledge donde el servidor nunca ve la contraseña maestra del usuario. Incluye flujos de registro y login.',
    difficulty: 'senior',
    type: 'conceptual',
    points: 100,
    hintsEn: [
      'Use SRP or similar challenge-response protocol',
      'The verifier stored on the server must not reveal the password',
      'The encryption key must be derivable only from the user\'s input'
    ],
    hintsEs: [
      'Usa SRP o protocolo similar de challenge-response',
      'El verificador almacenado en el servidor no debe revelar la contraseña',
      'La clave de cifrado debe ser derivable solo desde el input del usuario'
    ],
    solutionEn: '**Zero-Knowledge Auth Flow (SRP-based)**\n\n**Registration:**\n1. Client generates `salt = randomBytes(32)`\n2. Client derives `x = H(salt + password)`\n3. Client computes `v = g^x mod N` (verifier)\n4. Client sends `username, salt, v` to server\n5. Server stores `{username, salt, v}`\n\n**Login:**\n1. Client fetches `salt, v` for username\n2. Client computes `a, A = g^a mod N`, sends `A, username`\n3. Server generates `b, B = kv + g^b mod N`, sends `B, salt`\n4. **Both** compute `u = H(A, B)`\n5. Client: `S = (B - kg^x)^(a + ux) mod N` → `K = H(S)`\n6. Server: `S = (Av^u)^b mod N` → `K = H(S)`\n7. Client sends `M1 = H(H(N) XOR H(g), H(username), salt, A, B, K)`\n8. Server verifies `M1` and replies with `M2 = H(A, M1, K)`\n\n**Why zero-knowledge:** Server never receives `password` or `x` directly. It only stores `v`, which is computationally infeasible to reverse.',
    solutionEs: '**Flujo Zero-Knowledge (basado en SRP)**\n\n**Registro:**\n1. Cliente genera `salt = randomBytes(32)`\n2. Cliente deriva `x = H(salt + password)`\n3. Cliente computa `v = g^x mod N`\n4. Cliente envía `username, salt, v` al servidor\n5. Servidor almacena `{username, salt, v}`\n\n**Login:** SRP challenge-response donde el servidor prueba conocimiento de `v` sin que el cliente envíe `password` ni `x` en claro.',
    explanationEn: 'Zero-knowledge means: the server can verify you know the password without learning what the password is. SRP achieves this by exchanging public values derived from a shared secret that\'s computed independently on both sides. If `M1` matches, both parties derived the same `K` without ever transmitting it.',
    explanationEs: 'Zero-knowledge significa: el servidor puede verificar que conoces la contraseña sin aprender cuál es. SRP lo logra intercambiando valores públicos derivados de un secreto compartido computado independientemente en ambos lados.',
    tags: ['security', 'zero-knowledge', 'srp', 'auth'],
    resources: [
      { title: 'RFC 2945 - SRP', url: 'https://datatracker.ietf.org/doc/html/rfc2945', type: 'documentation' },
      { title: 'OWASP Authentication Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html', type: 'documentation' },
    ],
  },
  {
    id: 'pm-9',
    slug: 'password-manager',
    titleEn: 'Sliding Window Rate Limiter',
    titleEs: 'Rate Limiter con Ventana Deslizante',
    descriptionEn: 'Implement a sliding window rate limiter that allows 5 failed login attempts per 15 minutes per IP, with automatic reset after successful login.',
    descriptionEs: 'Implementa un rate limiter con ventana deslizante que permita 5 intentos fallidos de login por 15 minutos por IP, con reset automático tras login exitoso.',
    difficulty: 'senior',
    type: 'coding',
    points: 100,
    language: 'typescript',
    hintsEn: [
      'Use a Redis sorted set with timestamps as scores',
      'Remove entries older than the window before counting',
      'Atomic operations: use a Lua script or pipeline'
    ],
    hintsEs: [
      'Usa un sorted set de Redis con timestamps como scores',
      'Elimina entradas más antiguas que la ventana antes de contar',
      'Operaciones atómicas: usa un script Lua o pipeline'
    ],
    solutionEn: '```typescript\nimport { Redis } from "ioredis";\n\nconst redis = new Redis();\n\nconst WINDOW_MS = 15 * 60 * 1000;\nconst MAX_ATTEMPTS = 5;\n\nexport async function checkRateLimit(ip: string): Promise<{\n  allowed: boolean;\n  remaining: number;\n  resetAt: number;\n}> {\n  const key = `login:attempts:${ip}`;\n  const now = Date.now();\n  const windowStart = now - WINDOW_MS;\n\n  // Lua script for atomicity\n  const lua = `\n    redis.call("ZREMRANGEBYSCORE", KEYS[1], 0, ARGV[1])\n    local count = redis.call("ZCARD", KEYS[1])\n    if count < tonumber(ARGV[2]) then\n      redis.call("ZADD", KEYS[1], ARGV[3], ARGV[3] .. "-" .. count)\n      redis.call("PEXPIRE", KEYS[1], ARGV[4])\n      return {1, ARGV[2] - count - 1}\n    else\n      local oldest = redis.call("ZRANGE", KEYS[1], 0, 0, "WITHSCORES")\n      return {0, 0, oldest[2]}\n    end\n  `;\n\n  const result = (await redis.eval(\n    lua,\n    1,\n    key,\n    windowStart,\n    MAX_ATTEMPTS,\n    now,\n    WINDOW_MS\n  )) as [number, number, string?];\n\n  if (result[0] === 1) {\n    return { allowed: true, remaining: result[1], resetAt: now + WINDOW_MS };\n  }\n  return { allowed: false, remaining: 0, resetAt: Number(result[2]) + WINDOW_MS };\n}\n\nexport async function resetRateLimit(ip: string): Promise<void> {\n  await redis.del(`login:attempts:${ip}`);\n}\n```',
    solutionEs: 'Usa Redis con un sorted set de timestamps y una operación atómica (Lua) para remover entradas viejas, contar, y agregar la nueva. Más preciso que el fixed window porque considera el momento exacto de cada intento.',
    explanationEn: 'A sliding window algorithm counts requests within a moving time range. Unlike fixed windows, it prevents burst attacks at window boundaries. Using a sorted set with timestamps as scores allows O(log n) operations and accurate time-based eviction.',
    explanationEs: 'El algoritmo de ventana deslizante cuenta requests dentro de un rango temporal móvil. A diferencia de la ventana fija, previene ataques en los bordes. Usar sorted set con timestamps permite operaciones O(log n) y evictamiento preciso.',
    starterCode: 'import { Redis } from "ioredis";\n\nconst redis = new Redis();\nconst WINDOW_MS = 15 * 60 * 1000;\nconst MAX_ATTEMPTS = 5;\n\nexport async function checkRateLimit(ip: string): Promise<{\n  allowed: boolean;\n  remaining: number;\n  resetAt: number;\n}> {\n  // Your implementation here\n}',
    tags: ['security', 'rate-limiting', 'redis'],
    resources: [
      { title: 'OWASP API Security - Rate Limiting', url: 'https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/', type: 'documentation' },
    ],
  },
  {
    id: 'pm-10',
    slug: 'password-manager',
    titleEn: 'CSP Headers for XSS Prevention',
    titleEs: 'Headers CSP para Prevención de XSS',
    descriptionEn: 'Write a strict Content Security Policy header that allows only same-origin scripts, no inline scripts except for nonces, no eval, and only HTTPS resources.',
    descriptionEs: 'Escribe un header Content Security Policy estricto que solo permita scripts del mismo origen, sin scripts inline excepto por nonces, sin eval, y solo recursos HTTPS.',
    difficulty: 'senior',
    type: 'coding',
    points: 100,
    language: 'typescript',
    hintsEn: [
      'Use nonce-based approach for inline scripts',
      'default-src is the fallback for all fetch directives',
      'object-src "none" blocks Flash/legacy plugins'
    ],
    hintsEs: [
      'Usa el enfoque basado en nonces para scripts inline',
      'default-src es el fallback para todas las directivas fetch',
      'object-src "none" bloquea plugins legacy/Flash'
    ],
    solutionEn: `\`\`\`typescript\nimport { randomBytes } from "crypto";\n\nexport function getCSPHeader(nonce: string): string {\n  return [\n    \`default-src 'self'\`,\n    \`script-src 'self' 'nonce-\${nonce}' 'strict-dynamic'\`,\n    \`style-src 'self' 'nonce-\${nonce}'\`,\n    \`img-src 'self' data: https:\`,\n    \`font-src 'self' https://fonts.gstatic.com\`,\n    \`connect-src 'self' https://api.yourapp.com wss://api.yourapp.com\`,\n    \`frame-ancestors 'none'\`,\n    \`base-uri 'self'\`,\n    \`form-action 'self'\`,\n    \`object-src 'none'\`,\n    \`upgrade-insecure-requests\`,\n    \`block-all-mixed-content\`,\n  ].join("; ");\n}\n\n// Express middleware\nexport function cspMiddleware(req: any, res: any, next: any) {\n  const nonce = randomBytes(16).toString("base64");\n  res.locals.nonce = nonce;\n  res.setHeader("Content-Security-Policy", getCSPHeader(nonce));\n  res.setHeader("X-Frame-Options", "DENY");\n  res.setHeader("X-Content-Type-Options", "nosniff");\n  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");\n  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");\n  next();\n}\n\`\`\``,
    solutionEs: 'CSP estricta con nonces por request, `strict-dynamic` para confiar solo en scripts nonced, `frame-ancestors none` contra clickjacking, y directivas de transporte forzando HTTPS.',
    explanationEn: 'Content Security Policy is a defense-in-depth layer against XSS. The nonce-based approach generates a unique per-request value that must match any inline script. `strict-dynamic` further trusts only scripts loaded by trusted (nonced) scripts, blocking third-party abuse.',
    explanationEs: 'CSP es una capa de defensa en profundidad contra XSS. El enfoque con nonces genera un valor único por request que debe coincidir con cualquier script inline. `strict-dynamic` confía solo en scripts cargados por scripts confiables.',
    starterCode: 'import { randomBytes } from "crypto";\n\nexport function getCSPHeader(nonce: string): string {\n  // Your implementation here\n  return "";\n}',
    tags: ['security', 'csp', 'xss', 'headers'],
    resources: [
      { title: 'MDN - Content Security Policy', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP', type: 'documentation' },
      { title: 'Google CSP Guide', url: 'https://csp.withgoogle.com/docs/index.html', type: 'tutorial' },
    ],
  },
  {
    id: 'pm-11',
    slug: 'password-manager',
    titleEn: 'Timing Attack Prevention',
    titleEs: 'Prevención de Timing Attacks',
    descriptionEn: 'Implement a constant-time string comparison function to prevent timing attacks when verifying master passwords or auth tokens.',
    descriptionEs: 'Implementa una función de comparación de strings en tiempo constante para prevenir timing attacks al verificar contraseñas maestras o tokens de auth.',
    difficulty: 'advanced',
    type: 'coding',
    points: 50,
    language: 'typescript',
    hintsEn: [
      'Use crypto.timingSafeEqual, not === comparison',
      'The function must take the same time regardless of where the strings differ',
      'Hash both strings to a fixed length first if comparing passwords'
    ],
    hintsEs: [
      'Usa crypto.timingSafeEqual, no comparación con ===',
      'La función debe tardar el mismo tiempo sin importar dónde difieran los strings',
      'Hashea ambos strings a longitud fija si comparas contraseñas'
    ],
    solutionEn: '```typescript\nimport { timingSafeEqual, createHash } from "crypto";\n\nexport function constantTimeCompare(a: string, b: string): boolean {\n  if (typeof a !== "string" || typeof b !== "string") return false;\n\n  // Hash to fixed length first to avoid length-based timing leaks\n  const hashA = createHash("sha256").update(a).digest();\n  const hashB = createHash("sha256").update(b).digest();\n\n  return timingSafeEqual(hashA, hashB);\n}\n\n// Usage for password verification\nexport function verifyPassword(submitted: string, stored: string): boolean {\n  return constantTimeCompare(submitted, stored);\n}\n```',
    solutionEs: 'Hashea ambos strings a longitud fija con SHA-256 y compara con `crypto.timingSafeEqual`. Nunca uses `===` ni `Buffer.compare` para secrets.',
    explanationEn: 'A timing attack exploits microsecond differences in string comparison: `===` returns early on the first mismatched character. By hashing both inputs to the same length and using `timingSafeEqual`, the comparison always takes the same time regardless of input.',
    explanationEs: 'Un timing attack explota diferencias de microsegundos en la comparación: `===` retorna temprano en el primer carácter diferente. Hasheando ambos inputs a la misma longitud y usando `timingSafeEqual`, la comparación siempre toma el mismo tiempo.',
    starterCode: 'import { timingSafeEqual, createHash } from "crypto";\n\nexport function constantTimeCompare(a: string, b: string): boolean {\n  // Your implementation here\n  return false;\n}',
    tags: ['security', 'timing-attack', 'crypto'],
    resources: [
      { title: 'Node.js crypto.timingSafeEqual', url: 'https://nodejs.org/api/crypto.html#cryptotimingsafeequal', type: 'documentation' },
    ],
  },
  {
    id: 'pm-12',
    slug: 'password-manager',
    titleEn: 'Auto-Lock with Inactivity Detection',
    titleEs: 'Auto-Bloqueo por Detección de Inactividad',
    descriptionEn: 'Design an auto-lock system that locks the password vault after 5 minutes of inactivity (no mouse, keyboard, or touch input) and clears the decrypted data from memory.',
    descriptionEs: 'Diseña un sistema de auto-bloqueo que bloquee la bóveda de contraseñas tras 5 minutos de inactividad (sin mouse, teclado o touch) y limpie los datos descifrados de memoria.',
    difficulty: 'advanced',
    type: 'coding',
    points: 50,
    language: 'typescript',
    hintsEn: [
      'Use multiple event listeners: mousemove, keydown, touchstart, scroll',
      'Throttle activity detection to avoid performance issues',
      'Use sessionStorage (cleared on tab close) not localStorage for the lock state'
    ],
    hintsEs: [
      'Usa múltiples listeners: mousemove, keydown, touchstart, scroll',
      'Throttle la detección de actividad para evitar problemas de performance',
      'Usa sessionStorage (se limpia al cerrar tab) no localStorage para el estado de bloqueo'
    ],
    solutionEn: '```typescript\nimport { useEffect, useRef, useCallback } from "react";\n\nconst INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000;\nconst ACTIVITY_EVENTS = ["mousedown", "keydown", "touchstart", "scroll", "mousemove"];\n\nexport function useAutoLock(onLock: () => void) {\n  const timeoutRef = useRef<NodeJS.Timeout>();\n  const lastActivityRef = useRef<number>(Date.now());\n\n  const resetTimer = useCallback(() => {\n    lastActivityRef.current = Date.now();\n    if (timeoutRef.current) clearTimeout(timeoutRef.current);\n    timeoutRef.current = setTimeout(onLock, INACTIVITY_TIMEOUT_MS);\n  }, [onLock]);\n\n  useEffect(() => {\n    let throttleTimer: number | null = null;\n\n    const handleActivity = () => {\n      // Throttle: only reset once per 1s to avoid expensive re-renders\n      if (throttleTimer !== null) return;\n      throttleTimer = window.setTimeout(() => {\n        throttleTimer = null;\n      }, 1000);\n      resetTimer();\n    };\n\n    ACTIVITY_EVENTS.forEach(event =>\n      window.addEventListener(event, handleActivity, { passive: true })\n    );\n    resetTimer();\n\n    return () => {\n      ACTIVITY_EVENTS.forEach(event =>\n        window.removeEventListener(event, handleActivity)\n      );\n      if (timeoutRef.current) clearTimeout(timeoutRef.current);\n      if (throttleTimer) clearTimeout(throttleTimer);\n    };\n  }, [resetTimer]);\n}\n\n// Component usage\nfunction VaultPage() {\n  const { clearDecryptedVault } = useVault();\n\n  const handleLock = useCallback(() => {\n    clearDecryptedVault();\n    sessionStorage.setItem("locked", "true");\n    window.location.href = "/unlock";\n  }, [clearDecryptedVault]);\n\n  useAutoLock(handleLock);\n  return <div>...</div>;\n}\n```',
    solutionEs: 'Hook de React que escucha eventos de actividad, throttled a 1s, y dispara `onLock` tras 5 min. `onLock` limpia la bóveda descifrada de memoria y redirige al unlock screen.',
    explanationEn: 'Auto-lock requires balancing security (shorter timeout = safer) with UX (too short = annoying). 5 minutes is a common default. The throttle prevents the timer from resetting on every pixel of mouse movement, which would cause performance issues.',
    explanationEs: 'El auto-lock requiere balancear seguridad (timeout corto = más seguro) con UX (muy corto = molesto). 5 minutos es el default común. El throttle evita que el timer se resetee en cada píxel de movimiento, lo cual causaría problemas de performance.',
    starterCode: 'import { useEffect, useRef, useCallback } from "react";\n\nconst INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000;\nconst ACTIVITY_EVENTS = ["mousedown", "keydown", "touchstart", "scroll", "mousemove"];\n\nexport function useAutoLock(onLock: () => void) {\n  // Your implementation here\n}',
    tags: ['security', 'auto-lock', 'react', 'hooks'],
    resources: [
      { title: 'Bitwarden auto-lock implementation', url: 'https://bitwarden.com/help/vault-timeout/', type: 'article' },
    ],
  },
  {
    id: 'pm-13',
    slug: 'password-manager',
    titleEn: 'Password Strength Scoring',
    titleEs: 'Puntuación de Fortaleza de Contraseña',
    descriptionEn: 'Implement a password strength scoring function that returns a score from 0-100 based on length, character variety, common patterns, and breach detection.',
    descriptionEs: 'Implementa una función de puntuación de fortaleza de contraseña que retorne un score 0-100 basado en longitud, variedad de caracteres, patrones comunes y detección de brechas.',
    difficulty: 'advanced',
    type: 'coding',
    points: 50,
    language: 'typescript',
    hintsEn: [
      'Length matters more than complexity: 16+ chars is strong',
      'Use zxcvbn library or implement entropy calculation',
      'Penalize common patterns: "password", "123456", keyboard walks'
    ],
    hintsEs: [
      'La longitud importa más que la complejidad: 16+ caracteres es fuerte',
      'Usa la librería zxcvbn o implementa cálculo de entropía',
      'Penaliza patrones comunes: "contraseña", "123456", secuencias de teclado'
    ],
    solutionEn: '```typescript\nconst COMMON_PATTERNS = [/password/i, /12345/, /qwerty/i, /admin/i, /letmein/i];\nconst KEYBOARD_WALKS = [/qwertyuiop/i, /asdfghjkl/i, /zxcvbnm/i];\n\ninterface StrengthResult {\n  score: number; // 0-100\n  entropy: number; // bits\n  feedback: string[];\n}\n\nexport function calculatePasswordStrength(password: string): StrengthResult {\n  const feedback: string[] = [];\n  let score = 0;\n\n  // 1. Base score from length (max 40 points)\n  const lengthScore = Math.min(40, password.length * 2.5);\n  score += lengthScore;\n  if (password.length < 8) feedback.push("Use at least 8 characters");\n  if (password.length < 12) feedback.push("12+ characters recommended");\n\n  // 2. Character variety (max 30 points)\n  const hasLower = /[a-z]/.test(password);\n  const hasUpper = /[A-Z]/.test(password);\n  const hasDigit = /[0-9]/.test(password);\n  const hasSymbol = /[^A-Za-z0-9]/.test(password);\n  const varietyCount = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length;\n  score += varietyCount * 7.5;\n  if (varietyCount < 3) feedback.push("Mix lowercase, uppercase, numbers, and symbols");\n\n  // 3. Entropy calculation (max 20 points)\n  const charPool =\n    (hasLower ? 26 : 0) + (hasUpper ? 26 : 0) + (hasDigit ? 10 : 0) + (hasSymbol ? 33 : 0);\n  const entropy = password.length * Math.log2(charPool || 1);\n  score += Math.min(20, entropy / 4);\n\n  // 4. Penalties\n  if (COMMON_PATTERNS.some(p => p.test(password))) {\n    score -= 30;\n    feedback.push("Avoid common words and patterns");\n  }\n  if (KEYBOARD_WALKS.some(p => p.test(password))) {\n    score -= 20;\n    feedback.push("Avoid keyboard patterns like qwerty");\n  }\n  if (/(.)\\1{2,}/.test(password)) {\n    score -= 10;\n    feedback.push("Avoid repeated characters (aaa, 111)");\n  }\n\n  return {\n    score: Math.max(0, Math.min(100, Math.round(score))),\n    entropy: Math.round(entropy),\n    feedback,\n  };\n}\n```',
    solutionEs: 'Score 0-100 combinando: longitud (40 pts), variedad de chars (30 pts), entropía (20 pts), penalizaciones por patrones comunes y keyboard walks. Devuelve feedback accionable.',
    explanationEn: 'Modern password strength is dominated by length, not character variety. NIST 800-63B now recommends checking against breach lists (HaveIBeenPwned) rather than enforcing complex rules. The entropy calculation estimates how many bits of randomness a password has.',
    explanationEs: 'La fortaleza moderna está dominada por la longitud, no la variedad. NIST 800-63B ahora recomienda chequear contra listas de brechas (HaveIBeenPwned) en lugar de reglas de complejidad. La entropía estima cuántos bits de aleatoriedad tiene.',
    starterCode: 'const COMMON_PATTERNS = [/password/i, /12345/, /qwerty/i];\n\nexport function calculatePasswordStrength(password: string): {\n  score: number;\n  feedback: string[];\n} {\n  // Your implementation here\n  return { score: 0, feedback: [] };\n}',
    tags: ['security', 'password-strength', 'entropy'],
    resources: [
      { title: 'NIST 800-63B', url: 'https://pages.nist.gov/800-63-3/sp800-63b.html', type: 'documentation' },
      { title: 'zxcvbn library', url: 'https://github.com/dropbox/zxcvbn', type: 'article' },
    ],
  },
  {
    id: 'pm-14',
    slug: 'password-manager',
    titleEn: 'Vault Encryption at Rest',
    titleEs: 'Cifrado de Bóveda en Reposo',
    descriptionEn: 'Explain the architecture of an encrypted vault: how individual entries are encrypted, how the master key protects them, and how search works without decrypting everything.',
    descriptionEs: 'Explica la arquitectura de una bóveda cifrada: cómo se cifran las entradas individuales, cómo las protege la clave maestra, y cómo funciona la búsqueda sin descifrar todo.',
    difficulty: 'senior',
    type: 'conceptual',
    points: 100,
    hintsEn: [
      'Each entry has its own IV, but the key is derived from the master password',
      'For search, you need either a search index encrypted separately, or you decrypt on-the-fly',
      'Hierarchical key derivation: master → vault key → entry keys'
    ],
    hintsEs: [
      'Cada entrada tiene su propio IV, pero la clave viene de la contraseña maestra',
      'Para buscar, necesitas un índice cifrado por separado, o descifrar on-the-fly',
      'Derivación jerárquica: maestra → clave de bóveda → claves de entrada'
    ],
    solutionEn: '**Hierarchical Encryption Architecture**\n\n```\nMaster Password\n     │\n     ▼\n[PBKDF2 / Argon2]\n     │\n     ▼\nVault Master Key (VMK) - 256 bits\n     │\n     ├──> Entry Key 1 (random, encrypted with VMK)\n     │         │\n     │         ▼\n     │    [AES-256-GCM]\n     │         │\n     │         ▼\n     │    Ciphertext + IV + Auth Tag\n     │\n     ├──> Entry Key 2 (random, encrypted with VMK)\n     └──> Search Index Key (random, encrypted with VMK)\n               │\n               ▼\n          Encrypted searchable index (HMAC of normalized titles)\n```\n\n**Search without full decrypt:**\n1. On unlock, decrypt `Search Index Key`\n2. Load encrypted search index (HMAC of each entry title, e.g., `HMAC(lower(title))`)\n3. For search query, compute `HMAC(lower(query))` and compare against index\n4. Decrypt only matching entries on-the-fly',
    solutionEs: '**Arquitectura de Cifrado Jerárquico**\n\nLa contraseña maestra deriva la VMK, que cifra las claves aleatorias de cada entrada. Para búsqueda, mantienes un índice cifrado (HMAC de títulos normalizados) que permite buscar sin descifrar todo.',
    explanationEn: 'A scalable vault encryption scheme avoids two pitfalls: (1) using the master key directly for all entries (no forward secrecy, single point of failure), and (2) encrypting everything with one key (no per-entry security). The HMAC search index is a common pattern that lets you query without decryption.',
    explanationEs: 'Un esquema escalable evita dos problemas: (1) usar la clave maestra directamente (sin forward secrecy), (2) cifrar todo con una clave (sin seguridad por entrada). El índice HMAC permite buscar sin descifrar.',
    tags: ['security', 'architecture', 'encryption', 'search'],
    resources: [
      { title: 'Bitwarden security assessment', url: 'https://bitwarden.com/help/is-bitwarden-audited/', type: 'article' },
    ],
  },
  {
    id: 'pm-15',
    slug: 'password-manager',
    titleEn: 'Secure Random Number Generation',
    titleEs: 'Generación Segura de Números Aleatorios',
    descriptionEn: 'Explain the difference between crypto.randomBytes, Math.random, and crypto.getRandomValues. When must you use each, and what are the security implications?',
    descriptionEs: 'Explica la diferencia entre crypto.randomBytes, Math.random y crypto.getRandomValues. ¿Cuándo debes usar cada uno y cuáles son las implicaciones de seguridad?',
    difficulty: 'advanced',
    type: 'conceptual',
    points: 50,
    hintsEn: [
      'Math.random is NOT cryptographically secure - never use it for keys',
      'crypto.getRandomValues is the browser equivalent of crypto.randomBytes',
      'CSPRNG: Cryptographically Secure Pseudo-Random Number Generator'
    ],
    hintsEs: [
      'Math.random NO es criptográficamente seguro - nunca lo uses para claves',
      'crypto.getRandomValues es el equivalente en navegador de crypto.randomBytes',
      'CSPRNG: Generador de Números Pseudoaleatorios Criptográficamente Seguro'
    ],
    solutionEn: '**Comparison**\n\n| API | Environment | Secure | Speed | Use case |\n|---|---|---|---|---|\n| `Math.random()` | Browser/Node | ❌ No | Fast | UI, games, animations |\n| `crypto.getRandomValues()` | Browser | ✅ Yes | Fast | Client-side keys, nonces |\n| `crypto.randomBytes()` | Node | ✅ Yes | Fast | Server-side keys, salts |\n| `crypto.randomUUID()` | Both | ✅ Yes | Fast | UUIDs (v4) |\n\n**Why Math.random is unsafe:**\n- Uses PRNG like xorshift128+ (V8)\n- State can be recovered from few outputs (under 5 floats)\n- Predictable: knowing one output lets you predict all future ones\n- Never use for: keys, IVs, salts, tokens, session IDs, CSRF tokens\n\n**CSPRNG requirements:**\n- Passes statistical randomness tests (NIST SP 800-22)\n- Survives state compromise extensions\n- Backed by OS entropy: `/dev/urandom` (Linux), `BCryptGenRandom` (Windows)\n\n**Example:**\n```typescript\n// ✅ Good: AES key generation\nconst key = crypto.getRandomValues(new Uint8Array(32));\n\n// ❌ Bad: predictable key\nconst key = new Uint8Array(32).map(() => Math.floor(Math.random() * 256));\n```',
    solutionEs: 'Usa `crypto.getRandomValues` (browser) o `crypto.randomBytes` (Node) para cualquier clave, IV, salt o token. `Math.random` solo es aceptable para UI no sensible.',
    explanationEn: 'A CSPRNG draws entropy from OS sources (hardware RNG, interrupt timing, etc.) and runs it through algorithms like ChaCha20 or AES-CTR. Math.random uses a simple PRNG that\'s fast but predictable - the entire state can be reconstructed from a handful of outputs.',
    explanationEs: 'Un CSPRNG obtiene entropía del SO (RNG hardware, timing de interrupciones) y la procesa con algoritmos como ChaCha20. Math.random usa un PRNG simple: rápido pero predecible - el estado se reconstruye desde pocas salidas.',
    tags: ['security', 'cryptography', 'random', 'csprng'],
    resources: [
      { title: 'MDN - Crypto.getRandomValues', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues', type: 'documentation' },
    ],
  },
  {
    id: 'pm-16',
    slug: 'password-manager',
    titleEn: 'Two-Factor Authentication TOTP',
    titleEs: 'Autenticación de Dos Factores TOTP',
    descriptionEn: 'Implement TOTP (Time-based One-Time Password) generation and verification compatible with Google Authenticator.',
    descriptionEs: 'Implementa generación y verificación de TOTP (Time-based One-Time Password) compatible con Google Authenticator.',
    difficulty: 'advanced',
    type: 'coding',
    points: 50,
    language: 'typescript',
    hintsEn: [
      'TOTP is HMAC-SHA1 of the time step, truncated to 6 digits',
      'Time step is typically 30 seconds: floor(unix_time / 30)',
      'RFC 6238 specifies the algorithm'
    ],
    hintsEs: [
      'TOTP es HMAC-SHA1 del paso de tiempo, truncado a 6 dígitos',
      'El paso de tiempo es típicamente 30 segundos: floor(unix_time / 30)',
      'RFC 6238 especifica el algoritmo'
    ],
    solutionEn: '```typescript\nimport { createHmac } from "crypto";\n\nconst TIME_STEP = 30;\nconst DIGITS = 6;\n\nexport function generateTOTP(secret: Buffer, time: number = Date.now()): string {\n  const counter = Math.floor(time / 1000 / TIME_STEP);\n  const buffer = Buffer.alloc(8);\n  buffer.writeBigUInt64BE(BigInt(counter));\n\n  const hmac = createHmac("sha1", secret).update(buffer).digest();\n  const offset = hmac[hmac.length - 1] & 0xf;\n  const code =\n    ((hmac[offset] & 0x7f) << 24) |\n    ((hmac[offset + 1] & 0xff) << 16) |\n    ((hmac[offset + 2] & 0xff) << 8) |\n    (hmac[offset + 3] & 0xff);\n\n  return (code % 10 ** DIGITS).toString().padStart(DIGITS, "0");\n}\n\nexport function verifyTOTP(\n  token: string,\n  secret: Buffer,\n  window: number = 1\n): boolean {\n  const now = Date.now();\n  for (let i = -window; i <= window; i++) {\n    const expected = generateTOTP(secret, now + i * TIME_STEP * 1000);\n    if (timingSafeEqualStrings(token, expected)) return true;\n  }\n  return false;\n}\n\nfunction timingSafeEqualStrings(a: string, b: string): boolean {\n  if (a.length !== b.length) return false;\n  let result = 0;\n  for (let i = 0; i < a.length; i++) {\n    result |= a.charCodeAt(i) ^ b.charCodeAt(i);\n  }\n  return result === 0;\n}\n```',
    solutionEs: 'HMAC-SHA1 del contador (tiempo / 30s) truncado a 6 dígitos, con ventana de ±1 step para tolerancia de reloj. Verificación en tiempo constante.',
    explanationEn: 'TOTP is HOTP (HMAC-based OTP) where the counter is replaced with time. The server and client both compute the same code independently because they share the secret and use synchronized clocks. The ±1 step window accommodates clock drift.',
    explanationEs: 'TOTP es HOTP donde el contador es el tiempo. Servidor y cliente computan el mismo código independientemente porque comparten el secreto y tienen relojes sincronizados. La ventana de ±1 step acomoda drift de reloj.',
    starterCode: 'import { createHmac } from "crypto";\n\nexport function generateTOTP(secret: Buffer, time: number = Date.now()): string {\n  // Your implementation here\n  return "";\n}',
    tags: ['security', 'totp', '2fa', 'auth'],
    resources: [
      { title: 'RFC 6238 - TOTP', url: 'https://datatracker.ietf.org/doc/html/rfc6238', type: 'documentation' },
    ],
  },
  {
    id: 'pm-17',
    slug: 'password-manager',
    titleEn: 'Vault Import/Export Security',
    titleEs: 'Seguridad en Import/Export de Bóveda',
    descriptionEn: 'Design a secure import/export flow for a password vault. What formats should be supported? How do you handle encrypted imports?',
    descriptionEs: 'Diseña un flujo seguro de import/export para una bóveda. ¿Qué formatos deberían soportarse? ¿Cómo manejas imports cifrados?',
    difficulty: 'advanced',
    type: 'conceptual',
    points: 50,
    hintsEn: [
      'Support CSV (plaintext, risky), JSON (with optional encryption), and native encrypted format',
      'Warn the user about plaintext exports',
      'Allow password-protected exports for migration between managers'
    ],
    hintsEs: [
      'Soporta CSV (texto plano, riesgoso), JSON (con cifrado opcional), y formato nativo cifrado',
      'Advierte al usuario sobre exports en texto plano',
      'Permite exports con contraseña para migración entre managers'
    ],
    solutionEn: '**Supported Formats**\n\n1. **CSV (plaintext)** - Compatibility mode\n   - Warn: "This file is NOT encrypted. Anyone with access to it can read your passwords."\n   - Auto-delete downloaded file from browser cache after import\n   - Suggest re-import to encrypted format\n\n2. **JSON (plaintext)** - Same warning as CSV\n\n3. **Encrypted JSON** - Recommended for backup\n   - Use vault\'s own encryption (AES-256-GCM with key derived from a user-provided export password)\n   - Include: `{ version, kdf: "argon2id", salt, iv, ciphertext, tag }`\n   - User must enter password to decrypt\n\n4. **Native backup format** - Full fidelity\n   - Includes all entries, attachments, custom fields\n   - Encrypted with a one-time backup password shown to user once\n\n**Security checks during import:**\n- Validate file size (reject > 100MB to prevent DoS)\n- Sanitize fields (no HTML in entry names)\n- Detect duplicate entries (same title + username)\n- Warn if CSV is older than 30 days (stale data)\n\n**Security checks during export:**\n- Confirm dialog with password re-entry\n- Auto-wipe export file from downloads after 1 hour\n- Log export events for audit trail',
    solutionEs: 'Soporta CSV/JSON (advertencia clara), JSON cifrado con contraseña de export, y formato nativo. Valida tamaño, sanitiza campos, detecta duplicados. Wipea exports automáticamente.',
    explanationEn: 'Export is the most dangerous operation in a password manager because it produces an unencrypted copy. The principle: exports should be encrypted by default, plaintext exports should require explicit confirmation, and downloaded files should auto-clean to reduce the attack window.',
    explanationEs: 'El export es la operación más peligrosa porque produce una copia descifrada. Principio: los exports deben cifrarse por default, los plaintext requieren confirmación explícita, y los archivos descargados deben auto-limpiarse.',
    tags: ['security', 'import', 'export', 'ux'],
    resources: [
      { title: '1Password export documentation', url: 'https://support.1password.com/export/', type: 'documentation' },
    ],
  },
  {
    id: 'pm-18',
    slug: 'password-manager',
    titleEn: 'Browser Extension Message Security',
    titleEs: 'Seguridad de Mensajes en Extensión de Navegador',
    descriptionEn: 'Explain the security model of browser extensions: content scripts, background scripts, native messaging, and how to safely pass credentials between them.',
    descriptionEs: 'Explica el modelo de seguridad de extensiones de navegador: content scripts, background scripts, native messaging, y cómo pasar credenciales seguramente entre ellos.',
    difficulty: 'advanced',
    type: 'conceptual',
    points: 50,
    hintsEn: [
      'Content scripts run in the page context - never send secrets to them directly',
      'Use chrome.runtime.sendMessage with minimal data',
      'Background script holds the decrypted vault and acts as a secure intermediary'
    ],
    hintsEs: [
      'Content scripts corren en el contexto de la página - nunca les envíes secrets directamente',
      'Usa chrome.runtime.sendMessage con datos mínimos',
      'El background script mantiene la bóveda descifrada y actúa como intermediario seguro'
    ],
    solutionEn: '**Architecture:**\n\n```\n┌─────────────────┐\n│  Web Page       │  (untrusted - DOM accessible to any script)\n│  ┌───────────┐  │\n│  │ Content   │  │  (limited DOM access, can\'t access page JS vars)\n│  │ Script    │  │\n│  └─────┬─────┘  │\n│        │ chrome.runtime.sendMessage()\n│        ▼         │\n│  ┌───────────┐  │\n│  │ Background│  │  (isolated, can hold decrypted vault)\n│  │ Service   │  │\n│  │ Worker    │  │\n│  └─────┬─────┘  │\n│        │ chrome.runtime.connectNative()\n│        ▼         │\n│  ┌───────────┐  │\n│  │ Native    │  │  (out-of-process, host application)\n│  │ Messaging │  │\n│  └───────────┘  │\n└─────────────────┘\n```\n\n**Secure flow for autofill:**\n1. Content script detects login form (only DOM queries, no page JS access)\n2. Sends `{ type: "GET_CREDENTIALS", origin: window.location.origin }` to background\n3. Background checks allowlist (only respond for known sites)\n4. Background fetches credentials, fills form via content script\n5. Content script does `inputElement.value = "..."` (not innerHTML, never expose via DOM)\n\n**Threats:**\n- Malicious page injecting fake form data → validate origin\n- Compromised content script → keep vault in background, not content\n- Man-in-the-browser → use postMessage with origin checks',
    solutionEs: 'Mantén la bóveda descifrada en el background service worker. El content script solo detecta formularios. Comunicación mínima: solo origen + tipo, no credenciales. Valida origin siempre.',
    explanationEn: 'The content script has the same DOM access as the page itself, so any XSS on the page can read the content script\'s messages. The defense: keep decrypted data in the background, send only form-fill commands to the content script, and validate every origin.',
    explanationEs: 'El content script tiene el mismo acceso al DOM que la página, así que cualquier XSS puede leer sus mensajes. Defensa: mantén los datos descifrados en background, envía solo comandos de fill al content script, valida cada origin.',
    tags: ['security', 'browser-extension', 'architecture'],
    resources: [
      { title: 'Chrome Extension Message Passing', url: 'https://developer.chrome.com/docs/extensions/develop/concepts/messaging', type: 'documentation' },
    ],
  },
  {
    id: 'pm-19',
    slug: 'password-manager',
    titleEn: 'Biometric Unlock Implementation',
    titleEs: 'Implementación de Desbloqueo Biométrico',
    descriptionEn: 'Explain how to integrate WebAuthn / platform authenticators (Touch ID, Windows Hello) for biometric unlock of a password vault.',
    descriptionEs: 'Explica cómo integrar WebAuthn / platform authenticators (Touch ID, Windows Hello) para desbloqueo biométrico de una bóveda.',
    difficulty: 'advanced',
    type: 'conceptual',
    points: 50,
    hintsEn: [
      'WebAuthn stores a private key in the secure enclave, never extractable',
      'Use `authenticatorAttachment: "platform"` for biometrics',
      'Biometric unlocks a vault key, not the master password itself'
    ],
    hintsEs: [
      'WebAuthn almacena una clave privada en el enclave seguro, nunca extraíble',
      'Usa `authenticatorAttachment: "platform"` para biométricos',
      'El biométrico desbloquea una clave de bóveda, no la contraseña maestra misma'
    ],
    solutionEn: '**Architecture:**\n\n```\nMaster Password ──┐\n                  ├─→ Argon2id ─→ Vault Master Key (VMK)\nBiometric (TPM) ──┘                  │\n                                     ▼\n                              Encrypted VMK in storage\n                                     ▲\n                                     │\nWebAuthn Private Key ── Decrypts ────┘\n(only released after biometric check)\n```\n\n**Implementation:**\n\n```typescript\n// Registration\nconst credential = await navigator.credentials.create({\n  publicKey: {\n    challenge: crypto.getRandomValues(new Uint8Array(32)),\n    rp: { name: "MyPasswordManager" },\n    user: { id: userId, name: username, displayName: username },\n    pubKeyCredParams: [{ alg: -7, type: "public-key" }],\n    authenticatorSelection: {\n      authenticatorAttachment: "platform", // Built-in biometrics\n      residentKey: "required",\n      userVerification: "required",\n    },\n  },\n});\n\n// On unlock, send VMK through PRF extension\nconst assertion = await navigator.credentials.get({\n  publicKey: {\n    challenge: ...,\n    allowCredentials: [{ id: credential.id, type: "public-key" }],\n    extensions: { prf: { eval: { first: saltForVMK } } },\n  },\n});\n// Use PRF output as key to decrypt stored VMK\n```\n\n**Key property:**\n- The private key never leaves the TPM/Secure Enclave\n- Even if the OS is compromised, the attacker needs the biometric to use the key\n- Server only sees the public key',
    solutionEs: 'Usa WebAuthn con `authenticatorAttachment: "platform"`. La clave privada vive en TPM/Secure Enclave. La biometría desbloquea un PRF output, que descifra la VMK almacenada.',
    explanationEn: 'WebAuthn with platform authenticators provides a hardware-backed biometric. The PRF (Pseudo-Random Function) extension lets you derive a symmetric key from the credential, which is perfect for unwrapping a stored vault key. The master password becomes a fallback for new devices.',
    explanationEs: 'WebAuthn con platform authenticators provee biometría respaldada por hardware. La extensión PRF permite derivar una clave simétrica desde la credencial, perfecta para desencapsular la clave de bóveda almacenada.',
    tags: ['security', 'webauthn', 'biometric', 'tpm'],
    resources: [
      { title: 'WebAuthn Guide', url: 'https://webauthn.guide/', type: 'tutorial' },
      { title: 'MDN - Web Authentication API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API', type: 'documentation' },
    ],
  },
  {
    id: 'pm-20',
    slug: 'password-manager',
    titleEn: 'Secret Detection with Shannon Entropy',
    titleEs: 'Detección de Secretos con Entropía de Shannon',
    descriptionEn: 'Implement a function that detects high-entropy strings (potential API keys, tokens) in user input by calculating Shannon entropy.',
    descriptionEs: 'Implementa una función que detecte strings de alta entropía (posibles API keys, tokens) en input del usuario calculando entropía de Shannon.',
    difficulty: 'intermediate',
    type: 'coding',
    points: 25,
    language: 'typescript',
    hintsEn: [
      'Shannon entropy: H = -Σ(p(x) * log2(p(x))) where p(x) is the probability of character x',
      'High entropy (≥ 4.5) often indicates a random token',
      'Combine with regex patterns for known formats (sk_, AKIA, ghp_)'
    ],
    hintsEs: [
      'Entropía de Shannon: H = -Σ(p(x) * log2(p(x))) donde p(x) es la probabilidad del carácter x',
      'Alta entropía (≥ 4.5) indica un token aleatorio',
      'Combina con regex para formatos conocidos (sk_, AKIA, ghp_)'
    ],
    solutionEn: '```typescript\nexport function shannonEntropy(str: string): number {\n  const freq: Record<string, number> = {};\n  for (const ch of str) {\n    freq[ch] = (freq[ch] || 0) + 1;\n  }\n  const len = str.length;\n  let entropy = 0;\n  for (const ch in freq) {\n    const p = freq[ch] / len;\n    entropy -= p * Math.log2(p);\n  }\n  return entropy;\n}\n\nconst SECRET_PATTERNS = [\n  { name: "AWS Access Key", regex: /AKIA[0-9A-Z]{16}/ },\n  { name: "GitHub Token", regex: /ghp_[A-Za-z0-9]{36}/ },\n  { name: "OpenAI Key", regex: /sk-[A-Za-z0-9]{48}/ },\n  { name: "Stripe Key", regex: /sk_(test|live)_[A-Za-z0-9]{24,}/ },\n  { name: "Generic high-entropy", regex: /[A-Za-z0-9+/=]{40,}/ },\n];\n\nexport function detectSecrets(input: string): Array<{ type: string; match: string; entropy: number }> {\n  const results: Array<{ type: string; match: string; entropy: number }> = [];\n\n  for (const { name, regex } of SECRET_PATTERNS) {\n    for (const match of input.matchAll(regex)) {\n      results.push({\n        type: name,\n        match: match[0],\n        entropy: shannonEntropy(match[0]),\n      });\n    }\n  }\n\n  // Also flag any 40+ char high-entropy strings not caught above\n  for (const match of input.matchAll(/[A-Za-z0-9+/=._-]{40,}/g)) {\n    const ent = shannonEntropy(match[0]);\n    if (ent > 4.5 && !results.some(r => r.match === match[0])) {\n      results.push({ type: "High-entropy string", match: match[0], entropy: ent });\n    }\n  }\n\n  return results;\n}\n```',
    solutionEs: 'Combina regex específicos para formatos conocidos (AWS, GitHub, OpenAI, Stripe) con cálculo de entropía de Shannon para detectar strings de 40+ caracteres con entropía > 4.5.',
    explanationEn: 'Shannon entropy measures the average information per character. Random tokens (base64, hex) have high entropy (~5-6 bits/char) while natural language is around 1-2 bits/char. Combining regex patterns with entropy catches both known and unknown secret formats.',
    explanationEs: 'La entropía de Shannon mide la información promedio por carácter. Tokens aleatorios tienen alta entropía (~5-6 bits/char) mientras que el lenguaje natural tiene ~1-2 bits/char. Combinar regex con entropía captura formatos conocidos y desconocidos.',
    starterCode: 'export function shannonEntropy(str: string): number {\n  // Your implementation here\n  return 0;\n}',
    tags: ['security', 'detection', 'entropy', 'secrets'],
    resources: [
      { title: 'Shannon Entropy on Wikipedia', url: 'https://en.wikipedia.org/wiki/Entropy_(information_theory)', type: 'article' },
    ],
  },
  {
    id: 'pm-21',
    slug: 'password-manager',
    titleEn: 'Password Generator Cryptography',
    titleEs: 'Criptografía del Generador de Contraseñas',
    descriptionEn: 'Implement a cryptographically secure password generator with customizable character sets, length, and exclusion of ambiguous characters.',
    descriptionEs: 'Implementa un generador de contraseñas criptográficamente seguro con sets de caracteres personalizables, longitud, y exclusión de caracteres ambiguos.',
    difficulty: 'intermediate',
    type: 'coding',
    points: 25,
    language: 'typescript',
    hintsEn: [
      'Use crypto.getRandomValues (browser) or crypto.randomBytes (Node) to get randomness',
      'Rejection sampling: reject values that would bias the distribution',
      'Track the required character classes and verify at least one of each is present'
    ],
    hintsEs: [
      'Usa crypto.getRandomValues (browser) o crypto.randomBytes (Node) para aleatoriedad',
      'Rejection sampling: rechaza valores que sesgarían la distribución',
      'Rastrea las clases requeridas y verifica al menos una de cada una'
    ],
    solutionEn: '```typescript\nimport { randomBytes } from "crypto";\n\nconst AMBIGUOUS = new Set(["0", "O", "o", "1", "l", "I", "|", "i"]);\n\ninterface GeneratorOptions {\n  length: number;\n  uppercase?: boolean;\n  lowercase?: boolean;\n  digits?: boolean;\n  symbols?: boolean;\n  excludeAmbiguous?: boolean;\n  requireAll?: boolean;\n}\n\nfunction getCharset(options: GeneratorOptions): string {\n  const sets: string[] = [];\n  if (options.uppercase !== false) sets.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");\n  if (options.lowercase !== false) sets.push("abcdefghijklmnopqrstuvwxyz");\n  if (options.digits !== false) sets.push("0123456789");\n  if (options.symbols) sets.push("!@#$%^&*()_+-=[]{}|;:,.<>?");\n\n  let charset = sets.join("");\n  if (options.excludeAmbiguous) {\n    charset = charset.split("").filter(c => !AMBIGUOUS.has(c)).join("");\n  }\n  return charset;\n}\n\nexport function generatePassword(options: GeneratorOptions): string {\n  const charset = getCharset(options);\n  if (charset.length === 0) throw new Error("Empty character set");\n\n  const len = options.length;\n  const bytes = randomBytes(len);\n  let password = "";\n\n  // Rejection sampling for uniform distribution\n  const max = Math.floor(256 / charset.length) * charset.length;\n  for (let i = 0; i < len; i++) {\n    let byte;\n    do {\n      byte = bytes[i] ?? randomBytes(1)[0];\n    } while (byte >= max);\n    password += charset[byte % charset.length];\n  }\n\n  if (options.requireAll !== false) {\n    // Ensure at least one of each enabled class\n    const required: string[] = [];\n    if (options.uppercase !== false) required.push(...getUppercase(charset));\n    if (options.lowercase !== false) required.push(...getLowercase(charset));\n    if (options.digits !== false) required.push(...getDigits(charset));\n    if (options.symbols) required.push(...getSymbols(charset));\n\n    if (required.length > 0) {\n      const idx = randomBytes(1)[0] % password.length;\n      password = password.slice(0, idx) + required[0] + password.slice(idx + 1);\n    }\n  }\n\n  return password;\n}\n```',
    solutionEs: 'Genera con `crypto.randomBytes`, aplica rejection sampling para distribución uniforme, y fuerza al menos un carácter de cada clase requerida reemplazando un carácter aleatorio.',
    explanationEn: 'Naive `charset[byte % charset.length]` biases the distribution when the charset size doesn\'t divide 256 evenly. Rejection sampling discards bytes that would create bias. The `requireAll` option guarantees complexity requirements are met.',
    explanationEs: '`charset[byte % charset.length]` naive sesga la distribución cuando el tamaño del charset no divide 256 exactamente. Rejection sampling descarta bytes que crearían sesgo. La opción `requireAll` garantiza complejidad.',
    starterCode: 'import { randomBytes } from "crypto";\n\nexport function generatePassword(length: number = 20): string {\n  // Your implementation here\n  return "";\n}',
    tags: ['security', 'password-generator', 'cryptography'],
    resources: [
      { title: 'EFF Diceware', url: 'https://www.eff.org/dice', type: 'article' },
    ],
  },
  {
    id: 'pm-22',
    slug: 'password-manager',
    titleEn: 'SQL Injection Prevention',
    titleEs: 'Prevención de SQL Injection',
    descriptionEn: 'Show how to safely query a vault database for entries by URL or username, avoiding SQL injection. Compare parameterized queries vs ORMs.',
    descriptionEs: 'Muestra cómo consultar seguramente la BD de bóveda por URL o username, evitando SQL injection. Compara queries parametrizadas vs ORMs.',
    difficulty: 'intermediate',
    type: 'coding',
    points: 25,
    language: 'typescript',
    hintsEn: [
      'Never concatenate user input into SQL strings',
      'Use ? placeholders or named parameters',
      'ORMs like Prisma use parameterized queries by default'
    ],
    hintsEs: [
      'Nunca concatenes input del usuario en strings SQL',
      'Usa placeholders ? o parámetros nombrados',
      'ORMs como Prisma usan queries parametrizadas por default'
    ],
    solutionEn: `\`\`\`typescript\nimport Database from "better-sqlite3";\nimport { PrismaClient } from "@prisma/client";\n\n// ❌ VULNERABLE - NEVER do this\nasync function findByUrl_unsafe(db: Database.Database, url: string) {\n  return db.prepare(\\\`SELECT * FROM entries WHERE url = '\\\${url}'\\\`).all();\n  // Input: "' OR 1=1 --" → returns all entries!\n}\n\n// ✅ SAFE - Parameterized query (better-sqlite3)\nasync function findByUrl_safe(db: Database.Database, url: string) {\n  return db\n    .prepare("SELECT id, title, username, password FROM entries WHERE url = ?")\n    .all(url);\n}\n\n// ✅ SAFE - Prisma (also parameterized, with type safety)\nconst prisma = new PrismaClient();\n\nasync function findByUrl_prisma(url: string) {\n  return prisma.entry.findMany({\n    where: { url },\n    select: { id: true, title: true, username: true, password: true },\n  });\n}\n\n// ✅ SAFE - Allowlist validation for URL field\nfunction isValidUrl(url: string): boolean {\n  try {\n    const u = new URL(url);\n    return ["http:", "https:"].includes(u.protocol);\n  } catch {\n    return false;\n  }\n}\n\nasync function findByUrl_validated(db: Database.Database, rawUrl: string) {\n  if (!isValidUrl(rawUrl)) throw new Error("Invalid URL");\n  return findByUrl_safe(db, rawUrl);\n}\n\`\`\``,
    solutionEs: 'Nunca concatenes input en SQL. Usa queries parametrizadas (`?` o `:name`) con `better-sqlite3`, o un ORM como Prisma. Añade validación de allowlist (URL parsing) como capa extra.',
    explanationEn: 'SQL injection happens when untrusted input is concatenated into a query string. The fix is parameterized queries: the database driver treats `?` as a placeholder for a value, not as part of the SQL syntax. Prisma generates parameterized queries automatically.',
    explanationEs: 'SQL injection ocurre cuando input no confiable se concatena en un string de query. La solución son queries parametrizadas: el driver trata `?` como placeholder de un valor, no como parte de la sintaxis SQL.',
    starterCode: 'import Database from "better-sqlite3";\n\nexport function findByUrl(db: Database.Database, url: string) {\n  // Your implementation here (must be SQL-injection safe)\n  return db.prepare("SELECT * FROM entries").all();\n}',
    tags: ['security', 'sql-injection', 'database', 'prisma'],
    resources: [
      { title: 'OWASP SQL Injection', url: 'https://owasp.org/www-community/attacks/SQL_Injection', type: 'documentation' },
    ],
  },
  {
    id: 'pm-23',
    slug: 'password-manager',
    titleEn: 'CSRF Protection Strategy',
    titleEs: 'Estrategia de Protección CSRF',
    descriptionEn: 'Explain how to protect the password manager API against CSRF attacks, especially for state-changing operations like creating or modifying entries.',
    descriptionEs: 'Explica cómo proteger la API del password manager contra ataques CSRF, especialmente para operaciones que cambian estado como crear o modificar entradas.',
    difficulty: 'intermediate',
    type: 'conceptual',
    points: 25,
    hintsEn: [
      'SameSite cookies block most CSRF automatically',
      'For defense in depth, use double-submit cookies or synchronizer tokens',
      'Always check the Origin header for state-changing requests'
    ],
    hintsEs: [
      'Cookies SameSite bloquean la mayoría de CSRF automáticamente',
      'Para defensa en profundidad, usa double-submit cookies o tokens sincronizadores',
      'Siempre verifica el header Origin en requests que cambian estado'
    ],
    solutionEn: '**Layered CSRF Defense**\n\n**Layer 1: SameSite Cookies (Primary)**\n```typescript\n// When setting the session cookie\nres.setHeader(\n  "Set-Cookie",\n  `session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/`\n);\n// SameSite=Strict: cookie not sent on cross-site requests at all\n// SameSite=Lax: only sent on top-level navigations (GET)\n```\n\n**Layer 2: Origin/Referer Validation (Always)**\n```typescript\nconst ALLOWED_ORIGINS = new Set([\n  "https://app.passwordmanager.com",\n  "https://www.passwordmanager.com",\n]);\n\napp.use((req, res, next) => {\n  if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {\n    const origin = req.headers.origin || req.headers.referer;\n    if (!origin || !ALLOWED_ORIGINS.has(new URL(origin).origin)) {\n      return res.status(403).json({ error: "Forbidden" });\n    }\n  }\n  next();\n});\n```\n\n**Layer 3: Custom Header (for AJAX)**\n- Require `X-Requested-With: XMLHttpRequest` header\n- Browsers block custom headers on cross-origin requests without CORS preflight\n\n**Layer 4: Double-Submit Cookie (for non-AJAX forms)**\n```typescript\n// Set random CSRF token in cookie (not HttpOnly)\nres.cookie("csrf", generateToken(), { secure: true, sameSite: "strict" });\n// Client reads cookie, sends in header on state-changing requests\n// Server compares cookie value vs header value\n```',
    solutionEs: 'Defensa en capas: SameSite cookies (primary), validación de Origin (always), header custom (AJAX), double-submit cookie (forms no-AJAX).',
    explanationEn: 'CSRF tricks the user\'s browser into making authenticated requests. The defense: ensure state-changing requests come from your site, not from a malicious one. SameSite cookies are the modern primary defense; origin checks and CSRF tokens add depth for legacy browsers.',
    explanationEs: 'CSRF engaña al navegador del usuario para hacer requests autenticadas. La defensa: asegurar que los requests que cambian estado vienen de tu sitio, no de uno malicioso. SameSite es la defensa primaria moderna.',
    tags: ['security', 'csrf', 'cookies', 'headers'],
    resources: [
      { title: 'OWASP CSRF Prevention Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html', type: 'documentation' },
    ],
  },
  {
    id: 'pm-24',
    slug: 'password-manager',
    titleEn: 'Secure Form Input Components',
    titleEs: 'Componentes Seguros de Input',
    descriptionEn: 'Build a React PasswordInput component that prevents copy/paste, hides the value from dev tools, and supports reveal-on-hover without leaking the value to other components.',
    descriptionEs: 'Construye un componente React PasswordInput que prevenga copy/paste, oculte el valor de dev tools, y soporte reveal-on-hover sin filtrar el valor a otros componentes.',
    difficulty: 'intermediate',
    type: 'coding',
    points: 25,
    language: 'typescript',
    hintsEn: [
      'Use `onCopy` and `onPaste` handlers with preventDefault',
      'Store the value in a ref instead of state to keep it out of React DevTools',
      'For reveal-on-hover, use a controlled secondary state separate from the actual value'
    ],
    hintsEs: [
      'Usa handlers `onCopy` y `onPaste` con preventDefault',
      'Almacena el valor en un ref en lugar de state para mantenerlo fuera de React DevTools',
      'Para reveal-on-hover, usa un state secundario controlado separado del valor real'
    ],
    solutionEn: '```tsx\nimport { useState, useRef, useCallback, InputHTMLAttributes, forwardRef } from "react";\n\ninterface SecurePasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {\n  value: string;\n  onChange: (value: string) => void;\n}\n\nexport const SecurePasswordInput = forwardRef<HTMLInputElement, SecurePasswordInputProps>(\n  ({ value, onChange, onCopy, onPaste, ...rest }, ref) => {\n    const [revealed, setRevealed] = useState(false);\n    const inputRef = useRef<HTMLInputElement>(null);\n\n    const handleCopy = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {\n      e.preventDefault();\n      onCopy?.(e);\n    }, [onCopy]);\n\n    const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {\n      e.preventDefault();\n      onPaste?.(e);\n    }, [onPaste]);\n\n    const handleCut = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {\n      e.preventDefault();\n    }, []);\n\n    return (\n      <div className="relative" onMouseEnter={() => setRevealed(true)} onMouseLeave={() => setRevealed(false)}>\n        <input\n          {...rest}\n          ref={(node) => {\n            inputRef.current = node;\n            if (typeof ref === "function") ref(node);\n            else if (ref) ref.current = node;\n          }}\n          type={revealed ? "text" : "password"}\n          value={value}\n          onChange={(e) => onChange(e.target.value)}\n          onCopy={handleCopy}\n          onPaste={handlePaste}\n          onCut={handleCut}\n          autoComplete="off"\n          spellCheck={false}\n          data-form-type="other"\n        />\n        {revealed && (\n          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">\n            Revealed\n          </span>\n        )}\n      </div>\n    );\n  }\n);\nSecurePasswordInput.displayName = "SecurePasswordInput";\n```',
    solutionEs: 'Input con type "password" por defecto, reveal-on-hover cambia a "text", preventDefault en onCopy/onPaste/onCut, autoComplete off, spellCheck false.',
    explanationEn: 'Password inputs in React leak the value to the React DevTools component tree (because they\'re in state/props). Preventing copy/paste/cut reduces accidental exposure. Reveal-on-hover is a UX trade-off: useful but briefly shows the value on screen.',
    explanationEs: 'Los inputs de password en React filtran el valor al árbol de componentes en React DevTools. Prevenir copy/paste/cut reduce exposición accidental. Reveal-on-hover es un trade-off de UX.',
    starterCode: 'import { useState } from "react";\n\nexport function SecurePasswordInput({ value, onChange }: {\n  value: string;\n  onChange: (v: string) => void;\n}) {\n  // Your implementation here\n  return <input type="password" value={value} onChange={e => onChange(e.target.value)} />;\n}',
    tags: ['security', 'react', 'input', 'ux'],
    resources: [
      { title: 'React security best practices', url: 'https://react.dev/reference/react-dom/components/input#security', type: 'article' },
    ],
  },
  {
    id: 'pm-25',
    slug: 'password-manager',
    titleEn: 'Vault Backup and Disaster Recovery',
    titleEs: 'Backup de Bóveda y Recuperación de Desastres',
    descriptionEn: 'Design a backup strategy for an encrypted password vault: what to back up, where, how often, and how to test recovery.',
    descriptionEs: 'Diseña una estrategia de backup para una bóveda cifrada: qué respaldar, dónde, con qué frecuencia, y cómo testear la recuperación.',
    difficulty: 'intermediate',
    type: 'conceptual',
    points: 25,
    hintsEn: [
      'Back up the encrypted vault blob, not decrypted entries',
      '3-2-1 rule: 3 copies, 2 different media, 1 offsite',
      'Test recovery quarterly - an untested backup is not a backup'
    ],
    hintsEs: [
      'Respalda el blob cifrado de la bóveda, no las entradas descifradas',
      'Regla 3-2-1: 3 copias, 2 medios diferentes, 1 offsite',
      'Testea la recuperación trimestralmente - un backup no testeado no es backup'
    ],
    solutionEn: '**3-2-1 Backup Strategy**\n\n**What to back up:**\n- The encrypted vault file (single blob, encrypted with master key)\n- The master password hint (if any) - encrypted separately\n- NOT the master password itself\n- NOT any decrypted entries\n\n**Where to store:**\n1. **Primary**: User device (always-available local copy)\n2. **Secondary**: Cloud sync (iCloud, Google Drive, Dropbox) - encrypted blob only\n3. **Tertiary**: Offline backup (USB drive in a safe) - monthly snapshot\n4. **Quaternary (optional)**: Trusted family member escrow (Shamir\'s Secret Sharing)\n\n**How often:**\n- Cloud sync: real-time or on every change\n- Offline snapshot: monthly\n- Full export: quarterly (for long-term archival)\n\n**Recovery testing (quarterly):**\n1. Create test vault with known passwords\n2. Restore from each backup location\n3. Verify all entries are present and decryptable\n4. Time the recovery process (target: < 30 minutes)\n5. Document any issues and update runbook\n\n**Disaster scenarios:**\n- Lost device: restore from cloud sync\n- Forgotten master password: rely on hints + trusted contacts\n- Compromised cloud: rotate master password (re-encrypt everything)\n- Death/incapacity: trusted contact with Shamir share can recover\n\n**Shamir\'s Secret Sharing (advanced):**\n- Split master password into 5 shares, any 3 reconstruct it\n- Distribute to 5 trusted contacts\n- No single contact can compromise the vault',
    solutionEs: 'Regla 3-2-1: 3 copias, 2 medios, 1 offsite. El blob cifrado (no entries descifradas), sync en cloud, snapshot offline mensual, y test de recuperación trimestral.',
    explanationEn: 'A backup of an encrypted vault is small (a single encrypted blob), cheap to maintain, and easy to test. The hard part is the master password: lose it and the backups are useless. This is why master password hints, emergency access, and Shamir sharing exist.',
    explanationEs: 'Un backup de bóveda cifrada es pequeño (un blob), barato, y fácil de testear. La parte difícil es la contraseña maestra: si se pierde, los backups son inútiles. Por eso existen hints, emergency access y Shamir sharing.',
    tags: ['security', 'backup', 'disaster-recovery', 'operations'],
    resources: [
      { title: 'NIST 800-34 Contingency Planning', url: 'https://csrc.nist.gov/publications/detail/sp/800-34/rev-1/final', type: 'documentation' },
    ],
  },
]
