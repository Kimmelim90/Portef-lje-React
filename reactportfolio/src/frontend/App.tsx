import { Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import ProjectsSite from './components/pages/ProjectsSite';
import Contact from './components/pages/Contact';
import Navbar from './components/Navbar';


function App() {
  
  

  return (
    //https://hygraph.com/blog/routing-in-react
    <>
      <h1><u>Kim's Portfolio</u></h1>
      <Navbar/>
      <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<ProjectsSite />} />
            <Route path="/contactinfo" element={<Contact />} />
      </Routes>

    </>
  )
}

export default App
