import IrregularVerbs from './components/irregularverbs'
import { Routes, Route } from 'react-router-dom'
import Home from './components/home'


const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/irregular-verbs' element={<IrregularVerbs />} />
      </Routes>
    </div>
  )
}

export default App