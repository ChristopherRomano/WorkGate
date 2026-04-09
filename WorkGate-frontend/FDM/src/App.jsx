import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';


export default function App() {
  return (
    <ThemeProvider>
      <Login/>
    </ThemeProvider>
  );
}
