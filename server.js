const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('./db/db.json');

const PORT = process.env.PORT || 3001
const app = express();

//app.use = middleware - this is for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

//all my get routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

app.get('/api/notes', (req, res) => {
  res.json(db.slice(1))
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'))
});

//as I create new notes, they get pushed to the end of a previously empty array
const createNote = (body, notesArray) => {
    const newNote = body;
    if(!Array.isArray(notesArray)) {
        notesArray = [];
    }
    if(notesArray.length === 0) {
        notesArray.push(0)
    }
    body.id = notesArray.length;
    notesArray[0]++;
    notesArray.push(newNote);

    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    )
    return newNote;
};

app.post('/api/notes', (req, res) => {
    const newNote = createNote(req.body, db)
    res.json(newNote)
});

  app.listen(PORT, () => {
    console.log(`I CAN HEAR YOU on port ${PORT}...`)
  });