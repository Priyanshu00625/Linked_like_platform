import React, { useEffect } from 'react'
import Userlayout from '../layout/userlayout'
import Dashboardlayout from '../layout/dashboardlayout'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers } from '../../config/redux/action/authAction'

export default function Discoverpage() {
  const authState = useSelector((state)=>state.auth)

  const dispatch = useDispatch();
  useEffect(()=>{
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers())
    }
  } , [])
  return (
    <Userlayout>
        <Dashboardlayout>
            <div>
                <h1>Discover</h1>
            </div>
        </Dashboardlayout>
    </Userlayout>
  )
}
