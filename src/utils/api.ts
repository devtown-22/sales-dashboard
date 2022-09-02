import api , {  adminApi } from '../lib/api'
export const fetchCourses = async () => {
  const apiInst = await api()
  return apiInst.get('/courses')
}

export const fetchBatchesByCourse = async (courseId: string) => {
  const apiInst = await api()
  return apiInst.get(`/courses/${courseId}/batches`)
}

export const fetchProductByBatch = async (batchId: string) => {
  const apiInst = await api()
  return apiInst.get(`courses/batches/${batchId}/product`)
}

export const createPaymentLink = async (body: any) => {
  const apiInst = await api()
  return apiInst.post('/payments', body)
}

export const getOrder = async (orderId: string) => {
  const apiInst = await api()
  return apiInst.get(`/orders/${orderId}`)
}

export const updateOrderStatus = async (paymentId: string, signature: string) => {
  const apiInst = await api()
  return apiInst.post(`/orders/update/status`, {
    razorpayPaymentId: paymentId,
    razorpaySignature: signature,
  })
}

export const getPayments = async () => {
  const apiInst = await api()
  return apiInst.get('/payments')
}

export const getPayment = async (paymentId: string) => {
  const apiInst = await api()
  return apiInst.get(`/payments/${paymentId}`)
}

export const searchPayments = async (query: string, showOnlyPending: boolean) => {
  const apiInst = await api()
  return apiInst.get(`/payments/search?q=${query}&showOnlyPending=${showOnlyPending}`)
}

export const getBulkPaymentMeta = async (id: string) => {
  const apiInst = await api()
  return apiInst.get(`/payments/bulk/${id}`)
}

export const getBulkPayments = async () => {
  const apiInst = await api()
  return apiInst.get(`/payments/bulk`)
}

export const getPaymentsByBulkId = async (id: string) => {
  const apiInst = await api()
  return apiInst.get(`/payments/bulk/${id}/payments`)
}

export const loginAdmin = async (email: string, password: string) => {
  const apiInst = await api()
  return apiInst.post('/users/admin/login', {
    email,
    password,
  })
}

export const createUsers = async (body: any) => {
  return adminApi().post('/users/create-lot-of-users', body)
}

export const sendResetPasswordEmail = async (email: string) => {
    const apiInst = await api()
    return apiInst.post('/users/send-reset-password-email', {
        email,
    })
}
