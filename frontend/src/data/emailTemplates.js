export const emailTemplates = [
  {
    id: 'client-proposal',
    name: 'Client Proposal',
    category: 'Business',
    description: 'Professional proposal template for client projects',
    subject: 'Project Proposal: {{projectName}}',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Project Proposal</h2>
        
        <p>Dear {{clientName}},</p>
        
        <p>Thank you for considering our agency for your {{projectName}} project. We are excited about the opportunity to work with you and help bring your vision to life.</p>
        
        <h3 style="color: #34495e; margin-top: 25px;">Project Overview</h3>
        <p>{{projectDescription}}</p>
        
        <h3 style="color: #34495e; margin-top: 25px;">Our Approach</h3>
        <ul>
          <li>Initial consultation and strategy development</li>
          <li>Creative concept development and presentation</li>
          <li>Implementation and execution</li>
          <li>Ongoing support and optimization</li>
        </ul>
        
        <h3 style="color: #34495e; margin-top: 25px;">Investment</h3>
        <p>Total Project Cost: <strong>{{projectCost}}</strong></p>
        <p>Timeline: {{projectTimeline}}</p>
        
        <p>We look forward to discussing this proposal with you and answering any questions you may have.</p>
        
        <p>Best regards,<br>
        {{yourName}}<br>
        {{yourTitle}}<br>
        {{companyName}}</p>
      </div>
    `,
    variables: ['clientName', 'projectName', 'projectDescription', 'projectCost', 'projectTimeline', 'yourName', 'yourTitle', 'companyName']
  },
  {
    id: 'project-kickoff',
    name: 'Project Kickoff',
    category: 'Project Management',
    description: 'Welcome email for new project initiation',
    subject: 'Welcome! Let\'s Start {{projectName}} Together',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #27ae60; text-align: center;">🎉 Project Kickoff - {{projectName}}</h2>
        
        <p>Hi {{clientName}},</p>
        
        <p>Welcome aboard! We're thrilled to officially kick off your {{projectName}} project. This is going to be an exciting journey, and we're here to make it as smooth and successful as possible.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">What's Next?</h3>
          <ul>
            <li><strong>Week 1:</strong> Discovery and planning phase</li>
            <li><strong>Week 2:</strong> Initial concepts and wireframes</li>
            <li><strong>Week 3:</strong> Design development and feedback</li>
            <li><strong>Week 4:</strong> Final delivery and launch</li>
          </ul>
        </div>
        
        <h3 style="color: #34495e;">Your Project Team</h3>
        <p><strong>Project Manager:</strong> {{projectManager}}<br>
        <strong>Lead Designer:</strong> {{leadDesigner}}<br>
        <strong>Developer:</strong> {{developer}}</p>
        
        <h3 style="color: #34495e;">Communication</h3>
        <p>We'll be using {{communicationTool}} for regular updates and feedback. You can reach us at {{contactEmail}} or schedule a call anytime.</p>
        
        <p>Let's make something amazing together!</p>
        
        <p>Best regards,<br>
        {{yourName}}<br>
        {{companyName}}</p>
      </div>
    `,
    variables: ['clientName', 'projectName', 'projectManager', 'leadDesigner', 'developer', 'communicationTool', 'contactEmail', 'yourName', 'companyName']
  },
  {
    id: 'invoice-reminder',
    name: 'Invoice Reminder',
    category: 'Finance',
    description: 'Professional invoice reminder template',
    subject: 'Invoice Reminder - {{invoiceNumber}}',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #e74c3c; border-bottom: 2px solid #e74c3c; padding-bottom: 10px;">Invoice Reminder</h2>
        
        <p>Dear {{clientName}},</p>
        
        <p>This is a friendly reminder that invoice <strong>#{{invoiceNumber}}</strong> for {{serviceDescription}} is now {{daysOverdue}} days past due.</p>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #856404; margin-top: 0;">Invoice Details</h3>
          <p><strong>Invoice Number:</strong> {{invoiceNumber}}<br>
          <strong>Amount Due:</strong> {{amountDue}}<br>
          <strong>Due Date:</strong> {{dueDate}}<br>
          <strong>Service Period:</strong> {{servicePeriod}}</p>
        </div>
        
        <p>To maintain our excellent working relationship, we kindly ask that you process this payment at your earliest convenience.</p>
        
        <h3 style="color: #34495e;">Payment Options</h3>
        <ul>
          <li>Bank Transfer: {{bankDetails}}</li>
          <li>Online Payment: {{paymentLink}}</li>
          <li>Check: {{mailingAddress}}</li>
        </ul>
        
        <p>If you have any questions about this invoice or need to discuss payment arrangements, please don't hesitate to contact us.</p>
        
        <p>Thank you for your prompt attention to this matter.</p>
        
        <p>Best regards,<br>
        {{yourName}}<br>
        {{companyName}}<br>
        {{contactPhone}}</p>
      </div>
    `,
    variables: ['clientName', 'invoiceNumber', 'serviceDescription', 'daysOverdue', 'amountDue', 'dueDate', 'servicePeriod', 'bankDetails', 'paymentLink', 'mailingAddress', 'yourName', 'companyName', 'contactPhone']
  },
  {
    id: 'project-update',
    name: 'Project Update',
    category: 'Project Management',
    description: 'Regular project status update template',
    subject: 'Project Update: {{projectName}} - Week {{weekNumber}}',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #3498db; text-align: center;">📊 Project Update - {{projectName}}</h2>
        
        <p>Hi {{clientName}},</p>
        
        <p>Here's your weekly update for {{projectName}}. We're making great progress and wanted to keep you in the loop!</p>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #27ae60; margin-top: 0;">✅ Completed This Week</h3>
          <ul>
            <li>{{completedTask1}}</li>
            <li>{{completedTask2}}</li>
            <li>{{completedTask3}}</li>
          </ul>
        </div>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #f39c12; margin-top: 0;">🔄 In Progress</h3>
          <ul>
            <li>{{inProgressTask1}}</li>
            <li>{{inProgressTask2}}</li>
          </ul>
        </div>
        
        <div style="background: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #721c24; margin-top: 0;">⚠️ Blockers & Challenges</h3>
          <p>{{blockers}}</p>
        </div>
        
        <h3 style="color: #34495e;">Next Week's Focus</h3>
        <ul>
          <li>{{nextWeekTask1}}</li>
          <li>{{nextWeekTask2}}</li>
        </ul>
        
        <p>As always, feel free to reach out if you have any questions or concerns.</p>
        
        <p>Best regards,<br>
        {{yourName}}<br>
        {{companyName}}</p>
      </div>
    `,
    variables: ['clientName', 'projectName', 'weekNumber', 'completedTask1', 'completedTask2', 'completedTask3', 'inProgressTask1', 'inProgressTask2', 'blockers', 'nextWeekTask1', 'nextWeekTask2', 'yourName', 'companyName']
  },
  {
    id: 'contract-renewal',
    name: 'Contract Renewal',
    category: 'Business',
    description: 'Contract renewal and extension template',
    subject: 'Contract Renewal - {{serviceName}}',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #8e44ad; border-bottom: 2px solid #8e44ad; padding-bottom: 10px;">Contract Renewal Opportunity</h2>
        
        <p>Dear {{clientName}},</p>
        
        <p>We hope this email finds you well! As we approach the end of our current contract period for {{serviceName}}, we wanted to reach out to discuss renewal options.</p>
        
        <p>It has been a pleasure working with you over the past {{contractDuration}}, and we're proud of the results we've achieved together:</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">Key Achievements</h3>
          <ul>
            <li>{{achievement1}}</li>
            <li>{{achievement2}}</li>
            <li>{{achievement3}}</li>
          </ul>
        </div>
        
        <h3 style="color: #34495e;">Renewal Options</h3>
        <div style="display: flex; gap: 20px; margin: 20px 0;">
          <div style="flex: 1; background: #e8f5e8; padding: 15px; border-radius: 5px;">
            <h4 style="color: #27ae60; margin-top: 0;">6-Month Extension</h4>
            <p><strong>Rate:</strong> {{rate6Month}}<br>
            <strong>Benefits:</strong> Continued support, priority access</p>
          </div>
          <div style="flex: 1; background: #fff3cd; padding: 15px; border-radius: 5px;">
            <h4 style="color: #f39c12; margin-top: 0;">12-Month Extension</h4>
            <p><strong>Rate:</strong> {{rate12Month}}<br>
            <strong>Benefits:</strong> 15% discount, additional services</p>
          </div>
        </div>
        
        <p>We'd love to schedule a brief call to discuss your needs and how we can continue supporting your success.</p>
        
        <p>Thank you for your continued trust in our services.</p>
        
        <p>Best regards,<br>
        {{yourName}}<br>
        {{companyName}}<br>
        {{contactEmail}}</p>
      </div>
    `,
    variables: ['clientName', 'serviceName', 'contractDuration', 'achievement1', 'achievement2', 'achievement3', 'rate6Month', 'rate12Month', 'yourName', 'companyName', 'contactEmail']
  },
  {
    id: 'feedback-request',
    name: 'Feedback Request',
    category: 'Customer Service',
    description: 'Professional feedback and testimonial request',
    subject: 'How was your experience with {{serviceName}}?',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #e67e22; text-align: center;">🌟 We Value Your Feedback</h2>
        
        <p>Dear {{clientName}},</p>
        
        <p>We hope you're thrilled with the results of your {{serviceName}} project! As we wrap up this phase of our collaboration, we'd love to hear about your experience working with us.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3 style="color: #2c3e50; margin-top: 0;">Quick Feedback</h3>
          <p>How would you rate your overall experience?</p>
          <div style="font-size: 24px; margin: 10px 0;">
            ⭐⭐⭐⭐⭐
          </div>
          <p><em>Click on a star to rate us!</em></p>
        </div>
        
        <h3 style="color: #34495e;">We'd Love to Know:</h3>
        <ul>
          <li>What did you like most about working with us?</li>
          <li>How did we meet your expectations?</li>
          <li>What could we improve for future projects?</li>
          <li>Would you recommend us to others?</li>
        </ul>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #27ae60; margin-top: 0;">Share Your Success Story</h3>
          <p>If you're happy with our work, we'd be incredibly grateful if you could share a brief testimonial. Your words help us grow and help other businesses find the right partner.</p>
          <p><strong>Testimonial Link:</strong> <a href="{{testimonialLink}}" style="color: #3498db;">Share Your Experience</a></p>
        </div>
        
        <p>Thank you for choosing us for your {{serviceName}} needs. We look forward to working with you again soon!</p>
        
        <p>Best regards,<br>
        {{yourName}}<br>
        {{companyName}}</p>
      </div>
    `,
    variables: ['clientName', 'serviceName', 'testimonialLink', 'yourName', 'companyName']
  },
  {
    id: 'meeting-invitation',
    name: 'Meeting Invitation',
    category: 'Scheduling',
    description: 'Professional meeting invitation template',
    subject: 'Meeting Invitation: {{meetingTopic}} - {{meetingDate}}',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2c3e50; text-align: center;">📅 Meeting Invitation</h2>
        
        <p>Dear {{clientName}},</p>
        
        <p>I hope this email finds you well. I'd like to schedule a meeting to discuss {{meetingTopic}} and how we can best support your {{projectName}} goals.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">Meeting Details</h3>
          <p><strong>Topic:</strong> {{meetingTopic}}<br>
          <strong>Date:</strong> {{meetingDate}}<br>
          <strong>Time:</strong> {{meetingTime}}<br>
          <strong>Duration:</strong> {{meetingDuration}}<br>
          <strong>Location:</strong> {{meetingLocation}}</p>
        </div>
        
        <h3 style="color: #34495e;">Agenda</h3>
        <ol>
          <li>{{agendaItem1}}</li>
          <li>{{agendaItem2}}</li>
          <li>{{agendaItem3}}</li>
          <li>Q&A and Next Steps</li>
        </ol>
        
        <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h4 style="color: #27ae60; margin-top: 0;">Preparation</h4>
          <p>Please come prepared with any questions or materials related to {{meetingTopic}}. If you need to reschedule, please let me know at least 24 hours in advance.</p>
        </div>
        
        <p>I'm looking forward to our discussion and the opportunity to help you achieve your goals.</p>
        
        <p>Best regards,<br>
        {{yourName}}<br>
        {{companyName}}<br>
        {{contactPhone}}</p>
      </div>
    `,
    variables: ['clientName', 'meetingTopic', 'projectName', 'meetingDate', 'meetingTime', 'meetingDuration', 'meetingLocation', 'agendaItem1', 'agendaItem2', 'agendaItem3', 'yourName', 'companyName', 'contactPhone']
  },
  {
    id: 'project-completion',
    name: 'Project Completion',
    category: 'Project Management',
    description: 'Project delivery and completion celebration',
    subject: '🎉 Project Complete: {{projectName}} - Ready for Launch!',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #27ae60; text-align: center;">🎉 Project Complete!</h2>
        
        <p>Dear {{clientName}},</p>
        
        <p>We're thrilled to announce that your {{projectName}} project is complete and ready for launch! It has been an absolute pleasure working with you on this exciting venture.</p>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #27ae60; margin-top: 0;">✅ What We've Delivered</h3>
          <ul>
            <li>{{deliverable1}}</li>
            <li>{{deliverable2}}</li>
            <li>{{deliverable3}}</li>
            <li>{{deliverable4}}</li>
          </ul>
        </div>
        
        <h3 style="color: #34495e;">Project Highlights</h3>
        <p>{{projectHighlights}}</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">Next Steps</h3>
          <ol>
            <li>Review all deliverables and provide feedback</li>
            <li>Schedule a launch meeting if needed</li>
            <li>Access your project files: <a href="{{projectFilesLink}}" style="color: #3498db;">Download Here</a></li>
            <li>Consider ongoing maintenance and support options</li>
          </ol>
        </div>
        
        <h3 style="color: #34495e;">Support & Maintenance</h3>
        <p>We're here to support you even after project completion. Our team is available for:</p>
        <ul>
          <li>Bug fixes and minor adjustments (30 days included)</li>
          <li>Training sessions for your team</li>
          <li>Ongoing maintenance packages</li>
          <li>Future enhancements and updates</li>
        </ul>
        
        <p>Thank you for trusting us with your {{projectName}} project. We're excited to see the impact it will have on your business!</p>
        
        <p>Best regards,<br>
        {{yourName}}<br>
        {{companyName}}<br>
        {{contactEmail}}</p>
      </div>
    `,
    variables: ['clientName', 'projectName', 'deliverable1', 'deliverable2', 'deliverable3', 'deliverable4', 'projectHighlights', 'projectFilesLink', 'yourName', 'companyName', 'contactEmail']
  },
  {
    id: 'custom',
    name: 'Custom Template',
    category: 'Custom',
    description: 'Create your own custom email template',
    subject: '{{customSubject}}',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2c3e50;">{{customTitle}}</h2>
        
        <p>Dear {{recipientName}},</p>
        
        <p>{{customContent}}</p>
        
        <p>Best regards,<br>
        {{yourName}}<br>
        {{yourTitle}}<br>
        {{companyName}}</p>
      </div>
    `,
    variables: ['customSubject', 'customTitle', 'recipientName', 'customContent', 'yourName', 'yourTitle', 'companyName'],
    isCustom: true
  }
];

export const templateCategories = [
  'All',
  'Business',
  'Project Management',
  'Finance',
  'Customer Service',
  'Scheduling',
  'Your Templates',
  'Custom'
];
