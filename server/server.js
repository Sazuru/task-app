/* eslint-disable no-underscore-dangle */
import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'

import cookieParser from 'cookie-parser'
import Root from '../client/config/root'

import Html from '../client/html'

const lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const db = lowdb(new FileSync('db.json'))

const { readFile, writeFile, readdir } = require('fs').promises
const shortid = require('shortid')

db.defaults({ tasks: {} }).write()

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

const readTasks = (category) => {
  return readFile(`${__dirname}/tasks/${category}.json`, { encoding: 'utf8' })
    .then((data) => JSON.parse(data))
    .catch(() => {
      return []
    })
}

const listTasks = () => {
  // читаем список файлов в папке tasks
  return (
    readdir(`${__dirname}/tasks/`)
      // убираем расширение .json у каждого элемента массива
      .then((data) => data.map((list) => list.slice(0, -5)))
      .catch(() => {
        return []
      })
  )
}

server.get('/api/v2/categories', async (req, res) => {
  const tasks = db.get('tasks').keys()
  res.json(tasks)
})

server.get('/api/v2/tasks/:category', (req, res) => {
  const { category } = req.params
  const categoryName = `${category.trim()}`
  const data = db.get('tasks').get(categoryName).value()
  if (!data) {
    return res.status(404).json({ status: 'Category not found' })
  }
  console.log(data)
  return res.json(data)
})

server.post('/api/v2/tasks/:category', (req, res) => {
  const { category } = req.params
  const newTask = {
    taskId: shortid.generate(),
    title: req.body.title.trim(),
    status: 'new',
    _isDeleted: false,
    _createdAt: Date.now(),
    _deletedAt: null
  }
  const categoryName = `${category.trim()}`
  // создаём категорию, если её нет
  if (db.find(categoryName).value() === undefined) {
    return db.get('tasks').set(`${categoryName}`, []).write()
  }

  const getCategory = db.get('tasks').get(categoryName).value().push(newTask)
  db.find(categoryName).assign(getCategory).write()

  return res.status(200).json({ status: 'success', id: newTask.taskId })
})

server.patch('/api/v2/tasks/:category/:id', async (req, res) => {
  // берём категорию и id задачи
  const { category, id } = req.params
  // создаём массив разрешённых статусов
  const acceptableStatus = ['done', 'new', 'in progress', 'blocked']
  // получаем новый статус задачи
  const newStatus = req.body.status.trim()
  const categoryName = `${category.trim()}`
  if (acceptableStatus.includes(newStatus)) {
    db.get('tasks')
      .get(categoryName)
      .find({ taskId: id })
      .assign({ status: `${newStatus}` })
      .write()
    return res.status(200).json({ status: 'Successfully updated', newStatus, id })
  }
  // возвращаем ошибку
  return res.status(501).json({ status: 'error', message: 'Incorrect status' })
})

// старые методы

server.get('/api/v1/categories', async (req, res) => {
  const tasks = await listTasks()
  res.json(tasks)
})

server.get('/api/v1/tasks/:category', async (req, res) => {
  // берём категорию задач
  const { category } = req.params
  // берём массив прошлых задач из заданной категории или возвращаем пустой
  const allTasks = await readTasks(category)
  // фильтруем список задач по статусу _isDeleted
  const filteredTasks = allTasks.filter((task) => task._isDeleted !== true)
  // возвращаем список задач без полей, начинающихся с "_"
  const result = filteredTasks.map((task) => {
    return Object.keys(task).reduce((acc, field) => {
      if (field[0] === '_') {
        return acc
      }
      return { ...acc, [field]: task[field] }
    }, {})
  })
  // возвращаем статус запроса
  res.status(200).json(result)
})

