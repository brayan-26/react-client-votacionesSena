import React from 'react'
import {useLocation} from "react-router-dom"

function VotoPage() {
    const {state} = useLocation()
    const token = state.token
    console.log(token)
  return (
    <div>VotoPage</div>
  )
}

export default VotoPage