import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Landing from './pages/Landing'
import Courses from './pages/Courses'
import LessonViewer from './pages/LessonViewer'
import GiveLessonMode from './pages/GiveLessonMode'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:courseId" element={<LessonViewer />} />
            <Route path="/lesson/:lessonId/give" element={<GiveLessonMode />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App