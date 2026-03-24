const minecraft_heads_url = "https://mc-heads.net/avatar/"

const useHead = (data) => {
    if(typeof data === "string") {
        return minecraft_heads_url + data
    }
    return minecraft_heads_url + user?.minecraftUUID ?? ""
}

export default useHead