const mysql = require('mysql')
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "dell123456",
    database: "vdr"
})


async function userIdFunction(token) {
    return new Promise((resolve, reject) => {
        connection.query(`select userId from token where token='${token}'`, (err, result) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(result[0].userId)
            }
        })
    })

}
async function folderPathFunction(userId, id) {
    return new Promise((resolve, reject) => {
        connection.query(`select id,folderPath from folder where id='${id}' and userId='${userId}'`, (err, result) => {
            if (err) {
                reject(err)
            }
            else {
                if (result.length) {
                    resolve([result[0].folderPath, result[0].id, userId])
                }
                else {
                    reject({ "success": false, "message": "id not found" })
                }
            }
        })
    })
}
async function fileCheckingFunction(userId, folderId, fileName) {
    return new Promise((resolve, reject) => {
        let query
        if (folderId !== undefined) {
            query = `select fileName from file where userId='${userId}' and folderId='${folderId}' and fileName='${fileName}'`
        }
        else {
            query = `select fileName from file where userId='${userId}' and folderId is null and fileName='${fileName}'`
        }
        connection.query(query, (err, result) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(result)
            }
        })

    })
}

async function fileInsertFunction(userId, id, fileName, filePath, folderId) {
    return new Promise((resolve, reject) => {
        let query
        if (folderId !== undefined) {
            query = `insert into file(id,fileName,filePath,folderId,userId,createAt) values('${id}','${fileName}','${filePath}',.'${folderId}','${userId}',NOW())`
        }
        else {
            query = `insert into file(id,fileName,filePath,userId,createAt) values('${id}','${fileName}','${filePath}','${userId}',NOW())`
        }
        connection.query(query, (err, result) => {

            if (err) {
                reject(err)
            }
            else {
                resolve({ "success": true, "message": "file created", "id": id })
            }
        })

    })
}
async function fileDataFunction(userId) {
    return new Promise((resolve, reject) => {
        connection.query(`select fileName,id from file where userId='${userId}'`, (err, result) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(result)

            }
        })
    })
}
async function folderDataFunction(userId) {
    return new Promise((resolve, reject) => {
        connection.query(`select folderName,id from folder where userId='${userId}'`, (err, result) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(result)
            }
        })
    })
}
async function folderDataInsertFunction(id, userId, folderName, folderPath, isActive,userFolderName) {
    return new Promise((resolve, reject) => {

console.log(folderPath)
        connection.query(`insert into folder (id,folderName,folderPath,createAt,userId,isActive,userFolderName) values('${id}','${folderName}',"${folderPath}",NOW(),'${userId}',${isActive},'${userFolderName}')`, (err, result) => {
            if (err) {
                console.log(err)
            }
            else {
                resolve({
                    "success": true,
                    "message": "folder created",
                    "id": id
                })
            }
        })
    }
    )
}

async function folderNameFunction(userId, paths) {
    return new Promise((resolve, reject) => {


        connection.query(`select userFolderName,folderName from folder where userId='${userId}' and folderPath='${paths}'`, (err, result) => {
            if (err) {
                console.log(err)
            }
            else {
                console.log(result)
                if(result.length){
                resolve([result[0].userFolderName, result[0].folderName])
            }
            }
        })
    }
    )
}
async function filePathFunction(id, userId) {
    return new Promise((resolve, reject) => {

        connection.query(`select filePath from file  where id='${id}' and userId='${userId}'`, (err, result) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(result[0].filePath)
            }
        })
    })

}
async function fileRenameFunction(id, userId, fileName, filePath) {
    return new Promise((resolve, reject) => {

        connection.query(`update file set fileName='${fileName}',filePath='${filePath}' where id='${id}' and userId='${userId}'`, (err, result) => {
            if (err) {
                reject(err)
            }
            else {
                resolve({
                    "success": true,
                    "message": "file renamed"
                })
            }
        })


    })
}

async function folderRenameFunction(id,userId, name) {
    return new Promise((resolve, reject) => {


        connection.query(`update folder set userFolderName='${name}'  where id='${id}' and userId='${userId}'`, (err, result) => {
            if (err) {
                console.log(err)
            }
            else {

                resolve({
                    "success": true,
                    "message": "renamed successfully"
                })
            }
        })

    })

}



module.exports = { userIdFunction, folderPathFunction, fileInsertFunction, fileCheckingFunction, fileDataFunction, folderDataFunction, folderDataInsertFunction, folderNameFunction, filePathFunction, folderRenameFunction, fileRenameFunction }