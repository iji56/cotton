import { supabase } from "@/lib/supabase"
import { ImageCompressor } from "../utils/imageCompressor";
import { baseUrl } from "./authSignUp";
var fs = require('react-native-fs');
global.Buffer = require('buffer').Buffer;

export const uploadUserImage = async (path: string, uid: string) => {
    try {
        const compressedFilePath = await ImageCompressor(path);
        let base64Image = await fs.readFile(compressedFilePath, 'base64');
        const arrayBuffer = Buffer.from(base64Image, 'base64');
        const imageId = new Date().toISOString()
        console.log(uid)
        const { data, error } = await supabase
            .storage
            .from('user_profile')
            .upload(`${uid}${imageId}.jpeg`, arrayBuffer, {
                cacheControl: '3600',
                upsert: true,  // Allow overwriting the file
                contentType: 'image/jpeg' // Set the content type to image/jpeg
            });

        if (error) {
            console.log(error)
            // throw new Error(error.message);
            return undefined
        }

        return `${baseUrl}${uid}${imageId}.jpeg`;
    } catch (e) {
        console.log("error in catch : ", e)
        return undefined
    }
}