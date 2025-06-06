import IrregularVerbs from './components/irregularverbs'
import { Routes, Route } from 'react-router-dom'
import Home from './components/home'
import RandomGame from './components/randomgame'


const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/irregular-verbs' element={<IrregularVerbs />} />
        <Route path='/random-game' element={<RandomGame />} />
      </Routes>
    </div>
  )
}

export default App