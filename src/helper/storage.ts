import fs from "fs";
import path from "path";
import { Readable } from "stream";

interface HapiFile {
  hapi: {
    filename: string;
    headers: Record<string, string>;
  };
  pipe: (dest: NodeJS.WritableStream) => Readable;
}

const generateUniqueFilename = (originalName: string): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let uniqueName = "";

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueName += characters[randomIndex];
  }

  const extension = path.extname(originalName);
  return uniqueName + extension;
};

export const storeEmployeeFile = async (
  file: HapiFile,
  fileType: "profileImage" | "aadharCard"
): Promise<string> => {
  // base folder
  const baseDir = path.join(process.cwd(), "./src/assets/employeeDocs");

  // determine sub-folder based on type
  const folderName =
    fileType === "profileImage" ? "profileImages" : "aadharCards";

  const uploadDir = path.join(baseDir, folderName);

  // ensure folder exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // generate file name and path
  const uniqueFilename = generateUniqueFilename(file.hapi.filename);
  const uploadPath = path.join(uploadDir, uniqueFilename);

  // create write stream
  const fileStream = fs.createWriteStream(uploadPath);
  const readableStream: Readable = file as unknown as Readable;

  return new Promise((resolve, reject) => {
    readableStream.pipe(fileStream);

    readableStream.on("end", () => {
      resolve(`/assets/employeeDocs/${folderName}/${uniqueFilename}`);
    });

    readableStream.on("error", (err) => {
      reject(err);
    });
  });
};
