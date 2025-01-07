import useSWR from "swr";
import {fetcher} from "@/services/apiService";

export const useUserMeta = () => {
    return useSWR("/api/user-meta", fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });
}
