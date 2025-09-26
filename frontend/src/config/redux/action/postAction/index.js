import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "../../..";



export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async ( _,thunkAPI )=>{
        try {
            const respone = await clientServer.get('/posts');
            return thunkAPI.fulfillWithValue(respone.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const createPost = createAsyncThunk(
    "post/createPost",
    async (userData , thunkAPI) =>{
        const {file , body} = userData;
        try {
            const formData = new FormData();
            formData.append('token' , localStorage.getItem('token'));
            formData.append('body' , body);
            formData.append('media' , file);

            const response =await clientServer.post('/post' , formData )
            if (response.status === 200) {
                return thunkAPI.fulfillWithValue("Post Uploaded");
            }else{
                return thunkAPI.rejectWithValue("post not upload");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.respone.data);
        }
    }
)