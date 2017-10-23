# BINJ
## Boston Institute for Nonprofit Journalism

#### A heroku-served instance of this project is running [here](https://mysterious-chamber-44366.herokuapp.com/)

## To Run Locally:
1. Clone this repository
2. Change into the repository's directory
3. Run `npm start`
4. The served content will be available at `localhost:3000`

#### To send data to the locally running Mongo instance:

`curl -X POST 'localhost:3000/stories' -d "title=Jumbos&author=alex&tags=tufts&coordinates=1.2&coordinates=2.3"`


The info sent with the `POST` request will be displayed at `localhost:3000/name`

#### Check out our [wiki](https://github.com/jumbocodefall2017/BINJ/wiki) for data on our API and schema!
