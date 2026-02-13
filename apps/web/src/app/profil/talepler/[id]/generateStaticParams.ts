export async function generateStaticParams() {
  // Return all request IDs for static generation
  return [
    { id: 'request-1' },
    { id: 'customer-request-1' },
    { id: 'customer-request-2' },
    { id: 'customer-request-3' }
  ]
}

