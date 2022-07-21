import './SideBar.css'

const SideBar = ({ id, themeCallback }) => {
    return <div className='SideBar'>
        <div className='SideBarCard'>
            <h3>Humidity</h3>
            <span>44%</span>
        </div>
        <div className='SideBarCard'>
            <h3>Last</h3>
            <span>2022-04-02 UTC</span>
        </div>
        <div className='SideBarCard' onClick={themeCallback}>
            <h3>Change theme</h3>
        </div>
    </div>
}

export default SideBar
