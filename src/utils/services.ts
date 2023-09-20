import { API_ENDPOINT } from './config'

export async function customFetch<D=any> (path: string, { token, method, body }: {
  token?: boolean
  method?: string
  body?: object
}): Promise<D> {
  const headers: HeadersInit = {}

  if (token === true && typeof localStorage !== 'undefined') {
    const token = localStorage.getItem('token')
    headers.Authorization = `Token ${token}`
  }
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  return await fetch(API_ENDPOINT + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  }).then(res => {
    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`)
    }

    return res.json()
  })
}
