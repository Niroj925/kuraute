import React, { useState } from 'react';
import { Image } from 'react-bootstrap';

const MyImage = ({ src, alt, size,iscircle=false }) => {
//   const [hover, setHover] = useState(false);

//   const handleHover = () => {
//     setHover(true);
//   };

//   const handleMouseLeave = () => {
//     setHover(false);
//   };

  return (
    <div
      style={{
        borderRadius: '50%',
        overflow: 'hidden',
        position: 'relative',
        display: 'inline-block',
       
      }}
    //   onMouseEnter={handleHover}
    //   onMouseLeave={handleMouseLeave}
    >
      <Image src={src} alt={alt} roundedCircle style={{ width: size, height: size }} />
      {iscircle && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: '50%',
            border: '2px solid green',
          }}
        />
      )}
    </div>
  );
};

export default MyImage;