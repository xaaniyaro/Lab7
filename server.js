let express = require("express");
let morgan = require("morgan");

let bodyParser = require("body-parser");

let uuid = require("uuid");
const cors = require('cors')

let app = express();
let jsonParser = bodyParser.json();
//js, css and html in the 'public' named folder
app.use(express.static('public'));
app.use(morgan("combined"));
app.use(cors());

//Default data

let posts = [{
    id: uuid.v4(),
    title: "One Hundred Years of Solitude",
    content: "One of the 20th century's enduring works. Is a widely beloved and acclaimed novel.",
    author: "Gabriel Garcia Marquez",
    publishDate: new Date('April 13, 2019 17:40:10')

},
{
    id: uuid.v4(),
    title: "Crime and Punishment",
    content: "It is a murder story, told from a murder;s point of view, that implicates even the most innocent reader in its enormities.",
    author: "Fyodor Dostoyevsky",
    publishDate: new Date('March 25, 2018 11:54:23')
},
{
    id: uuid.v4(),
    title: "Anna Karenina",
    content: "Anna Karenina tells of the doomed love affair between the sensuous and rebellious Anna and the dashing officer, Count Vronsky.",
    author: "Leo Tolstoy",
    publishDate: new Date('July 18, 2018 19:47:42')
},
{
    id: uuid.v4(),
    title: "To Kill a Mockingbird",
    content: "As a Southern Gothic novel and a Bildungsroman, the primary themes of To Kill a Mockingbird involve racial injustice and the destruction of innocence.",
    author: "Harper Lee",
    publishDate: new Date('Novemeber 2, 2018 21:32:21')
}];

//Auxiliary functions

function updatePost(uid, title, content, author, date){
    for (let i = 0; i < posts.length; i++) {
        if(posts[i].id == uid){
            if(title || title != undefined){
                posts[i].title = title;
            }
            if(content || content != undefined){
                posts[i].content = content;
            }
            if(author || author != undefined){
                posts[i].author = author;
            }
            if(author || author != undefined){
                posts[i].date = date;
            }
        }
    }
}

function checkId(id){
    for (let i = 0; i < posts.length; i++) {
        if(posts[i].id == id){
            return true;
        }
    }
    return false;
}

function deletePost(id){
    for(let i = 0; i < posts.length; i++){
        if(posts[i].id = id){
            posts.splice(i,1);
            return;
        }
    }
}

//Server functions

app.get("/blog-posts", (req, res, next) => {
    return res.status(200).json(posts);
});

app.get("/blog-postAuthor", (req, res, next) => {
    let author = req.query.author;
   
    if(!author) {
        res.statusMessage = "Author field is missing in paramenters";
        return res.status(406).json({
            message: res.statusMessage,
            status: 406
        });
    }

    let authorPosts = posts.filter(p => p.author == author);
    if(authorPosts.length == 0) {
        res.statusMessage = "The author does not exist";
        return res.status(404).json({
            message: res.statusMessage, 
            status: 404
        });
    }

    return res.status(200).json(authorPosts);
});

app.post("/blog-posts", jsonParser, (req, res) => {
    let request = req.body
    let title = request.title;
    let content = request.content;
    let author = request.author;
    let publishDate = request.publishDate;

    if(!title || !content || !author || !publishDate) {
        res.statusMessage = "All fields must have a value";
        return res.status(406).json({
            message: res.statusMessage, 
            status: 406
        });
    }

    request.id = uuid.v4();

    posts.push(request);
    return res.status(201).json(request);
});

app.delete("/blog-posts/:id", (req, res) => {
    let deleteId = req.params.id;
    console.log(deleteId);

    if(!checkId(deleteId)) {
        res.statusMessage = "The id does not exist";
        return res.status(404).json({
            message: res.statusMessage, 
            status: 404
        });
    }
    else{
        deletePost(deleteId);
    return res.status(200).json({
        message: "Deletion was successful",
        status: 200
    });
    }
});

app.put("/blog-posts/:id", jsonParser, (req, res) => {
    let paramId = req.params.id;
    let bodyId = req.body.id;
    let title = req.body.title;
    let content = req.body.content;
    let author = req.body.author;
    let publishDate = req.body.publishDate;

    if(!paramId) {
        res.statusMessage = "The id is required to update a post";
        return res.status(406).json({
            message: statusMessage, 
            status: 406
            });
    }

    if(paramId != bodyId) {
        res.statusMessage = "The id parameter and the body id are not the same";
        return res.status(409).json({
            message: res.statusMessage, 
            status: 409
            });
    }

    if(!checkId(paramId)) {
        res.statusMessage = "The id does not exist";
        return res.status(404).json({
            message: res.statusMessage, 
            status: 404
        });
    }
    
    updatePost(paramId,title, content, author, publishDate);
    return res.status(202).json({
        message: "The post was updated",
        status: 202
        });
});

app.listen("8080", () => {
    console.log("App is running on port 8080");
});
