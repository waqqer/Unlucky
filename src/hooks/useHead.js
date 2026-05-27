const minecraft_heads_url = "https://avatars.spworlds.ru/"

const useHead = (data, custom) => {
    const c = custom || "face"
    if(typeof data === "string") {
        const url = data ?? ""
        return minecraft_heads_url + url
    }
    return minecraft_heads_url + `${c}/` + (data?.minecraftUUID ?? "")
}

export default useHead