const express = require('express')
const mysql = require('mysql')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const { v4: uuid } = require('uuid')
const { userIdFunction, folderPathFunction, fileInsertFunction, fileCheckingFunction,fileRenameFunction ,filePathFunction} = require('./Functions')

const router = express.Router()

let startPath = "./vdr"

router.use(bodyParser.json())

router.post('/create', (req, res) => {
    let data = req.body.data
    let fileName = req.body.fileName
    let id = req.body.id
    let token = req.headers.token
    if (id !== undefined) {

        async function create(folderPath, folderId, userId) {
            return new Promise((resolve, reject) => {
                let id = uuid()
                let filePath = path.join(folderPath, fileName)
                fs.writeFile(filePath, data, (err) => {
                    if (err) {
                        res.json({
                            "success": false,
                            "message": "file already exist"
                        })
                    }
                    else {
                        resolve([userId, id, fileName, filePath, folderId])
                    }

                })
            })
        }
        async function find() {
            try {
                let userId = await userIdFunction(token)
                let check = await fileCheckingFunction(userId, id, fileName)

                if (!check.length) {
                    let data = await folderPathFunction(userId, id)
                    let fileData = await create(data[0], data[1], data[2])
                    let out = await fileInsertFunction(fileData[0], fileData[1], fileData[2], fileData[3], fileData[4])
                    res.send(out)
                }
                else {
                    res.json({ "success": false, "message": "file already exist" })
                }
            } catch (err) {
                console.log(err)
            }

        }
        if (token !== undefined) {
            find()
        }
        else {
            res.json({ "success": false, "message": "request invalid" })
        }
    }
    else {

        function fileCreate(userId) {
            return new Promise((resolve, reject) => {
                let id = uuid()
                let filePath = startPath+"/"+ userId+"/"+fileName
                fs.writeFile(filePath, data, (err) => {
                    if (err) {
                        reject({
                            "success": false,
                            "message": "file already exist"
                        })
                    }
                    else {
                        resolve([userId, id, fileName, filePath])
                    }

                })
            })
        }
        async function user() {
            try {
                let userId = await userIdFunction(token)
                let check = await fileCheckingFunction(userId, undefined, fileName)
                console.log(check)

                if (!check.length) {
                    let fileData = await fileCreate(userId)
                    let out = await fileInsertFunction(fileData[0], fileData[1], fileData[2], fileData[3])
                    res.send(out)
                }
                else {
                    res.json({ "success": false, "message": "file already exist" })
                }
            } catch (err) {
                console.log(err)
            }
        }
        if (token !== undefined) {
            user()
        }
        else {
            res.json({ "success": false, "message": "request invalid" })
        }

    }
})

router.post('/remove', (req, res) => {

    let fileName = req.body.fileName
    fs.unlink(path.join(startPath, fileName), err => {
        if (err) {
            res.json({
                "success": false,
                "message": "file not exist"
            })
        }
        else {
            res.json({
                "success": true,
                "message": "file removed"
            })
        }
    })
})

router.post('/rename', (req, res) => {
    let token = req.headers.token
    let id = req.body.id

    async function fileRename(filePath) {
        let newFileName = req.body.newFileName
        let fileName = filePath.slice(0, filePath.lastIndexOf('/'))
        return new Promise((resolve, reject) => {
            let newFilePath = path.join(fileName, newFileName)

            fs.rename(filePath, newFilePath, err => {
                if (err) {
                    reject({
                        "success": false,
                        "message": "file not exist"
                    })
                }
                else {
                    resolve([newFilePath, newFileName])
                }
            })
        })
    }

    async function fileRenameProcess() {
        try {
            let userId = await userIdFunction(token)
            let filePath = await filePathFunction(id, userId)
            let fileData = await fileRename(filePath, userId)
            let data = await fileRenameFunction(id, userId, fileData[1], fileData[0])
            res.json(data)
        }
        catch (err) {
            res.send(err)
        }
    }
    if ((id !== undefined) && (token !== undefined)) {
        fileRenameProcess()
    }
    else{
        res.json({ "success": false, "message": "request invalid" })
    }



})

module.exports = router