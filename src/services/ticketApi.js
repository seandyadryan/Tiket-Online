const DEFAULT_API_BASE_URL = 'https://apiakapticketdev.hibautama.com/api/'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/?$/, '/')
const tenantId = import.meta.env.VITE_TENANT_ID || 'a517ddb8-101f-47b3-a86c-26035c395fc1'

export const authStorageKey = 'hibaPutraAuth'
const deviceStorageKey = 'hibaPutraDeviceId'

export const getDeviceId = () => {
  const storedDeviceId = localStorage.getItem(deviceStorageKey)

  if (storedDeviceId) {
    return storedDeviceId
  }

  const deviceId =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `web-${Date.now()}-${Math.random().toString(16).slice(2)}`

  localStorage.setItem(deviceStorageKey, deviceId)
  return deviceId
}

export const getStoredAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(authStorageKey) || 'null')
  } catch {
    return null
  }
}

export const setStoredAuth = (data) => {
  localStorage.setItem(authStorageKey, JSON.stringify(data))
}

export const clearStoredAuth = () => {
  localStorage.removeItem(authStorageKey)
}

const getHeaders = (extraHeaders = {}) => {
  const auth = getStoredAuth()
  return {
    Accept: 'application/json',
    'X-TenantId': tenantId,
    ...(auth?.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {}),
    ...extraHeaders,
  }
}

const getErrorMessage = (body, fallback) => {
  const modelErrors = Object.values(body?.modelState || body?.ModelState || {})
    .flat()
    .filter(Boolean)
    .join(' ')

  return modelErrors || body?.message || body?.Message || fallback
}

export const request = async (endpoint) => {
  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    headers: getHeaders(),
  })

  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(getErrorMessage(body, `Request gagal (${response.status})`))
  }

  return body
}

export const postForm = async (endpoint, data) => {
  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    method: 'POST',
    headers: getHeaders({
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    }),
    body: new URLSearchParams(data),
  })

  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(getErrorMessage(body, `Request gagal (${response.status})`))
  }

  return body
}

export const postJson = async (endpoint, data) => {
  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    method: 'POST',
    headers: getHeaders({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(data),
  })

  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(getErrorMessage(body, `Request gagal (${response.status})`))
  }

  return body
}

export const getApiBaseUrl = () => apiBaseUrl

export const getFromList = async () => {
  const response = await request('search-ticket/get-from-list')
  return Array.isArray(response.data) ? response.data : []
}

export const getToList = async () => {
  const response = await request('search-ticket/get-to-list')
  return Array.isArray(response.data) ? response.data : []
}

export const getMaxPassenger = async () => {
  const response = await request('search-ticket/get-max-passenger')
  const maxPassenger = Number(response.data)
  return Number.isFinite(maxPassenger) && maxPassenger > 0 ? maxPassenger : 1
}

export const searchBus = async ({ date, from, passenger, to }) => {
  const params = new URLSearchParams({
    from,
    to,
    date,
    passenger: String(passenger),
  })
  const response = await request(`search-ticket/search-bus?${params.toString()}`)
  return Array.isArray(response.data) ? response.data : []
}
