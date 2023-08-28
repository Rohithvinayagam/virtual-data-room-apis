const express = require('express')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const { v4: uuid } = require('uuid')
const { userIdFunction, folderPathFunction, folderDataInsertFunction ,folderNameFunction,folderRenameFunction} = require('./Functions.js')
const router = express.Router()


router.use(bodyParser.json())

const startPath = "./vdr"
router.post('/create', (req, response) => {
    let token = req.headers.token
    let isActive = true
    let id = req.body.id
    let folderName = req.body.folderName

    async function createNestedFolder(name, userId) {
        return new Promise((resolve, reject) => {

            let folderPath =name+"/"+folderName

            fs.mkdir(folderPath, err => {
                if (err) {
                    res.json({
                        "success": false,
                        "message": "already exist"
                    })
                }
                else {
                    let id = uuid()

                    resolve([id, folderPath, folderName])
                }
            })
        })
    }
    async function nestedFolderNameCheck(name, userId) {
        console.log("newwww")
        let fileName = fs.readdirSync("./" + name)
        console.log(fileName)
        return new Promise((resolve, reject) => {
            const promises = fileName.map(it => {
                return new Promise((resolve1, reject1) => {
                    let out = { folders: [] }
                    let paths =name+"/"+it
                    console.log(paths)
                    fs.stat(paths, async(err, stats) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            if (stats.isDirectory()) {

                             let name=await folderNameFunction(userId,paths)
                                        out.folders.push(...name)
                                        resolve1(out)
                            }

                            else if (stats.isFile()) {
                                resolve1(out)
                            }

                        }

                    })
                })
            })
            Promise.all(promises).then(results => {
                console.log(results)
                let out = results.filter(it => (it.folders[0] === folderName))
                if (out.length) {

                    resolve(false)
                }
                else {
                    let out = results.filter(it => (it.folders[1] === folderName))
                    if (out.length) {
                        let str = "0123"
                        let number = ''
                        for (let i = 0; i < 4; i++) {
                            number += str[Math.floor(Math.random() * 4)]
                        }
                        folderName = folderName + number
                    resolve(nestedFolderNameCheck(name, userId))

                    }
                    else {
                        resolve(true)
                    }
                }

            })
        })
    }


    async function main() {
        try {
            let userId = await userIdFunction(token)
            let folderPath = await folderPathFunction(userId, id)
            console.log(folderPath[0])
            let check = await nestedFolderNameCheck(folderPath[0], userId)
            if (check) {
                let data = await createNestedFolder(folderPath[0], userId)
                let out = await folderDataInsertFunction(data[0], userId, data[2], data[1], isActive,req.body.folderName)
                console.log(out)
                response.json(out)
            }
            else {
                response.json({ "success": false, "message": "already exist" })
            }

        }
        catch (err) {
            console.log(err)
        }
    }

    if (id !== undefined) {
        if (token !== undefined) {
            main()
        }
        else{
            res.json({ "success": false, "message": "request invalid" })
        }

    }
    else {

        async function folderNameCheck(userId) {
            let fileName = fs.readdirSync("./vdr/" + userId)
            return new Promise((resolve, reject) => {
                const promises = fileName.map(it => {
              
                    return new Promise(async (resolve1, reject1) => {
                        let out = { folders: [] }
                        let paths = startPath+"/"+userId+"/"+it

                        fs.stat(paths, async(err, stats) => {
                            if (err) {
                                console.log(err)
                            }
                            else {
                                if (stats.isDirectory()) {

                                    let name=await folderNameFunction(userId,paths)
                                    out.folders.push(...name)
                                    resolve1(out)
                                }
                                else if (stats.isFile()) {
                                    resolve1(out)
                                }
                            }

                        })
                    })
                })
                Promise.all(promises).then(results => {
                    let out = results.filter(it => (it.folders[0] === folderName))
                    if (out.length) {

                        resolve(false)
                    }
                    else {

                        let out = results.filter(it => (it.folders[1] === folderName))
                        if (out.length) {
                            
                            let str = "0123"
                            let number = ''
                            for (let i = 0; i < 4; i++) {
                                number += str[Math.floor(Math.random() * 4)]
                            }
                            folderName = folderName + number
                            resolve(folderNameCheck(userId))
                        }
                        else {
                            resolve(true)
                        }
                    }

                })
            })
        }

        function createFolder(userId) {
            return new Promise((resolve, reject) => {
                let folderPath =startPath+"/"+userId+"/"+folderName
                console.log(folderPath)

                fs.mkdir(folderPath, err => {
                    if (err) {
                        response.json({
                            "success": false,
                            "message": "already exist"
                        })
                    }
                    else {
                        let id = uuid()
                         resolve([id, folderPath, folderName])

                    }
                })
            })
        }
        async function process() {
            try {
                let userId = await userIdFunction(token)
                let check = await folderNameCheck(userId)
                console.log(check)
                if (check) {
                    let data = await createFolder(userId)
                    let out = await folderDataInsertFunction(data[0], userId, data[2], data[1], isActive,req.body.folderName)
                    response.json(out)
                }
                else {
                    response.json({ "success": false, "message": "already exist" })
                }
            }
            catch (err) {
                console.log(err)
            }
        }
        if (token !== undefined) {
            process()
        }
        else{
            res.json({ "success": false, "message": "request invalid" })
        }

    }
})

router.post('/rename', (req, res) => {

    let id = req.body.id
    let token = req.headers.token
    let newFolderName = req.body.newFolderName

    async function nameCheck(name, userId) {
        let fileName = fs.readdirSync(name)

        return new Promise((resolve, reject) => {
            const promises = fileName.map(it => {
                return new Promise((resolve1, reject1) => {
                    let out = { folders: [] }
                    let paths = name+"/"+it
                    fs.stat(paths, async(err, stats) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            if (stats.isDirectory()) {

                             let name=await folderNameFunction(userId,paths)
                                        out.folders.push(name[0])
                                        resolve1(out)
                            }

                            else if (stats.isFile()) {
                                resolve1(out)
                            }

                        }

                    })
                })
            })
            Promise.all(promises).then(results => {
                console.log(results)
                let out = results.filter(it => (it.folders[0] === newFolderName))
                if (out.length) {

                    resolve(false)
                }
                else{
                    resolve(true)
                }
            })
        })
    }
    async function path(folderPath){
        let basePath=folderPath.slice(0,folderPath.lastIndexOf('/'))
        return basePath
    }  
     async function folderRenameProcess() {
     try {
          let userId= await userIdFunction(token)
        let folderPath=await folderPathFunction(userId,id)
        let basePath=await path(folderPath[0])
        let check=await nameCheck(basePath,userId)
        if(check){
            let data = await folderRenameFunction(id,userId,newFolderName)
            res.json(data)
        }
        else{
            res.json({"status":false,"message":"folderName already exist"})
        }
    }
    catch(err){
        console.log(err)
    }
       
    }

    if ((id !== undefined) && (token !== undefined) && (newFolderName !== undefined)) {
        folderRenameProcess()
    }
    else {
        res.json({
            "success": false,
            "message": "request invalid"
        })
    }

})


router.post('/remove', (req, res) => {
    let fileName = path.join(startPath, req.body.folderName)
    fs.rmdir(fileName, err => {
        if (err) {
            res.json({
                "success": false,
                "message": "not exist"
            })
        }
        else {
            res.json({
                "success": true,
                "message": "removed successfully"
            })
        }
    })
})

module.exports = router