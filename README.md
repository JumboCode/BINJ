# BINJ
## Boston Institute for Nonprofit Journalism

to send data:
`curl -X POST 'localhost:3000/stories' -d "title=Jumbos&author=alex&tags=tufts&coordinates=1.2&coordinates=2.3"`

## To Run:
#### Install Packages:
```
npm install express
npm install mongodb
```

#### Then Run (server startup script):
```
mongod (in seperate tab)
node server
```
