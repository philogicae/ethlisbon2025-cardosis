import { baseUrl } from '@/constants/api'
import { useQuery } from '@tanstack/react-query'

export type Token = {
    attributes: {
        name: string
        symbol: string
        coingecko_coin_id: string
        price_usd: string
        fdv_usd: string
        market_cap_usd: string
        total_reserve_in_usd: string
        image_url: string
    }
    id: number
}

const fetchToken = async (addr: string[]): Promise<Token[]> => {
    const response = await fetch(`${baseUrl}/networks/xdai/tokens/multi/${addr}`)

    const token = await response.json()
    return token.data
}

const useToken = (searchValue: string[]) => {
    return useQuery({
        queryKey: ['token', searchValue],
        queryFn: () => fetchToken(searchValue),
        enabled: !!searchValue,
    })
}

export { useToken, fetchToken }