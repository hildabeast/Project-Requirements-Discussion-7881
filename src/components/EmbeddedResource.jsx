import React, { useState, useEffect } from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFile, FiFileText, FiImage, FiVideo, FiLink, FiDownload, FiExternalLink } = FiIcons;

// Helper function to determine file type
const getFileType = (url) => {
  if (!url) return 'unknown';
  
  const lowerUrl = url.toLowerCase();
  
  // Image types
  if (lowerUrl.match(/\.(jpeg|jpg|gif|png|svg|webp)$/)) return 'image';
  
  // PDF
  if (lowerUrl.match(/\.pdf$/)) return 'pdf';
  
  // Video files
  if (lowerUrl.match(/\.(mp4|webm|ogg|mov)$/)) return 'video';
  
  // YouTube links
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return 'youtube';
  
  // Google Docs
  if (lowerUrl.includes('docs.google.com')) return 'google-doc';
  
  // Default
  return 'other';
};

// Extract YouTube video ID
const getYoutubeVideoId = (url) => {
  if (!url) return null;
  
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[7].length === 11) ? match[7] : null;
};

// Helper to transform Google Docs URL to embedded viewer URL
const getGoogleDocsEmbedUrl = (url) => {
  if (!url || !url.includes('docs.google.com')) return null;
  
  // Replace /edit with /preview for Google Docs
  if (url.includes('/edit')) {
    return url.replace('/edit', '/preview');
  }
  
  return url;
};

// Helper to get appropriate icon for file type
const getIconForFileType = (fileType) => {
  switch (fileType) {
    case 'image': return FiImage;
    case 'pdf': return FiFileText;
    case 'video':
    case 'youtube': return FiVideo;
    case 'google-doc': return FiLink;
    default: return FiFile;
  }
};

const EmbeddedResource = ({ resource }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const fileType = getFileType(resource.file_url);
  const FileIcon = getIconForFileType(fileType);
  
  // Reset error state if resource changes
  useEffect(() => {
    setError(false);
    setLoading(true);
  }, [resource.file_url]);
  
  const handleOpenResource = () => {
    if (resource.file_url) {
      window.open(resource.file_url, '_blank', 'noopener,noreferrer');
    }
  };
  
  const handleLoadSuccess = () => {
    setLoading(false);
  };
  
  const handleError = () => {
    setError(true);
    setLoading(false);
  };
  
  // Fallback view for errors or unsupported types
  if (error || fileType === 'other' || fileType === 'unknown') {
    return (
      <div className="resource-embed bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900 flex items-center">
            <SafeIcon icon={FileIcon} className="w-4 h-4 mr-2 text-gray-500" />
            {resource.title}
          </h4>
          <button
            onClick={handleOpenResource}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg flex items-center hover:bg-blue-700 transition-colors"
          >
            <SafeIcon icon={FiExternalLink} className="w-3 h-3 mr-1" />
            Open
          </button>
        </div>
        <div className="text-sm text-gray-600 mb-2">{resource.file_name || 'Resource file'}</div>
      </div>
    );
  }
  
  // Render based on file type
  let embedContent;
  
  switch (fileType) {
    case 'image':
      embedContent = (
        <div className="resource-image-container">
          {loading && (
            <div className="flex items-center justify-center h-48 bg-gray-100 animate-pulse">
              <SafeIcon icon={FiImage} className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <img
            src={resource.file_url}
            alt={resource.title}
            className={`max-w-full h-auto max-h-96 rounded-lg mx-auto ${loading ? 'hidden' : 'block'}`}
            onLoad={handleLoadSuccess}
            onError={handleError}
          />
        </div>
      );
      break;
      
    case 'pdf':
      embedContent = (
        <div className="resource-pdf-container">
          <iframe
            src={`${resource.file_url}#toolbar=0&navpanes=0`}
            className="w-full h-96 rounded-lg border-0"
            title={resource.title}
            onLoad={handleLoadSuccess}
            onError={handleError}
          />
        </div>
      );
      break;
      
    case 'video':
      embedContent = (
        <div className="resource-video-container">
          <video
            src={resource.file_url}
            controls
            className="w-full max-h-96 rounded-lg"
            onLoadedData={handleLoadSuccess}
            onError={handleError}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
      break;
      
    case 'youtube':
      const videoId = getYoutubeVideoId(resource.file_url);
      if (!videoId) {
        return (
          <div className="resource-embed bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{resource.title}</h4>
              <button
                onClick={handleOpenResource}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg flex items-center hover:bg-blue-700 transition-colors"
              >
                <SafeIcon icon={FiExternalLink} className="w-3 h-3 mr-1" />
                Watch on YouTube
              </button>
            </div>
            <div className="text-sm text-gray-600">Invalid YouTube URL</div>
          </div>
        );
      }
      
      embedContent = (
        <div className="resource-youtube-container">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            className="w-full aspect-video rounded-lg border-0"
            title={resource.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleLoadSuccess}
            onError={handleError}
          />
        </div>
      );
      break;
      
    case 'google-doc':
      const embedUrl = getGoogleDocsEmbedUrl(resource.file_url);
      if (!embedUrl) {
        return (
          <div className="resource-embed bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{resource.title}</h4>
              <button
                onClick={handleOpenResource}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg flex items-center hover:bg-blue-700 transition-colors"
              >
                <SafeIcon icon={FiExternalLink} className="w-3 h-3 mr-1" />
                Open in Google Docs
              </button>
            </div>
            <div className="text-sm text-gray-600">Google Document</div>
          </div>
        );
      }
      
      embedContent = (
        <div className="resource-google-doc-container">
          <iframe
            src={embedUrl}
            className="w-full h-96 rounded-lg border-0"
            title={resource.title}
            onLoad={handleLoadSuccess}
            onError={handleError}
          />
        </div>
      );
      break;
      
    default:
      embedContent = (
        <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg">
          <div className="text-center">
            <SafeIcon icon={FileIcon} className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <button
              onClick={handleOpenResource}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg flex items-center mx-auto hover:bg-blue-700 transition-colors"
            >
              <SafeIcon icon={FiExternalLink} className="w-3 h-3 mr-1" />
              Open File
            </button>
          </div>
        </div>
      );
  }
  
  return (
    <div className="resource-embed bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900 truncate flex-1">
          <a 
            href={resource.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors flex items-center"
            title={resource.title}
          >
            <SafeIcon icon={FileIcon} className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
            <span className="truncate">{resource.title}</span>
          </a>
        </h4>
        <button
          onClick={handleOpenResource}
          className="ml-2 p-1 text-gray-500 hover:text-blue-600 rounded transition-colors flex-shrink-0"
          title="Open in new tab"
        >
          <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
        </button>
      </div>
      {embedContent}
    </div>
  );
};

export default EmbeddedResource;