server.get('/api/v1/tasks/:category/:timespan', async (req, res) => {
  // берём категорию задач и время для фильтра
  const { category, timespan } = req.params
  // берём массив прошлых задач из заданной категории или возвращаем пустой
  const allTasks = await readTasks(category)
  // задаём переменную в зависимости от времени для фильтра
  const periodOfTime = (() => {
    if (timespan === 'day') return 1000 * 60 * 60 * 24
    if (timespan === 'week') return 7 * 1000 * 60 * 60 * 24
    if (timespan === 'month') return 30 * 1000 * 60 * 60 * 24
    return 'all'
  })()
  // фильтруем список задач по статусу _isDeleted и фильтруем по дате создания
  const filteredTasks = allTasks.filter(
    (task) =>
      task._isDeleted !== true &&
      (periodOfTime === 'all' ? true : task._createdAt + periodOfTime > Date.now())
  )
  // возвращаем список задач без полей, начинающихся с "_"
  const result = filteredTasks.map((task) => {
    return Object.keys(task).reduce((acc, field) => {
      if (field[0] === '_') {
        return acc
      }
      return { ...acc, [field]: task[field] }
    }, {})
  })
  // возвращаем статус запроса
  res.status(200).json(result)
})

server.post('/api/v1/tasks/:category', async (req, res) => {
  // берём категорию задачи
  const { category } = req.params
  // создаём новую задачу
  const newTask = {
    taskId: shortid.generate(),
    title: req.body.title,
    status: 'new',
    _isDeleted: false,
    _createdAt: Date.now(),
    _deletedAt: null
  }
  // берём массив прошлых задач из заданной категории или возвращаем пустой
  const allTasks = await readTasks(category)
  // добавляем новую задачу в массив
  const addTasks = [...allTasks, newTask]
  // сохраняем массив задач в файл нужной категории
  saveTasks(category, addTasks)
  // возвращаем статус запроса
  res.status(200).json({ status: 'success', id: newTask.taskId })
})

server.patch('/api/v1/tasks/:category/:id', async (req, res) => {
  // берём категорию и id задачи
  const { category, id } = req.params
  // создаём массив разрешённых статусов
  const acceptableStatus = ['done', 'new', 'in progress', 'blocked']
  // получаем новый статус задачи
  const newStatus = req.body.status
  // получаем новое название задачи
  const newTitle = req.body.title
  if (newTitle.length === 0) {
    // возвращаем ошибку
    return res.status(501).json({ status: 'error', message: 'Incorrect title' })
  }
  // проверяем условие наличия нового статуса в списке разрешённых
  if (acceptableStatus.includes(newStatus)) {
    // берём массив прошлых задач из заданной категории или возвращаем пустой
    const allTasks = await readTasks(category)
    // обновляем статус и название задачи
    const updatedTasks = allTasks.map((task) =>
      task.taskId === id ? { ...task, status: newStatus, title: newTitle } : task
    )
    // сохраняем массив задач в файл нужной категории
    saveTasks(category, updatedTasks)
    // возвращаем статус запроса
    return res.status(200).json({ status: 'Successfully updated', newStatus, newTitle, id })
  }
  // возвращаем ошибку
  return res.status(501).json({ status: 'error', message: 'Incorrect status' })
})

// server.patch('/api/v1/tasks/:category/:id', async (req, res) => {
//   // берём категорию и id задачи
//   const { category, id } = req.params
//   // получаем новый статус задачи
//   const newTitle = req.body.title
//   if (newTitle.length === 0) {
//     // возвращаем ошибку
//     res.status(501).json({ status: 'error', message: 'Incorrect title' })
//   }
//   // берём массив прошлых задач из заданной категории или возвращаем пустой
//   const allTasks = await readTasks(category)
//   // обновляем статус задачи
//   const updatedTasks = allTasks.map((task) =>
//     task.taskId === id ? { ...task, title: newTitle } : task
//   )
//   // сохраняем массив задач в файл нужной категории
//   saveTasks(category, updatedTasks)
//   // возвращаем статус запроса
//   res.status(200).json({ status: 'Title successfully updated', newTitle, id })
// })

server.delete('/api/v1/tasks/:category/:id', async (req, res) => {
  // берём категорию задач и нужный id
  const { category, id } = req.params
  // берём массив прошлых задач из заданной категории или возвращаем пустой
  const allTasks = await readTasks(category)
  // находим нужную задачу по id, выставляем значение ключа _isDeleted в true, создаем дату удаления
  const updatedTasks = allTasks.map((task) =>
    task.taskId === id ? { ...task, _isDeleted: true, _deletedAt: Date.now() } : task
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

// eslint-disable-next-line no-console
console.log(`Serving at http://localhost:${port}`)
