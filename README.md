## A web-app for uploading code snippets and searching them.
<a href="https://quicksnippets.herokuapp.com/" target="blank">Preview</a>
![kuva](https://user-images.githubusercontent.com/66220187/172847079-407bbdf5-ea09-4519-8865-beeaf24656a2.png)

## Local usage
### Server
<code>cd server</code><br>
<code>npm install</code><br>
<code>node index.js</code><br>

### Client
<code>cd client</code><br>
<code>npm install --force</code><br>
<code>npm start</code><br>

### In case of yarn or npm install errors, just run <code>--force</code> many libraries used haven't been updated to include React 18 or newer.


## Deployment to heroku

#### - Change database credentials in /server/db/dbconfig.js
#### - Create hero PSQL and dump latest.dump file to initiate SQL tables
#### - Uncomment heroku initiation blocks from /server/index.js
#### - Deploy app to heroku
