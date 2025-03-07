import { python3 } from '@/httpsnippet-lite/esm/targets/python/python3/client'
import type { Plugin } from '@/types'
import { convertWithHttpSnippetLite } from '@/utils/convertWithHttpSnippetLite'

/**
 * python/python3
 */
export const pythonPython3: Plugin = {
  target: 'python',
  client: 'python3',
  title: 'http.client',
  generate(request) {
    // TODO: Write an own converter
    return convertWithHttpSnippetLite(python3, request)
  },
}
