export function pay({amount, description, accountId, data = {} }) {
  const widget = new cp.CloudPayments()

  return new Promise((resolve, reject) => {
    widget.pay('charge',
      {
        publicId: 'test_api_00000000000000000000002',
        currency: 'RUB',
        email: accountId,
        description,
        amount,
        data
      },
      {
        onSuccess(options) {
          resolve(options)
        },
        onFail(reason) {
          reject(reason)
        }
      }
    )
  })
}
