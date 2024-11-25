import { SUPABASE_ANON_KEY, STRIP_EDGE_FUNCTIONS_BASE_URL } from '@env'
var fs = require('react-native-fs');
global.Buffer = require('buffer').Buffer;

export const getShipmentArtifect = async ({ shippingId }: { shippingId: string }): Promise<string | null> => {
    try {
        console.log("lable id : ", shippingId)
        const response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/get-artifect`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({
                "shipmentId": shippingId
            }),
        }
        );
        if (response.ok) {
            const blob = await response.blob();
            console.log("blob : ", blob);

            return new Promise((resolve, reject) => {


                // Convert blob to base64
                const reader = new FileReader();

                reader.onloadend = async () => {
                    const base64data = reader.result?.split(',')[1]; // Remove the base64 header
                    const filePath = `${fs.DocumentDirectoryPath}/artifact.pdf`;

                    try {
                        await fs.writeFile(filePath, base64data, 'base64');
                        console.log('File saved to:', filePath);
                        resolve(filePath)
                    } catch (error) {
                        console.log('Error saving file:', error);
                        reject(null)
                    }
                };

                reader.onerror = (error) => {
                    console.log('Error reading blob:', error);
                    reject(null)
                };

                reader.readAsDataURL(blob); // Read the blob as base64
            })

        } else {
            console.log("Error getting artifact label response:", response);
            return null;
        }
    }
    catch (error) {
        console.log("Error getting artifect label : ", error)
        return null
    }
}
