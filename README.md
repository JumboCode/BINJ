# BINJ [![Build Status](https://travis-ci.org/JumboCode/BINJ.svg?branch=master)](https://travis-ci.org/JumboCode/BINJ)
## Boston Institute for Nonprofit Journalism

#### A heroku-served instance of this project is running [here](https://binj-map.herokuapp.com/)


to register a user:
run server: 
`DEV_MODE=true node server.js`
then send user:
`curl -X POST 'localhost:3000/account/register' -d "username=Jumbo&password=Tufts"`

## To Run:
#### Install Packages:
```
npm install express
npm install mongodb
```

## To Run Locally:
1. Clone this repository
2. Change into the repository's directory
3. Run `npm start`
4. The served content will be available at `localhost:3000`


#### Check out our [wiki](https://github.com/jumbocodefall2017/BINJ/wiki) for data on our API and schema!
