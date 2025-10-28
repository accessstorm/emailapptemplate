import React, { useState, useRef, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { generateHTML } from '../utils/visualEditorUtils';

// Component Library - 20 premade components
const COMPONENT_LIBRARY = [
  // Text Components
  {
    id: 'heading',
    name: 'Heading',
    type: 'text',
    icon: '📝',
    defaultProps: { text: 'Your Heading', level: 2, align: 'left' },
    component: ({ text, level, align, color = '#333' }) => {
      const Tag = `h${level}`;
      return <Tag style={{ textAlign: align, color, margin: '10px 0' }}>{text}</Tag>;
    }
  },
  {
    id: 'paragraph',
    name: 'Paragraph',
    type: 'text',
    icon: '📄',
    defaultProps: { text: 'Your paragraph text goes here. You can edit this content.', align: 'left' },
    component: ({ text, align, color = '#333' }) => (
      <p style={{ textAlign: align, color, margin: '10px 0', lineHeight: '1.6' }}>{text}</p>
    )
  },
  {
    id: 'quote',
    name: 'Quote',
    type: 'text',
    icon: '💬',
    defaultProps: { text: 'This is an inspiring quote', author: 'Author Name' },
    component: ({ text, author, color = '#666' }) => (
      <blockquote style={{ 
        borderLeft: '4px solid #007cba', 
        padding: '10px 20px', 
        margin: '20px 0', 
        fontStyle: 'italic',
        color,
        backgroundColor: '#f8f9fa'
      }}>
        "{text}"
        <footer style={{ marginTop: '10px', fontSize: '0.9em', color: '#888' }}>— {author}</footer>
      </blockquote>
    )
  },

  // Layout Components
  {
    id: 'container',
    name: 'Container',
    type: 'layout',
    icon: '📦',
    defaultProps: { padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px' },
    component: ({ children, padding, backgroundColor, borderRadius }) => (
      <div style={{ padding, backgroundColor, borderRadius, margin: '10px 0' }}>
        {children}
      </div>
    )
  },
  {
    id: 'row',
    name: 'Row',
    type: 'layout',
    icon: '📐',
    defaultProps: { gap: '20px', direction: 'row' },
    component: ({ children, gap, direction, align = 'flex-start' }) => (
      <div style={{ 
        display: 'flex', 
        gap, 
        flexDirection: direction, 
        alignItems: align,
        margin: '10px 0'
      }}>
        {children}
      </div>
    )
  },
  {
    id: 'column',
    name: 'Column',
    type: 'layout',
    icon: '📋',
    defaultProps: { width: '50%', padding: '10px' },
    component: ({ children, width, padding }) => (
      <div style={{ width, padding, margin: '5px 0' }}>
        {children}
      </div>
    )
  },

  // Button Components
  {
    id: 'button',
    name: 'Button',
    type: 'interactive',
    icon: '🔘',
    defaultProps: { text: 'Click Me', url: '#', style: 'primary' },
    component: ({ text, url, style, backgroundColor, color, padding }) => {
      const styles = {
        primary: { backgroundColor: '#007cba', color: 'white' },
        secondary: { backgroundColor: '#6c757d', color: 'white' },
        outline: { backgroundColor: 'transparent', color: '#007cba', border: '2px solid #007cba' }
      };
      const buttonStyle = {
        ...styles[style] || styles.primary,
        backgroundColor: backgroundColor || styles[style]?.backgroundColor,
        color: color || styles[style]?.color,
        padding: padding || '12px 24px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        textDecoration: 'none',
        display: 'inline-block',
        margin: '10px 0'
      };
      return (
        <a href={url} style={buttonStyle}>
          {text}
        </a>
      );
    }
  },
  {
    id: 'cta-button',
    name: 'Call to Action',
    type: 'interactive',
    icon: '🚀',
    defaultProps: { text: 'Get Started Now', url: '#', backgroundColor: '#28a745' },
    component: ({ text, url, backgroundColor, color = 'white' }) => (
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <a href={url} style={{
          backgroundColor,
          color,
          padding: '15px 30px',
          borderRadius: '25px',
          textDecoration: 'none',
          fontSize: '18px',
          fontWeight: 'bold',
          display: 'inline-block',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          {text}
        </a>
      </div>
    )
  },

  // Media Components
  {
    id: 'image',
    name: 'Image',
    type: 'media',
    icon: '🖼️',
    defaultProps: { src: 'https://via.placeholder.com/400x300', alt: 'Image', width: '100%' },
    component: ({ src, alt, width, height, align = 'center' }) => (
      <div style={{ textAlign: align, margin: '20px 0' }}>
        <img src={src} alt={alt} style={{ width, height, maxWidth: '100%', borderRadius: '8px' }} />
      </div>
    )
  },
  {
    id: 'video',
    name: 'Video',
    type: 'media',
    icon: '🎥',
    defaultProps: { src: '', name: 'video.file' },
    component: ({ src, name }) => {
      const fileNameFromUrl = (() => {
        try {
          const lastSlash = src.lastIndexOf('/');
          const fileName = lastSlash >= 0 ? src.substring(lastSlash + 1) : src;
          return fileName || name || 'video.file';
        } catch {
          return name || 'video.file';
        }
      })();
      const ext = (fileNameFromUrl.split('.').pop() || '').toLowerCase();
      const displayExt = ext ? ext : 'file';
      
      return (
        <div style={{ 
          margin: '20px 0', 
          padding: '16px', 
          border: '1px solid #e5e7eb', 
          borderRadius: '8px', 
          backgroundColor: '#f9fafb',
          maxWidth: '400px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            gap: '12px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '8px', 
                backgroundColor: '#e5e7eb', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 'bold', 
                color: '#374151', 
                fontFamily: 'Arial, Helvetica, sans-serif', 
                textTransform: 'uppercase',
                fontSize: '12px'
              }}>
                {displayExt.substring(0, 3)}
              </div>
              <div>
                <div style={{ 
                  fontWeight: '600', 
                  color: '#111827', 
                  fontFamily: 'Arial, Helvetica, sans-serif', 
                  fontSize: '14px' 
                }}>
                  {fileNameFromUrl}
                </div>
                <div style={{ 
                  color: '#6b7280', 
                  fontSize: '12px', 
                  fontFamily: 'Arial, Helvetica, sans-serif' 
                }}>
                  Video attachment
                </div>
              </div>
            </div>
            <a 
              href={src || '#'} 
              download 
              style={{ 
                backgroundColor: '#111827', 
                color: '#ffffff', 
                textDecoration: 'none', 
                padding: '8px 12px', 
                borderRadius: '6px', 
                fontSize: '13px', 
                fontFamily: 'Arial, Helvetica, sans-serif' 
              }}
            >
              Download
            </a>
          </div>
        </div>
      );
    }
  },

  // List Components
  {
    id: 'bullet-list',
    name: 'Bullet List',
    type: 'content',
    icon: '📝',
    defaultProps: { items: ['First item', 'Second item', 'Third item'] },
    component: ({ items, color = '#333' }) => (
      <ul style={{ color, margin: '10px 0', paddingLeft: '20px' }}>
        {items.map((item, index) => (
          <li key={index} style={{ margin: '5px 0' }}>{item}</li>
        ))}
      </ul>
    )
  },
  {
    id: 'numbered-list',
    name: 'Numbered List',
    type: 'content',
    icon: '🔢',
    defaultProps: { items: ['First step', 'Second step', 'Third step'] },
    component: ({ items, color = '#333' }) => (
      <ol style={{ color, margin: '10px 0', paddingLeft: '20px' }}>
        {items.map((item, index) => (
          <li key={index} style={{ margin: '5px 0' }}>{item}</li>
        ))}
      </ol>
    )
  },

  // Divider Components
  {
    id: 'divider',
    name: 'Divider',
    type: 'layout',
    icon: '➖',
    defaultProps: { style: 'solid', color: '#ddd', thickness: '1px' },
    component: ({ style, color, thickness, margin = '20px 0' }) => (
      <hr style={{ 
        border: 'none', 
        borderTop: `${thickness} ${style} ${color}`, 
        margin 
      }} />
    )
  },
  {
    id: 'spacer',
    name: 'Spacer',
    type: 'layout',
    icon: '⬜',
    defaultProps: { height: '20px' },
    component: ({ height }) => (
      <div style={{ height, width: '100%' }} />
    )
  },

  // Card Components
  {
    id: 'card',
    name: 'Card',
    type: 'layout',
    icon: '🃏',
    defaultProps: { 
      title: 'Card Title', 
      content: 'Card content goes here', 
      backgroundColor: '#ffffff',
      borderColor: '#ddd'
    },
    component: ({ title, content, backgroundColor, borderColor, children }) => (
      <div style={{
        backgroundColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '8px',
        padding: '20px',
        margin: '10px 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {title && <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{title}</h3>}
        {content && <p style={{ margin: '0 0 10px 0', color: '#666' }}>{content}</p>}
        {children}
      </div>
    )
  },

  // Social Components
  {
    id: 'social-links',
    name: 'Social Links',
    type: 'interactive',
    icon: '🔗',
    defaultProps: { 
      links: [
        { platform: 'Facebook', url: '#', icon: '📘' },
        { platform: 'Twitter', url: '#', icon: '🐦' },
        { platform: 'LinkedIn', url: '#', icon: '💼' }
      ]
    },
    component: ({ links, align = 'center' }) => (
      <div style={{ textAlign: align, margin: '20px 0' }}>
        {links.map((link, index) => (
          <a key={index} href={link.url} style={{
            display: 'inline-block',
            margin: '0 10px',
            padding: '10px',
            backgroundColor: '#f8f9fa',
            borderRadius: '50%',
            textDecoration: 'none',
            fontSize: '20px'
          }}>
            {link.icon}
          </a>
        ))}
      </div>
    )
  },

  // Form Components
  {
    id: 'contact-form',
    name: 'Contact Form',
    type: 'interactive',
    icon: '📧',
    defaultProps: { 
      title: 'Contact Us',
      fields: ['Name', 'Email', 'Message'],
      buttonText: 'Send Message'
    },
    component: ({ title, fields, buttonText }) => (
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        {title && <h3 style={{ margin: '0 0 15px 0' }}>{title}</h3>}
        <form>
          {fields.map((field, index) => (
            <div key={index} style={{ margin: '10px 0' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                {field}:
              </label>
              {field === 'Message' ? (
                <textarea 
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px',
                    minHeight: '100px'
                  }}
                  placeholder={`Enter your ${field.toLowerCase()}`}
                />
              ) : (
                <input 
                  type={field === 'Email' ? 'email' : 'text'}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px'
                  }}
                  placeholder={`Enter your ${field.toLowerCase()}`}
                />
              )}
            </div>
          ))}
          <button type="submit" style={{
            backgroundColor: '#007cba',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}>
            {buttonText}
          </button>
        </form>
      </div>
    )
  },

  // Table Component
  {
    id: 'table',
    name: 'Table',
    type: 'content',
    icon: '📊',
    defaultProps: { 
      headers: ['Column 1', 'Column 2', 'Column 3'],
      rows: [
        ['Row 1, Col 1', 'Row 1, Col 2', 'Row 1, Col 3'],
        ['Row 2, Col 1', 'Row 2, Col 2', 'Row 2, Col 3']
      ]
    },
    component: ({ headers, rows, striped = true }) => (
      <div style={{ margin: '20px 0', overflowX: 'auto' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          border: '1px solid #ddd'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              {headers.map((header, index) => (
                <th key={index} style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  border: '1px solid #ddd',
                  fontWeight: 'bold'
                }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} style={{ 
                backgroundColor: striped && rowIndex % 2 === 0 ? '#f8f9fa' : 'white'
              }}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} style={{ 
                    padding: '12px', 
                    border: '1px solid #ddd' 
                  }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  },

  // Progress Bar
  {
    id: 'progress-bar',
    name: 'Progress Bar',
    type: 'content',
    icon: '📈',
    defaultProps: { 
      label: 'Progress',
      percentage: 75,
      color: '#007cba',
      backgroundColor: '#e9ecef'
    },
    component: ({ label, percentage, color, backgroundColor }) => (
      <div style={{ margin: '20px 0' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '5px' 
        }}>
          <span style={{ fontWeight: 'bold' }}>{label}</span>
          <span>{percentage}%</span>
        </div>
        <div style={{
          width: '100%',
          height: '20px',
          backgroundColor,
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color,
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>
    )
  },

  // Alert Box
  {
    id: 'alert',
    name: 'Alert Box',
    type: 'content',
    icon: '⚠️',
    defaultProps: { 
      type: 'info',
      title: 'Information',
      message: 'This is an important message',
      dismissible: true
    },
    component: ({ type, title, message, dismissible }) => {
      const colors = {
        info: { bg: '#d1ecf1', border: '#bee5eb', text: '#0c5460' },
        success: { bg: '#d4edda', border: '#c3e6cb', text: '#155724' },
        warning: { bg: '#fff3cd', border: '#ffeaa7', text: '#856404' },
        danger: { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24' }
      };
      const style = colors[type] || colors.info;
      
      return (
        <div style={{
          backgroundColor: style.bg,
          border: `1px solid ${style.border}`,
          color: style.text,
          padding: '15px',
          borderRadius: '4px',
          margin: '20px 0',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              {title && <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{title}</h4>}
              <p style={{ margin: '0', fontSize: '14px' }}>{message}</p>
            </div>
            {dismissible && (
              <button style={{
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: style.text,
                padding: '0',
                marginLeft: '10px'
              }}>
                ×
              </button>
            )}
          </div>
        </div>
      );
    }
  }
];

// Draggable Component Item
const DraggableComponent = ({ component, onDragStart }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: () => {
      console.log('Drag begin:', component);
      return { id: component.id, component, type: 'component' };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      console.log('Drag end:', item, monitor.getDropResult());
    },
  });

  return (
    <div
      ref={drag}
      className={`p-3 border rounded-lg cursor-move hover:shadow-md transition-all ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      onMouseDown={() => {
        console.log('Mouse down on component:', component);
        onDragStart(component);
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{component.icon}</span>
        <div>
          <div className="font-medium text-gray-800">{component.name}</div>
          <div className="text-sm text-gray-500 capitalize">{component.type}</div>
        </div>
      </div>
    </div>
  );
};

// Draggable Canvas Item
const DraggableCanvasItem = ({ component, onUpdate, onDelete, onClick, isSelected }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'canvas-item',
    item: () => {
      return { id: component.id, type: 'canvas-item' };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'canvas-item',
    drop: (item) => {
      return { index: component.id }; // Return the target index
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const componentDef = COMPONENT_LIBRARY.find(c => c.id === component.type);
  if (!componentDef) return null;

  const Component = componentDef.component;

  return (
    <div
      ref={(node) => {
        drag(node);
        drop(node);
      }}
      onClick={(e) => {
        e.stopPropagation();
        console.log('Canvas item clicked:', component);
        onClick(component);
      }}
      className={`cursor-pointer border-2 rounded-lg p-2 m-1 transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : isOver
          ? 'border-green-400 bg-green-50'
          : 'border-transparent hover:border-gray-300'
      } ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{componentDef.icon}</span>
          <span className="text-sm font-medium text-gray-600">{componentDef.name}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(component.id);
          }}
          className="text-red-500 hover:text-red-700 p-1"
          title="Delete component"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <div className="pointer-events-none">
        <Component {...component.props}>
          {component.children && component.children.map(child => {
            const childDef = COMPONENT_LIBRARY.find(c => c.id === child.type);
            if (!childDef) return null;
            const ChildComponent = childDef.component;
            return <ChildComponent key={child.id} {...child.props} />;
          })}
        </Component>
      </div>
    </div>
  );
};

// Droppable Canvas Area
const CanvasArea = ({ children, onDrop, onReorder }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ['component', 'canvas-item'],
    drop: (item, monitor) => {
      console.log('CanvasArea drop:', item, monitor.getDropResult());
      if (item.type === 'component') {
        console.log('Calling onDrop with component:', item);
        onDrop(item);
      } else if (item.type === 'canvas-item') {
        // Handle reordering
        const dropResult = monitor.getDropResult();
        if (dropResult) {
          onReorder(item.id, dropResult.index);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`min-h-96 max-h-96 p-4 border-2 border-dashed rounded-lg transition-colors overflow-y-auto ${
        isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
      }`}
    >
      {children.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <div className="text-4xl mb-4">🎨</div>
          <p>Drag components here to build your email</p>
        </div>
      ) : (
        <div className="space-y-2">
          {children}
        </div>
      )}
    </div>
  );
};

// Component Properties Panel
const PropertiesPanel = React.memo(({ selectedComponent, onUpdate, onDelete }) => {
  console.log('PropertiesPanel rendering with selectedComponent:', selectedComponent);
  
  if (!selectedComponent) {
    console.log('No selected component, showing placeholder');
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="text-2xl mb-2">⚙️</div>
        <p>Select a component to edit its properties</p>
      </div>
    );
  }

  const component = COMPONENT_LIBRARY.find(c => c.id === selectedComponent.type);
  console.log('Found component definition:', component);
  if (!component) {
    console.log('Component definition not found for type:', selectedComponent.type);
    return null;
  }

  const handlePropertyChange = (property, value) => {
    console.log('Property change:', property, '=', value, 'for component:', selectedComponent.id);
    onUpdate(selectedComponent.id, { [property]: value });
  };

  const [localValues, setLocalValues] = React.useState({});
  
  // File upload refs
  const hiddenImageInputRef = React.useRef(null);
  const hiddenVideoInputRef = React.useRef(null);
  const hiddenPosterInputRef = React.useRef(null);
  
  // Upload media function
  const uploadMedia = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      console.log("Starting upload for file:", file.name, "Size:", file.size, "Type:", file.type);
      
      const response = await fetch("http://localhost:5000/api/media/upload", {
        method: "POST",
        body: formData
      });
      
      console.log("Upload response status:", response.status);
      console.log("Upload response headers:", response.headers);
      
      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response received:", text);
        throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}. Response: ${text.substring(0, 200)}...`);
      }
      
      const data = await response.json();
      console.log("Upload response data:", data);
      
      if (!data.success) {
        throw new Error(data.message || "Upload failed");
      }
      
      console.log("Media uploaded successfully:", data);
      return data.url; // Return the public URL
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };
  
  // Convert Google Drive link to direct image URL
  const convertDriveLink = (driveUrl) => {
    try {
      // Extract file ID from Google Drive URL
      const fileIdMatch = driveUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
      if (fileIdMatch) {
        const fileId = fileIdMatch[1];
        // Convert to direct image URL
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
      }
      return driveUrl; // Return original if not a Google Drive link
    } catch (error) {
      console.error("Error converting Drive link:", error);
      return driveUrl;
    }
  };

  // Render upload controls for Image and Video components
  const renderUploadControls = (type) => {
    if (type === "image") {
      return (
        <div className="mt-3 space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Upload Image</h4>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                onClick={() => hiddenImageInputRef.current?.click()}
              >
                📁 Choose File
              </button>
              <span className="text-xs text-blue-600">or paste URL above</span>
            </div>
            <input
              ref={hiddenImageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                
                try {
                  console.log("Uploading image:", file.name);
                  const url = await uploadMedia(file);
                  handlePropertyChange("src", url);
                  console.log("Image uploaded successfully:", url);
                } catch (err) {
                  console.error("Image upload failed:", err);
                  alert(`Image upload failed: ${err.message}`);
                } finally {
                  e.target.value = "";
                }
              }}
            />
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <h4 className="text-sm font-medium text-green-800 mb-2">Google Drive Link</h4>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Paste Google Drive share link here..."
                className="w-full px-3 py-2 text-sm border border-green-300 rounded focus:ring-2 focus:ring-green-500"
                onBlur={(e) => {
                  const driveUrl = e.target.value.trim();
                  if (driveUrl && driveUrl.includes('drive.google.com')) {
                    const directUrl = convertDriveLink(driveUrl);
                    handlePropertyChange("src", directUrl);
                    console.log("Drive link converted:", directUrl);
                  }
                }}
              />
              <p className="text-xs text-green-600">
                💡 Make sure your Google Drive file is set to "Anyone with the link can view"
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (type === "video") {
      return (
        <div className="mt-3 space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Upload Video</h4>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                onClick={() => hiddenVideoInputRef.current?.click()}
              >
                🎥 Choose Video
              </button>
              <span className="text-xs text-blue-600">or paste URL above</span>
            </div>
            <input
              ref={hiddenVideoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                
                try {
                  console.log("Uploading video:", file.name);
                  const url = await uploadMedia(file);
                  handlePropertyChange("src", url);
                  console.log("Video uploaded successfully:", url);
                } catch (err) {
                  console.error("Video upload failed:", err);
                  alert(`Video upload failed: ${err.message}`);
                } finally {
                  e.target.value = "";
                }
              }}
            />
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <h4 className="text-sm font-medium text-green-800 mb-2">Google Drive Video Link</h4>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Paste Google Drive video share link here..."
                className="w-full px-3 py-2 text-sm border border-green-300 rounded focus:ring-2 focus:ring-green-500"
                onBlur={(e) => {
                  const driveUrl = e.target.value.trim();
                  if (driveUrl && driveUrl.includes('drive.google.com')) {
                    const directUrl = convertDriveLink(driveUrl);
                    handlePropertyChange("src", directUrl);
                    console.log("Drive video link converted:", directUrl);
                  }
                }}
              />
              <p className="text-xs text-green-600">
                💡 Make sure your Google Drive video is set to "Anyone with the link can view"
              </p>
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Upload Poster (Thumbnail)</h4>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition"
                onClick={() => hiddenPosterInputRef.current?.click()}
              >
                🖼️ Choose Poster
              </button>
              <span className="text-xs text-gray-600">or paste URL above</span>
            </div>
            <input
              ref={hiddenPosterInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                
                try {
                  console.log("Uploading poster:", file.name);
                  const url = await uploadMedia(file);
                  handlePropertyChange("poster", url);
                  console.log("Poster uploaded successfully:", url);
                } catch (err) {
                  console.error("Poster upload failed:", err);
                  alert(`Poster upload failed: ${err.message}`);
                } finally {
                  e.target.value = "";
                }
              }}
            />
          </div>
        </div>
      );
    }

    return null;
  };
  
  // Sync local values when selectedComponent changes
  React.useEffect(() => {
    if (selectedComponent) {
      setLocalValues(selectedComponent.props);
    }
  }, [selectedComponent?.id]);

  const renderPropertyInput = (property, value, type = 'text') => {
    const localValue = localValues[property] !== undefined ? localValues[property] : value;
    
    const handleLocalChange = (newValue) => {
      setLocalValues(prev => ({ ...prev, [property]: newValue }));
      handlePropertyChange(property, newValue);
    };
    
    switch (type) {
      case 'text':
        return (
          <input
            type="text"
            value={localValue || ''}
            onChange={(e) => handleLocalChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        );
      case 'textarea':
        return (
          <textarea
            value={localValue || ''}
            onChange={(e) => handleLocalChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-20"
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={localValue || 0}
            onChange={(e) => handleLocalChange(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        );
      case 'color':
        return (
          <input
            type="color"
            value={localValue || '#000000'}
            onChange={(e) => handleLocalChange(e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-lg"
          />
        );
      case 'select':
        return (
          <select
            value={localValue || ''}
            onChange={(e) => handleLocalChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {property === 'level' && [1, 2, 3, 4, 5, 6].map(level => (
              <option key={level} value={level}>H{level}</option>
            ))}
            {property === 'style' && ['primary', 'secondary', 'outline'].map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
            {property === 'align' && ['left', 'center', 'right'].map(align => (
              <option key={align} value={align}>{align}</option>
            ))}
            {property === 'type' && ['info', 'success', 'warning', 'danger'].map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handlePropertyChange(property, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        );
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {component.name} Properties
        </h3>
        <button
          onClick={() => onDelete(selectedComponent.id)}
          className="text-red-500 hover:text-red-700 p-1"
          title="Delete component"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(component.defaultProps).map(([key, defaultValue]) => {
          const currentValue = selectedComponent.props[key];
          console.log(`Rendering property ${key}:`, { defaultValue, currentValue });
          return (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
            {key === 'text' || key === 'content' || key === 'message' ? (
              renderPropertyInput(key, selectedComponent.props[key], 'textarea')
            ) : key === 'level' || key === 'percentage' || key === 'height' || key === 'thickness' ? (
              renderPropertyInput(key, selectedComponent.props[key], 'number')
            ) : key === 'color' || key === 'backgroundColor' || key === 'borderColor' ? (
              renderPropertyInput(key, selectedComponent.props[key], 'color')
            ) : key === 'style' || key === 'align' || key === 'type' || key === 'direction' ? (
              renderPropertyInput(key, selectedComponent.props[key], 'select')
            ) : key === 'items' ? (
              <div>
                <textarea
                  value={Array.isArray(selectedComponent.props[key]) ? selectedComponent.props[key].join('\n') : ''}
                  onChange={(e) => handlePropertyChange(key, e.target.value.split('\n').filter(item => item.trim()))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-20"
                  placeholder="One item per line"
                />
                <p className="text-xs text-gray-500 mt-1">One item per line</p>
              </div>
            ) : key === 'links' ? (
              <div>
                <textarea
                  value={Array.isArray(selectedComponent.props[key]) ? 
                    selectedComponent.props[key].map(link => `${link.platform}|${link.url}|${link.icon}`).join('\n') : ''}
                  onChange={(e) => {
                    const links = e.target.value.split('\n').filter(line => line.trim()).map(line => {
                      const [platform, url, icon] = line.split('|');
                      return { platform: platform || '', url: url || '#', icon: icon || '🔗' };
                    });
                    handlePropertyChange(key, links);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-20"
                  placeholder="Platform|URL|Icon (one per line)"
                />
                <p className="text-xs text-gray-500 mt-1">Format: Platform|URL|Icon (one per line)</p>
              </div>
            ) : key === 'rows' ? (
              <div>
                <textarea
                  value={Array.isArray(selectedComponent.props[key]) ? 
                    selectedComponent.props[key].map(row => Array.isArray(row) ? row.join('|') : row).join('\n') : ''}
                  onChange={(e) => {
                    const rows = e.target.value.split('\n').filter(line => line.trim()).map(line => 
                      line.split('|').map(cell => cell.trim())
                    );
                    handlePropertyChange(key, rows);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-20"
                  placeholder="Row1Col1|Row1Col2|Row1Col3"
                />
                <p className="text-xs text-gray-500 mt-1">Format: Cell1|Cell2|Cell3 (one row per line)</p>
              </div>
            ) : (
              renderPropertyInput(key, selectedComponent.props[key])
            )}
          </div>
          );
        })}
      </div>
      
      {/* Upload controls for Image and Video components */}
      {renderUploadControls(selectedComponent.type)}
    </div>
  );
});

// Main Visual Editor Component
const VisualEditor = ({ initialContent = '', onSave, onClose, isFullscreen = false, onToggleFullscreen, templateName = '', templateSubject = '' }) => {
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showHTML, setShowHTML] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const [name, setName] = useState(templateName);
  const [subject, setSubject] = useState(templateSubject);
  const [isSaving, setIsSaving] = useState(false);

  // Load initial content
  React.useEffect(() => {
    if (initialContent) {
      try {
        const parsed = JSON.parse(initialContent);
        if (Array.isArray(parsed)) {
          setComponents(parsed);
        }
      } catch (error) {
        console.error('Error parsing initial content:', error);
      }
    }
  }, [initialContent]);

  // Update HTML content when components change
  React.useEffect(() => {
    const html = generateHTML(components);
    setHtmlContent(html);
  }, [components]);

  // Debug selected component changes
  React.useEffect(() => {
    console.log('Selected component changed:', selectedComponent);
  }, [selectedComponent]);


  const handleDrop = useCallback((item) => {
    console.log('Drop received:', item);
    
    if (item.type === 'component') {
      const newComponent = {
        id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: item.component.id,
        props: { ...item.component.defaultProps },
        children: []
      };
      
      console.log('Adding new component:', newComponent);
      setComponents(prev => [...prev, newComponent]);
    }
  }, []);

  const handleComponentUpdate = useCallback((componentId, updates) => {
    console.log('Updating component:', componentId, 'with updates:', updates);
    setComponents(prev => {
      const updated = prev.map(comp => 
        comp.id === componentId 
          ? { ...comp, props: { ...comp.props, ...updates } }
          : comp
      );
      console.log('Components after update:', updated);
      return updated;
    });
    
    // Update the selected component to reflect the changes
    setSelectedComponent(prev => {
      if (prev && prev.id === componentId) {
        return { ...prev, props: { ...prev.props, ...updates } };
      }
      return prev;
    });
  }, []);

  const handleComponentDelete = useCallback((componentId) => {
    setComponents(prev => prev.filter(comp => comp.id !== componentId));
    setSelectedComponent(null);
  }, []);

  const handleComponentClick = useCallback((component) => {
    console.log('Component clicked:', component);
    setSelectedComponent(component);
    console.log('Selected component set to:', component);
  }, []);

  const handleReorder = (draggedId, targetId) => {
    setComponents(prev => {
      const draggedIndex = prev.findIndex(comp => comp.id === draggedId);
      const targetIndex = prev.findIndex(comp => comp.id === targetId);
      
      if (draggedIndex === -1 || targetIndex === -1) return prev;
      
      const newComponents = [...prev];
      const [draggedComponent] = newComponents.splice(draggedIndex, 1);
      newComponents.splice(targetIndex, 0, draggedComponent);
      
      return newComponents;
    });
  };

  const handleSave = async () => {
    if (!name.trim() || !subject.trim()) {
      alert('Please enter template name and subject before saving');
      return;
    }

    setIsSaving(true);
    try {
      const content = JSON.stringify(components);
      const html = showHTML ? htmlContent : generateHTML(components);
      
      const newTemplate = {
        id: `user_${Date.now()}`,
        name: name.trim(),
        subject: subject.trim(),
        html: html,
        category: 'Your Templates',
        description: 'Your custom template',
        variables: ['recipientName', 'yourName', 'yourTitle', 'companyName'],
        isUserTemplate: true,
        createdAt: new Date().toISOString()
      };

      // Get existing templates
      const existingTemplates = JSON.parse(localStorage.getItem('userEmailTemplates') || '[]');
      const updatedTemplates = [...existingTemplates, newTemplate];
      
      // Save to localStorage
      localStorage.setItem('userEmailTemplates', JSON.stringify(updatedTemplates));
      
      console.log('Template saved to Your Templates:', newTemplate);
      alert('Template saved to Your Templates!');
      
      // Call the original onSave for any additional handling
      if (onSave) {
        onSave({ content, html, template: newTemplate });
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Error saving template. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleHTMLChange = (newHtml) => {
    setHtmlContent(newHtml);
    // Update the components when HTML is manually edited
    // For now, we'll just update the HTML content
    // In a full implementation, you'd parse HTML back to components
  };

  console.log('VisualEditor rendering with props:', { 
    initialContent, 
    templateName, 
    templateSubject, 
    isFullscreen 
  });
  
  console.log('Current components:', components);
  console.log('Selected component:', selectedComponent);

  return (
    <div className={`bg-white ${isFullscreen ? 'fixed inset-0 z-50' : 'rounded-lg'}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Visual Email Editor</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHTML(!showHTML)}
              className={`px-3 py-1 rounded text-sm ${
                showHTML ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {showHTML ? 'Visual' : 'HTML'}
            </button>
            <button
              onClick={onToggleFullscreen}
              className="p-2 text-gray-600 hover:text-gray-800"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Template Name and Subject */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Template Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter template name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject Line *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email subject"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {components.length} component{components.length !== 1 ? 's' : ''} added
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !name.trim() || !subject.trim()}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isSaving || !name.trim() || !subject.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isSaving ? 'Saving...' : 'Save to Your Templates'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Component Library */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Components</h3>
            <p className="text-sm text-gray-600">Drag components to canvas</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {COMPONENT_LIBRARY.map(component => (
                <DraggableComponent
                  key={component.id}
                  component={component}
                  onDragStart={(component) => {
                    console.log('Drag started:', component);
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {showHTML ? (
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">HTML Editor</h3>
                <p className="text-sm text-gray-600">Edit the HTML directly</p>
              </div>
              <div className="flex-1 p-4">
                <textarea
                  value={showHTML ? htmlContent : generateHTML(components)}
                  onChange={(e) => handleHTMLChange(e.target.value)}
                  className="w-full h-full font-mono text-sm border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500"
                  placeholder="HTML content will appear here..."
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 p-4">
              <CanvasArea onDrop={handleDrop} onReorder={handleReorder}>
                {components.map(component => (
                  <DraggableCanvasItem
                    key={component.id}
                    component={component}
                    onUpdate={handleComponentUpdate}
                    onDelete={handleComponentDelete}
                    onClick={handleComponentClick}
                    isSelected={selectedComponent?.id === component.id}
                  />
                ))}
              </CanvasArea>
            </div>
          )}
        </div>

        {/* Properties Panel */}
        <div className="w-80 border-l border-gray-200">
          <PropertiesPanel
            selectedComponent={selectedComponent}
            onUpdate={handleComponentUpdate}
            onDelete={handleComponentDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default VisualEditor;
