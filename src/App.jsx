import './App.css'
import Dashboard from './Pages/Dashboard'
import Login from './Pages/Login'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
    </Router>
  )
}

export default App
