import {imagekit} from "../config/cloudinary"

const uploadToImagekit = async (file:Express.Multer.File) => {
    const result = await imagekit.upload({
        file:file.buffer,
        fileName:file.originalname,
        folder : "/upload",
    })

    return result.url;
}

export {uploadToImagekit}