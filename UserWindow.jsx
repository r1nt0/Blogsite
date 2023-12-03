import axios from 'axios'
import React from 'react'
import { useEffect, useState, useRef } from 'react';
import SendIcon from "./icons/send.svg"
import UserIcon from "./icons/user.svg"
import EditIcon from "./icons/pen-tool.svg"
import DeleteIcon from "./icons/trash.svg"
import UploadComments from "./icons/upload.svg"
import ViewComment from "./icons/message-square.svg"


const UserWindow = () => {

const token = localStorage.getItem("mytoken");
const [myblog, setmyblog] = useState("");
const [blogdata, setblogdata] = useState([]);
const [OthersBlogs, setOthersBlogs] = useState([]);



useEffect(()=>{
  
  axios.post("http://localhost:5000/api/ReadothersBlog",
  null, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then((response) => {
    setOthersBlogs(response.data.OthersBlogs);
  })
  .catch((error)=>{
      console.log(error);
  })
},[]
);

const RenderothersBlogs = ({ OthersBlogs }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentmail, setcommentmail] = useState("");
 
  
  

  const fetchComments = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/ViewComments", { postid: OthersBlogs.postid }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setComments(response.data.commentresults);
      setcommentmail(response.data.usermail);
    } catch (error) {
      console.log(error);
    }
  };

  const CommentonPost = async () => {
    try {
      
      await axios.post("http://localhost:5000/api/CommentonBlog", {
        postid: OthersBlogs.postid,
        comment: newComment
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      await fetchComments();
      
      setNewComment("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  
  const Editcomment = () =>{
    axios.post("http://localhost:5000/api/EditComment", {CommentContent, mycommentid}, 
    {
      headers: {Authorization: `Bearer ${token}`}
    }).catch((error) =>{
      console.log(error);
    })
  
  } 

  const DeleteComment = () =>{
    axios.post("http://localhost:5000/api/DeleteComment", {mycommentid}, 
    {
      headers: {Authorization: `Bearer ${token}`}
    }).catch((error) =>{
      console.log(error);
    })
  
  }
  
  const [CommentContent, setCommentContent] = useState(comments.mycomment);
  const [mycommentid, setmycommentid] = useState(comments && comments.commentid);
  
  return (
    <div className="card mb-3">
      <p className="card-title">{OthersBlogs.email}</p>
      <p className="card-title">{OthersBlogs.blogs}</p>
      <p className="card-title">{new Date(OthersBlogs.time).toLocaleString()}</p>
      
      <div>
        <button onClick={fetchComments}><img src={ViewComment} alt='View Comment Icon'/>Load Comments</button>
        {comments.map((comments, index) => (
          <div key={index}>
            <p className="card-title">{comments.commenter_email}</p>
            <p className="card-title">{comments.mycomment}</p>
            <p className="card-title">{new Date(comments.time).toLocaleString()}</p>
            
          </div>
           ))}   
      </div>

      
      <div>
        <input type="text" className='input-field' value={newComment} onChange={handleCommentChange} />
        <button onClick={CommentonPost}><img src={UploadComments} alt='Upload icon'/>Add Comment</button>
      </div>
    </div>
  );
};

  
  const createBlog = () =>{
   if(myblog.trim() != ''){
  axios.post("http://localhost:5000/api/createmyBlog", 
  {myblog}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
 
  ).then((response) => {
    alert("blog created successfully");
    setmyblog("");
  })
  .catch((error) => {
    console.log(error);
  });
}else{
  alert("please create a blog to post it");
}
}

const ReadyourBlog = () =>{

  axios.post("http://localhost:5000/api/ReadmyBlog", 
  null, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
 
  ).then((response) => {
    setblogdata(response.data.blogdata);
    
  })
  .catch((error) => {
    console.log(error);
  });
}




const RenderBlogdata = ({ blogdata }) => {

  const EditBlog = () =>{
    axios.post("http://localhost:5000/api/EditmyBlog", {blogContent, postid}, 
    {
      headers: {Authorization: `Bearer ${token}`}
    }).catch((error) =>{
      console.log(error);
    })
  
  }

  const DeleteBlog = () =>{
    axios.post("http://localhost:5000/api/DeletemyBlog", {postid}, 
    {
      headers: {Authorization: `Bearer ${token}`}
    }).catch((error) =>{
      console.log(error);
    })
  
  }
  
  const [postid, setpostid] = useState(blogdata.postid);
  const [blogContent, setblogContent] = useState(blogdata.blogs);
  
  return (
    <div className="card mb-3">
      <button onClick={EditBlog}><img src={EditIcon} alt='Edit Icon'/>Update</button>
      <button onClick={DeleteBlog}><img src={DeleteIcon} alt='Delete Icon'/>Delete</button><br/>
      <input
        type="text"
        className="text-area"
        value={blogContent}
        onChange={(e) => setblogContent(e.target.value)}
      />
      <p className="card-title">{new Date(blogdata.time).toLocaleString()}</p>
     </div>
  );
};


  return (
    <div>Create Blog
      <input type='text'className='input-field' name='myblog' onChange={(e) => setmyblog(e.target.value)} required/>
      <button onClick={createBlog} >  <img src={SendIcon} alt="Send Icon"/>Post</button>
      <button onClick={ReadyourBlog}> <img src={UserIcon} alt="User Icon" />Read</button>

      <div>
      {Array.isArray(OthersBlogs) ? (
  OthersBlogs.map((data, index) => (
    <RenderothersBlogs key={index} OthersBlogs={data} />
  ))
) : (
  <p>No data available</p>
)}

        </div>


      <div className='myblogs'>
      {Array.isArray(blogdata) ? (
  blogdata.map((data, index) => (
    <RenderBlogdata key={index} blogdata={data} />
  ))
) : (
  <p>No data available</p>
)}

        </div>
    </div>
  )
}

export default UserWindow