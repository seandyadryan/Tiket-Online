import { request } from './ticketApi'

export const getUserProfile = async () => {
  const response = await request('users/profile')
  return response?.data || null
}

export const getLastTicket = async () => {
  const response = await request('users/ticket-last')
  return response?.data || null
}

export const getTicketDetail = async (bookingNumber) => {
  const params = new URLSearchParams({
    bookingNumber,
  })
  const response = await request(`users/ticket-detail?${params.toString()}`)
  return response?.data || null
}
