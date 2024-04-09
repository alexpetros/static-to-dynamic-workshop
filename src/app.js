import express from 'express'
import nunjucks from 'nunjucks'
import Database from 'better-sqlite3'


const db = new Database('./posts.db',
  { fileMustExist: true }
)

const app = express()
app.use(express.urlencoded({ extended: true }))

nunjucks.configure('./src/templates', { express: app })

app.get('/', (_req, res) => {
  const statement = db.prepare('SELECT post_id, content, author FROM posts')
  const posts = statement.all()
  res.render('index.njk', { posts })
})

app.post('/posts', (req, res) => {
  const post = req.body
  const content = post.content
  console.log(content)

  const statement = db.prepare(`
    INSERT INTO posts (content, author) VALUES (?, ?)
  `)
  statement.run(content, 'Alex')
  res.header('Location', '/')
  res.sendStatus(303)
})

app.post('/posts/:post_id/delete', (req, res) => {
  const post_id = req.params.post_id
  console.log(post_id)
  const statement = db.prepare(`
    DELETE FROM posts WHERE post_id = ?
  `)
  statement.run(post_id)

  res.header('Location', '/')
  res.sendStatus(303)
})

console.log('now listening on http://localhost:3000')
app.listen(3000)
