//const express = require('express')
import express from "express";
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(express.json());// converting the values to json
const PORT = '3000'

//const MONGO_URL = "mongodb://localhost";
const MONGO_URL = process.env.MONGO_URL;

async function createConnection() {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("Mongo is connected");
    return client;
}

 const client = await createConnection();
app.get('/', function (req, res) {
  res.send('Hello World')
})

const movies = [
    {
     "id": "101",
     "title": "Spider-Man",
     "rating": "4.9",
     "summary": "Spider-Man is a superhero appearing in American comic books published by Marvel Comics. Created by writer-editor Stan Lee and artist Steve Ditko, he first appeared in the anthology comic book Amazing Fantasy #15 (August 1962) in the Silver Age of Comic Books.",
     "poster": "https://upload.wikimedia.org/wikipedia/en/2/21/Web_of_Spider-Man_Vol_1_129-1.png",
     "trailer": "https://www.youtube.com/embed/TYMMOjBUPMM"
    },
    {
     "id": "102",
     "title": "Iron Man",
     "rating": 4.7,
     "summary": "Iron Man is a 2008 American superhero film based on the Marvel Comics character of the same name. Produced by Marvel Studios and distributed by Paramount Pictures,[N 1] it is the first film in the Marvel Cinematic Universe (MCU). ",
     " poster": "https://upload.wikimedia.org/wikipedia/en/0/02/Iron_Man_%282008_film%29_poster.jpg",
     "trailer": "https://www.youtube.com/embed/8ugaeA-nMTc"
    },
    {
     "id": "103",
     "title": "Avengers",
     "rating": 4.7,
     "summary": "Marvel's The Avengers[6] (classified under the name Marvel Avengers Assemble in the United Kingdom and Ireland),[3][7] or simply The Avengers, is a 2012 American superhero film based on the Marvel Comics superhero team of the same name. Produced by Marvel Studios and distributed by Walt Disney Studios Motion Pictures,",
     "poster": "https://upload.wikimedia.org/wikipedia/en/8/8a/The_Avengers_%282012_film%29_poster.jpg",
     "trailer": "https://www.youtube.com/embed/eOrNdBpGMv8"
    },
    {
     "id": "104",
     "title": "Avengers: Age Of Ultron",
     "rating": 4.4,
     "summary": "Avengers: Age of Ultron is a 2015 American superhero film based on the Marvel Comics superhero team the Avengers. Produced by Marvel Studios and distributed by Walt Disney Studios Motion Pictures, it is the sequel to The Avengers (2012) and the 11th film in the Marvel Cinematic Universe (MCU).",
     "poster": "https://upload.wikimedia.org/wikipedia/en/f/ff/Avengers_Age_of_Ultron_poster.jpg",
     "trailer": "https://www.youtube.com/embed/tmeOjFno6Do"
    },
    {
     "id": "105",
     "title": "Avengers: Infinity War",
     "rating": 4.7,
     "summary": "Avengers: Infinity War is a 2018 American superhero film based on the Marvel Comics superhero team the Avengers. Produced by Marvel Studios and distributed by Walt Disney Studios Motion Pictures, it is the sequel to The Avengers (2012) and Avengers: Age of Ultron (2015), and the 19th film in the Marvel Cinematic Universe (MCU). ",
     "poster": "https://upload.wikimedia.org/wikipedia/en/4/4d/Avengers_Infinity_War_poster.jpg",
     "trailer": "https://www.youtube.com/embed/6ZfuNTqbHE8"
    },
    {
     "title": "Beast",
     "rating": "5",
     "summary": "Beast is an upcoming Indian Tamil-language action comedy film written and directed by Nelson and produced by Sun Pictures. The film stars Vijay and Pooja Hegde, while Selvaraghavan, Yogi Babu and Redin Kingsley play supporting roles.",
     "poster": "https://static.toiimg.com/photo/msid-83716592/83716592.jpg?920851",
     "trailer": "https://www.youtube.com/embed/0E1kVRRi6lk",
     "id": "106"
    }
   ];

app.get("/movies", async function(req,res) {
    let filter = req.query;
    if(filter.rating){
        filter.rating = +filter.rating;
    }
    //const movieRating = movies.filter(item => item.rating == rating);
    // connect to db 
    // the output will have pagination, we need array as output to show
    const allMovies = await client.db("test").collection("movies").find(filter).toArray()
    //const movieRating = await client.db("test").collection("movies").findOne({rating: rating})
    //rating ? res.send(movieRating) : res.send(movies);
    res.send(allMovies)
})

app.get("/movies/:id", async function(req,res){
    const {id} = req.params;
    //const movie = movies.find(item => item.id === id)
    //console.log(req.params);
    
    // connect with db
    
    const movie = await client.db("test").collection("movies").findOne({ id: id});
    movie ? res.send(movie) : res.send("No movie found with that ID") ;
})

app.post("/movies", async function(req,res){
    const newMovie = req.body;
    const updatedMovie = await client.db("test").collection("movies").insertMany(newMovie);
    res.send(updatedMovie);
})

app.delete("/movies/:id", async function(req,res){
    const {id} = req.params;
    const deletedMovie = await client.db("test").collection("movies").deleteOne({ id: id})
    deletedMovie ? res.send(deletedMovie) : res.send("No Movie is deleted") ;
})

app.put("/movies/:id", async function(req,res){
    const {id} = req.params;
    const updateData = req.body;
    const updatedMovie = await client.db("test").collection("movies").updateOne({ id: id}, {$set: updateData})
    updatedMovie ? res.send(updatedMovie) : res.send(" Movie is updated") ;
})


app.listen(PORT, function(){
    console.log("Listening on:", PORT);
})