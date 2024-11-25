import { supabase } from "@/lib/supabase"
import { ImageCompressor, VideoCompressor } from "../utils/imageCompressor";
var fs = require('react-native-fs');
global.Buffer = require('buffer').Buffer;

export const uploadUserImage = async (path: string, uid: string) => {
    try {
        const compressedFilePath = await ImageCompressor(path);
        let base64Image = await fs.readFile(compressedFilePath, 'base64');
        const arrayBuffer = Buffer.from(base64Image, 'base64');
        console.log(uid)
        const { data, error } = await supabase
            .storage
            .from('review_images')
            .upload(`${uid}${new Date()}image.jpeg`, arrayBuffer, {
                cacheControl: '3600',
                upsert: true,  // Allow overwriting the file
                contentType: 'image/jpeg' // Set the content type to image/jpeg
            });

        if (error) {
            console.log(error)
            throw new Error(error.message);
        }

        return `${uid}${new Date()}image.jpeg`;
    } catch (e) {
        console.log("error in catch : ", e)
    }
}

export const uploadVideo = async (path: string, uid: string) => {
    try {
        console.log("path : ", path)
        const compressedFilePath = await VideoCompressor(path);
        console.log(compressedFilePath)
        let base64Video = await fs.readFile(compressedFilePath, 'base64');
        const arrayBuffer = Buffer.from(base64Video, 'base64');
        const { data, error } = await supabase
            .storage
            .from('review_videos')
            .upload(`${uid}${new Date()}video.mp4`, arrayBuffer, {
                cacheControl: '3600',
                upsert: true,  // Allow overwriting the file
                contentType: 'video/mp4' // Set the content type to image/jpeg
            });

        if (error) {
            console.log(error)
            throw new Error(error.message);
        }

        return `${uid}${new Date()}video.mp4`;
    } catch (e) {
        console.log("error in catch : ", e)
    }
}