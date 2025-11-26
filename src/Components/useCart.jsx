import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useContext } from "react"
import { AuthContext } from "../Context/AuthContext"

const useCart = () => {
    const { user } = useContext(AuthContext)
    const email = user?.email
    const base_url = import.meta.env.VITE_BASE_URL

    const { data: cart = [], refetch, isLoading } = useQuery({
        queryKey: ["cart", email],
        enabled: !!email,
        queryFn: async () => {
            const res = await axios.get(`${base_url}/carts/${email}`)
            return res.data
        }
    })

    return { cart, refetch, isLoading }
}

export default useCart;
