import fs from "fs"
import { DEPS_DIR } from "./constants.js"
import { finished } from "stream/promises"
import { Readable } from "stream"
import path from "path"

/**
 * Download a jar file from Maven Central.
 * @param {string} library - The library to download.
 * @param {string} version - The version of the library to download.
 * @return {Promise<void}
 * @throws {Error} If the file can't be downloaded
 */
export async function downloadJar(library, version) {
  fs.mkdirSync(DEPS_DIR, { recursive: true })
  let [group, artifactId] = library.split(":")
  let baseUrl = "https://repo1.maven.org/maven2"
  let groupUrl = group.replace(/\./gi, "/")
  let jarUrl = `${baseUrl}/${groupUrl}/${artifactId}/${version}/${artifactId}-${version}.jar`

  return downloadFile(jarUrl, `${DEPS_DIR}/${artifactId}-${version}.jar`)
}


/**
 * Download a file from a URL.
 * @param {string} url - The URL to download from.
 * @param {string} savePath - The path to save the file to.
 * @returns {Promise<void>}
 * @throws {Error} If the request fails or of the file is not found
 */
export async function downloadFile(url, savePath) {
  let response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.statusText}`)
  }
  let destination = path.resolve(savePath)
  let fileStream = fs.createWriteStream(destination, {flags: "wx"})
  return finished(Readable.fromWeb(response.body).pipe(fileStream))
}
