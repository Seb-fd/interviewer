import type { Resource, Question } from './db/types'

const RESOURCE_TEMPLATES: Record<string, ResourceTemplate[]> = {
  javascript: [
    { type: 'documentation', title: 'JavaScript MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
    { type: 'tutorial', title: 'JavaScript Guide', url: 'https://javascript.info/' },
    { type: 'article', title: 'JavaScript Patterns', url: 'https://addyosmani.com/resources/essentialjsdesignpatterns/' },
  ],
  typescript: [
    { type: 'documentation', title: 'TypeScript Docs', url: 'https://www.typescriptlang.org/docs/' },
    { type: 'tutorial', title: 'TypeScript Deep Dive', url: 'https://basarat.gitbook.io/typescript/' },
    { type: 'article', title: 'TypeScript Best Practices', url: 'https://github.com/microsoft/TypeScript/wiki/TypeScript-Best-Practices' },
  ],
  react: [
    { type: 'documentation', title: 'React Docs', url: 'https://react.dev' },
    { type: 'tutorial', title: 'React Tutorial', url: 'https://react.dev/learn' },
    { type: 'article', title: 'React Patterns', url: 'https://reactpatterns.com/' },
  ],
  nextjs: [
    { type: 'documentation', title: 'Next.js Docs', url: 'https://nextjs.org/docs' },
    { type: 'tutorial', title: 'Next.js Learn', url: 'https://nextjs.org/learn' },
    { type: 'article', title: 'App Router Guide', url: 'https://nextjs.org/docs/app' },
  ],
  security: [
    { type: 'documentation', title: 'OWASP Top 10', url: 'https://owasp.org/Top10/' },
    { type: 'tutorial', title: 'Security Guide', url: 'https://cheatsheetseries.owasp.org/' },
    { type: 'article', title: 'Secure Coding Practices', url: 'https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/' },
  ],
  database: [
    { type: 'documentation', title: 'Prisma Docs', url: 'https://www.prisma.io/docs' },
    { type: 'tutorial', title: 'SQL Basics', url: 'https://www.w3schools.com/sql/' },
    { type: 'article', title: 'Database Design Patterns', url: 'https://database.guide/' },
  ],
  node: [
    { type: 'documentation', title: 'Node.js Docs', url: 'https://nodejs.org/docs/latest/' },
    { type: 'tutorial', title: 'Node.js Guide', url: 'https://nodejs.org/en/guides' },
    { type: 'article', title: 'Node.js Best Practices', url: 'https://github.com/goldbergyoni/nodebestpractices' },
  ],
  api: [
    { type: 'documentation', title: 'REST API Guide', url: 'https://restfulapi.net/' },
    { type: 'tutorial', title: 'API Design Guide', url: 'https://cloud.google.com/apis/design' },
    { type: 'article', title: 'API Best Practices', url: 'https://stackoverflow.blog/2022/01/27/best-practices-for-rest-api-development/' },
  ],
  testing: [
    { type: 'documentation', title: 'Testing Library', url: 'https://testing-library.com/docs/' },
    { type: 'tutorial', title: 'Jest Guide', url: 'https://jestjs.io/docs/getting-started' },
    { type: 'article', title: 'Testing Best Practices', url: 'https://github.com/goldbergyoni/javascript-testing-best-practices' },
  ],
  docker: [
    { type: 'documentation', title: 'Docker Docs', url: 'https://docs.docker.com/' },
    { type: 'tutorial', title: 'Docker Tutorial', url: 'https://docker-curriculum.com/' },
    { type: 'article', title: 'Docker Best Practices', url: 'https://github.com/BretFisher/docker-best-practices' },
  ],
  default: [
    { type: 'documentation', title: 'MDN Web Docs', url: 'https://developer.mozilla.org/' },
    { type: 'tutorial', title: 'Tutorial Point', url: 'https://tutorialspoint.com/' },
    { type: 'article', title: 'Stack Overflow', url: 'https://stackoverflow.com/' },
  ],
}

interface ResourceTemplate {
  type: 'documentation' | 'tutorial' | 'article' | 'video'
  title: string
  url: string
}

function getCategoryKey(categoryId: string): string {
  const slug = categoryId.toLowerCase()

  if (slug.includes('javascript') || slug.includes('js')) return 'javascript'
  if (slug.includes('typescript') || slug.includes('ts')) return 'typescript'
  if (slug.includes('react')) return 'react'
  if (slug.includes('next') || slug.includes('nextjs')) return 'nextjs'
  if (slug.includes('security') || slug.includes('auth') || slug.includes('password')) return 'security'
  if (slug.includes('database') || slug.includes('prisma') || slug.includes('sql')) return 'database'
  if (slug.includes('node') || slug.includes('express')) return 'node'
  if (slug.includes('api') || slug.includes('rest')) return 'api'
  if (slug.includes('test') || slug.includes('jest')) return 'testing'
  if (slug.includes('docker') || slug.includes('container')) return 'docker'

  return 'default'
}

function getTopicFromTags(tags?: string[]): ResourceTemplate[] {
  if (!tags || tags.length === 0) return []

  const topicResources: ResourceTemplate[] = []

  for (const tag of tags.slice(0, 2)) {
    const tagLower = tag.toLowerCase()

    if (tagLower.includes('async') || tagLower.includes('promise')) {
      topicResources.push({
        type: 'tutorial',
        title: 'Async/Await Guide',
        url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises',
      })
    }
    if (tagLower.includes('hook')) {
      topicResources.push({
        type: 'tutorial',
        title: 'React Hooks Guide',
        url: 'https://react.dev/reference/react',
      })
    }
    if (tagLower.includes('state')) {
      topicResources.push({
        type: 'article',
        title: 'State Management Patterns',
        url: 'https://redux.js.org/understanding/thinking-in-redux/glossary',
      })
    }
    if (tagLower.includes('performance')) {
      topicResources.push({
        type: 'article',
        title: 'Performance Best Practices',
        url: 'https://web.dev/fast/',
      })
    }
    if (tagLower.includes('security') || tagLower.includes('xss') || tagLower.includes('sql')) {
      topicResources.push({
        type: 'documentation',
        title: 'Security Guide',
        url: 'https://cheatsheetseries.owasp.org/',
      })
    }
  }

  return topicResources
}

export function generateResources(question: Question): Resource[] {
  const categoryKey = getCategoryKey(question.categoryId)
  const templates = RESOURCE_TEMPLATES[categoryKey] || RESOURCE_TEMPLATES.default

  const resources: Resource[] = templates.slice(0, 3).map(template => ({
    title: template.title,
    url: template.url,
    type: template.type,
  }))

  const topicResources = getTopicFromTags(question.tags)
  for (const resource of topicResources) {
    if (resources.length >= 4) break
    if (!resources.some(r => r.url === resource.url)) {
      resources.push(resource)
    }
  }

  return resources.slice(0, 4)
}

export function getDefaultResources(): Resource[] {
  return RESOURCE_TEMPLATES.default.slice(0, 2).map(template => ({
    title: template.title,
    url: template.url,
    type: template.type,
  }))
}
