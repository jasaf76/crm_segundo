import React from "react";

import { useEffect, useState } from "react";

const Loading = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const Timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(Timer);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }
  return null;
};

export default Loading;
