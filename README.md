# BINJ
## Boston Institute for Nonprofit Journalism

## To Run:
#### Install Packages:
```
npm install
```

#### Then Run (server startup script):
```
mongod (in seperate tab)
node server
```

#### To send data to the running Mongo instance:
`curl --request POST 'localhost:3000/name' --data "name=alex"`

The info sent with the `POST` request will be displayed at `localhost:3000/name`
