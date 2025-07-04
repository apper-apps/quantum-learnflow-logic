import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Home from '@/components/pages/Home'
import Courses from '@/components/pages/Courses'
import CourseDetail from '@/components/pages/CourseDetail'
import Learn from '@/components/pages/Learn'
import Dashboard from '@/components/pages/Dashboard'
import Teach from '@/components/pages/Teach'
import Cart from '@/components/pages/Cart'
import Checkout from '@/components/pages/Checkout'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="courses" element={<Courses />} />
          <Route path="course/:id" element={<CourseDetail />} />
          <Route path="learn/:courseId" element={<Learn />} />
          <Route path="learn/:courseId/lesson/:lessonId" element={<Learn />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="teach" element={<Teach />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 9999 }}
      />
    </>
  )
}

export default App