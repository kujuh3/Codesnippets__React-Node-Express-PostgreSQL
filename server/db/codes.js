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

const deleteCustomer = (req, res) => {
    const query = {
        text: 'DELETE FROM customers WHERE id = $1',
        values: [req.params.id],
      }
    
      db.query(query, (err, res) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
      })
    
      res.status(204).end();
}

const updateCustomer = (req, res) => {

    const editedCustomer = req.body;

    const query = {
      text: 'UPDATE customers SET firstname=$1, lastname=$2, email=$3, phone=$4 WHERE id = $5',
      values: [editedCustomer.firstname, editedCustomer.lastname, editedCustomer.email, editedCustomer.phone, req.params.id],
    }
  
    db.query(query, (err, res) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
    })
  
    res.json(editedCustomer);
}

module.exports = {
    getAllSnippets: getAllSnippets,
    addNewSnippet: addNewSnippet,
    deleteCustomer: deleteCustomer,
    updateCustomer: updateCustomer,
  }