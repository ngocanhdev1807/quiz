import * as fs from 'fs-extra'
import last from 'lodash/last'
import path from 'path'
import { messageNotification } from './messageNotification.utils'

export const createAndWriteFileUpdate = async ({
  filePath,
  content,
  currentContent,
  overwrite = false,
  createFolder = false
}: {
  filePath: string
  content: any
  currentContent: string
  overwrite: boolean
  createFolder: boolean
}) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Kiểm tra xem tệp đã tồn tại hay không
    const fileExists = await fs.pathExists(filePath)

    if (fileExists) {
      // logger.logAsync(`thư mục ${path.dirname(filePath)} đã tồn tại`)
      console.log(messageNotification(`thư mục ${path.dirname(filePath)} đã tồn tại`))
    }

    if (fileExists && !overwrite) {
      throw new Error('Tệp đã tồn tại và không cho phép ghi đè.')
    }

    if (createFolder) {
      const folderPath = path.dirname(filePath)

      if (!fileExists) {
        // logger.logAsync(`thư mục ${path.dirname(filePath)} chưa tồn tại, đang tiến hành tạo thư mục ${folderPath} `)
        console.log(
          messageNotification(
            `thư mục ${path.dirname(filePath)} chưa tồn tại, đang tiến hành tạo thư mục ${folderPath} `
          )
        )
      }

      await fs.ensureDir(folderPath)
    }

    // Chuyển nội dung thành chuỗi nếu nó không phải là chuỗi
    if (typeof content !== 'string') {
      content = JSON.stringify(content)
    }

    // logger.logAsync(
    //   `Đang tiến hành tạo file ${last(filePath.split('/'))} trong thư mục ${path.dirname(
    //     filePath
    //   )} và ghi dữ liệu vào file ${last(filePath.split('/'))}`
    // )

    console.log(
      messageNotification(
        `Đang tiến hành tạo file ${last(filePath.split('/'))} trong thư mục ${path.dirname(
          filePath
        )} và ghi dữ liệu vào file ${last(filePath.split('/'))}`
      )
    )

    await fs.writeFile(filePath, currentContent + content)

    // logger.logAsync(
    //   `Tạo thư file ${last(filePath.split('/'))} với đường dẫn ${filePath} và ghi dữ liệu vào file ${last(
    //     filePath.split('/')
    //   )} thành công`
    // )

    console.log(
      messageNotification(
        `Tạo thư file ${last(filePath.split('/'))} với đường dẫn ${filePath} và ghi dữ liệu vào file ${last(
          filePath.split('/')
        )} thành công`
      )
    )

    return 'Tạo và ghi tệp thành công.'
  } catch (err) {
    console.error('Lỗi trong quá trình xử lý:', err)
    throw err
  }
}

export const getNameFromFullname = (fullname: string) => {
  const namearr = fullname.split('.')
  namearr.pop()
  return namearr.join('')
}

export const getExtension = (fullname: string) => {
  const namearr = fullname.split('.')
  return namearr[namearr.length - 1]
}

export const getFiles = (dir: string, files: string[] = []) => {
  // Get an array of all files and directories in the passed directory using fs.readdirSync
  const fileList = fs.readdirSync(dir)
  // Create the full path of the file/directory by concatenating the passed directory and file/directory name
  for (const file of fileList) {
    const name = `${dir}/${file}`
    // Check if the current file/directory is a directory using fs.statSync
    if (fs.statSync(name).isDirectory()) {
      // If it is a directory, recursively call the getFiles function with the directory path and the files array
      getFiles(name, files)
    } else {
      // If it is a file, push the full path to the files array
      files.push(name)
    }
  }
  return files
}
