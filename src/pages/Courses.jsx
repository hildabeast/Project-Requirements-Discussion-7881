import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import supabase from '../lib/supabase'
import SafeIcon from '../common/SafeIcon'
import LoadingSpinner from '../components/LoadingSpinner'
import * as FiIcons from 'react-icons/fi'

const { FiBook, FiArrowRight, FiAlertCircle } = FiIcons

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('courses_cb_2024')
        .select('*')
        .order('title')

      if (error) throw error
      setCourses(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <SafeIcon icon={FiAlertCircle} className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Courses</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchCourses}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <SafeIcon icon={FiBook} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Courses Available</h2>
          <p className="text-gray-600">There are no courses available at the moment. Please check back later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Course Library</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Explore our collection of professionally designed courses. Each course contains 
            structured units and interactive lessons ready for your classroom.
          </p>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                to={`/course/${course.id}`}
                className="block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group transform hover:-translate-y-1"
              >
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <SafeIcon icon={FiBook} className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                    </div>
                  </div>
                  
                  {course.description && (
                    <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                      {course.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Click to explore
                    </span>
                    <SafeIcon 
                      icon={FiArrowRight} 
                      className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" 
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Courses