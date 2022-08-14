import { useState } from 'react'
import './App.css'
import { Card } from './components/Card.js'

const App = () => {
    const [theme, setTheme] = useState('dark')
    
    const changeTheme = () => setTheme(theme == 'light' ? 'dark' : 'light')

    return (
        <div className={theme == 'light' ? 'App light' : 'App dark'}>
            <Card />
        </div>
    )
}

export default App;
