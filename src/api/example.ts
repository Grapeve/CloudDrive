// https://shikimori.one/api/animes?page=${page}&limit=8&order=popularity

import axios from '@/utils/axios'

export const getAnimes = async (page: number) => {
  return await axios.get(`https://shikimori.one/api/animes?page=${page}&limit=8&order=popularity`)
}
