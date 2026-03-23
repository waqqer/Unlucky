const minecraft_heads_url = "https://mc-heads.net/avatar/"

const useHead = (user) => {
    return minecraft_heads_url + user?.minecraftUUID ?? ""
}

export default useHead