/* eslint-disable no-underscore-dangle */
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
  const filteredTasks = allTasks.filter((task) => task._isDeleted !== true)
  const result = filteredTasks.map((task) => {
    return Object.keys(task).reduce((acc, field) => {
      if (field[0] === '_') {
        return acc
      }
      return { ...acc, [field]: task[field] }
    }, {})
  })

  res.json(result)
})

server.post('/api/v1/tasks/:category', async (req, res) => {
  // берём категорию задач
  const { category } = req.params
  // создаём новую задачу
  const newTask = {
    taskId: shortid.generate(),
    title: req.body.title,
    status: 'new',
    _isDeleted: false,
    _createdAt: +new Date(),
    _deletedAt: null
  }
  // берём массив прошлых задач из заданной категории или возвращаем пустой
  const allTasks = await readTasks(category)
  // добавляем новую задачу в массив
  const addTasks = [...allTasks, newTask]
  // сохраняем массив задач в файл нужной категории
  saveTasks(category, addTasks)
  // возвращаем статус запроса
  res.json({ status: 'success', id: newTask.taskId })
})

server.delete('/api/v1/tasks/:category/:id', async (req, res) => {
  // берём категорию задач и нужный id
  const { category, id } = req.params
  // берём массив прошлых задач из заданной категории или возвращаем пустой
  const allTasks = await readTasks(category)
  // находим нужную задачу по id, выставляем значение ключа _isDeleted в true, создаем дату удаления
  const updatedTasks = allTasks.map((task) =>
    task.taskId === id ? { ...task, _isDeleted: true, _deletedAt: +new Date() } : task
  )
  // сохраняем новый массив
  saveTasks(category, updatedTasks)
  // возвращаем статус запроса и id удалённой задачи
  res.json({ status: 'Successfully deleted', id })
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
