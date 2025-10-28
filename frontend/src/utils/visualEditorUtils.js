// Utility functions for Visual Editor template processing

export const generateHTML = (comps) => {
  if (comps.length === 0) return '';
  
  // Generate email-compatible HTML with inline styles
  // This wraps content in a proper email HTML structure
  
  const renderComponent = (comp) => {
    const { type, props } = comp;
    
    switch (type) {
      case 'heading':
        const level = props.level || 2;
        return `<h${level} style="text-align: ${props.align || 'left'}; color: ${props.color || '#333'}; margin: 10px 0;">${props.text || ''}</h${level}>`;
      
      case 'paragraph':
        return `<p style="text-align: ${props.align || 'left'}; color: ${props.color || '#333'}; margin: 10px 0; line-height: 1.6;">${props.text || ''}</p>`;
      
      case 'quote':
        return `<blockquote style="border-left: 4px solid #007cba; padding: 10px 20px; margin: 20px 0; font-style: italic; color: ${props.color || '#666'}; background-color: #f8f9fa;">
          "${props.text || ''}"
          <footer style="margin-top: 10px; font-size: 0.9em; color: #888;">— ${props.author || ''}</footer>
        </blockquote>`;
      
      case 'container':
        const children = comp.children ? comp.children.map(child => renderComponent(child)).join('') : '';
        return `<div style="padding: ${props.padding || '20px'}; background-color: ${props.backgroundColor || '#ffffff'}; border-radius: ${props.borderRadius || '8px'}; margin: 10px 0;">
          ${children}
        </div>`;
      
      case 'row':
        const rowChildren = comp.children ? comp.children.map(child => renderComponent(child)).join('') : '';
        return `<div style="display: flex; gap: ${props.gap || '20px'}; flex-direction: ${props.direction || 'row'}; align-items: ${props.align || 'flex-start'}; margin: 10px 0;">
          ${rowChildren}
        </div>`;
      
      case 'column':
        const columnChildren = comp.children ? comp.children.map(child => renderComponent(child)).join('') : '';
        return `<div style="width: ${props.width || '50%'}; padding: ${props.padding || '10px'}; margin: 5px 0;">
          ${columnChildren}
        </div>`;
      
      case 'button':
        const buttonStyle = props.style === 'primary' ? 'background-color: #007cba; color: white;' :
                          props.style === 'secondary' ? 'background-color: #6c757d; color: white;' :
                          'background-color: transparent; color: #007cba; border: 2px solid #007cba;';
        return `<a href="${props.url || '#'}" style="${buttonStyle} padding: ${props.padding || '12px 24px'}; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; text-decoration: none; display: inline-block; margin: 10px 0;">
          ${props.text || 'Click Me'}
        </a>`;
      
      case 'cta-button':
        return `<div style="text-align: center; margin: 20px 0;">
          <a href="${props.url || '#'}" style="background-color: ${props.backgroundColor || '#28a745'}; color: ${props.color || 'white'}; padding: 15px 30px; border-radius: 25px; text-decoration: none; font-size: 18px; font-weight: bold; display: inline-block; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            ${props.text || 'Get Started Now'}
          </a>
        </div>`;
      
      case 'image':
        // Use publicly accessible image URLs for email compatibility
        const imageSrc = props.src || 'https://via.placeholder.com/400x300';
        return `<div style="text-align: ${props.align || 'center'}; margin: 20px 0;">
          <img src="${imageSrc}" alt="${props.alt || 'Image'}" style="width: ${props.width || '100%'}; height: ${props.height || 'auto'}; max-width: 600px; border-radius: 8px; display: block; margin: 0 auto;" />
        </div>`;
      
      case 'video':
        // Render as file block with icon, filename, and download button (no player)
        const fileUrl = props.src || '#';
        const fileNameFromUrl = (() => {
          try {
            const lastSlash = fileUrl.lastIndexOf('/')
            const name = lastSlash >= 0 ? fileUrl.substring(lastSlash + 1) : fileUrl;
            return name || props.name || 'video.file';
          } catch {
            return props.name || 'video.file';
          }
        })();
        const ext = (fileNameFromUrl.split('.').pop() || '').toLowerCase();
        const displayExt = ext ? ext : 'file';
        return `<div style="margin: 20px 0; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #f9fafb;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 36px; height: 36px; border-radius: 8px; background-color: #e5e7eb; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #374151; font-family: Arial, Helvetica, sans-serif; text-transform: uppercase;">${displayExt.substring(0,3)}</div>
              <div>
                <div style="font-weight: 600; color: #111827; font-family: Arial, Helvetica, sans-serif; font-size: 14px;">${fileNameFromUrl}</div>
                <div style="color: #6b7280; font-size: 12px; font-family: Arial, Helvetica, sans-serif;">Video attachment</div>
              </div>
            </div>
            <a href="${fileUrl}" download style="background-color: #111827; color: #ffffff; text-decoration: none; padding: 8px 12px; border-radius: 6px; font-size: 13px; font-family: Arial, Helvetica, sans-serif;">Download</a>
          </div>
        </div>`;
      
      case 'bullet-list':
        const bulletItems = Array.isArray(props.items) ? props.items.map(item => `<li style="margin: 5px 0;">${item}</li>`).join('') : '';
        return `<ul style="color: ${props.color || '#333'}; margin: 10px 0; padding-left: 20px;">
          ${bulletItems}
        </ul>`;
      
      case 'numbered-list':
        const numberedItems = Array.isArray(props.items) ? props.items.map(item => `<li style="margin: 5px 0;">${item}</li>`).join('') : '';
        return `<ol style="color: ${props.color || '#333'}; margin: 10px 0; padding-left: 20px;">
          ${numberedItems}
        </ol>`;
      
      case 'divider':
        return `<hr style="border: none; border-top: ${props.thickness || '1px'} ${props.style || 'solid'} ${props.color || '#ddd'}; margin: ${props.margin || '20px 0'};" />`;
      
      case 'spacer':
        return `<div style="height: ${props.height || '20px'}; width: 100%;"></div>`;
      
      case 'card':
        const cardChildren = comp.children ? comp.children.map(child => renderComponent(child)).join('') : '';
        return `<div style="background-color: ${props.backgroundColor || '#ffffff'}; border: 1px solid ${props.borderColor || '#ddd'}; border-radius: 8px; padding: 20px; margin: 10px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          ${props.title ? `<h3 style="margin: 0 0 10px 0; color: #333;">${props.title}</h3>` : ''}
          ${props.content ? `<p style="margin: 0 0 10px 0; color: #666;">${props.content}</p>` : ''}
          ${cardChildren}
        </div>`;
      
      case 'social-links':
        const socialItems = Array.isArray(props.links) ? props.links.map(link => 
          `<a href="${link.url || '#'}" style="display: inline-block; margin: 0 10px; padding: 10px; background-color: #f8f9fa; border-radius: 50%; text-decoration: none; font-size: 20px;">${link.icon || '🔗'}</a>`
        ).join('') : '';
        return `<div style="text-align: ${props.align || 'center'}; margin: 20px 0;">
          ${socialItems}
        </div>`;
      
      case 'contact-form':
        // Generate a unique form ID for tracking submissions
        const formId = comp.id || `form_${Date.now()}`;
        const backendUrl = 'http://localhost:5000'; // Backend URL
        
        const formFields = Array.isArray(props.fields) ? props.fields.map((field, index) => {
          const fieldName = field.toLowerCase().replace(/\s+/g, '_');
          if (field === 'Message') {
            return `<div style="margin: 10px 0;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">${field}:</label>
              <textarea name="${fieldName}" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; min-height: 100px; font-family: Arial, sans-serif; font-size: 14px;" placeholder="Enter your ${field.toLowerCase()}"></textarea>
            </div>`;
          } else {
            return `<div style="margin: 10px 0;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">${field}:</label>
              <input type="${field === 'Email' ? 'email' : 'text'}" name="${fieldName}" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-family: Arial, sans-serif; font-size: 14px;" placeholder="Enter your ${field.toLowerCase()}" />
            </div>`;
          }
        }).join('') : '';
        
        return `<div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          ${props.title ? `<h3 style="margin: 0 0 15px 0; color: #333;">${props.title}</h3>` : ''}
          <form action="${backendUrl}/api/form-submission" method="POST" style="margin: 0;">
            <input type="hidden" name="formId" value="${formId}" />
            ${formFields}
            <button type="submit" style="background-color: #007cba; color: white; padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; margin-top: 10px; font-family: Arial, sans-serif;">${props.buttonText || 'Send Message'}</button>
          </form>
          <p style="margin-top: 15px; font-size: 12px; color: #666; text-align: center;">Your response will be sent securely.</p>
        </div>`;
      
      case 'table':
        const tableHeaders = Array.isArray(props.headers) ? props.headers.map(header => 
          `<th style="padding: 12px; text-align: left; border: 1px solid #ddd; font-weight: bold;">${header}</th>`
        ).join('') : '';
        const tableRows = Array.isArray(props.rows) ? props.rows.map((row, rowIndex) => {
          const cells = Array.isArray(row) ? row.map(cell => 
            `<td style="padding: 12px; border: 1px solid #ddd;">${cell}</td>`
          ).join('') : '';
          const rowStyle = props.striped && rowIndex % 2 === 0 ? 'background-color: #f8f9fa;' : '';
          return `<tr style="${rowStyle}">${cells}</tr>`;
        }).join('') : '';
        return `<div style="margin: 20px 0; overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                ${tableHeaders}
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>`;
      
      case 'progress-bar':
        return `<div style="margin: 20px 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-weight: bold;">${props.label || 'Progress'}</span>
            <span>${props.percentage || 0}%</span>
          </div>
          <div style="width: 100%; height: 20px; background-color: ${props.backgroundColor || '#e9ecef'}; border-radius: 10px; overflow: hidden;">
            <div style="width: ${props.percentage || 0}%; height: 100%; background-color: ${props.color || '#007cba'}; transition: width 0.3s ease;"></div>
          </div>
        </div>`;
      
      case 'alert':
        const alertColors = {
          info: { bg: '#d1ecf1', border: '#bee5eb', text: '#0c5460' },
          success: { bg: '#d4edda', border: '#c3e6cb', text: '#155724' },
          warning: { bg: '#fff3cd', border: '#ffeaa7', text: '#856404' },
          danger: { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24' }
        };
        const alertStyle = alertColors[props.type] || alertColors.info;
        return `<div style="background-color: ${alertStyle.bg}; border: 1px solid ${alertStyle.border}; color: ${alertStyle.text}; padding: 15px; border-radius: 4px; margin: 20px 0; position: relative;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              ${props.title ? `<h4 style="margin: 0 0 5px 0; font-size: 16px;">${props.title}</h4>` : ''}
              <p style="margin: 0; font-size: 14px;">${props.message || ''}</p>
            </div>
            ${props.dismissible ? `<button style="background: none; border: none; font-size: 18px; cursor: pointer; color: ${alertStyle.text}; padding: 0; margin-left: 10px;">×</button>` : ''}
          </div>
        </div>`;
      
      default:
        return `<div style="margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
          <p>Unknown component: ${type}</p>
        </div>`;
    }
  };

  // Wrap all components in a proper email HTML structure
  const bodyContent = comps.map(comp => renderComponent(comp)).join('');
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
  <style>
    body { margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 30px;">
              ${bodyContent}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

// Function to regenerate HTML from Visual Editor template data
export const regenerateTemplateHTML = (template) => {
  if (!template || !template.content) {
    console.warn('No template content found, using saved HTML');
    return template?.html || '';
  }
  
  try {
    const components = JSON.parse(template.content);
    console.log('Regenerating HTML from components:', components);
    const regeneratedHTML = generateHTML(components);
    console.log('Regenerated HTML:', regeneratedHTML);
    return regeneratedHTML;
  } catch (error) {
    console.error('Error regenerating HTML from template:', error);
    console.log('Falling back to saved HTML:', template.html);
    return template.html || '';
  }
};
