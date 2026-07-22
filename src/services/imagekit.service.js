import ImageKit from "imagekit";
import config from "../config/config.js";

let imagekitInstance = null;

if (config.imagekit.publicKey && config.imagekit.privateKey && config.imagekit.urlEndpoint) {
  imagekitInstance = new ImageKit({
    publicKey: config.imagekit.publicKey,
    privateKey: config.imagekit.privateKey,
    urlEndpoint: config.imagekit.urlEndpoint,
  });
}

export const uploadImage = async (fileBuffer, fileName, folderPath = "/posts") => {
  if (imagekitInstance) {
    try {
      const response = await imagekitInstance.upload({
        file: fileBuffer,
        fileName: fileName,
        folder: folderPath,
      });
      return response.url;
    } catch (error) {
      console.error("❌ ImageKit Upload Error:", error);
      throw new Error(`Image upload failed: ${error.message}`);
    }
  } else {
    const mockUrl = `https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80`;
    console.log(`📱 [DEV MODE] ImageKit credentials missing. Mocking upload for file "${fileName}". Returning mock image URL.`);
    return mockUrl;
  }
};
