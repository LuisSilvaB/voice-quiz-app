import { useState, useEffect } from 'react';

const useDevice = () => {
  const [device, setDevice] = useState('');
  useEffect(() => {
    const handleDeviceDetection = () => {
      const windowWidth = window.innerWidth;
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /iphone|ipad|ipod|android|blackberry|windows phone/g.test(userAgent);
      const isTablet = /(ipad|tablet|playbook|silk)|(android(?!.*mobile))/g.test(userAgent);

      if (isMobile || windowWidth < 768) {
        setDevice('Mobile');
      } else if (isTablet || windowWidth < 1024) {
        setDevice('Tablet');  
      } else {
        setDevice('Desktop');
      }
    };

    handleDeviceDetection();
    window.addEventListener('resize', handleDeviceDetection);

    return () => {
      window.removeEventListener('resize', handleDeviceDetection);
    };
  }, []);

  return device;
};

export default useDevice;
