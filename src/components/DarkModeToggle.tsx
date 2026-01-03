import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, LightbulbOff } from 'lucide-react';

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleDarkMode}>
      <Lightbulb className="h-[1.2rem] w-[1.2rem] scale-100 transition-all dark:scale-0" />
      <LightbulbOff className="absolute h-[1.2rem] w-[1.2rem] scale-0 transition-all dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default DarkModeToggle;
