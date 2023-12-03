const db = require('./db');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key'; 
const app = express();
const port = 5000;


// Middleware

app.use(cors({
    origin: 'http://localhost:5173', // Replace with your client's origin
    //credentials: true, // Enable sending cookies (session)
  }));
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  
// Middleware for JWT verification and user extraction
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if(authHeader == undefined){
    res.status(401).send({error: "no token provided"})
  }
  else{
    const token = authHeader.split(' ')[1];
      jwt.verify(token, secretKey, function(err, decoded){
        if(err){
          console.log(err);
          res.status(401).send({error: "Authentication failed"})
        }
        else{
         // res.send(decoded);
          req.user = decoded;
          next();
        }
      });
    }
    }

app.get('/', (req, res) => {
    res.send('server is running');
});

app.post("/api/signup", (req, res) => {
    const {email, password} = req.body;
    const signupquery = "INSERT INTO login (email, password)values(?, ?)";
    db.query(signupquery, [email, password],(result, err) =>{
       
    })
})

app.post("/api/login", (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
      }
    
      const loginQuery = "SELECT * FROM login WHERE email = ? AND password = ?";
      db.query(loginQuery, [email, password], (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Internal server error" });
        }
    
        if (result.length === 0) {
          return res.status(401).json({ message: "No user with that email and password" });
        }
    
        // User is authenticated; generate and send a JWT token
        const user = result[0];
        const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
      
    
        res.json({ token:  token });
})
})

app.post("/api/CreatemyBlog",verifyToken, (req, res) => {
const createquery = "INSERT INTO blogtable  (email, blogs) VALUES (?, ?)";
const email = req.user.email;
const {myblog} = req.body;
db.query(createquery, [email, myblog], (err, cresult) => {
  if(err){
    console.log(err);
  }
  
    res.json({ message: "inserted successfully" });
  
});
})

app.post("/api/ReadmyBlog",verifyToken, (req, res) => {
  const readquery = "SELECT * FROM blogtable WHERE email = ? ORDER BY time desc";
  const email = req.user.email;
  db.query(readquery, [email], (err, blogdata) => {
    if(err){
      console.log(err);
    }
    
    res.json({blogdata})
})
})

app.post("/api/EditmyBlog",verifyToken, (req, res) => {
  const {blogContent, postid} = req.body;
  const editquery = "UPDATE blogtable SET blogs = ? WHERE postid = ?";
  db.query(editquery, [blogContent, postid], (err, res) => {
    if(err){
      console.log(err);
    }
  })  
})

app.post("/api/DeletemyBlog",verifyToken, (req, res) => {
  const {postid} = req.body;
  const deletequery = "DELETE FROM blogtable WHERE postid = ?";
  db.query(deletequery, [postid], (err, res) => {
    if(err){
      console.log(err);
    }
  })  
})

app.post("/api/ReadothersBlog",verifyToken, (req, res) => {
  const readothersquery = "SELECT * FROM blogtable WHERE email != ? ORDER BY time desc";
  const email = req.user.email;
  db.query(readothersquery, [email], (err, OthersBlogs) => {
  if(err){
    console.log(err);
  }
  res.json({OthersBlogs})
})
})

app.post("/api/ViewComments",verifyToken, (req, res) => {
  const viewcommentquery = "SELECT * from comment WHERE postid = ? ORDER BY time desc";
  const {postid} = req.body;
  const usermail = req.user.email;
  db.query(viewcommentquery, [postid], (err, commentresults) => {
    if(err){
      console.log(err);
    }
    res.json({commentresults, usermail})
  })
})

app.post("/api/CommentonBlog",verifyToken, (req, res) => {
  const commentquery = "INSERT INTO comment (commenter_email, postid, mycomment) VALUES (?, ?, ?)";
  const commenter_email = req.user.email;
  const {postid, comment} = req.body;
  db.query(commentquery, [commenter_email, postid, comment], (err, res) => {
  if(err){
    console.log(err);
  }
})
})

app.post("/api/EditComment", verifyToken, (req, res) => {
  const editcommentquery = "UPDATE comment SET mycomment = ? WHERE commentid = ?";
  const {CommentContent, mycommentid} = req.body;
  db.query(editcommentquery, [CommentContent, mycommentid], (err, editedcommentresults) => {
    if(err){
      console.log(err);
    }
  })
})

app.post("/api/DeleteComment", verifyToken, (req, res) => {
  const deletecommentquery = "DELETE FROM comment WHERE commentid = ?";
  const {mycommentid} = req.body;
  db.query(deletecommentquery, [mycommentid], (err, deleteresult) => {
    if(err){
      console.log(err);
    }
  })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});