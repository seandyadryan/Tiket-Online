import { getApiBaseUrl, postJson, request } from './ticketApi'

export const getSeatAvailableList = async ({ draftNo, trayekID }) => {
  const params = new URLSearchParams({
    draftNo,
    TrayekID: String(trayekID),
  })
  const response = await request(`booking-ticket/seat-available-list?${params.toString()}`)
  return Array.isArray(response.data) ? response.data : []
}

export const getPaymentList = async () => {
  const response = await request('payment/get-payment-list')
  return Array.isArray(response.data) ? response.data : []
}

export const submitFinalOrder = async (payload) => {
  const endpoint = /dev/i.test(getApiBaseUrl())
    ? 'booking-ticket/final-order-sandbox'
    : 'booking-ticket/final-order'
  const response = await postJson(endpoint, payload)

  if (!response?.success) {
    throw new Error(response?.message || 'Pemesanan belum berhasil dibuat.')
  }

  return response.data
}
