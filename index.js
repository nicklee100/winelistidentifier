const express = requrie('express')

const app = express()

app.get('/', function (req,res){
  res.send('server running')
})

app.listen(3000, function() {
  console.log('serving running on 3000')
  })
