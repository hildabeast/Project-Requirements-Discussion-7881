import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import supabase from '../lib/supabase'
import SafeIcon from '../common/SafeIcon'
import LoadingSpinner from '../components/LoadingSpinner'
import RichTextRenderer from '../components/RichTextRenderer'
import ResourceCard from '../components/ResourceCard'
import * as FiIcons from 'react-icons/fi'

const { 
  FiChevronDown, FiChevronRight, FiPlay, FiEye, FiEyeOff, 
  FiFile, FiArrowLeft, FiClock, FiTarget, FiHome 
} = FiIcons

const LessonViewer = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [units, setUnits] = useState([])
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [activities, setActivities] = useState([])
  const [homework, setHomework] = useState([])
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedUnits, setExpandedUnits] = useState({})

  useEffect(() => {
    fetchCourseData()
  }, [courseId])

  const fetchCourseData = async () => {
    try {
      setLoading(true)
      
      // Fetch course
      const { data: courseData, error: courseError } = await supabase
        .from('courses_cb_2024')
        .select('*')
        .eq('id', courseId)
        .single()

      if (courseError) throw courseError
      setCourse(courseData)

      // Fetch units with lessons
      const { data: unitsData, error: unitsError } = await supabase
        .from('units_cb_2024')
        .select(`
          *,
          lessons:lessons_cb_2024(*)
        `)
        .eq('course_id', courseId)
        .order('order_index')

      if (unitsError) throw unitsError
      setUnits(unitsData || [])

      // Auto-expand first unit and select first lesson
      if (unitsData && unitsData.length > 0) {
        const firstUnit = unitsData[0]
        setExpandedUnits({ [firstUnit.id]: true })
        
        if (firstUnit.lessons && firstUnit.lessons.length > 0) {
          const firstLesson = firstUnit.lessons[0]
          setSelectedLesson(firstLesson)
          await fetchLessonContent(firstLesson.id)
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchLessonContent = async (lessonId) => {
    try {
      // Fetch activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities_cb_2024')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('order_index')

      if (activitiesError) throw activitiesError
      setActivities(activitiesData || [])

      // Fetch homework
      const { data: homeworkData, error: homeworkError } = await supabase
        .from('homework_cb_2024')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('order_index')

      if (homeworkError) throw homeworkError
      setHomework(homeworkData || [])

      // Fetch resources for all activities and homework
      const activityIds = activitiesData?.map(a => a.id) || []
      const homeworkIds = homeworkData?.map(h => h.id) || []
      
      if (activityIds.length > 0 || homeworkIds.length > 0) {
        let resourcesQuery = supabase
          .from('resources_cb_2024')
          .select('*')
          .order('order_index')

        // Build OR condition for activity_id or homework_id
        if (activityIds.length > 0 && homeworkIds.length > 0) {
          resourcesQuery = resourcesQuery.or(`activity_id.in.(${activityIds.join(',')}),homework_id.in.(${homeworkIds.join(',')})`)
        } else if (activityIds.length > 0) {
          resourcesQuery = resourcesQuery.in('activity_id', activityIds)
        } else if (homeworkIds.length > 0) {
          resourcesQuery = resourcesQuery.in('homework_id', homeworkIds)
        }

        const { data: resourcesData, error: resourcesError } = await resourcesQuery

        if (resourcesError) throw resourcesError
        setResources(resourcesData || [])
      } else {
        setResources([])
      }
    } catch (err) {
      console.error('Error fetching lesson content:', err)
    }
  }

  const toggleUnit = (unitId) => {
    setExpandedUnits(prev => ({
      ...prev,
      [unitId]: !prev[unitId]
    }))
  }

  const selectLesson = async (lesson) => {
    setSelectedLesson(lesson)
    await fetchLessonContent(lesson.id)
  }

  const getResourcesForActivity = (activityId) => {
    return resources.filter(r => r.activity_id === activityId)
  }

  const getResourcesForHomework = (homeworkId) => {
    return resources.filter(r => r.homework_id === homeworkId)
  }

  const startGiveLessonMode = () => {
    if (selectedLesson) {
      navigate(`/lesson/${selectedLesson.id}/give`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading lesson content...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/courses')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={() => navigate('/courses')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-2" />
            Back to Courses
          </button>
          <h2 className="text-lg font-semibold text-gray-900">{course?.title}</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {units.map((unit) => (
            <div key={unit.id} className="border-b border-gray-100">
              <button
                onClick={() => toggleUnit(unit.id)}
                className="w-full p-4 text-left hover:bg-gray-50 flex items-center justify-between transition-colors"
              >
                <span className="font-medium text-gray-900">{unit.title}</span>
                <SafeIcon 
                  icon={expandedUnits[unit.id] ? FiChevronDown : FiChevronRight} 
                  className="w-4 h-4 text-gray-500" 
                />
              </button>
              
              <AnimatePresence>
                {expandedUnits[unit.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {unit.lessons?.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => selectLesson(lesson)}
                        className={`w-full p-3 pl-8 text-left text-sm hover:bg-gray-50 transition-colors ${
                          selectedLesson?.id === lesson.id 
                            ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                            : 'text-gray-700'
                        }`}
                      >
                        {lesson.title}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {selectedLesson ? (
          <div className="max-w-6xl mx-auto p-8">
            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">{selectedLesson.title}</h1>
                <button
                  onClick={startGiveLessonMode}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <SafeIcon icon={FiPlay} className="w-5 h-5" />
                  <span>Give Lesson</span>
                </button>
              </div>

              {/* Lesson Metadata */}
              <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {selectedLesson.objectives && (
                    <div>
                      <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                        <SafeIcon icon={FiTarget} className="w-5 h-5 mr-2 text-blue-600" />
                        Objectives
                      </h3>
                      <div className="text-gray-600">
                        <RichTextRenderer content={selectedLesson.objectives} />
                      </div>
                    </div>
                  )}
                  {selectedLesson.duration && (
                    <div>
                      <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                        <SafeIcon icon={FiClock} className="w-5 h-5 mr-2 text-blue-600" />
                        Duration
                      </h3>
                      <div className="text-gray-600">{selectedLesson.duration}</div>
                    </div>
                  )}
                </div>
                {selectedLesson.description && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <div className="text-gray-600">
                      <RichTextRenderer content={selectedLesson.description} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Activities */}
            <div className="space-y-8">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Activity {index + 1}: {activity.title}
                      </h3>
                      {activity.duration && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <SafeIcon icon={FiClock} className="w-4 h-4 mr-1" />
                          <span>{activity.duration}</span>
                        </div>
                      )}
                    </div>

                    {/* Instructions Side by Side */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      {/* Teacher Instructions */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Teacher Instructions</h4>
                        <div className="bg-blue-50 rounded-lg p-4 text-gray-700">
                          <RichTextRenderer content={activity.teacher_content || 'No teacher instructions provided.'} />
                        </div>
                      </div>

                      {/* Student Instructions */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          Student Instructions
                          {!activity.show_to_students && (
                            <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center">
                              <SafeIcon icon={FiEyeOff} className="w-3 h-3 mr-1" />
                              Hidden
                            </span>
                          )}
                        </h4>
                        <div className={`rounded-lg p-4 text-gray-700 ${
                          !activity.show_to_students 
                            ? 'bg-gray-100 text-gray-500' 
                            : 'bg-green-50'
                        }`}>
                          <RichTextRenderer 
                            content={activity.student_content || 'No student instructions provided.'} 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Resources */}
                    {getResourcesForActivity(activity.id).length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Resources</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          {getResourcesForActivity(activity.id).map((resource) => (
                            <ResourceCard 
                              key={resource.id}
                              resource={resource}
                              variant="default"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Homework Section */}
              {homework.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: activities.length * 0.1 }}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border-l-4 border-purple-500"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <SafeIcon icon={FiHome} className="w-6 h-6 mr-2 text-purple-600" />
                      Homework
                    </h3>

                    {homework.map((hw, index) => (
                      <div key={hw.id} className="mb-6 last:mb-0">
                        {homework.length > 1 && (
                          <h4 className="text-lg font-medium text-gray-900 mb-4">
                            Homework Assignment {index + 1}
                          </h4>
                        )}

                        {/* Homework Instructions Side by Side */}
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                          {/* Teacher Content */}
                          <div>
                            <h5 className="font-medium text-gray-900 mb-3">Teacher Content</h5>
                            <div className="bg-purple-50 rounded-lg p-4 text-gray-700">
                              <RichTextRenderer content={hw.teacher_content || 'No teacher content provided.'} />
                            </div>
                          </div>

                          {/* Student Content */}
                          <div>
                            <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                              Student Content
                              {!hw.show_to_students && (
                                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center">
                                  <SafeIcon icon={FiEyeOff} className="w-3 h-3 mr-1" />
                                  Hidden
                                </span>
                              )}
                            </h5>
                            <div className={`rounded-lg p-4 text-gray-700 ${
                              !hw.show_to_students 
                                ? 'bg-gray-100 text-gray-500' 
                                : 'bg-green-50'
                            }`}>
                              <RichTextRenderer 
                                content={hw.student_content || 'No student content provided.'} 
                              />
                            </div>
                          </div>
                        </div>

                        {/* Homework Resources */}
                        {getResourcesForHomework(hw.id).length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-3">Homework Resources</h5>
                            <div className="grid md:grid-cols-2 gap-4">
                              {getResourcesForHomework(hw.id).map((resource) => (
                                <ResourceCard 
                                  key={resource.id}
                                  resource={resource}
                                  variant="homework"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <SafeIcon icon={FiFile} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Lesson</h3>
              <p className="text-gray-600">Choose a lesson from the sidebar to view its content.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LessonViewer