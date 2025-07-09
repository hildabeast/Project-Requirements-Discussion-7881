import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SafeIcon from '../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import Modal from './Modal'

const { FiMenu, FiX, FiBook, FiPlay, FiHelpCircle } = FiIcons

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [modalContent, setModalContent] = useState(null)

  const openModal = (title, content) => {
    setModalContent({ title, content })
  }

  const closeModal = () => {
    setModalContent(null)
  }

  const footerLinks = [
    { title: 'About this app', content: 'Coming soon' },
    { title: 'Privacy Policy', content: 'Coming soon' },
    { title: 'Terms of Use', content: 'Coming soon' },
    { title: 'Contact', content: 'Coming soon' }
  ]

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiBook} className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ReadySetGoTeach</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link 
                to="/courses" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Courses
              </Link>
              <button 
                onClick={() => openModal('Help', 'Coming soon')}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
              >
                <SafeIcon icon={FiHelpCircle} className="w-4 h-4" />
                <span>Help</span>
              </button>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            >
              <SafeIcon icon={isMenuOpen ? FiX : FiMenu} className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="space-y-1">
                <Link 
                  to="/courses" 
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Courses
                </Link>
                <button 
                  onClick={() => {
                    openModal('Help', 'Coming soon')
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md text-base font-medium transition-colors"
                >
                  Help
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                <SafeIcon icon={FiBook} className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-600">ReadySetGoTeach</span>
            </div>
            <div className="flex flex-wrap justify-center space-x-6">
              {footerLinks.map((link) => (
                <button
                  key={link.title}
                  onClick={() => openModal(link.title, link.content)}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {link.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {modalContent && (
        <Modal
          title={modalContent.title}
          isOpen={true}
          onClose={closeModal}
        >
          <p className="text-gray-600">{modalContent.content}</p>
        </Modal>
      )}
    </>
  )
}

export default Header