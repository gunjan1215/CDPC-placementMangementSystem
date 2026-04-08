import React from 'react';
import logoImage from '../../Assets/background.jpg'; 

function Logo() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      height: '100%',
      paddingTop: '10px' // This pushes the logo DOWN from the top
    }}>
      <img 
        src={logoImage} 
        alt="Logo" 
        className="img-fluid" 
        style={{ 
          maxHeight: '80px',  // Increased size (stays within 90px navbar)
          maxWidth: '200px', 
          objectFit: 'contain',
          display: 'block'
        }} 
      />
    </div>
  )
}

export default Logo;