import './App.css'

import { useState } from 'react'
import HumidityGraph from './components/HumidityGraph'
import SideBar from './components/SideBar'

const themes = {
    'light': {
        '--foreground-color': '#ADC2A9',
        '--background-color': '#FEF5ED',
    },
    'dark': {
        '--foreground-color': '#D3E4CD',
        '--background-color': '#99A799',
    },
}

const App = () => {
    const [theme, setTheme] = useState('dark')
    
    const changeTheme = () => setTheme(theme == 'light' ? 'dark' : 'light')

    return (
        <div className={theme == 'light' ? 'App' : 'App dark'}>
            <HumidityGraph id={3} color={themes[theme]['--foreground-color']} />
            <SideBar id={3} themeCallback={changeTheme} />
        </div>
    )
}

export default App;
