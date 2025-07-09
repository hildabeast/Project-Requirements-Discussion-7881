import React from 'react';
import DOMPurify from 'dompurify';

// Configure DOMPurify to allow certain tags and attributes for embedded content
const configuredDOMPurify = () => {
  DOMPurify.addHook('afterSanitizeAttributes', function(node) {
    // Allow certain iframes (YouTube, Google Docs, etc.)
    if (node.tagName === 'IFRAME') {
      // Set iframe sandbox attribute for security
      node.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-forms');
      // Force all iframes to use HTTPS
      const src = node.getAttribute('src');
      if (src && src.startsWith('http:')) {
        node.setAttribute('src', src.replace('http:', 'https:'));
      }
    }
  });
  
  return DOMPurify;
};

const RichTextRenderer = ({ content, className = '' }) => {
  if (!content) return null;
  
  const purify = configuredDOMPurify();
  
  // Sanitize HTML content
  const sanitizedContent = purify.sanitize(content, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allowfullscreen', 'frameborder', 'sandbox', 'src'],
    FORBID_TAGS: ['style', 'script'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick']
  });
  
  return (
    <div 
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default RichTextRenderer;