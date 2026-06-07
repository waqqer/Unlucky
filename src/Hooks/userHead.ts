import type { UUID } from "@/Shared/Types/UserTypes"

const minecraft_heads_url = "https://avatars.spworlds.ru/"

const useHead = (data?: string | UUID, custom?: string) => {
    const c = custom ?? "face"
    if(typeof data === "string") {
        const url = data ?? ""
        return minecraft_heads_url + `${c}/` + url
    }
    return minecraft_heads_url + `${c}/` + (data?.minecraftUUID ?? "steve")
}

export default useHead