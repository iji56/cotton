import { ImageCompressor } from "@/features/orders/utils/imageCompressor";
import { supabase } from "@/lib/supabase"
var fs = require('react-native-fs');
global.Buffer = require('buffer').Buffer;

export const uploadListingImage = async (path: string, uid: string) => {
    try {
        const compressedFilePath = await ImageCompressor(path);
        let base64Image = await fs.readFile(compressedFilePath, 'base64');
        const arrayBuffer = Buffer.from(base64Image, 'base64');
        console.log(uid)
        const uniquePath = `${uid}${new Date().toISOString()}_image.jpeg`;
        const { data, error } = await supabase
            .storage
            .from('listings')
            .upload(uniquePath, arrayBuffer, {
                cacheControl: '3600',
                upsert: true,  // Allow overwriting the file
                contentType: 'image/jpeg' // Set the content type to image/jpeg
            });

        if (error) {
            console.log(error)
            throw new Error(error.message);
        }
        return uniquePath;
    } catch (e) {
        console.log("error in catch : ", e)
    }
}