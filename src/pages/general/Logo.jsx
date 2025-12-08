import { useEffect, useState } from 'react';

const Logo = () => {
  const [src, setSrc] = useState('/img/logo-light.png');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setSrc(isDark ? '/img/logo-dark.png' : '/img/logo-light.png');

    const observer = new MutationObserver(() => {
      const isDarkNow = document.documentElement.classList.contains('dark');
      setSrc(isDarkNow ? '/img/logo-dark.png' : '/img/logo-light.png');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <img src={src} alt="Logo" className="h-8" />
  );
};

export default Logo;
