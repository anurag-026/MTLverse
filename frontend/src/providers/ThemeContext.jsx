// import React, { createContext, useContext, useEffect, useState } from 'react';

// const ThemeContext = createContext(undefined);

// export function ThemeProvider({ children }) {
//   const [theme, setTheme] = useState('dark');
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     const saved = localStorage.getItem('theme');
//     if (saved === 'light' || saved === 'dark') setTheme(saved);
//     else setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     if (!mounted) return;
//     localStorage.setItem('theme', theme);
//     document.documentElement.classList.toggle('dark', theme === 'dark');
//   }, [theme, mounted]);

//   const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
//       <div className={`transition-colors ${theme === 'dark' ? 'text-white bg-[#070920]' : 'text-black bg-white'}`}>
//         <div className="pt-16 md:pt-20 relative">
//           <div className="fixed inset-0 pointer-events-none">
//             <div className="absolute z-10 inset-0 bg-[linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] bg-[size:72px_72px]"></div>
//             <div className={`absolute z-20 inset-0 ${theme === 'dark' ? 'bg-black/60' : 'bg-white'}`}></div>
//           </div>
//           {children}
//         </div>
//       </div>
//     </ThemeContext.Provider>
//   );
// }

// export function useTheme() {
//   const ctx = useContext(ThemeContext);
//   if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
//   return ctx;
// }


