import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Navbar from './components/Navbar';


function App() {
  

  return (
    //https://hygraph.com/blog/routing-in-react
    <>
      <h1><u>Kim's Portfolio</u></h1>
      <Navbar/>
      <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contactinfo" element={<Contact />} />
      </Routes>

    </>
  )
}

export default App
