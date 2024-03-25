import { createClient } from "@supabase/supabase-js"
import mime from "mime"
import fs from "fs"
import path from "path"
import dotenv from "dotenv"

dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

const defaultBucketName = "test"

const uploadFile = async (filePath) => {
	const fileName = path.basename(filePath)
	const fileType = mime.getType(filePath) || "application/octet-stream" // Dynamically determine MIME type

	try {
		const fileBuffer = fs.readFileSync(filePath)
		const { data, error } = await supabase.storage.from(defaultBucketName).upload(`uploads/${fileName}`, fileBuffer, {
			contentType: fileType // Set the MIME type dynamically
		})

		if (error) {
			throw error
		}

		console.log("File uploaded:", data)
	} catch (error) {
		console.error("Error uploading file:", error.message)
	}
}

const filePath = process.argv[2]
if (!filePath) {
	console.error("Usage: node upload.js <file-path>")
	process.exit(1)
}

uploadFile(filePath)
