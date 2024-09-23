import { Routes, Route } from 'react-router-dom';
import './assets/style/App.css';
import SignIn from './views/SignIn'
import SignUp from './views/SignUp'
import Todo from './views/Todo'
import NotFound from './views/NotFound'

function App() {
  return (
    <>
      {/* ... existing layout or components ... */}
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
