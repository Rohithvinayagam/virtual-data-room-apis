const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const mysql = require('mysql')
const router = express.Router()


router.use(bodyParser.json())
router.post('/', (req, res) => {
    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "dell123456",
        database: "vdr"
    })
    let id = req.body.id
    let token = req.headers.token
    if (id !== undefined) {

        if (token !== undefined) {
            connection.connect(err => {
                if (err) {
                    console.log(err)
                }
                else {
                    connection.query(`select userId from token where token='${token}'`, (err, result) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            nestedFolderPath(result[0].userId)

                        }
                    })
                    function nestedFolderPath(userId) {
                        connection.query(`select folderPath from folder where id='${id}' and userId='${userId}'`, (err, result) => {
                            if (err) {
                                console.log(err)
                            }
                            else {
                                read(result[0].folderPath, userId)
                            }
                        })
                    }
                }
            })
        }

        function read(name, userId) {
            // let baseName = path.resolve(name)
            let fileName = fs.readdirSync("./" + name)
            async function find() {
                let out = await split()
                res.send(out)
            }
            find()
            async function split() {
                return new Promise((resolve, reject) => {
                    const promises = fileName.map(it => {
                        return new Promise((resolve1, reject1) => {
                            let out = {}
                            let paths = path.join(name, it)
                            fs.stat(paths, (err, stats) => {
                                if (err) {
                                    console.log(err)
                                }
                                else {
                                    if (stats.isFile()) {
                                        out.files = [it]
                                        connection.query(`select id from file where userId='${userId}' and filePath='${paths}'`, (err, result) => {
                                            if (err) {
                                                console.log(err)
                                            }
                                            else {
                                                out.files.push(result[0].id)
                                                resolve1(out)

                                            }
                                        })
                                    }
                                    else if (stats.isDirectory()) {
                                        out.folders = [it]
                                        connection.query(`select id from folder where userId='${userId}' and folderPath='${paths}'`, (err, result) => {
                                            if (err) {
                                                console.log(err)
                                            }
                                            else {
                                                out.folders.push(result[0].id)
                                                resolve1(out)

                                            }
                                        })
                                    }
                                }

                            })
                        })
                    })
                    Promise.all(promises).then(results => {
                        let out = { folders: [], files: [] } 
                        results.forEach(it => {

                            if (it.files !== undefined) {
                                out.files.push({ name: it.files[0], id: it.files[1] })
                            }
                            else {
                                out.folders.push({ name: it.folders[0], id: it.folders[1] })
                            }
                        })
                        resolve(out)
                    })
                })
            }
        }
    }

    else {
        async function folderPath() {
            return new Promise((resolve, reject) => {
                connection.connect(err => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        connection.query(`select userId from token where token ='${token}'`, (err, result) => {
                            if (err) {
                                console.log(err)
                            }
                            else {
                                resolve(result[0].userId)

                            }

                        })
                    }
                })

            })
        }
        async function wait() {
            let folder = await folderPath()
            let out = await a(folder)
            res.send(out)

        }
        if (token !== undefined) {
            wait()
        }
        async function a(folder) {
            return new Promise((resolve, reject) => {
                let result = fs.readdirSync("./vdr/" + folder)
                const promises = result.map(it => {
                    return new Promise((resolve1, reject1) => {

                        let out = {}
                        let paths = path.join("./vdr", folder, it)
                        fs.stat(paths, (err, stats) => {
                            if (err) {
                                console.log(err)

                            }
                            else {
                                if (stats.isFile()) {

                                    out.files = [it]
                                    connection.query(`select id from file where userId='${folder}' and filePath='${paths}'`, (err, result) => {
                                        if (err) {
                                            console.log(err)
                                        }
                                        else {
                                            out.files.push(result[0].id)
                                            resolve1(out)

                                        }
                                    })

                                }
                                else if (stats.isDirectory()) {

                                    out.folders = [it]
                                    connection.query(`select id from folder where userId='${folder}' and folderPath='${paths}'`, (err, result) => {
                                        if (err) {
                                            console.log(err)
                                        }
                                        else {
                                            out.folders.push(result[0].id)
                                            resolve1(out)

                                        }
                                    })


                                }
                            }

                        })
                    })
                })
                Promise.all(promises).then(results => {
                    let out = { folders: [], files: [] }
                 
                    results.forEach(it => {
                        if (it.files !== undefined) {
                            out.files.push({ name: it.files[0], id: it.files[1] })
                        }
                        else {
                            out.folders.push({ name: it.folders[0], id: it.folders[1] })
                        }
                    })
                    resolve(out)
                })
            })
        }
    }
})
module.exports = router