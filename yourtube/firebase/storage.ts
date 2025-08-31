// yourtube/firebase/storage.ts
import { ref, uploadBytesResumable, getDownloadURL, getStorage } from "firebase/storage";
import app from "./firebaseConfig";

// ✅ Initialize Firebase Storage
const storage = getStorage(app);

// ✅ Upload video function
export const uploadVideo = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `videos/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      () => {}, // Optional: add progress tracking here
      (error) => reject(error),
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
};

export { storage };
