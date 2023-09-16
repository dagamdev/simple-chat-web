import { API_ENDPOINT } from './config'

export async function customFetch<D=any> (path: string, { token, method, body }: {
  token?: string
  method?: string
  body?: object
}): Promise<D> {
  const headers: HeadersInit = {}

  if (token !== undefined) headers.Authorization = `Token ${token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  return await fetch(API_ENDPOINT + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  }).then(res => {
    if (res.ok) return res.json()
  })
}
