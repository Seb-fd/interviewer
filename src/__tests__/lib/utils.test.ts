import { describe, it, expect } from 'vitest'
import { normalizeAnswer } from '@/lib/utils'

describe('normalizeAnswer', () => {
  it('trims whitespace from start and end', () => {
    expect(normalizeAnswer('  hello  ')).toBe('hello')
  })

  it('converts to lowercase', () => {
    expect(normalizeAnswer('HELLO')).toBe('hello')
  })

  it('collapses multiple spaces into single space', () => {
    expect(normalizeAnswer('hello   world')).toBe('hello world')
  })

  it('removes zero-width characters', () => {
    expect(normalizeAnswer('hello\u200Bworld')).toBe('helloworld')
  })

  it('removes leading dashes and spaces', () => {
    expect(normalizeAnswer('---hello')).toBe('hello')
    expect(normalizeAnswer('  ---hello')).toBe('hello')
  })

  it('removes trailing dashes and spaces', () => {
    expect(normalizeAnswer('hello---')).toBe('hello')
    expect(normalizeAnswer('hello  ---')).toBe('hello')
  })

  it('handles complex input correctly', () => {
    const input = '   Hello   World  \u200B---  '
    const expected = 'hello world'
    expect(normalizeAnswer(input)).toBe(expected)
  })

  it('returns empty string for empty input', () => {
    expect(normalizeAnswer('')).toBe('')
  })

  it('handles mixed dashes and spaces at boundaries', () => {
    expect(normalizeAnswer('-- hello --')).toBe('hello')
    expect(normalizeAnswer('  --  hello  --  ')).toBe('hello')
  })
})
