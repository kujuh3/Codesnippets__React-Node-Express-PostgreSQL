const db = require('./dbconfig');

let descriptions = [];

// Get all snippets and match their categories from categories table
const getAllSnippets = (req, res) => {
    db.query('SELECT * FROM snippets', (err, snippets) => {
        if (err)
          console.error(err);
        else {
          var data = snippets.rows;
          descriptions = snippets.rows;
          db.query('SELECT * FROM categories', (err, categories) => {
            if (err)
              console.error(err);
            else
              for(let i = 0; i < data.length; i++) {
                data[i].category = categories.rows.filter(category => category.id == data[i].category_id);
              }
              res.send({data, "categories" : categories.rows});
          })
        }
     }) 
}

const addNewSnippet = (req, res) => {
  const newSnippet = req.body;
  
  /*res.json(newCustomer);*/
  try {
    if(!req.files || descriptions.some(el => el.name === newSnippet.name)) {
      console.log("asd")
        res.send({
            status: false,
            message: 'No file uploaded'
        });
    } else {
        let codeVal = req.files.file.data.toString('utf8')
        let extension = "";

        switch(newSnippet.extension) {
          case "py": 
          extension = "python"
          break;
          case "js": 
          extension = "javascript"
          break;
      }
        
        const query = {
          text: 'INSERT INTO snippets (name, code, description, extension, category_id, shortextension) VALUES ($1, $2, $3, $4, $5, $6)',
          values: [newSnippet.name, codeVal, newSnippet.description, extension, newSnippet.category_id, newSnippet.extension],
        }
        console.log(query)
        
        db.query(query, (err, res) => {
          if (err) {
            return console.error('Error executing query', err.stack)
          }
        })

        res.send({
            status: true,
            message: 'File is uploaded'
        });
    }
} catch (err) {
    res.status(500).send(err);
    console.log(err)
}
}

/* THESE ARENT BEING USED, NEITHER TESTED - JUST BOILERPLATE CODED */
const deleteSnippet = (req, res) => {
    const query = {
        text: 'DELETE FROM snippets WHERE id = $1',
        values: [req.params.id],
      }
    
      db.query(query, (err, res) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
      })
    
      res.status(204).end();
}

const updateSnippet = (req, res) => {

    const editedSnippet = req.body;
    
    newSnippet.name, codeVal, newSnippet.description, extension, newSnippet.category_id
    const query = {
      values: [editedSnippet.name, editedSnippet.code, editedSnippet.description, editedSnippet.category_id, req.params.id],
    }
  
    db.query(query, (err, res) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
    })
  
    res.json(editedSnippet);
}

module.exports = {
    getAllSnippets: getAllSnippets,
    addNewSnippet: addNewSnippet,
    deleteSnippet: deleteSnippet,
    updateSnippet: updateSnippet,
  }
