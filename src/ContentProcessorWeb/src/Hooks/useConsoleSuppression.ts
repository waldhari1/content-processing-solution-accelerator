import { useEffect } from "react";

// Custom hook to suppress console logs, warnings, and errors in localhost
const useConsoleSuppression = () => {
  useEffect(() => {
    if (window.location.hostname !== "localhost" &&  process.env.REACT_APP_ISLOGS_ENABLED?.toLocaleLowerCase() != "true" ) {
      // Save the original console methods
      const originalConsoleError = console.error;
      const originalConsoleWarn = console.warn;
      const originalConsoleLog = console.log;
      const originalConsoleInfo = console.info;

      // Suppress console methods
      console.error = () => {};
      console.warn = () => {};
      console.log = () => {};
      console.info = () => {};

      // Clean up when component unmounts
      return () => {
        console.error = originalConsoleError;
        console.warn = originalConsoleWarn;
        console.log = originalConsoleLog;
        console.info = originalConsoleInfo;
      };
    }
  }, []);
};

export default useConsoleSuppression;
