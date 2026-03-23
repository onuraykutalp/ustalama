const PAYMENT_BASE_URL = process.env.PAYMENT_API_URL || 'https://payment.loopcode.co'

export async function callPaymentApi(endpoint: string, data: any): Promise<any> {
  const response = await fetch(`${PAYMENT_BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return response.json()
}
