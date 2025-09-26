import  {createSlice } from "@reduxjs/toolkit"
import { getAllPosts } from "../../action/postAction"





const initialState = {
    posts:[],
    isError:false,
    postFetched:false,
    isLoading:false,
    loggedIn:false,
    message:"",
    Comments:[],
    postId:"",
}

const postSlice = createSlice({
    name:"post",
    initialState,
    reducer:{
        reset:()=>initalState,
        resetPostId:(state)=>{
            state.postId = ""
        },
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getAllPosts.pending , (state)=>{
            state.isLoading=true
            state.message = "feacthing all the posts..."
        })
        .addCase(getAllPosts.fulfilled , (state , action)=>{
            state.isLoading = false;
            state.isError = false;
            state.postFetched = true;
            state.posts = action.payload.posts
        })
        .addCase(getAllPosts.rejected , (state , action)=>{
            state.isLoading = false;
            state.isError = true,
            state.message = action.payload
        })
    }
})


export default postSlice.reducer