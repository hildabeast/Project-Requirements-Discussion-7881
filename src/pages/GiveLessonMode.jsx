import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import supabase from '../lib/supabase'
import SafeIcon from '../common/SafeIcon'
import LoadingSpinner from '../components/LoadingSpinner'
import RichTextRenderer from '../components/RichTextRenderer'
import ResourceCard from '../components/ResourceCard'
import EmbeddedResource from '../components/EmbeddedResource'
import * as FiIcons from 'react-icons/fi'

const { FiArrowLeft, FiArrowRight, FiX, FiFile, FiEye, FiEyeOff, FiMonitor, FiCheck, FiClock } = FiIcons

const GiveLessonMode = () => {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState(null)
  const [activities, setActivities] = useState([])
  const [resources, setResources] = useState([])
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [studentWindow, setStudentWindow] = useState(null)

  useEffect(() => {
    fetchLessonData()
    return () => {
      if (studentWindow) {
        studentWindow.close()
      }
    }
  }, [lessonId])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPreviousActivity()
      } else if (e.key === 'ArrowRight') {
        goToNextActivity()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentActivityIndex, activities])

  useEffect(() => {
    updateStudentWindow()
  }, [currentActivityIndex, activities, resources])

  const fetchLessonData = async () => {
    try {
      setLoading(true)
      
      // Fetch lesson
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons_cb_2024')
        .select('*')
        .eq('id', lessonId)
        .single()

      if (lessonError) throw lessonError
      setLesson(lessonData)

      // Fetch activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities_cb_2024')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('order_index')

      if (activitiesError) throw activitiesError
      setActivities(activitiesData || [])

      // Fetch resources
      const activityIds = activitiesData?.map(a => a.id) || []
      if (activityIds.length > 0) {
        const { data: resourcesData, error: resourcesError } = await supabase
          .from('resources_cb_2024')
          .select('*')
          .in('activity_id', activityIds)
          .order('order_index')

        if (resourcesError) throw resourcesError
        setResources(resourcesData || [])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const openStudentWindow = () => {
    const newWindow = window.open('', 'StudentWindow', 'width=800,height=600')
    setStudentWindow(newWindow)
    updateStudentWindow(newWindow)
  }

  const getYouTubeVideoId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[7].length === 11) ? match[7] : null
  }

  const updateStudentWindow = (window = studentWindow) => {
    if (!window || window.closed) return

    const currentActivity = activities[currentActivityIndex]
    if (!currentActivity) return

    const studentResources = resources.filter(r => 
      r.activity_id === currentActivity.id && r.visible_to_students
    )

    const generateResourceContent = (resource) => {
      const url = resource.file_url?.toLowerCase() || ''
      let resourceContent = ''
      
      // Images
      if (url.match(/\.(jpeg|jpg|gif|png|svg|webp)$/)) {
        resourceContent = `
          <div class="resource-content">
            <img src="${resource.file_url}" alt="${resource.title}" class="resource-image">
          </div>
        `
      }
      // PDFs
      else if (url.match(/\.pdf$/)) {
        resourceContent = `
          <div class="resource-content">
            <iframe src="${resource.file_url}#toolbar=0&navpanes=0" class="resource-embed" title="${resource.title}"></iframe>
          </div>
        `
      }
      // Videos
      else if (url.match(/\.(mp4|webm|ogg|mov)$/)) {
        resourceContent = `
          <div class="resource-content">
            <video src="${resource.file_url}" controls class="resource-video">
              Your browser does not support the video tag.
            </video>
          </div>
        `
      }
      // YouTube
      else if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = getYouTubeVideoId(resource.file_url)
        
        if (videoId) {
          resourceContent = `
            <div class="resource-content">
              <div class="youtube-container">
                <iframe 
                  src="https://www.youtube-nocookie.com/embed/${videoId}" 
                  class="youtube-embed"
                  title="${resource.title}"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
            </div>
          `
        } else {
          resourceContent = `
            <div class="resource-fallback">
              <p>YouTube video could not be embedded</p>
              <a href="${resource.file_url}" class="resource-open-button" target="_blank">Watch on YouTube</a>
            </div>
          `
        }
      }
      // Google Docs
      else if (url.includes('docs.google.com')) {
        let embedUrl = resource.file_url
        if (embedUrl.includes('/edit')) {
          embedUrl = embedUrl.replace('/edit', '/preview')
        }
        
        resourceContent = `
          <div class="resource-content">
            <iframe src="${embedUrl}" class="resource-embed" title="${resource.title}"></iframe>
          </div>
        `
      }
      // Fallback for other file types
      else {
        resourceContent = `
          <div class="resource-fallback">
            <p>${resource.file_name || 'Resource file'}</p>
            <a href="${resource.file_url}" class="resource-open-button" target="_blank">Open Resource</a>
          </div>
        `
      }
      
      return `
        <div class="resource">
          <div class="resource-header">
            <a href="${resource.file_url}" class="resource-title" target="_blank">
              ${resource.title}
            </a>
          </div>
          ${resourceContent}
        </div>
      `
    }

    const studentContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student View - ${lesson?.title}</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              margin: 0; 
              padding: 24px; 
              background: #f9fafb; 
              line-height: 1.5;
            }
            .container { max-width: 800px; margin: 0 auto; }
            .header { 
              background: white; 
              padding: 24px; 
              border-radius: 12px; 
              box-shadow: 0 1px 3px rgba(0,0,0,0.1); 
              margin-bottom: 24px; 
            }
            .activity-title { 
              font-size: 24px; 
              font-weight: 600; 
              color: #1f2937; 
              margin-bottom: 16px; 
            }
            .instructions { 
              background: #dcfce7; 
              padding: 16px; 
              border-radius: 8px; 
              margin-bottom: 24px; 
            }
            .instructions h3 { 
              margin: 0 0 8px 0; 
              font-size: 16px; 
              font-weight: 600; 
              color: #166534; 
            }
            .instructions-content { 
              margin: 0; 
              color: #15803d;
            }
            .instructions-content p { 
              margin: 0 0 12px 0; 
            }
            .instructions-content p:last-child { 
              margin-bottom: 0; 
            }
            .resources { 
              display: flex; 
              flex-direction: column; 
              gap: 16px;
            }
            .resource { 
              background: white; 
              padding: 16px; 
              border-radius: 8px; 
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .resource-header { 
              margin-bottom: 12px; 
              display: flex; 
              align-items: center; 
              justify-content: space-between;
            }
            .resource-title { 
              font-size: 16px; 
              font-weight: 600; 
              color: #1f2937; 
              text-decoration: none; 
              margin: 0;
            }
            .resource-title:hover { 
              color: #2563eb; 
            }
            .resource-content { 
              width: 100%; 
            }
            .resource-image { 
              max-width: 100%; 
              max-height: 400px; 
              display: block; 
              margin: 0 auto; 
              border-radius: 4px;
            }
            .resource-embed { 
              width: 100%; 
              height: 400px; 
              border: none; 
              border-radius: 4px;
            }
            .resource-video { 
              width: 100%; 
              max-height: 400px; 
              border-radius: 4px;
            }
            .resource-fallback { 
              background: #f3f4f6; 
              padding: 16px; 
              border-radius: 4px; 
              text-align: center;
            }
            .resource-open-button { 
              display: inline-block; 
              background: #2563eb; 
              color: white; 
              padding: 8px 12px; 
              border-radius: 6px; 
              text-decoration: none; 
              font-size: 14px; 
              margin-top: 8px;
            }
            .resource-open-button:hover { 
              background: #1d4ed8; 
            }
            .hidden-message { 
              text-align: center; 
              color: #6b7280; 
              font-style: italic; 
              padding: 40px; 
            }
            .youtube-container {
              position: relative;
              width: 100%;
              padding-bottom: 56.25%; /* 16:9 aspect ratio */
            }
            .youtube-embed {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              border: none;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="activity-title">Activity ${currentActivityIndex + 1}: ${currentActivity.title}</h1>
              ${currentActivity.show_to_students && currentActivity.student_content ? `
                <div class="instructions">
                  <h3>Instructions</h3>
                  <div class="instructions-content">${currentActivity.student_content}</div>
                </div>
              ` : '<div class="hidden-message">No student instructions for this activity</div>'}
            </div>
            
            ${studentResources.length > 0 ? `
              <div class="resources">
                ${studentResources.map(generateResourceContent).join('')}
              </div>
            ` : '<div class="hidden-message">No resources available for students</div>'}
          </div>
        </body>
      </html>
    `

    window.document.open()
    window.document.write(studentContent)
    window.document.close()
  }

  const goToNextActivity = () => {
    if (currentActivityIndex < activities.length - 1) {
      setCurrentActivityIndex(currentActivityIndex + 1)
    }
  }

  const goToPreviousActivity = () => {
    if (currentActivityIndex > 0) {
      setCurrentActivityIndex(currentActivityIndex - 1)
    }
  }

  const exitLessonMode = () => {
    if (studentWindow) {
      studentWindow.close()
    }
    navigate(`/courses`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading lesson...</p>
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

  const currentActivity = activities[currentActivityIndex]
  const currentResources = resources.filter(r => r.activity_id === currentActivity?.id)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Give Lesson</h2>
            <button
              onClick={exitLessonMode}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <SafeIcon icon={FiX} className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">{lesson?.title}</p>
          
          <button
            onClick={openStudentWindow}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiMonitor} className="w-4 h-4" />
            <span>Open Student Window</span>
          </button>
        </div>

        {/* Activity List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Activities</h3>
            <div className="space-y-2">
              {activities.map((activity, index) => (
                <button
                  key={activity.id}
                  onClick={() => setCurrentActivityIndex(index)}
                  className={`w-full p-3 text-left rounded-lg transition-colors ${
                    index === currentActivityIndex
                      ? 'bg-blue-50 text-blue-600 border-2 border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {index === currentActivityIndex && (
                      <SafeIcon icon={FiCheck} className="w-4 h-4 text-blue-600" />
                    )}
                    <span className="text-sm font-medium">
                      Activity {index + 1}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1 truncate">
                    {activity.title}
                  </div>
                  {activity.duration && (
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <SafeIcon icon={FiClock} className="w-3 h-3 mr-1" />
                      <span>{activity.duration}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <button
              onClick={goToPreviousActivity}
              disabled={currentActivityIndex === 0}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={goToNextActivity}
              disabled={currentActivityIndex === activities.length - 1}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <span>Next</span>
              <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {currentActivity ? (
          <div className="max-w-4xl mx-auto p-8">
            <motion.div
              key={currentActivityIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Activity {currentActivityIndex + 1}: {currentActivity.title}
                  </h1>
                  {currentActivity.duration && (
                    <div className="flex items-center text-gray-600">
                      <SafeIcon icon={FiClock} className="w-5 h-5 mr-1" />
                      <span>{currentActivity.duration}</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600">
                  Activity {currentActivityIndex + 1} of {activities.length}
                </p>
              </div>

              {/* Instructions Side by Side */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Teacher Instructions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Teacher Instructions</h3>
                  <div className="bg-blue-50 rounded-lg p-4 text-gray-700">
                    <RichTextRenderer 
                      content={currentActivity.teacher_content || 'No teacher instructions provided.'} 
                    />
                  </div>
                </div>

                {/* Student Instructions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    Student Instructions
                    {!currentActivity.show_to_students && (
                      <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center">
                        <SafeIcon icon={FiEyeOff} className="w-3 h-3 mr-1" />
                        Hidden
                      </span>
                    )}
                  </h3>
                  <div className={`rounded-lg p-4 text-gray-700 ${
                    !currentActivity.show_to_students 
                      ? 'bg-gray-100 text-gray-500' 
                      : 'bg-green-50'
                  }`}>
                    <RichTextRenderer 
                      content={currentActivity.student_content || 'No student instructions provided.'} 
                    />
                  </div>
                </div>
              </div>

              {/* Resources */}
              {currentResources.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {currentResources.map((resource) => (
                      <ResourceCard 
                        key={resource.id}
                        resource={resource}
                        variant="default"
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <SafeIcon icon={FiFile} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Activities</h3>
              <p className="text-gray-600">This lesson doesn't have any activities yet.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GiveLessonMode