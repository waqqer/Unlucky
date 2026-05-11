const minecraft_heads_url = "https://avatars.spworlds.ru/face/"

const useHead = (data) => {
    if(typeof data === "string") {
        const url = data ?? ""
        return minecraft_heads_url + url
    }
    return minecraft_heads_url + (data?.minecraftUUID ?? "")
}

export default useHead