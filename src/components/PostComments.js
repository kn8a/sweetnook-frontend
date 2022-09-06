
import React, { useEffect, useState } from 'react'
import {MediaLeft, Button,  MediaContent, Field, Control, TextArea, Image, CardContent} from 'bloomer'
import { Card, Media, Box } from 'react-bulma-components'


import axios from 'axios'
import Comment from './Comment'
import { toast } from 'react-toastify'


function PostComments (props) {
    const userId = localStorage.getItem('palstalkUserId')
    const token = props.token
    const postId = props.postId
    const profilePic = localStorage.getItem('palstalkUserPic')
    const profileName = localStorage.getItem('palstalkUserName')
    //console.log(profilePic)
    const [comments, setComments] = useState([])
    const commentsURL = `http://localhost:3000/api/posts/${postId}/comments`
    const [newComment, setNewComment] = useState('')
    const updatePost = props.updatePost
    
    useEffect(()=>{
        axios.get(commentsURL, {headers: {"Authorization": `Bearer ${token}`}})
        .then((response)=>{
            setComments(response.data)
        })
    },[])

    const onChange = (e) => {
        setNewComment(e.target.value)
    }

    const submitNewComment = () => {
        const commentToSubmit = {
            comment: newComment,
            author: userId,
            postId: postId
        }
        axios.post(commentsURL, commentToSubmit, {headers: {"Authorization": `Bearer ${token}`}})
        .then(() => {
            axios.get(commentsURL, {headers: {"Authorization": `Bearer ${token}`}})
            .then((response)=>{
                setComments(response.data)
                toast.success('Comment posted')
                setNewComment('')
                updatePost()
            })
            .catch((err) => {
                toast.error("Comment posted but didn't update. Please refresh the page.")
            })
        })
        .catch((err) => {
            toast.error("Comment didn't post. Please retry.")
        })
    }

  return (
    <div> 
        <Box>
            
                <Card>
                    <CardContent>
                    <Media>
                        <MediaLeft>
                            <Image isSize='64x64' src={`http://localhost:3000/api/file/${profilePic}`} />
                        </MediaLeft>
                        <MediaContent>  
                            <Field>
                                <Control>
                                    <TextArea onChange={(e) => onChange(e)} value={newComment} rows='2' placeholder={'Enter your comment'} />  
                                </Control>
                            </Field>
                            <Field isGrouped='right'>
                                <Control>
                                    <small>{`Posting as ${profileName} `}</small>
                                </Control>
                                
                                <Control>
                                    <Button onClick={submitNewComment} isSize='small' isColor='info'>Comment</Button>
                                </Control>
                            </Field>   
                        </MediaContent>
                    </Media>
                    </CardContent>
                </Card> 
        {comments.map((comment)=>{
            return(
                <Comment key={comment._id} comment={comment} token={token} postId={postId} userId={userId}/>
            ) 
        })}
        </Box>
    </div>
  )
}

export default PostComments