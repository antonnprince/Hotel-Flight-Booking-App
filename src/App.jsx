import {Routes,BrowserRouter as Router, Route} from "react-router-dom"
import Login from "./Login"
import Register from "./Register"
import { AuthProvider } from "./AuthContext"
import Profile from "./Profile"


function App() 
{
  return(
    <Router>
      <AuthProvider>
        <Routes>
          <Route index element={<Login/>} path="/"/>
          <Route element={<Login/>} path="/login"/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/profile" element={<Profile/>}/>
        </Routes>
      </AuthProvider>
  </Router>
  )
  
}

export default App
