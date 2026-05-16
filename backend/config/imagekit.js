import ImageKit from "@imagekit/nodejs"

let client = null

const getClient = () => {
    if (!client) {
        if (
            !process.env.IMAGEKIT_PUBLIC_KEY ||
            !process.env.IMAGEKIT_PRIVATE_KEY ||
            !process.env.IMAGEKIT_URL_ENDPOINT
        ) {
            throw new Error("ImageKit env variables are missing")
        }

        client = new ImageKit({
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
        })
    }

    return client
}

export default getClient