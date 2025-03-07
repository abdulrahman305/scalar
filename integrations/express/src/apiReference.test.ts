import express from 'express'
import request from 'supertest'
import { describe, expect, it } from 'vitest'

import { apiReference } from './apiReference'

describe('apiReference', () => {
  it('should return HTML with default theme CSS when no theme is provided', async () => {
    const app = express()
    const options = {
      cdn: 'https://cdn.example.com',
      spec: { content: { info: { title: 'Test API' } } },
    }
    app.use(apiReference(options))

    const response = await request(app).get('/')
    expect(response.status).toBe(200)
    expect(response.type).toBe('text/html')
    expect(response.text).toContain('<title>Scalar API Reference</title>')
    expect(response.text).toContain('https://cdn.example.com')
    expect(response.text).toContain('Test API')
    expect(response.text).toContain('--scalar-color-1: #353535;') // Check for default theme CSS
  })

  it('should not include default theme CSS when a theme is provided', async () => {
    const app = express()
    app.use(
      apiReference({
        cdn: 'https://cdn.example.com',
        spec: { content: { info: { title: 'Test API' } } },
        theme: 'kepler',
      }),
    )

    const response = await request(app).get('/')
    expect(response.status).toBe(200)
    expect(response.type).toBe('text/html')
    expect(response.text).toContain('<title>Scalar API Reference</title>')
    expect(response.text).toContain('https://cdn.example.com')
    expect(response.text).toContain('Test API')
    // Ensure default theme CSS is not included
    expect(response.text).not.toContain('--scalar-color-1')
  })

  it('should handle missing spec content gracefully', async () => {
    const app = express()
    const options = {
      cdn: 'https://cdn.example.com',
    }
    app.use(apiReference(options))

    const response = await request(app).get('/')
    expect(response.status).toBe(200)
    expect(response.type).toBe('text/html')
    expect(response.text).toContain('<title>Scalar API Reference</title>')
    expect(response.text).toContain('https://cdn.example.com')
    // Ensure no undefined content
    expect(response.text).not.toContain('undefined')
  })

  it('should use default CDN when no CDN is provided', async () => {
    const app = express()
    const options = {
      spec: { content: { info: { title: 'Test API' } } },
    }
    app.use(apiReference(options))

    const response = await request(app).get('/')
    expect(response.status).toBe(200)
    expect(response.type).toBe('text/html')
    expect(response.text).toContain('<title>Scalar API Reference</title>')
    expect(response.text).toContain(
      'https://cdn.jsdelivr.net/npm/@scalar/api-reference',
    )
  })

  it('doesn’t have the content twice', async () => {
    const app = express()
    app.use(
      apiReference({ spec: { content: { info: { title: 'Test API' } } } }),
    )

    const response = await request(app).get('/')
    expect(response.status).toBe(200)

    // Check the title is present
    expect(response.text).toContain('Test API')

    // Check that the title is only present once
    const text = response.text
    const titleCount = (text.match(/Test API/g) || []).length
    expect(titleCount).toBe(1)
  })

  it('keeps the URL in the configuration', async () => {
    const app = express()

    app.use(
      apiReference({
        spec: {
          url: 'https://cdn.jsdelivr.net/npm/@scalar/galaxy/dist/latest.json',
        },
      }),
    )

    const response = await request(app).get('/')

    // Check the URL is present
    expect(response.text).toContain(
      'https://cdn.jsdelivr.net/npm/@scalar/galaxy/dist/latest.json',
    )
  })
})
