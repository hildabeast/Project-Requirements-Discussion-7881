import React from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiFile, FiFileText, FiImage, FiVideo, FiLink, FiDownload, 
  FiEye, FiEyeOff, FiExternalLink
} = FiIcons;

// Helper function to determine file type
const getFileType = (resource) => {
  if (!resource.file_url) return 'unknown';
  
  const url = resource.file_url.toLowerCase();
  
  // Image types
  if (url.match(/\.(jpeg|jpg|gif|png|svg|webp)$/)) return 'image';
  
  // PDF
  if (url.match(/\.pdf$/)) return 'pdf';
  
  // Video files
  if (url.match(/\.(mp4|webm|ogg|mov)$/)) return 'video';
  
  // YouTube links
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  
  // Google Docs
  if (url.includes('docs.google.com')) return 'google-doc';
  
  // Document files
  if (url.match(/\.(doc|docx|txt|rtf|odt)$/)) return 'document';
  
  // Spreadsheet files
  if (url.match(/\.(xls|xlsx|csv|ods)$/)) return 'spreadsheet';
  
  // Presentation files
  if (url.match(/\.(ppt|pptx|odp)$/)) return 'presentation';
  
  // Default
  return 'other';
};

// Helper to get appropriate icon for file type
const getIconForFileType = (fileType) => {
  switch (fileType) {
    case 'image': return FiImage;
    case 'pdf': return FiFileText;
    case 'video':
    case 'youtube': return FiVideo;
    case 'document': return FiFileText;
    case 'spreadsheet': 
    case 'presentation': return FiFile;
    case 'google-doc': return FiLink;
    default: return FiFile;
  }
};

const ResourceCard = ({ 
  resource, 
  variant = 'default', 
  showVisibility = true,
  onClick
}) => {
  if (!resource) return null;
  
  const fileType = getFileType(resource);
  const FileIcon = getIconForFileType(fileType);
  
  const handleOpenResource = (e) => {
    e.preventDefault();
    if (resource.file_url) {
      window.open(resource.file_url, '_blank', 'noopener,noreferrer');
    }
    if (onClick) onClick(resource);
  };
  
  // Determine background color based on variant
  const bgColor = variant === 'homework' ? 'bg-purple-50' : 'bg-gray-50';
  const iconColor = variant === 'homework' ? 'text-purple-500' : 'text-gray-500';
  
  return (
    <div className={`${bgColor} rounded-lg p-4 flex items-center space-x-3 group hover:shadow-md transition-shadow`}>
      <SafeIcon icon={FileIcon} className={`w-5 h-5 ${iconColor}`} />
      
      <div className="flex-1 min-w-0">
        <a 
          href={resource.file_url || '#'} 
          target="_blank" 
          rel="noopener noreferrer" 
          onClick={handleOpenResource}
          className="font-medium text-gray-900 hover:text-blue-600 transition-colors block truncate"
        >
          {resource.title}
        </a>
        <div className="text-sm text-gray-600 truncate">{resource.file_name || 'Resource file'}</div>
      </div>
      
      {showVisibility && (
        <div className="flex items-center space-x-2">
          {resource.visible_to_students ? (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center whitespace-nowrap">
              <SafeIcon icon={FiEye} className="w-3 h-3 mr-1" />
              Visible
            </span>
          ) : (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center whitespace-nowrap">
              <SafeIcon icon={FiEyeOff} className="w-3 h-3 mr-1" />
              Hidden
            </span>
          )}
        </div>
      )}
      
      <a
        href={resource.file_url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleOpenResource}
        className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors hidden group-hover:block"
        title="Open in new tab"
      >
        <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
      </a>
    </div>
  );
};

export default ResourceCard;