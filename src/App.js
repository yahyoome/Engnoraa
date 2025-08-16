import IrregularVerbs from './components/irregularverbs'
import { Routes, Route } from 'react-router-dom'
import Home from './components/home'
import RandomGame from './components/randomgame'
import NotFound from './components/404'
import Tenses from './components/tenses'


const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/irregular-verbs' element={<IrregularVerbs />} />
        <Route path='/random-game' element={<RandomGame />} />
        <Route path='/tenses' element={<Tenses />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App