import { NextApiRequest, NextApiResponse } from 'next'

export default (request: NextApiRequest, response: NextApiResponse) => {
  const users = [
    { id: 1, name: 'Fabricio' },
    { id: 2, name: 'Marisa' },
    { id: 3, name: 'Philippe' },
    { id: 4, name: 'Gustavo' },
  ]

  return response.json(users)
}