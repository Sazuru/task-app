/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import express from 'express'
import axios from 'axios'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'

import cookieParser from 'cookie-parser'
import Root from '../client/config/root'

import Html from '../client/html'

const { readFile, writeFile, unlink } = require('fs').promises
const shortid = require('shortid')

let connections = []

const port = process.env.PORT || 8090
const server = express()

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  bodyParser.json({ limit: '50mb', extended: true }),
  cookieParser()
]

middleware.forEach((it) => server.use(it))

const saveTasks = async (category, tasks) => {
  return writeFile(`${__dirname}/tasks/${category}.json`, JSON.stringify(tasks), {
    encoding: 'utf8'
  })
}

const readTasks = async (category) => {
  return readFile(`${__dirname}/tasks/${category}.json`, { encoding: 'utf8' })
    .then((data) => JSON.parse(data))
    .catch(async () => {
      return []
    })
}

server.get('/api/v1/tasks/:category', async (req, res) => {
  const { category } = req.params
  const allTasks = await readTasks(category)
  const workingTasks = allTasks
    // eslint-disable-next-line no-underscore-dangle
    .filter((task) => task._isDeleted === true)
  res.json(workingTasks)
})

server.post('/api/v1/tasks/:category', async (req, res) => {
  // берём категорию задач
  const { category } = req.params
  // создаём новую задачу
  const newTask = {
    id: shortid.generate(),
    title: req.body.title,
    status: 'new',
    _isDeleted: false,
    _createdAt: +new Date(),
    _deletedAt: null
  }
  // берём массив прошлых задач из заданной категории или возвращаем пустой
  const arr = await readTasks(category)
  // добавляем новую задачу в массив
  const addTasks = [...arr, newTask]
  // сохраняем массив задач в файл нужной категории
  saveTasks(category, addTasks)
  // возвращаем статус запроса
  res.json({ status: 'success', id: newTask.id })
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const echo = sockjs.createServer()
echo.on('connection', (conn) => {
  connections.push(conn)
  conn.on('data', async () => {})

  conn.on('close', () => {
    connections = connections.filter((c) => c.readyState !== 3)
  })
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Skillcrucial - Become an IT HERO'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

const app = server.listen(port)

echo.installHandlers(app, { prefix: '/ws' })

console.log(`Serving at http://localhost:${port}`)
