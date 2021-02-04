import express from 'express'

const app = express()

app.get('/', (req: any, res: any  ) => {
  res.send('Hey 🙋🏼‍♂')
})


app.listen(3000, () => console.log('Server listening on port 3000...'))