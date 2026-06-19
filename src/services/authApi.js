import { getDeviceId, postForm, setStoredAuth } from './ticketApi'

const getAuthClientInfo = () => {
  const deviceId = getDeviceId()

  return {
    DeviceId: deviceId,
    DeviceType: 'Web',
    FCM: `web-${deviceId}`,
    IPAddress: '',
  }
}

const normalizeAuthData = (response) => {
  const data = response?.data

  if (!response?.success || !data?.accessToken) {
    throw new Error(response?.message || 'Login gagal')
  }

  const auth = {
    accessToken: data.accessToken,
    email: data.email,
    fullName: data.fullName,
    refreshToken: data.refreshToken,
    role: data.role,
    userId: data.userId,
    username: data.username,
  }

  setStoredAuth(auth)
  return { auth, response }
}

export const login = async ({ password, username }) => {
  const response = await postForm('auth/login', {
    Username: username,
    Password: password,
    ...getAuthClientInfo(),
  })

  return normalizeAuthData(response)
}

export const register = async ({ confirmPassword, email, fullName, password, phoneNumber }) => {
  const response = await postForm('auth/register', {
    FullName: fullName,
    PhoneNumber: phoneNumber,
    Email: email,
    Password: password,
    ConfirmPassword: confirmPassword,
    AcceptTerms: 'true',
  })

  return response
}

export const loginWithOAuth = async ({ email, idToken, name, phoneNumber = '' }) => {
  const response = await postForm('auth/external-auth', {
    Email: email,
    Name: name || email,
    PhoneNumber: phoneNumber,
    IdToken: idToken,
    ...getAuthClientInfo(),
  })

  return normalizeAuthData(response)
}

export const changePassword = async ({ confirmPassword, currentPassword, newPassword }) =>
  postForm('auth/change-password', {
    CurrentPassword: currentPassword,
    NewPassword: newPassword,
    ConfirmPassword: confirmPassword,
  })
