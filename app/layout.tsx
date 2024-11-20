import React, { ReactNode } from 'react';
import './globals.css';

interface LayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <title>To-Do List</title>
        <meta name="description" content="A simple Todo List app" />
        {/* Link to the favicon */}
        <link rel="icon" href="/niceicon.ico" />
      </head>
      <body>
        <div className="todo-container">
          {/* Center the title with flexbox */}
          <h1 style={{
            fontFamily: 'Poppins, sans-serif',
            color: '#d17c49',
            display: 'flex',
            justifyContent: 'center', // Center the content horizontally
            alignItems: 'center', // Align vertically
            width: '100%', // Ensure full width to center
            position: 'relative' // Allow positioning the icon inside the flex container
          }}>
            To-Do List
            {/* Icon on the right side of the title */}
            <img 
              src="assets/niceicon.ico" 
              alt="To-Do Icon" 
              style={{
                width: '40px', // Adjust size
                height: '40px', // Adjust size
                marginLeft: '15px' // Space between title and icon
              }} 
            />
          </h1>
          {/* Add description below the title */}
          <p style={{ fontFamily: 'Poppins, sans-serif', color: '#555', fontSize: '18px', marginBottom: '20px' }}>
            Organize your tasks and stay productive throughout the day .
          </p>
          {children}
        </div>
      </body>
    </html>
  );
};

export default MainLayout;



