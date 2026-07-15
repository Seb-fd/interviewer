-- ============================================
-- 003_seed_questions.sql
-- Tech Interview Challenge Platform
-- 168+ Questions across all categories
-- Created: Julio 14, 2026
-- ============================================

DO $$
DECLARE
    pm_category_id UUID;
    sm_category_id UUID;
    mm_category_id UUID;
    ge_category_id UUID;
    hb_category_id UUID;
    rh_category_id UUID;
    nx_category_id UUID;
    dp_category_id UUID;
    sa_category_id UUID;
    rt_category_id UUID;
    sm_state_category_id UUID;
    tc_category_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO pm_category_id FROM categories WHERE slug = 'password-manager';
    SELECT id INTO sm_category_id FROM categories WHERE slug = 'social-media-app';
    SELECT id INTO mm_category_id FROM categories WHERE slug = 'multiplayer-mini-game';
    SELECT id INTO ge_category_id FROM categories WHERE slug = 'gitanas-ecommerce';
    SELECT id INTO hb_category_id FROM categories WHERE slug = 'hermit-bar';
    SELECT id INTO rh_category_id FROM categories WHERE slug = 'react-hooks';
    SELECT id INTO nx_category_id FROM categories WHERE slug = 'nextjs';
    SELECT id INTO dp_category_id FROM categories WHERE slug = 'database-prisma';
    SELECT id INTO sa_category_id FROM categories WHERE slug = 'security-auth';
    SELECT id INTO rt_category_id FROM categories WHERE slug = 'realtime-systems';
    SELECT id INTO sm_state_category_id FROM categories WHERE slug = 'state-management';
    SELECT id INTO tc_category_id FROM categories WHERE slug = 'testing-cicd';

    -- ============================================
    -- PASSWORD MANAGER QUESTIONS (25 questions)
    -- ============================================

    -- Basic (5)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (pm_category_id, 'basic', 'conceptual',
     'What is the difference between hashing and encryption? When would you use each?',
     '¿Cuál es la diferencia entre hashing y encriptación? ¿Cuándo usarías cada uno?',
     'Hashing is one-way, encryption is reversible. Use hashing for passwords, encryption for readable data.',
     'El hashing es unidireccional, la encriptación es reversible. Usa hashing para passwords, encriptación para datos legibles.',
     10, ARRAY['security', 'basics']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (pm_category_id, 'basic', 'conceptual',
     'What is a salt in password security and why is it important?',
     '¿Qué es un salt en seguridad de passwords y por qué es importante?',
     'A salt is random data added to passwords before hashing to ensure identical passwords produce different hashes.',
     'Un salt es dato aleatorio añadido a passwords antes de hashing para asegurar que passwords idénticos produzcan hashes diferentes.',
     10, ARRAY['security', 'basics']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (pm_category_id, 'basic', 'conceptual',
     'What is the purpose of a password manager?',
     '¿Cuál es el propósito de un gestor de contraseñas?',
     'Password managers securely store and generate complex passwords, eliminating the need to remember them.',
     'Los gestores de contraseñas almacenan y generan passwords complejos de forma segura, eliminando la necesidad de recordarlos.',
     10, ARRAY['security', 'basics']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (pm_category_id, 'basic', 'conceptual',
     'What is multi-factor authentication (MFA)?',
     '¿Qué es la autenticación de múltiples factores (MFA)?',
     'MFA requires two or more verification methods: something you know (password), have (token), or are (biometrics).',
     'MFA requiere dos o más métodos de verificación: algo que sabes (password), tienes (token), o eres (biométricos).',
     10, ARRAY['security', 'basics']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (pm_category_id, 'basic', 'conceptual',
     'Why is it bad to reuse passwords across different services?',
     '¿Por qué es malo reutilizar passwords en diferentes servicios?',
     'If one service is breached, all accounts with the same password are compromised.',
     'Si un servicio es comprometido, todas las cuentas con el mismo password están comprometidas.',
     10, ARRAY['security', 'basics']);

    -- Intermediate (8)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (pm_category_id, 'intermediate', 'coding',
     'Implement a function that generates a cryptographically secure random password with specified length and character sets.',
     'Implementa una función que genere un password aleatorio criptográficamente seguro con longitud especificada y juegos de caracteres.',
     'Use crypto.randomBytes() and filter for required character classes.',
     'Usa crypto.randomBytes() y filtra para las clases de caracteres requeridas.',
     25, ARRAY['security', 'encryption']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (pm_category_id, 'intermediate', 'conceptual',
     'Explain the concept of "zero-knowledge" in password verification.',
     'Explica el concepto de "zero-knowledge" en verificación de passwords.',
     'Zero-knowledge means the server can verify a password without ever storing or seeing the actual password.',
     'Zero-knowledge significa que el servidor puede verificar un password sin nunca almacenar o ver el password real.',
     25, ARRAY['security', 'zero-knowledge']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (pm_category_id, 'intermediate', 'coding',
     'Write a function that safely compares two strings in constant time to prevent timing attacks.',
     'Escribe una función que compare dos strings de forma segura en tiempo constante para prevenir ataques de tiempo.',
     'Use crypto.timingSafeEqual() or implement constant-time comparison manually.',
     'Usa crypto.timingSafeEqual() o implementa comparación de tiempo constante manualmente.',
     25, ARRAY['security', 'timing-attacks']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (pm_category_id, 'intermediate', 'conceptual',
     'What is PBKDF2 and when would you use it?',
     '¿Qué es PBKDF2 y cuándo lo usarías?',
     'PBKDF2 applies a pseudorandom function to a password with many iterations to derive keys.',
     'PBKDF2 aplica una función pseudoaleatoria a un password con muchas iteraciones para derivar claves.',
     25, ARRAY['security', 'encryption']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (pm_category_id, 'intermediate', 'conceptual',
     'Explain what happens when a user forgets their master password in a zero-knowledge password manager.',
     'Explica qué pasa cuando un usuario olvida su password maestro en un gestor zero-knowledge.',
     'Without the master password, the encrypted vault cannot be decrypted - the data is lost forever.',
     'Sin el password maestro, la bóveda encriptada no puede ser descifrada - los datos se pierden para siempre.',
     25, ARRAY['security', 'zero-knowledge']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (pm_category_id, 'intermediate', 'coding',
     'Implement a function that encrypts data using AES-256-GCM.',
     'Implementa una función que encripte datos usando AES-256-GCM.',
     'Use crypto.createCipheriv() with random IV for each encryption.',
     'Usa crypto.createCipheriv() con IV aleatorio para cada encriptación.',
     25, ARRAY['security', 'encryption']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (pm_category_id, 'intermediate', 'conceptual',
     'What is the difference between symmetric and asymmetric encryption?',
     '¿Cuál es la diferencia entre encriptación simétrica y asimétrica?',
     'Symmetric uses the same key for encrypt/decrypt. Asymmetric uses a key pair (public/private).',
     'Simétrica usa la misma clave para encriptar/desencriptar. Asimétrica usa un par de claves (pública/privada).',
     25, ARRAY['security', 'encryption']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (pm_category_id, 'intermediate', 'conceptual',
     'What is a key derivation function (KDF)?',
     '¿Qué es una función de derivación de claves (KDF)?',
     'A KDF derives one or more secret keys from a master secret like a password.',
     'Una KDF deriva una o más claves secretas de un secreto maestro como un password.',
     25, ARRAY['security', 'encryption']);

    -- Advanced (7)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (pm_category_id, 'advanced', 'coding',
     'Implement Argon2id password hashing with secure defaults.',
     'Implementa hashing de passwords con Argon2id con valores seguros.',
     'Use argon2.hash() with type: argon2id, memoryCost: 65536, timeCost: 3, parallelism: 4.',
     'Usa argon2.hash() con type: argon2id, memoryCost: 65536, timeCost: 3, parallelism: 4.',
     50, ARRAY['security', 'argon2']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (pm_category_id, 'advanced', 'conceptual',
     'Explain the security model of a browser-based password manager.',
     'Explica el modelo de seguridad de un gestor de passwords basado en navegador.',
     'Discusses sandboxing, encryption, sync security, and potential attack vectors.',
     'Discute sandboxing, encriptación, seguridad de sync, y vectores de ataque potenciales.',
     50, ARRAY['security', 'architecture']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (pm_category_id, 'advanced', 'coding',
     'Design and implement a secure password vault with AES-256 encryption.',
     'Diseña e implementa una bóveda de passwords segura con encriptación AES-256.',
     'Encrypt vault with derived key from master password using PBKDF2/Argon2.',
     'Encripta la bóveda con clave derivada del password maestro usando PBKDF2/Argon2.',
     50, ARRAY['security', 'architecture']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (pm_category_id, 'advanced', 'conceptual',
     'What is the "remember me" cookie security issue and how do you mitigate it?',
     '¿Cuál es el problema de seguridad de cookies "recordarme" y cómo lo mitigas?',
     'Long-lived tokens can be stolen. Use refresh tokens, short expiry, and secure flags.',
     'Tokens de larga vida pueden ser robados. Usa refresh tokens, corta expiración, y flags seguros.',
     50, ARRAY['security', 'authentication']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (pm_category_id, 'advanced', 'conceptual',
     'How would you implement secure password recovery without storing passwords?',
     '¿Cómo implementarías recuperación de password segura sin almacenar passwords?',
     'Use encrypted recovery codes, email verification, or security questions with proper hashing.',
     'Usa códigos de recuperación encriptados, verificación por email, o preguntas de seguridad con hashing propio.',
     50, ARRAY['security', 'recovery']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (pm_category_id, 'advanced', 'coding',
     'Implement a rate limiter for login attempts using Redis.',
     'Implementa un limitador de tasa para intentos de login usando Redis.',
     'Use sliding window algorithm with Redis INCR and EXPIRE.',
     'Usa algoritmo de ventana deslizante con INCR y EXPIRE de Redis.',
     50, ARRAY['security', 'rate-limiting']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (pm_category_id, 'advanced', 'conceptual',
     'What is credential stuffing and how do you protect against it?',
     '¿Qué es credential stuffing y cómo te proteges contra ello?',
     'Use rate limiting, CAPTCHA, breach detection, and encourage unique passwords.',
     'Usa limitación de tasa, CAPTCHA, detección de breaches, y encourage passwords únicos.',
     50, ARRAY['security', 'attacks']);

    -- Senior (5)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (pm_category_id, 'senior', 'conceptual',
     'Design a zero-knowledge password manager architecture.',
     'Diseña una arquitectura de gestor de passwords zero-knowledge.',
     'Client-side encryption, server stores only encrypted blobs, master password never leaves client.',
     'Encriptación del lado del cliente, servidor almacena solo blobs encriptados, password maestro nunca sale del cliente.',
     100, ARRAY['security', 'architecture', 'zero-knowledge']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (pm_category_id, 'senior', 'coding',
     'Implement the SRP-6a protocol for password authentication.',
     'Implementa el protocolo SRP-6a para autenticación de passwords.',
     'Complex mathematical protocol involving modular exponentiation and shared secrets.',
     'Protocolo matemático complejo involucrando exponenciación modular y secretos compartidos.',
     100, ARRAY['security', 'srp', 'protocol']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (pm_category_id, 'senior', 'conceptual',
     'Explain how Passkeys (FIDO2) work and their advantages over passwords.',
     'Explica cómo funcionan Passkeys (FIDO2) y sus ventajas sobre passwords.',
     'Public key cryptography, phishing-resistant, no server storage of secrets.',
     'Criptografía de clave pública, resistente a phishing, sin almacenamiento de secretos en servidor.',
     100, ARRAY['security', 'passkeys', 'fido2']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (pm_category_id, 'senior', 'coding',
     'Implement a secure audit logging system for password manager access.',
     'Implementa un sistema de logging de auditoría seguro para acceso al gestor de passwords.',
     'Use append-only logs, hash chain, and asymmetric signing.',
     'Usa logs de solo append, cadena de hashes, y firma asimétrica.',
     100, ARRAY['security', 'audit']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (pm_category_id, 'senior', 'conceptual',
     'Design a multi-device sync mechanism for a zero-knowledge password manager.',
     'Diseña un mecanismo de sync multi-dispositivo para un gestor de passwords zero-knowledge.',
     'End-to-end encrypted sync, key exchange via secure channel, conflict resolution.',
     'Sync encriptado end-to-end, intercambio de claves vía canal seguro, resolución de conflictos.',
     100, ARRAY['security', 'sync', 'architecture']);

    -- ============================================
    -- SOCIAL MEDIA APP QUESTIONS (25 questions)
    -- ============================================

    -- Basic (5)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_category_id, 'basic', 'conceptual',
     'What are Server Actions in Next.js and when should you use them?',
     '¿Qué son Server Actions en Next.js y cuándo deberías usarlas?',
     'Server Actions are async functions that run on the server and can be called from client components.',
     'Server Actions son funciones asíncronas que corren en el servidor y pueden ser llamadas desde componentes cliente.',
     10, ARRAY['nextjs', 'server-actions']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_category_id, 'basic', 'conceptual',
     'What is optimistic UI updates and why are they important?',
     '¿Qué son actualizaciones UI optimistas y por qué son importantes?',
     'UI updates immediately before server confirms, giving instant feedback to users.',
     'Actualizaciones de UI inmediatamente antes de confirmación del servidor, dando feedback instantáneo.',
     10, ARRAY['ux', 'optimistic']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_category_id, 'basic', 'conceptual',
     'What is the difference between CRUD operations and real-time operations?',
     '¿Cuál es la diferencia entre operaciones CRUD y operaciones en tiempo real?',
     'CRUD is create, read, update, delete. Real-time pushes updates instantly without polling.',
     'CRUD es crear, leer, actualizar, borrar. Tiempo real empuja actualizaciones instantáneamente sin polling.',
     10, ARRAY['architecture', 'realtime']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_category_id, 'basic', 'conceptual',
     'What is a social graph in the context of social media?',
     '¿Qué es un grafo social en el contexto de redes sociales?',
     'A data structure representing relationships between users (friends, followers, etc).',
     'Una estructura de datos representando relaciones entre usuarios (amigos, seguidores, etc).',
     10, ARRAY['architecture', 'social']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_category_id, 'basic', 'conceptual',
     'What are webhooks and when would you use them?',
     '¿Qué son webhooks y cuándo los usarías?',
     'HTTP callbacks that notify other systems when events occur.',
     'Callbacks HTTP que notifican a otros sistemas cuando ocurren eventos.',
     10, ARRAY['architecture', 'webhooks']);

    -- Intermediate (8)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_category_id, 'intermediate', 'coding',
     'Implement a function that handles infinite scroll pagination.',
     'Implementa una función que maneje paginación infinite scroll.',
     'Use cursor-based pagination with intersection observer for triggering loads.',
     'Usa paginación basada en cursor con intersection observer para cargar más.',
     25, ARRAY['pagination', 'ui']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_category_id, 'intermediate', 'conceptual',
     'How would you design a notification system for a social media app?',
     '¿Cómo diseñarías un sistema de notificaciones para una app de redes sociales?',
     'Discuss push notifications, in-app notifications, email, batching, and delivery guarantees.',
     'Discute push notifications, notificaciones in-app, email, batching, y garantías de entrega.',
     25, ARRAY['architecture', 'notifications']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_category_id, 'intermediate', 'conceptual',
     'What is the N+1 query problem and how do you solve it?',
     '¿Cuál es el problema de consultas N+1 y cómo lo resuelves?',
     'When fetching a list then making individual queries for each item. Solve with JOINs or batch queries.',
     'Cuando recuperas una lista y luego haces consultas individuales para cada item. Resuelve con JOINs o consultas batch.',
     25, ARRAY['database', 'performance']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_category_id, 'intermediate', 'coding',
     'Implement a Server Action that creates a new post with image upload.',
     'Implementa un Server Action que cree un nuevo post con subida de imagen.',
     'Use FormData, upload to storage, save URL to database.',
     'Usa FormData, sube a almacenamiento, guarda URL en base de datos.',
     25, ARRAY['nextjs', 'server-actions']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_category_id, 'intermediate', 'conceptual',
     'What are the differences between pull and push models for real-time updates?',
     '¿Cuáles son las diferencias entre modelos pull y push para actualizaciones en tiempo real?',
     'Pull: client polls periodically. Push: server notifies client immediately (WebSockets, SSE).',
     'Pull: cliente consulta periódicamente. Push: servidor notifica inmediatamente (WebSockets, SSE).',
     25, ARRAY['realtime', 'architecture']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_category_id, 'intermediate', 'conceptual',
     'How would you implement mentions (@username) and hashtags in a post?',
     '¿Cómo implementarías menciones (@usuario) y hashtags en un post?',
     'Use regex to extract patterns, then lookup and link to users/topics.',
     'Usa regex para extraer patrones, luego busca y enlaza a usuarios/temas.',
     25, ARRAY['features', 'parsing']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_category_id, 'intermediate', 'conceptual',
     'What is event sourcing and when is it useful?',
     '¿Qué es event sourcing y cuándo es útil?',
     'Storing all state changes as events rather than current state. Good for audit trails and complex domains.',
     'Almacenar todos los cambios de estado como eventos en lugar del estado actual. Bueno para auditorías y dominios complejos.',
     25, ARRAY['architecture', 'events']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_category_id, 'intermediate', 'conceptual',
     'How do you handle file uploads at scale?',
     '¿Cómo manejas subida de archivos a escala?',
     'Use object storage (S3), presigned URLs, CDN distribution, and cleanup policies.',
     'Usa almacenamiento de objetos (S3), URLs pre-firmadas, distribución CDN, y políticas de limpieza.',
     25, ARRAY['architecture', 'storage']);

    -- Advanced (7)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_category_id, 'advanced', 'coding',
     'Implement a real-time notification system using Server-Sent Events.',
     'Implementa un sistema de notificaciones en tiempo real usando Server-Sent Events.',
     'SSE endpoint that streams events, client EventSource, server publishes to subscribers.',
     'Endpoint SSE que transmite eventos, EventSource del cliente, servidor publica a suscriptores.',
     50, ARRAY['realtime', 'sse']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_category_id, 'advanced', 'conceptual',
     'Design a followers/following system that can scale to millions of users.',
     'Diseña un sistema de seguidores/siguiendo que pueda escalar a millones de usuarios.',
     'Fan-out on read vs write, hybrid approaches, denormalization, caching strategies.',
     'Fan-out en lectura vs escritura, enfoques híbridos, desnormalización, estrategias de cache.',
     50, ARRAY['architecture', 'scale']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_category_id, 'advanced', 'conceptual',
     'What is the fanout problem in social media feeds?',
     '¿Cuál es el problema de fanout en feeds de redes sociales?',
     'When posting, notifying all followers can be expensive. Solutions: fanout on write vs read.',
     'Cuando se postea, notificar a todos los seguidores puede ser caro. Soluciones: fanout en escritura vs lectura.',
     50, ARRAY['architecture', 'feed']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_category_id, 'advanced', 'coding',
     'Implement optimistic UI updates for liking a post.',
     'Implementa actualizaciones UI optimistas para dar like a un post.',
     'Update local state immediately, send request, rollback on error.',
     'Actualiza estado local inmediatamente, envía request, revierte en error.',
     50, ARRAY['ux', 'optimistic']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_category_id, 'advanced', 'conceptual',
     'How would you implement content moderation at scale?',
     '¿Cómo implementarías moderación de contenido a escala?',
     'AI classifiers, human review queues, user reporting, appeal processes.',
     'Clasificadores AI, colas de revisión humana, reportes de usuarios, procesos de apelación.',
     50, ARRAY['features', 'moderation']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_category_id, 'advanced', 'conceptual',
     'Design a search feature for finding users and content.',
     'Diseña una función de búsqueda para encontrar usuarios y contenido.',
     'Full-text search indexes, faceted search, ranking algorithms, caching.',
     'Índices de búsqueda full-text, búsqueda facetada, algoritmos de ranking, cache.',
     50, ARRAY['features', 'search']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_category_id, 'advanced', 'conceptual',
     'What are the challenges of implementing end-to-end encryption in a social media app?',
     '¿Cuáles son los desafíos de implementar encriptación end-to-end en una app de redes sociales?',
     'Key exchange, message recovery, device management, group chats complexity.',
     'Intercambio de claves, recuperación de mensajes, gestión de dispositivos, complejidad de chats grupales.',
     50, ARRAY['security', 'encryption']);

    -- Senior (5)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_category_id, 'senior', 'conceptual',
     'Design a scalable architecture for a social media feed that supports billions of posts.',
     'Diseña una arquitectura escalable para un feed de redes sociales que soporte miles de millones de posts.',
     'Microservices, CQRS, event sourcing, graph databases for social graph, CDN for media.',
     'Microservicios, CQRS, event sourcing, bases de datos de grafos para grafo social, CDN para media.',
     100, ARRAY['architecture', 'scale']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_category_id, 'senior', 'coding',
     'Implement a Server Action that processes a viral post with millions of potential interactions.',
     'Implementa un Server Action que procese un post viral con millones de interacciones potenciales.',
     'Rate limiting, queue processing, eventual consistency, idempotency.',
     'Limitación de tasa, procesamiento en cola, consistencia eventual, idempotencia.',
     100, ARRAY['scale', 'architecture']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_category_id, 'senior', 'conceptual',
     'How would you design a messaging system that supports end-to-end encryption?',
     '¿Cómo diseñarías un sistema de mensajería que soporte encriptación end-to-end?',
     'Signal protocol, key verification, forward secrecy, message requests.',
     'Protocolo Signal, verificación de claves, secreto hacia adelante, solicitudes de mensaje.',
     100, ARRAY['security', 'messaging']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_category_id, 'senior', 'conceptual',
     'Design an analytics pipeline for tracking user engagement metrics.',
     'Diseña un pipeline de analítica para rastrear métricas de engagement de usuarios.',
     'Event streaming, aggregation, real-time dashboards, historical analysis.',
     'Streaming de eventos, agregación, dashboards en tiempo real, análisis histórico.',
     100, ARRAY['architecture', 'analytics']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_category_id, 'senior', 'conceptual',
     'What are the trade-offs between SQL and NoSQL databases for social media applications?',
     '¿Cuáles son los trade-offs entre bases de datos SQL y NoSQL para aplicaciones de redes sociales?',
     'SQL: consistency, complex queries. NoSQL: scale, flexibility. Hybrid approaches often best.',
     'SQL: consistencia, queries complejas. NoSQL: escala, flexibilidad. Enfoques híbridos suelen ser mejores.',
     100, ARRAY['database', 'architecture']);

    -- ============================================
    -- MULTIPLAYER MINI GAME QUESTIONS (20 questions)
    -- ============================================

    -- Basic (4)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (mm_category_id, 'basic', 'conceptual',
     'What is Socket.io and what does it handle automatically?',
     '¿Qué es Socket.io y qué maneja automáticamente?',
     'WebSocket abstraction with fallback, connection handling, reconnection, rooms.',
     'Abstracción de WebSocket con fallback, manejo de conexiones, reconexión, salas.',
     10, ARRAY['socketio', 'basics']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (mm_category_id, 'basic', 'conceptual',
     'What is the difference between TCP and UDP in game networking?',
     '¿Cuál es la diferencia entre TCP y UDP en redes de juegos?',
     'TCP: reliable, ordered. UDP: fast, unreliable. Games often use UDP for real-time data.',
     'TCP: confiable, ordenado. UDP: rápido, no confiable. Juegos suelen usar UDP para datos en tiempo real.',
     10, ARRAY['networking', 'protocols']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (mm_category_id, 'basic', 'conceptual',
     'What is client-side prediction in multiplayer games?',
     '¿Qué es predicción del lado del cliente en juegos multiplayer?',
     'Client predicts game state locally for instant feedback, reconciles with server later.',
     'Cliente predice estado del juego localmente para feedback instantáneo, reconcial con servidor después.',
     10, ARRAY['game-networking', 'prediction']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (mm_category_id, 'basic', 'conceptual',
     'What is latency compensation in multiplayer games?',
     '¿Qué es compensación de latencia en juegos multiplayer?',
     'Techniques to hide network delay: prediction, interpolation, reconciliation.',
     'Técnicas para ocultar delay de red: predicción, interpolación, reconciliación.',
     10, ARRAY['game-networking', 'latency']);

    -- Intermediate (6)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (mm_category_id, 'intermediate', 'coding',
     'Implement a Socket.io room system for game matchmaking.',
     'Implementa un sistema de salas Socket.io para matchmaking de juegos.',
     'Use socket.join(roomId), handle room events, cleanup on disconnect.',
     'Usa socket.join(roomId), maneja eventos de sala, limpieza en desconexión.',
     25, ARRAY['socketio', 'rooms']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (mm_category_id, 'intermediate', 'conceptual',
     'What is the server authority model in multiplayer games?',
     '¿Qué es el modelo de autoridad del servidor en juegos multiplayer?',
     'Server is single source of truth, clients send inputs, server runs simulation.',
     'Servidor es la única fuente de verdad, clientes envían inputs, servidor corre simulación.',
     25, ARRAY['game-networking', 'architecture']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (mm_category_id, 'intermediate', 'conceptual',
     'How do you handle desync between client and server?',
     '¿Cómo manejas desincronización entre cliente y servidor?',
     'Snapshots, delta compression, reconciliation, sometimes just snap to correct state.',
     'Snapshots, compresión delta, reconciliación, a veces solo snap al estado correcto.',
     25, ARRAY['game-networking', 'sync']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (mm_category_id, 'intermediate', 'coding',
     'Implement input handling that supports both keyboard and gamepad.',
     'Implementa manejo de inputs que soporte teclado y gamepad.',
     'Use event listeners, normalize input format, support remapping.',
     'Usa event listeners, normaliza formato de input, soporta reasignación.',
     25, ARRAY['game-dev', 'input']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (mm_category_id, 'intermediate', 'conceptual',
     'What is lag compensation and when is it needed?',
     '¿Qué es compensación de lag y cuándo se necesita?',
     'Server rewinds time to validate old actions. Needed for hit detection in shooters.',
     'Servidor retrocede en tiempo para validar acciones viejas. Necesario para detección de hits en shooters.',
     25, ARRAY['game-networking', 'compensation']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (mm_category_id, 'intermediate', 'conceptual',
     'How would you implement a game lobby system?',
     '¿Cómo implementarías un sistema de lobby de juego?',
     'Room management, ready checks, host migration, game start synchronization.',
     'Gestión de sala, checks de listo, migración de host, sincronización de inicio de juego.',
     25, ARRAY['game-dev', 'lobby']);

    -- Advanced (5)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (mm_category_id, 'advanced', 'coding',
     'Implement server-side game state validation to prevent cheating.',
     'Implementa validación de estado de juego del lado del servidor para prevenir trampa.',
     'Validate all inputs server-side, physics checks, rate limiting, anomaly detection.',
     'Valida todos los inputs del lado del servidor, checks de física, limitadores de tasa, detección de anomalías.',
     50, ARRAY['security', 'anti-cheat']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (mm_category_id, 'advanced', 'conceptual',
     'Design a rollback netcode system for fighting games.',
     'Diseña un sistema de netcode rollback para juegos de pelea.',
     'Deterministic simulation, input frames, rollback frames, checksum verification.',
     'Simulación determinística, frames de input, frames de rollback, verificación de checksum.',
     50, ARRAY['game-networking', 'rollback']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (mm_category_id, 'advanced', 'conceptual',
     'What is state synchronization and how does it differ from input synchronization?',
     '¿Qué es sincronización de estado y cómo difiere de sincronización de input?',
     'State: server broadcasts full state. Input: server broadcasts inputs, clients simulate.',
     'Estado: servidor transmite estado completo. Input: servidor transmite inputs, clientes simulan.',
     50, ARRAY['game-networking', 'sync']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (mm_category_id, 'advanced', 'coding',
     'Implement a replay system that stores and replays game matches.',
     'Implementa un sistema de replay que almacene y reproduzca partidas.',
     'Store deterministic inputs with timestamps, simulate to reconstruct states.',
     'Almacena inputs determinísticos con timestamps, simula para reconstruir estados.',
     50, ARRAY['game-dev', 'replay']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (mm_category_id, 'advanced', 'conceptual',
     'How do you handle network partition or reconnection gracefully?',
     '¿Cómo manejas partición de red o reconexión graciosamente?',
     'Queue inputs, allow catch-up, timeout handling, state resync.',
     'Cola inputs, permite reintentar, manejo de timeout, resincronización de estado.',
     50, ARRAY['game-networking', 'reconnection']);

    -- Senior (5)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (mm_category_id, 'senior', 'conceptual',
     'Design a matchmaking system that balances skill levels.',
     'Diseña un sistema de matchmaking que balancee niveles de habilidad.',
     'Elo/TrueSkill ratings, queue times vs quality tradeoffs, regional considerations.',
     'Ratings Elo/TrueSkill, tradeoffs tiempo de cola vs calidad, consideraciones regionales.',
     100, ARRAY['game-dev', 'matchmaking']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (mm_category_id, 'senior', 'coding',
     'Implement a peer-to-peer game state synchronization using lockstep.',
     'Implementa sincronización de estado de juego peer-to-peer usando lockstep.',
     'All clients run same simulation, exchange inputs at fixed intervals.',
     'Todos los clientes corren la misma simulación, intercambian inputs a intervalos fijos.',
     100, ARRAY['game-networking', 'p2p']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (mm_category_id, 'senior', 'conceptual',
     'What are the challenges of making multiplayer games deterministic?',
     '¿Cuáles son los desafíos de hacer juegos multiplayer determinísticos?',
     'Floating point, random number generators, physics engines must be deterministic.',
     'Punto flotante, generadores de números aleatorios, motores de física deben ser determinísticos.',
     100, ARRAY['game-dev', 'determinism']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (mm_category_id, 'senior', 'conceptual',
     'Design a scalable game server architecture that supports millions of concurrent players.',
     'Diseña una arquitectura de servidor de juego escalable que soporte millones de jugadores concurrentes.',
     'Microservices, sharding, regional deployment, load balancing, session affinity.',
     'Microservicios, sharding, despliegue regional, balanceo de carga, afinidad de sesión.',
     100, ARRAY['architecture', 'scale']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (mm_category_id, 'senior', 'conceptual',
     'How would you implement regional servers with cross-region play?',
     '¿Cómo implementarías servidores regionales con juego entre regiones?',
     'Predictive matchmaking, latency hiding, selective region bridging.',
     'Matchmaking predictivo, ocultamiento de latencia, puente selectivo de regiones.',
     100, ARRAY['architecture', 'multiplayer']);

    -- ============================================
    -- Gitanas E-commerce QUESTIONS (25 questions)
    -- ============================================

    -- Basic (5)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (ge_category_id, 'basic', 'conceptual',
     'What is the difference between a SKU, UPC, and EAN in retail?',
     '¿Cuál es la diferencia entre SKU, UPC y EAN en retail?',
     'SKU: internal identifier. UPC/EAN: product codes for scanning at checkout.',
     'SKU: identificador interno. UPC/EAN: códigos de producto para escanear en checkout.',
     10, ARRAY['ecommerce', 'basics']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (ge_category_id, 'basic', 'conceptual',
     'What is a POS (Point of Sale) system?',
     '¿Qué es un sistema POS (Point of Sale)?',
     'Hardware/software for processing sales transactions, inventory, and customer payments.',
     'Hardware/software para procesar transacciones de venta, inventario, y pagos de clientes.',
     10, ARRAY['ecommerce', 'pos']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (ge_category_id, 'basic', 'conceptual',
     'What is the shopping cart abandonment problem?',
     '¿Cuál es el problema del abandono de carrito de compras?',
     'Customers add items but leave before purchasing. Recovery strategies include emails.',
     'Clientes añaden items pero se van antes de comprar. Estrategias de recuperación incluyen emails.',
     10, ARRAY['ecommerce', 'conversion']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (ge_category_id, 'basic', 'conceptual',
     'What is inventory shrinkage?',
     '¿Qué es merma de inventario?',
     'Difference between recorded and actual inventory due to theft, damage, or errors.',
     'Diferencia entre inventario registrado y real debido a robo, daño, o errores.',
     10, ARRAY['ecommerce', 'inventory']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (ge_category_id, 'basic', 'conceptual',
     'What is a product catalog and why is it important?',
     '¿Qué es un catálogo de productos y por qué es importante?',
     'Organized product data: descriptions, images, pricing, categories for browsing.',
     'Datos organizados de productos: descripciones, imágenes, precios, categorías para explorar.',
     10, ARRAY['ecommerce', 'catalog']);

    -- Intermediate (8)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (ge_category_id, 'intermediate', 'coding',
     'Implement a shopping cart that persists across sessions.',
     'Implementa un carrito de compras que persista entre sesiones.',
     'Store cart in localStorage or database, sync on login.',
     'Almacena carrito en localStorage o base de datos, sincroniza al hacer login.',
     25, ARRAY['ecommerce', 'cart']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (ge_category_id, 'intermediate', 'conceptual',
     'How would you implement a discount/coupon system?',
     '¿Cómo implementarías un sistema de descuentos/cupones?',
     'Code validation, usage limits, minimum purchase requirements, stackability rules.',
     'Validación de código, límites de uso, requisitos de compra mínima, reglas de apilamiento.',
     25, ARRAY['ecommerce', 'pricing']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (ge_category_id, 'intermediate', 'conceptual',
     'What is inventory FIFO and why is it important?',
     '¿Qué es inventario FIFO y por qué es importante?',
     'First In, First Out. Ensures older stock sells first, crucial for perishable goods.',
     'Primero en entrar, primero en salir. Asegura que inventario más antiguo se venda primero.',
     25, ARRAY['ecommerce', 'inventory']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (ge_category_id, 'intermediate', 'conceptual',
     'How do you handle out-of-stock situations?',
     '¿Cómo manejas situaciones de fuera de stock?',
     'Pre-order, backorder, substitute recommendations, automatic restock alerts.',
     'Pre-orden, backorder, recomendaciones de sustitutos, alertas automáticas de restock.',
     25, ARRAY['ecommerce', 'inventory']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (ge_category_id, 'intermediate', 'coding',
     'Implement a product search with filtering and sorting.',
     'Implementa búsqueda de productos con filtrado y ordenamiento.',
     'Use database indexes, filter builders, pagination, relevance scoring.',
     'Usa índices de base de datos, constructores de filtro, paginación, scoring de relevancia.',
     25, ARRAY['ecommerce', 'search']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (ge_category_id, 'intermediate', 'conceptual',
     'What is the difference between payment processing and payment gateway?',
     '¿Cuál es la diferencia entre procesamiento de pagos y gateway de pagos?',
     'Gateway: captures payment info. Processor: actually moves money between accounts.',
     'Gateway: captura info de pago. Procesador: realmente mueve dinero entre cuentas.',
     25, ARRAY['payments', 'architecture']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (ge_category_id, 'intermediate', 'conceptual',
     'How do you implement customer reviews and ratings?',
     '¿Cómo implementas reseñas y calificaciones de clientes?',
     'Review submission, moderation, rating aggregation, helpfulness voting.',
     'Envío de reseñas, moderación, agregación de ratings, votos de utilidad.',
     25, ARRAY['ecommerce', 'reviews']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (ge_category_id, 'intermediate', 'conceptual',
     'What is a product variant (size, color) and how do you model it?',
     '¿Qué es una variante de producto (talla, color) y cómo la modelas?',
     'Variants share base product but have unique SKU, price, inventory tracking.',
     'Variantes comparten producto base pero tienen SKU único, precio, tracking de inventario.',
     25, ARRAY['ecommerce', 'catalog']);

    -- Advanced (7)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (ge_category_id, 'advanced', 'coding',
     'Implement a real-time inventory tracking system for multiple store locations.',
     'Implementa un sistema de tracking de inventario en tiempo real para múltiples ubicaciones.',
     'Use WebSockets for updates, central database, inventory reservations.',
     'Usa WebSockets para actualizaciones, base de datos central, reservas de inventario.',
     50, ARRAY['ecommerce', 'inventory']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (ge_category_id, 'advanced', 'conceptual',
     'How would you design a recommendation engine for an e-commerce site?',
     '¿Cómo diseñarías un motor de recomendaciones para un sitio e-commerce?',
     'Collaborative filtering, content-based, hybrid approaches, A/B testing.',
     'Filtrado colaborativo, basado en contenido, enfoques híbridos, A/B testing.',
     50, ARRAY['ecommerce', 'recommendations']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (ge_category_id, 'advanced', 'coding',
     'Implement a checkout process with address validation and shipping calculation.',
     'Implementa un proceso de checkout con validación de dirección y cálculo de envío.',
     'Integrate address verification API, shipping carrier APIs, tax calculation.',
     'Integra API de verificación de direcciones, APIs de transportistas, cálculo de impuestos.',
     50, ARRAY['ecommerce', 'checkout']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (ge_category_id, 'advanced', 'conceptual',
     'What is the challenge with PCI compliance in payment processing?',
     '¿Cuál es el desafío con cumplimiento PCI en procesamiento de pagos?',
     'Strict security requirements for storing/transmitting card data, regular audits.',
     'Requisitos estrictos de seguridad para almacenar/transmitir datos de tarjetas, auditorías regulares.',
     50, ARRAY['payments', 'security']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (ge_category_id, 'advanced', 'conceptual',
     'How do you implement a loyalty/rewards program?',
     '¿Cómo implementas un programa de lealtad/recompensas?',
     'Point accumulation, tier systems, expiration rules, redemption options.',
     'Acumulación de puntos, sistemas de niveles, reglas de expiración, opciones de canje.',
     50, ARRAY['ecommerce', 'loyalty']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (ge_category_id, 'advanced', 'coding',
     'Implement a POS sale transaction with tax calculation and payment processing.',
     'Implementa una transacción de venta POS con cálculo de impuestos y procesamiento de pagos.',
     'Calculate tax by jurisdiction, apply discounts, process multiple payment methods.',
     'Calcula impuesto por jurisdicción, aplica descuentos, procesa múltiples métodos de pago.',
     50, ARRAY['ecommerce', 'pos']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (ge_category_id, 'advanced', 'conceptual',
     'What strategies optimize e-commerce conversion rates?',
     '¿Qué estrategias optimizan tasas de conversión en e-commerce?',
     'A/B testing, checkout flow optimization, trust signals, mobile optimization.',
     'A/B testing, optimización de flujo de checkout, señales de confianza, optimización mobile.',
     50, ARRAY['ecommerce', 'conversion']);

    -- Senior (5)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (ge_category_id, 'senior', 'conceptual',
     'Design a scalable e-commerce architecture supporting flash sales.',
     'Diseña una arquitectura e-commerce escalable soportando ventas flash.',
     'Inventory pre-scaling, queue systems, CDN, database sharding, eventual consistency.',
     'Pre-escalado de inventario, sistemas de cola, CDN, sharding de base de datos, consistencia eventual.',
     100, ARRAY['architecture', 'scale']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (ge_category_id, 'senior', 'conceptual',
     'How do you prevent overselling during high-traffic events?',
     '¿Cómo previenes sobreventa durante eventos de alto tráfico?',
     'Database transactions, inventory locks, reservation systems, graceful degradation.',
     'Transacciones de base de datos, locks de inventario, sistemas de reserva, degradación elegante.',
     100, ARRAY['architecture', 'concurrency']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (ge_category_id, 'senior', 'coding',
     'Implement a real-time sync between online store and physical POS inventory.',
     'Implementa sincronización en tiempo real entre tienda online e inventario POS físico.',
     'Event-driven architecture, message queues, conflict resolution strategies.',
     'Arquitectura event-driven, colas de mensajes, estrategias de resolución de conflictos.',
     100, ARRAY['architecture', 'sync']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (ge_category_id, 'senior', 'conceptual',
     'Design a multi-currency, multi-region e-commerce platform.',
     'Diseña una plataforma e-commerce multi-moneda y multi-región.',
     'Exchange rates, localized pricing, tax compliance per region, payment gateways.',
     'Tasas de cambio, precios localizados, cumplimiento fiscal por región, gateways de pago.',
     100, ARRAY['architecture', 'international']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (ge_category_id, 'senior', 'conceptual',
     'What are the challenges of returns processing and how do you optimize it?',
     '¿Cuáles son los desafíos del procesamiento de devoluciones y cómo lo optimizas?',
     'RMA system, refund workflows, restocking logic, analytics to reduce returns.',
     'Sistema RMA, flujos de reembolso, lógica de re-stock, analítica para reducir devoluciones.',
     100, ARRAY['ecommerce', 'returns']);

    -- ============================================
    -- HERMIT BAR QUESTIONS (15 questions)
    -- ============================================

    -- Basic (3)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (hb_category_id, 'basic', 'conceptual',
     'What is i18n and why is it important for web applications?',
     '¿Qué es i18n y por qué es importante para aplicaciones web?',
     'Internationalization adapts app for different languages/regions. Important for global reach.',
     'Internacionalización adapta app para diferentes idiomas/regiones. Importante para alcance global.',
     10, ARRAY['i18n', 'basics']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (hb_category_id, 'basic', 'conceptual',
     'What is the difference between i18n and l10n?',
     '¿Cuál es la diferencia entre i18n y l10n?',
     'i18n: making app translatable. l10n: actual translation/localization work.',
     'i18n: hacer la app traducible. l10n: trabajo real de traducción/localización.',
     10, ARRAY['i18n', 'basics']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (hb_category_id, 'basic', 'conceptual',
     'What is SEO and why does it matter for content sites?',
     '¿Qué es SEO y por qué importa para sitios de contenido?',
     'Search Engine Optimization improves visibility in search results, driving organic traffic.',
     'Optimización para Motores de Búsqueda mejora visibilidad en resultados, atrayendo tráfico orgánico.',
     10, ARRAY['seo', 'basics']);

    -- Intermediate (5)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (hb_category_id, 'intermediate', 'conceptual',
     'How do you handle pluralization in multiple languages?',
     '¿Cómo manejas pluralización en múltiples idiomas?',
     'ICU message format handles different plural rules per language (e.g., "1 item" vs "3 items").',
     'Formato de mensajes ICU maneja diferentes reglas de plural por idioma.',
     25, ARRAY['i18n', 'formatting']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (hb_category_id, 'intermediate', 'conceptual',
     'What are Core Web Vitals and why do they affect SEO?',
     '¿Qué son Core Web Vitals y por qué afectan el SEO?',
     'LCP, FID, CLS metrics that Google uses for ranking. Poor scores = lower ranking.',
     'Métricas LCP, FID, CLS que Google usa para ranking. Puntuaciones bajas = menor ranking.',
     25, ARRAY['seo', 'performance']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (hb_category_id, 'intermediate', 'conceptual',
     'How do you implement hreflang for multilingual sites?',
     '¿Cómo implementas hreflang para sitios multilingües?',
     'HTML tag indicating page language/region, helps search engines serve correct version.',
     'Tag HTML indicando idioma/región de página, ayuda a motores a servir versión correcta.',
     25, ARRAY['i18n', 'seo']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (hb_category_id, 'intermediate', 'conceptual',
     'What animation techniques work best for page transitions?',
     '¿Qué técnicas de animación funcionan mejor para transiciones de página?',
     'View transitions API, CSS animations, Framer Motion, content-aware transitions.',
     'View transitions API, animaciones CSS, Framer Motion, transiciones aware del contenido.',
     25, ARRAY['animations', 'ux']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (hb_category_id, 'intermediate', 'conceptual',
     'How do you handle date/time formatting across timezones?',
     '¿Cómo manejas formato de fecha/hora a través de zonas horarias?',
     'Store in UTC, convert to user timezone on display using libraries like date-fns.',
     'Almacena en UTC, convierte a zona horaria del usuario al mostrar usando librerías.',
     25, ARRAY['i18n', 'formatting']);

    -- Advanced (4)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (hb_category_id, 'advanced', 'coding',
     'Implement i18n with dynamic route switching (EN/ES/etc).',
     'Implementa i18n con cambio dinámico de rutas (EN/ES/etc).',
     'Middleware to detect/set locale, localized route params, SEO-friendly URLs.',
     'Middleware para detectar/fijar locale, params de ruta localizados, URLs amigables para SEO.',
     50, ARRAY['i18n', 'routing']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (hb_category_id, 'advanced', 'conceptual',
     'How do you optimize images for international audiences?',
     '¿Cómo optimizas imágenes para audiencias internacionales?',
     'WebP/AVIF formats, responsive images, lazy loading, CDN distribution.',
     'Formatos WebP/AVIF, imágenes responsivas, lazy loading, distribución CDN.',
     50, ARRAY['performance', 'images']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (hb_category_id, 'advanced', 'conceptual',
     'What is progressive enhancement and why use it?',
     '¿Qué es mejora progresiva y por qué usarla?',
     'Build core functionality works without JS, then enhance with JavaScript.',
     'Construir funcionalidad base que funciona sin JS, luego mejorar con JavaScript.',
     50, ARRAY['architecture', 'progressive']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (hb_category_id, 'advanced', 'conceptual',
     'How do you handle SEO for JavaScript-rendered content?',
     '¿Cómo manejas SEO para contenido renderizado con JavaScript?',
     'SSR/SSG for initial HTML, proper meta tags, sitemap generation.',
     'SSR/SSG para HTML inicial, meta tags apropiados, generación de sitemap.',
     50, ARRAY['seo', 'ssr']);

    -- Senior (3)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (hb_category_id, 'senior', 'conceptual',
     'Design an i18n architecture supporting hundreds of languages.',
     'Diseña una arquitectura i18n soportando cientos de idiomas.',
     'Translation management system, context extraction, fallbacks, RTL support.',
     'Sistema de gestión de traducciones, extracción de contexto, fallbacks, soporte RTL.',
     100, ARRAY['i18n', 'architecture']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (hb_category_id, 'senior', 'conceptual',
     'How do you ensure consistent performance across global regions?',
     '¿Cómo aseguras rendimiento consistente a través de regiones globales?',
     'Edge computing, CDN, regional deployments, monitoring, adaptive loading.',
     'Edge computing, CDN, despliegues regionales, monitoreo, carga adaptativa.',
     100, ARRAY['architecture', 'global']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (hb_category_id, 'senior', 'conceptual',
     'What are the challenges of RTL (right-to-left) language support?',
     '¿Cuáles son los desafíos de soporte para idiomas RTL (derecha a izquierda)?',
     'CSS mirroring, layout flipping, icon orientation, mixed content handling.',
     'Espejo CSS, volteo de layout, orientación de iconos, manejo de contenido mixto.',
     100, ARRAY['i18n', 'rtl']);

    -- ============================================
    -- REACT & HOOKS QUESTIONS (10 questions)
    -- ============================================

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (rh_category_id, 'basic', 'conceptual',
     'When should you use useState vs useRef?',
     '¿Cuándo deberías usar useState vs useRef?',
     'useState triggers re-render, useRef persists without re-rendering.',
     'useState dispara re-render, useRef persiste sin re-renderizar.',
     10, ARRAY['react', 'hooks']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (rh_category_id, 'basic', 'conceptual',
     'What is the purpose of the dependency array in useEffect?',
     '¿Cuál es el propósito del array de dependencias en useEffect?',
     'Controls when effect runs. Empty [] = once on mount. Values = when they change.',
     'Controla cuándo corre el efecto. [] vacío = una vez al montar. Valores = cuando cambian.',
     10, ARRAY['react', 'hooks']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (rh_category_id, 'intermediate', 'coding',
     'Implement a custom hook that debounces a value.',
     'Implementa un hook personalizado que debouncea un valor.',
     'Use useState, useEffect, setTimeout to delay updating the debounced value.',
     'Usa useState, useEffect, setTimeout para retrasar la actualización del valor debounced.',
     25, ARRAY['react', 'custom-hooks']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (rh_category_id, 'intermediate', 'conceptual',
     'What is useMemo and when should you use it?',
     '¿Qué es useMemo y cuándo deberías usarlo?',
     'Memoizes expensive calculations. Use when computation is costly and dependencies are stable.',
     'Memoiza cálculos costosos. Usa cuando la computación es costosa y dependencias son estables.',
     25, ARRAY['react', 'hooks']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (rh_category_id, 'intermediate', 'coding',
     'Implement a custom hook for fetching data with loading/error states.',
     'Implementa un hook personalizado para fetching de datos con estados de loading/error.',
     'Return { data, loading, error }, handle fetch lifecycle, cleanup on unmount.',
     'Retorna { data, loading, error }, maneja ciclo de vida del fetch, cleanup al desmontar.',
     25, ARRAY['react', 'data-fetching']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (rh_category_id, 'advanced', 'conceptual',
     'What is the difference between useCallback and useMemo?',
     '¿Cuál es la diferencia entre useCallback y useMemo?',
     'useCallback memoizes functions, useMemo memoizes values.',
     'useCallback memoiza funciones, useMemo memoiza valores.',
     50, ARRAY['react', 'hooks']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (rh_category_id, 'advanced', 'conceptual',
     'When would you use useReducer instead of useState?',
     '¿Cuándo usarías useReducer en lugar de useState?',
     'Complex state logic, multiple state values that change together, state machine patterns.',
     'Lógica de estado compleja, múltiples valores que cambian juntos, patrones de máquina de estados.',
     50, ARRAY['react', 'hooks']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (rh_category_id, 'advanced', 'coding',
     'Implement a custom hook that provides infinite scroll functionality.',
     'Implementa un hook personalizado que provee funcionalidad de infinite scroll.',
     'Use intersection observer, callback refs, or scroll event listeners.',
     'Usa intersection observer, callback refs, o listeners de evento de scroll.',
     50, ARRAY['react', 'custom-hooks']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (rh_category_id, 'senior', 'conceptual',
     'Explain React Server Components and their benefits.',
     'Explica React Server Components y sus beneficios.',
     'Components that render on server, reduce client bundle, streaming, async data fetching.',
     'Componentes que renderizan en servidor, reducen bundle del cliente, streaming, fetch asíncrono.',
     100, ARRAY['react', 'rsc']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (rh_category_id, 'senior', 'conceptual',
     'How does the React compiler (Forget) improve performance?',
     '¿Cómo mejora el compilador de React (Forget) el rendimiento?',
     'Automatically memoizes components/hooks, eliminates manual useMemo/useCallback.',
     'Memoiza automáticamente componentes/hooks, elimina useMemo/useCallback manual.',
     100, ARRAY['react', 'compiler']);

    -- ============================================
    -- NEXT.JS QUESTIONS (10 questions)
    -- ============================================

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (nx_category_id, 'basic', 'conceptual',
     'What is the difference between SSR, SSG, and CSR?',
     '¿Cuál es la diferencia entre SSR, SSG y CSR?',
     'SSR: server renders each request. SSG: build time render. CSR: client renders.',
     'SSR: servidor renderiza cada request. SSG: render en tiempo de build. CSR: cliente renderiza.',
     10, ARRAY['nextjs', 'rendering']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (nx_category_id, 'basic', 'conceptual',
     'What are the different ways to fetch data in Next.js?',
     '¿Cuáles son las diferentes formas de obtener datos en Next.js?',
     'Server Components, generateStaticParams, Server Actions, API routes, client-side fetch.',
     'Server Components, generateStaticParams, Server Actions, API routes, fetch del lado cliente.',
     10, ARRAY['nextjs', 'data-fetching']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (nx_category_id, 'intermediate', 'coding',
     'Implement a Server Action that updates a database record.',
     'Implementa un Server Action que actualice un registro de base de datos.',
     'async function with "use server", access to database, return updated data.',
     'función async con "use server", acceso a base de datos, retorna datos actualizados.',
     25, ARRAY['nextjs', 'server-actions']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (nx_category_id, 'intermediate', 'conceptual',
     'What is the App Router and how does it differ from Pages Router?',
     '¿Qué es el App Router y cómo difiere del Pages Router?',
     'App Router: layouts, nested routes, Server Components by default, loading/error boundaries.',
     'App Router: layouts, rutas anidadas, Server Components por defecto, loading/error boundaries.',
     25, ARRAY['nextjs', 'routing']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (nx_category_id, 'intermediate', 'conceptual',
     'How do you implement authentication in Next.js?',
     '¿Cómo implementas autenticación en Next.js?',
     'Middleware for route protection, server sessions, OAuth providers like Clerk.',
     'Middleware para protección de rutas, sesiones de servidor, proveedores OAuth como Clerk.',
     25, ARRAY['nextjs', 'auth']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (nx_category_id, 'advanced', 'coding',
     'Implement caching strategies for a Next.js application.',
     'Implementa estrategias de caching para una aplicación Next.js.',
     'fetch cache, route cache, full route cache, unstable_cache for custom caching.',
     'fetch cache, route cache, full route cache, unstable_cache para caching custom.',
     50, ARRAY['nextjs', 'caching']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (nx_category_id, 'advanced', 'conceptual',
     'What is middleware in Next.js and when do you use it?',
     '¿Qué es middleware en Next.js y cuándo lo usas?',
     'Code that runs before request completion. Auth checks, redirects, A/B testing.',
     'Código que corre antes de completar el request. Checks de auth, redirects, A/B testing.',
     50, ARRAY['nextjs', 'middleware']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (nx_category_id, 'advanced', 'conceptual',
     'How do you optimize images in Next.js?',
     '¿Cómo optimizas imágenes en Next.js?',
     'next/image for automatic optimization, WebP conversion, lazy loading, blur placeholders.',
     'next/image para optimización automática, conversión WebP, lazy loading, placeholders blur.',
     50, ARRAY['nextjs', 'images']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (nx_category_id, 'senior', 'conceptual',
     'Design a Next.js application that scales to millions of users.',
     'Diseña una aplicación Next.js que escale a millones de usuarios.',
     'Edge functions, ISR, streaming, proper caching, database connection pooling.',
     'Edge functions, ISR, streaming, caching apropiado, connection pooling de base de datos.',
     100, ARRAY['nextjs', 'scale']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (nx_category_id, 'senior', 'conceptual',
     'What are the security considerations in Next.js applications?',
     '¿Cuáles son las consideraciones de seguridad en aplicaciones Next.js?',
     'Input validation, Server Actions security, API route protections, dependency scanning.',
     'Validación de input, seguridad de Server Actions, protecciones de API routes, scanning de dependencias.',
     100, ARRAY['nextjs', 'security']);

    -- ============================================
    -- DATABASE & PRISMA QUESTIONS (10 questions)
    -- ============================================

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (dp_category_id, 'basic', 'conceptual',
     'What is an ORM and what are its advantages?',
     '¿Qué es un ORM y cuáles son sus ventajas?',
     'Object-Relational Mapping. Type safety, abstraction, reduced SQL, migrations.',
     'Object-Relational Mapping. Type safety, abstracción, menos SQL, migraciones.',
     10, ARRAY['database', 'orm']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (dp_category_id, 'basic', 'conceptual',
     'What is database migration and why is it important?',
     '¿Qué es migración de base de datos y por qué es importante?',
     'Version control for schema changes, team collaboration, rollback capability.',
     'Control de versiones para cambios de schema, colaboración en equipo, capacidad de rollback.',
     10, ARRAY['database', 'migrations']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (dp_category_id, 'intermediate', 'coding',
     'Write a Prisma query that fetches a user with all their posts.',
     'Escribe una query Prisma que fetch un usuario con todos sus posts.',
     'Use include or nested select to fetch related records.',
     'Usa include o nested select para fetchear registros relacionados.',
     25, ARRAY['prisma', 'queries']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (dp_category_id, 'intermediate', 'conceptual',
     'What is the N+1 problem in ORMs and how do you solve it?',
     '¿Qué es el problema N+1 en ORMs y cómo lo resuelves?',
     'Fetching list then each item separately. Solve with include/join queries.',
     'Fetchear lista luego cada item por separado. Resuelve con queries include/join.',
     25, ARRAY['prisma', 'performance']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (dp_category_id, 'intermediate', 'conceptual',
     'How do you handle database transactions in Prisma?',
     '¿Cómo manejas transacciones de base de datos en Prisma?',
     'Use $transaction to batch multiple operations atomically.',
     'Usa $transaction para agrupar múltiples operaciones atómicamente.',
     25, ARRAY['prisma', 'transactions']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (dp_category_id, 'advanced', 'conceptual',
     'What are Prisma raw queries and when should you use them?',
     '¿Qué son queries raw de Prisma y cuándo deberías usarlas?',
     '$queryRaw for complex queries ORM cant handle, $executeRaw for writes.',
     '$queryRaw para queries complejas que ORM no puede, $executeRaw para escrituras.',
     50, ARRAY['prisma', 'raw-queries']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (dp_category_id, 'advanced', 'conceptual',
     'How do you design a database schema for multi-tenancy?',
     '¿Cómo diseñas un schema de base de datos para multi-tenancy?',
     'Row-level security, schema per tenant, or shared with tenant_id foreign key.',
     'Seguridad a nivel de fila, schema por tenant, o compartido con foreign key tenant_id.',
     50, ARRAY['database', 'multi-tenancy']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (dp_category_id, 'advanced', 'conceptual',
     'What indexing strategies improve Prisma query performance?',
     '¿Qué estrategias de indexación mejoran el rendimiento de queries Prisma?',
     'Composite indexes, covering indexes, index on foreign keys, index hinting.',
     'Índices compuestos, índices covering, índices en foreign keys, index hinting.',
     50, ARRAY['prisma', 'indexing']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (dp_category_id, 'senior', 'conceptual',
     'How do you handle database schema evolution without downtime?',
     '¿Cómo manejas evolución de schema de base de datos sin downtime?',
     'Expand-contract pattern, backward compatible changes, blue-green deployments.',
     'Patrón expand-contract, cambios backward compatibles, despliegues blue-green.',
     100, ARRAY['database', 'schema']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (dp_category_id, 'senior', 'conceptual',
     'What are the trade-offs of different database architectures (monolith vs microservices)?',
     '¿Cuáles son los trade-offs de diferentes arquitecturas de base de datos?',
     'Monolith: simplicity, transactions. Microservices: scaling, isolation, complexity.',
     'Monolito: simplicidad, transacciones. Microservicios: escala, aislamiento, complejidad.',
     100, ARRAY['database', 'architecture']);

    -- ============================================
    -- SECURITY & AUTH QUESTIONS (10 questions)
    -- ============================================

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sa_category_id, 'basic', 'conceptual',
     'What is JWT and how does it work?',
     '¿Qué es JWT y cómo funciona?',
     'JSON Web Token. Encoded header, payload, signature. Used for stateless auth.',
     'JSON Web Token. Header codificado, payload, firma. Usado para auth sin estado.',
     10, ARRAY['security', 'jwt']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sa_category_id, 'basic', 'conceptual',
     'What is CORS and why does it matter?',
     '¿Qué es CORS y por qué importa?',
     'Cross-Origin Resource Sharing. Controls which domains can access your API.',
     'Cross-Origin Resource Sharing. Controla qué dominios pueden acceder tu API.',
     10, ARRAY['security', 'cors']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sa_category_id, 'intermediate', 'conceptual',
     'What is OAuth 2.0 and how does it differ from OAuth 1.0?',
     '¿Qué es OAuth 2.0 y cómo difiere de OAuth 1.0?',
     'OAuth 2.0 uses tokens, simpler flow, supports mobile better than OAuth 1.0.',
     'OAuth 2.0 usa tokens, flujo más simple, soporta mobile mejor que OAuth 1.0.',
     25, ARRAY['security', 'oauth']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sa_category_id, 'intermediate', 'conceptual',
     'How do you implement refresh token rotation?',
     '¿Cómo implementas rotación de refresh tokens?',
     'Issue new refresh token on each use, invalidate old one, detect token reuse.',
     'Emite nuevo refresh token en cada uso, invalida el anterior, detecta reutilización.',
     25, ARRAY['security', 'tokens']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sa_category_id, 'intermediate', 'conceptual',
     'What is the difference between authentication and authorization?',
     '¿Cuál es la diferencia entre autenticación y autorización?',
     'Auth: who are you (identity). Authorization: what can you do (permissions).',
     'Auth: quién eres (identidad). Authorization: qué puedes hacer (permisos).',
     25, ARRAY['security', 'basics']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sa_category_id, 'advanced', 'conceptual',
     'What is a CSRF attack and how do you prevent it?',
     '¿Qué es un ataque CSRF y cómo lo previenes?',
     'Cross-Site Request Forgery. Prevent with CSRF tokens, SameSite cookies.',
     'Cross-Site Request Forgery. Previene con tokens CSRF, cookies SameSite.',
     50, ARRAY['security', 'csrf']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sa_category_id, 'advanced', 'conceptual',
     'What is the purpose of an API gateway in authentication?',
     '¿Cuál es el propósito de un API gateway en autenticación?',
     'Centralized auth, rate limiting, request validation before reaching services.',
     'Auth centralizada, rate limiting, validación de requests antes de llegar a servicios.',
     50, ARRAY['security', 'architecture']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sa_category_id, 'advanced', 'conceptual',
     'How do you implement role-based access control (RBAC)?',
     '¿Cómo implementas control de acceso basado en roles (RBAC)?',
     'Roles with permissions, middleware checks, principle of least privilege.',
     'Roles con permisos, checks de middleware, principio de menor privilegio.',
     50, ARRAY['security', 'rbac']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sa_category_id, 'senior', 'conceptual',
     'What is the difference between OAuth 2.0 and OIDC?',
     '¿Cuál es la diferencia entre OAuth 2.0 y OIDC?',
     'OAuth 2.0: authorization. OIDC: authentication layer on top (adds ID token).',
     'OAuth 2.0: autorización. OIDC: capa de autenticación encima (añade ID token).',
     100, ARRAY['security', 'oauth']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sa_category_id, 'senior', 'conceptual',
     'Design a secure microservices authentication architecture.',
     'Diseña una arquitectura de autenticación segura para microservicios.',
     'JWT with public key verification, service-to-service auth, mTLS, token propagation.',
     'JWT con verificación de clave pública, auth service-to-service, mTLS, propagación de tokens.',
     100, ARRAY['security', 'architecture']);

    -- ============================================
    -- REALTIME SYSTEMS QUESTIONS (10 questions)
    -- ============================================

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (rt_category_id, 'basic', 'conceptual',
     'What is WebSocket and how does it differ from HTTP?',
     '¿Qué es WebSocket y cómo difiere de HTTP?',
     'WebSocket: persistent bidirectional connection. HTTP: request-response, stateless.',
     'WebSocket: conexión persistente bidireccional. HTTP: request-response, sin estado.',
     10, ARRAY['realtime', 'basics']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (rt_category_id, 'basic', 'conceptual',
     'What are Server-Sent Events (SSE) and when would you use them?',
     '¿Qué son Server-Sent Events (SSE) y cuándo los usarías?',
     'One-way server-to-client streaming. Good for notifications, live updates.',
     'Streaming unidireccional servidor-a-cliente. Bueno para notificaciones, actualizaciones live.',
     10, ARRAY['realtime', 'sse']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (rt_category_id, 'intermediate', 'conceptual',
     'What is Socket.io and what rooms provide?',
     '¿Qué es Socket.io y qué proporcionan las rooms?',
     'Socket.io: WebSocket abstraction. Rooms: namespace for grouping connections.',
     'Socket.io: abstracción de WebSocket. Rooms: namespace para agrupar conexiones.',
     25, ARRAY['realtime', 'socketio']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (rt_category_id, 'intermediate', 'conceptual',
     'What is the challenge with WebSocket scaling across multiple servers?',
     '¿Cuál es el desafío con escalado de WebSocket a través de múltiples servidores?',
     'Connections are stateful, need sticky sessions or pub/sub adapter for message broadcast.',
     'Conexiones son stateful, necesitas sticky sessions o adapter pub/sub para broadcast.',
     25, ARRAY['realtime', 'scale']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (rt_category_id, 'intermediate', 'conceptual',
     'How do you handle WebSocket reconnection gracefully?',
     '¿Cómo manejas reconexión de WebSocket graciosamente?',
     'Exponential backoff, state resync, message queuing during disconnection.',
     'Backoff exponencial, resincronización de estado, cola de mensajes durante desconexión.',
     25, ARRAY['realtime', 'reconnection']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (rt_category_id, 'advanced', 'conceptual',
     'What is the difference between polling, long polling, and WebSockets?',
     '¿Cuál es la diferencia entre polling, long polling, y WebSockets?',
     'Polling: regular requests. Long polling: wait for response. WebSockets: persistent connection.',
     'Polling: requests regulares. Long polling: esperar respuesta. WebSockets: conexión persistente.',
     50, ARRAY['realtime', 'comparison']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (rt_category_id, 'advanced', 'conceptual',
     'What is Redis pub/sub and when would you use it?',
     '¿Qué es Redis pub/sub y cuándo lo usarías?',
     'Message broker for broadcasting events across multiple Socket.io servers.',
     'Broker de mensajes para transmitir eventos a través de múltiples servidores Socket.io.',
     50, ARRAY['realtime', 'redis']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (rt_category_id, 'advanced', 'conceptual',
     'How do you ensure message ordering in real-time systems?',
     '¿Cómo aseguras orden de mensajes en sistemas en tiempo real?',
     'Sequence numbers, server-side ordering, client-side buffering with reorder logic.',
     'Números de secuencia, ordenamiento del lado del servidor, buffering del cliente con lógica de reorden.',
     50, ARRAY['realtime', 'ordering']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (rt_category_id, 'senior', 'conceptual',
     'Design a real-time collaboration system (like Google Docs).',
     'Diseña un sistema de colaboración en tiempo real (como Google Docs).',
     'Operational transformation, CRDTs, WebSocket with conflict resolution.',
     'Transformación operacional, CRDTs, WebSocket con resolución de conflictos.',
     100, ARRAY['realtime', 'collaboration']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (rt_category_id, 'senior', 'conceptual',
     'What are the trade-offs of different real-time messaging patterns?',
     '¿Cuáles son los trade-offs de diferentes patrones de mensajería en tiempo real?',
     'Pub/sub vs direct messaging, at-most-once vs at-least-once delivery guarantees.',
     'Pub/sub vs mensajes directos, garantías de entrega at-most-once vs at-least-once.',
     100, ARRAY['realtime', 'patterns']);

    -- ============================================
    -- STATE MANAGEMENT QUESTIONS (10 questions)
    -- ============================================

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_state_category_id, 'basic', 'conceptual',
     'When should you use local state vs global state?',
     '¿Cuándo deberías usar estado local vs estado global?',
     'Local: component-specific. Global: shared across components, like user auth.',
     'Local: específico de componente. Global: compartido entre componentes, como auth de usuario.',
     10, ARRAY['state-management', 'basics']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_state_category_id, 'basic', 'conceptual',
     'What is Zustand and why is it popular?',
     '¿Qué es Zustand y por qué es popular?',
     'Minimalist state management with simple API, no providers needed, good dev tools.',
     'Gestión de estado minimalista con API simple, no necesita providers, buenas dev tools.',
     10, ARRAY['zustand', 'basics']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_state_category_id, 'intermediate', 'conceptual',
     'What is the difference between Redux and Zustand?',
     '¿Cuál es la diferencia entre Redux y Zustand?',
     'Redux: strict patterns, middleware. Zustand: simpler, less boilerplate, similar power.',
     'Redux: patrones estrictos, middleware. Zustand: más simple, menos boilerplate, poder similar.',
     25, ARRAY['zustand', 'redux']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_state_category_id, 'intermediate', 'conceptual',
     'When would you use React Query over Zustand?',
     '¿Cuándo usarías React Query sobre Zustand?',
     'React Query for server state (caching, refetching). Zustand for client UI state.',
     'React Query para estado de servidor (caching, refetching). Zustand para estado UI del cliente.',
     25, ARRAY['react-query', 'zustand']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_state_category_id, 'intermediate', 'coding',
     'Implement a Zustand store with persistence middleware.',
     'Implementa un store Zustand con middleware de persistencia.',
     'Use persist middleware with localStorage or sessionStorage.',
     'Usa middleware persist con localStorage o sessionStorage.',
     25, ARRAY['zustand', 'persistence']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_state_category_id, 'advanced', 'conceptual',
     'What is server state vs client state?',
     '¿Qué es estado de servidor vs estado de cliente?',
     'Server: from API, needs caching. Client: UI state, preferences, local-only.',
     'Servidor: de API, necesita caching. Cliente: estado UI, preferencias, solo local.',
     50, ARRAY['architecture', 'state']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_state_category_id, 'advanced', 'conceptual',
     'How do you handle optimistic updates with React Query?',
     '¿Cómo manejas actualizaciones optimistas con React Query?',
     'useMutation with onMutate for immediate update, onError to rollback.',
     'useMutation con onMutate para actualización inmediata, onError para rollback.',
     50, ARRAY['react-query', 'optimistic']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_state_category_id, 'advanced', 'conceptual',
     'What are the benefits of React Query for caching?',
     '¿Cuáles son los beneficios de React Query para caching?',
     'Automatic background refetching, stale-while-revalidate, cache invalidation.',
     'Refetching automático en background, stale-while-revalidate, invalidación de cache.',
     50, ARRAY['react-query', 'caching']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_state_category_id, 'senior', 'conceptual',
     'Design a state management architecture for a large-scale application.',
     'Diseña una arquitectura de gestión de estado para una aplicación a gran escala.',
     'Separate server/client state, feature-based stores, clear data ownership.',
     'Separar estado servidor/cliente, stores basados en features, propiedad clara de datos.',
     100, ARRAY['architecture', 'state']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (sm_state_category_id, 'senior', 'conceptual',
     'What are the challenges of real-time state synchronization?',
     '¿Cuáles son los desafíos de sincronización de estado en tiempo real?',
     'Conflict resolution, eventual consistency, optimistic UI vs server truth.',
     'Resolución de conflictos, consistencia eventual, UI optimista vs verdad del servidor.',
     100, ARRAY['realtime', 'state']);

    -- ============================================
    -- TESTING & CI/CD QUESTIONS (8 questions)
    -- ============================================

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (tc_category_id, 'basic', 'conceptual',
     'What is the difference between unit tests and integration tests?',
     '¿Cuál es la diferencia entre tests unitarios y tests de integración?',
     'Unit: isolated component/function. Integration: multiple components working together.',
     'Unitario: componente/función aislada. Integración: múltiples componentes trabajando juntos.',
     10, ARRAY['testing', 'basics']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (tc_category_id, 'basic', 'conceptual',
     'What is TDD (Test Driven Development)?',
     '¿Qué es TDD (Desarrollo Guiado por Tests)?',
     'Write tests first, then code to make them pass. Red-Green-Refactor cycle.',
     'Escribe tests primero, luego código para hacerlos pasar. Ciclo Red-Green-Refactor.',
     10, ARRAY['testing', 'tdd']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (tc_category_id, 'intermediate', 'coding',
     'Write a test for a React component using Vitest and Testing Library.',
     'Escribe un test para un componente React usando Vitest y Testing Library.',
     'Render component, query elements, fire events, assert expected behavior.',
     'Renderiza componente, query elementos, dispara eventos, assertions de comportamiento esperado.',
     25, ARRAY['testing', 'react']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (tc_category_id, 'intermediate', 'conceptual',
     'What is CI/CD and why is it important?',
     '¿Qué es CI/CD y por qué es importante?',
     'Continuous Integration: merge code frequently. Continuous Deployment: automate releases.',
     'Integración Continua: mergear código frecuentemente. Deployment Continuo: automatizar releases.',
     25, ARRAY['cicd', 'basics']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (tc_category_id, 'intermediate', 'conceptual',
     'What is Playwright and what makes it good for E2E testing?',
     '¿Qué es Playwright y qué lo hace bueno para tests E2E?',
     'Cross-browser testing, auto-waiting, network interception, good debugging.',
     'Testing cross-browser, auto-waiting, interceptación de red, buen debugging.',
     25, ARRAY['testing', 'e2e']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (tc_category_id, 'advanced', 'conceptual',
     'How do you test asynchronous code in Vitest?',
     '¿Cómo pruebas código asíncrono en Vitest?',
     'Use async/await with findBy queries, act() for state updates, fake timers if needed.',
     'Usa async/await con queries findBy, act() para updates de estado, fake timers si necesario.',
     50, ARRAY['testing', 'async']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (tc_category_id, 'advanced', 'conceptual',
     'What are the principles of a good test suite?',
     '¿Cuáles son los principios de una buena suite de tests?',
     'Fast, isolated, repeatable, self-validating, thorough coverage.',
     'Rápido, aislado, repetible, auto-validante, cobertura completa.',
     50, ARRAY['testing', 'principles']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (tc_category_id, 'senior', 'conceptual',
     'Design a testing strategy for a microservices architecture.',
     'Diseña una estrategia de testing para arquitectura de microservicios.',
     'Contract testing, service virtualization, component tests per service, E2E.',
     'Contract testing, virtualización de servicios, tests de componente por servicio, E2E.',
     100, ARRAY['testing', 'strategy']);

    -- ============================================
    -- MULTIPLAYER MINI GAME - ADDITIONAL QUESTIONS (6 more to reach 25)
    -- ============================================

    -- Basic (1 more - total 5)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (mm_category_id, 'basic', 'conceptual',
     'What is server reconciliation in multiplayer games?',
     '¿Qué es reconciliación del servidor en juegos multiplayer?',
     'Client sends input, server simulates and sends corrected state, client snaps to match.',
     'Cliente envía input, servidor simula y envía estado corregido, cliente hace snap para igualar.',
     10, ARRAY['game-networking', 'reconciliation']);

    -- Intermediate (3 more - total 9)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (mm_category_id, 'intermediate', 'conceptual',
     'What is interest management in large-scale multiplayer games?',
     '¿Qué es gestión de interés en juegos multiplayer a gran escala?',
     'Only send updates to players who can see/affect relevant area. Spatial partitioning.',
     'Solo envía updates a jugadores que pueden ver/afectar área relevante. Particionamiento espacial.',
     25, ARRAY['game-networking', 'scale']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (mm_category_id, 'intermediate', 'conceptual',
     'How do you implement entity interpolation for smooth movement?',
     '¿Cómo implementas interpolación de entidades para movimiento suave?',
     'Store previous states, interpolate between them based on time, render past positions.',
     'Almacena estados previos, interpola entre ellos basado en tiempo, renderiza posiciones pasadas.',
     25, ARRAY['game-networking', 'interpolation']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (mm_category_id, 'intermediate', 'coding',
     'Implement a heartbeat system to detect disconnected players.',
     'Implementa un sistema de heartbeat para detectar jugadores desconectados.',
     'Send periodic pings, track last response time, mark as disconnected after timeout.',
     'Envía pings periódicos, rastrea tiempo de última respuesta, marca como desconectado después de timeout.',
     25, ARRAY['game-dev', 'networking']);

    -- Advanced (2 more - total 7)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (mm_category_id, 'advanced', 'coding',
     'Implement a message queue system for reliable ordered delivery over UDP.',
     'Implementa un sistema de cola de mensajes para entrega confiable y ordenada sobre UDP.',
     'Sequence numbers, acknowledgments, retransmission, packet reordering buffer.',
     'Números de secuencia, acknowledgments, retransmisión, buffer de reordenamiento de paquetes.',
     50, ARRAY['game-networking', 'udp']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (mm_category_id, 'advanced', 'conceptual',
     'Design a cheater detection system for competitive games.',
     'Diseña un sistema de detección de tramposos para juegos competitivos.',
     'Server-side validation, anomaly detection, replay analysis, player reports.',
     'Validación del lado del servidor, detección de anomalías, análisis de replays, reportes de jugadores.',
     50, ARRAY['security', 'anti-cheat']);

    -- ============================================
    -- HERMIT BAR - ADDITIONAL QUESTIONS (10 more to reach 25)
    -- ============================================

    -- Basic (2 more - total 5)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (hb_category_id, 'basic', 'conceptual',
     'What are micro-interactions and why do they matter?',
     '¿Qué son las micro-interacciones y por qué importan?',
     'Small animations/feedback that make UI feel alive and responsive.',
     'Pequeñas animaciones/feedback que hacen la UI sentirse viva y responsiva.',
     10, ARRAY['ux', 'animations']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (hb_category_id, 'basic', 'conceptual',
     'What is the difference between SSR and CSR for SEO?',
     '¿Cuál es la diferencia entre SSR y CSR para SEO?',
     'SSR sends complete HTML, search engines can crawl. CSR needs hydration.',
     'SSR envía HTML completo, motores de búsqueda pueden crawlear. CSR necesita hydration.',
     10, ARRAY['seo', 'ssr']);

    -- Intermediate (3 more - total 8)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (hb_category_id, 'intermediate', 'coding',
     'Implement smooth page transitions with View Transitions API.',
     'Implementa transiciones de página suaves con View Transitions API.',
     'Use document.startViewTransition, define transition selectors, animate elements.',
     'Usa document.startViewTransition, define selectores de transición, anima elementos.',
     25, ARRAY['animations', 'view-transitions']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (hb_category_id, 'intermediate', 'conceptual',
     'How do you handle form validation across different locales?',
     '¿Cómo manejas validación de formularios a través de diferentes locales?',
     'Different number/date formats, required field indicators, RTL considerations.',
     'Diferentes formatos de números/fechas, indicadores de campo requerido, consideraciones RTL.',
     25, ARRAY['i18n', 'forms']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (hb_category_id, 'intermediate', 'conceptual',
     'What is lazy loading and how do you implement it effectively?',
     '¿Qué es lazy loading y cómo lo implementas efectivamente?',
     'Load content on-demand, use Intersection Observer, prefetch near viewport.',
     'Cargar contenido bajo demanda, usar Intersection Observer, prefetch cerca del viewport.',
     25, ARRAY['performance', 'optimization']);

    -- Advanced (3 more - total 7)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (hb_category_id, 'advanced', 'coding',
     'Implement a custom i18n loader that handles pluralization rules.',
     'Implementa un loader de i18n personalizado que maneje reglas de pluralización.',
     'CLDR data for plural rules, ICU MessageFormat, runtime translation loading.',
     'Datos CLDR para reglas de plural, ICU MessageFormat, carga de traducciones en runtime.',
     50, ARRAY['i18n', 'pluralization']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (hb_category_id, 'advanced', 'conceptual',
     'How do you optimize Core Web Vitals for a content-heavy site?',
     '¿Cómo optimizas Core Web Vitals para un sitio con mucho contenido?',
     'LCP: optimize images, SSR. FID: minimize JS. CLS: reserve space for dynamic content.',
     'LCP: optimizar imágenes, SSR. FID: minimizar JS. CLS: reservar espacio para contenido dinámico.',
     50, ARRAY['performance', 'web-vitals']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (hb_category_id, 'advanced', 'conceptual',
     'What strategies exist for managing translations in large teams?',
     '¿Qué estrategias existen para gestionar traducciones en equipos grandes?',
     'TMS integration, context comments, glossary management, translation memory.',
     'Integración TMS, comentarios de contexto, gestión de glosario, memoria de traducción.',
     50, ARRAY['i18n', 'workflow']);

    -- Senior (2 more - total 5)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (hb_category_id, 'senior', 'conceptual',
     'Design a caching strategy that respects regional data regulations.',
     'Diseña una estrategia de caching que respete regulaciones regionales de datos.',
     'Geo-based cache rules, GDPR compliance, data residency requirements.',
     'Reglas de cache basadas en geo, cumplimiento GDPR, requisitos de residencia de datos.',
     100, ARRAY['architecture', 'compliance']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (hb_category_id, 'senior', 'coding',
     'Implement a real-time collaborative feature using CRDTs.',
     'Implementa una característica colaborativa en tiempo real usando CRDTs.',
     'Yjs or Automerge library, conflict-free merges, offline support.',
     'Biblioteca Yjs o Automerge, merges sin conflictos, soporte offline.',
     100, ARRAY['realtime', 'collaboration']);

    -- ============================================
    -- TESTING & CI/CD - ADDITIONAL QUESTIONS (17 more to reach 25)
    -- ============================================

    -- Basic (3 more - total 5)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (tc_category_id, 'basic', 'conceptual',
     'What is a mock in testing and when should you use it?',
     '¿Qué es un mock en testing y cuándo deberías usarlo?',
     'Fake object that simulates real behavior. Use for external dependencies.',
     'Objeto falso que simula comportamiento real. Usa para dependencias externas.',
     10, ARRAY['testing', 'mocks']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (tc_category_id, 'basic', 'conceptual',
     'What is the testing pyramid and why does it matter?',
     '¿Cuál es la pirámide de testing y por qué importa?',
     'Many unit tests, fewer integration, fewest E2E. Fast, cheap, slow/expensive.',
     'Muchos tests unitarios, menos integración, pocos E2E. Rápido, barato, lento/caro.',
     10, ARRAY['testing', 'strategy']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (tc_category_id, 'basic', 'conceptual',
     'What is a fixture in test frameworks?',
     '¿Qué es un fixture en frameworks de testing?',
     'Predefined test data/setup used across multiple tests.',
     'Datos/setup de test predefinidos usados en múltiples tests.',
     10, ARRAY['testing', 'fixtures']);

    -- Intermediate (5 more - total 8)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (tc_category_id, 'intermediate', 'coding',
     'Write a test that uses mocking to isolate a service dependency.',
     'Escribe un test que use mocking para aislar una dependencia de servicio.',
     'Use vi.mock or jest.mock, return fake data, verify interaction.',
     'Usa vi.mock o jest.mock, retorna datos falsos, verifica interacción.',
     25, ARRAY['testing', 'mocking']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (tc_category_id, 'intermediate', 'conceptual',
     'What is mutation testing and why is it useful?',
     '¿Qué es mutation testing y por qué es útil?',
     'Introduces bugs intentionally to verify tests catch them. Measures test quality.',
     'Introduce bugs intencionalmente para verificar que tests los detectan. Mide calidad de tests.',
     25, ARRAY['testing', 'mutation']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (tc_category_id, 'intermediate', 'conceptual',
     'How do you set up a GitHub Actions workflow for a Node.js project?',
     '¿Cómo configuras un workflow de GitHub Actions para un proyecto Node.js?',
     'YAML config, setup-node, install, test, cache dependencies.',
     'Config YAML, setup-node, install, test, cache dependencias.',
     25, ARRAY['cicd', 'github-actions']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (tc_category_id, 'intermediate', 'conceptual',
     'What is code coverage and what is a good coverage target?',
     '¿Qué es code coverage y cuál es un buen objetivo de coverage?',
     'Percentage of code executed by tests. 80% is common target, 100% unrealistic.',
     'Porcentaje de código ejecutado por tests. 80% es objetivo común, 100% irrealista.',
     25, ARRAY['testing', 'coverage']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (tc_category_id, 'intermediate', 'conceptual',
     'What is visual regression testing?',
     '¿Qué es visual regression testing?',
     'Screenshot comparison to detect unintended UI changes.',
     'Comparación de screenshots para detectar cambios de UI no intencionales.',
     25, ARRAY['testing', 'visual']);

    -- Advanced (5 more - total 7)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (tc_category_id, 'advanced', 'coding',
     'Implement a custom Vitest reporter for CI integration.',
     'Implementa un reporter personalizado de Vitest para integración CI.',
     'Extend Reporter interface, format output, send to metrics service.',
     'Extender interface Reporter, formatear output, enviar a servicio de métricas.',
     50, ARRAY['testing', 'custom']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (tc_category_id, 'advanced', 'conceptual',
     'How do you test WebSocket connections effectively?',
     '¿Cómo pruebas conexiones WebSocket efectivamente?',
     'Mock server, test reconnection logic, message ordering, error handling.',
     'Mock servidor, probar lógica de reconexión, orden de mensajes, manejo de errores.',
     50, ARRAY['testing', 'websockets']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (tc_category_id, 'advanced', 'conceptual',
     'What is contract testing and how does it differ from integration testing?',
     '¿Qué es contract testing y cómo difiere de integration testing?',
     'Verify API compatibility without full integration. Consumer-driven contracts.',
     'Verifica compatibilidad de API sin integración completa. Contracts definidos por consumidor.',
     50, ARRAY['testing', 'contracts']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (tc_category_id, 'advanced', 'conceptual',
     'How do you structure tests for a React application?',
     '¿Cómo estructuras tests para una aplicación React?',
     'Co-locate with components, test behavior not implementation, use testing library.',
     'Co-locar con componentes, testear comportamiento no implementación, usar testing library.',
     50, ARRAY['testing', 'structure']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (tc_category_id, 'advanced', 'coding',
     'Set up E2E tests with Playwright for a multi-step user flow.',
     'Configura tests E2E con Playwright para un flujo de usuario multi-paso.',
     'Page Object pattern, sequential steps, assertions at each stage.',
     'Patrón Page Object, pasos secuenciales, assertions en cada etapa.',
     50, ARRAY['testing', 'e2e']);

    -- Senior (4 more - total 5)
    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (tc_category_id, 'senior', 'conceptual',
     'What are the challenges of testing AI/ML features?',
     '¿Cuáles son los desafíos de testing features de AI/ML?',
     'Non-deterministic output, training data dependencies, evaluation metrics.',
     'Output no determinístico, dependencias de datos de entrenamiento, métricas de evaluación.',
     100, ARRAY['testing', 'ai']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (tc_category_id, 'senior', 'conceptual',
     'How do you implement shift-left testing in CI/CD?',
     '¿Cómo implementas shift-left testing en CI/CD?',
     'Run tests earlier in pipeline, static analysis, pre-commit hooks.',
     'Correr tests antes en pipeline, análisis estático, pre-commit hooks.',
     100, ARRAY['cicd', 'shift-left']);

    INSERT INTO questions (category_id, difficulty, type, question_en, question_es, solution_en, solution_es, points, tags)
    VALUES
    (tc_category_id, 'senior', 'coding',
     'Build a test automation framework that supports parallel execution.',
     'Construye un framework de automatización de tests que soporte ejecución paralela.',
     'Worker processes, shared fixtures, test isolation, reporting aggregation.',
     'Procesos worker, fixtures compartidos, aislamiento de tests, agregación de reportes.',
     100, ARRAY['testing', 'automation']);

END $$;
