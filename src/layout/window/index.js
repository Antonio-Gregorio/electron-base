import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDownLeftAndUpRightToCenter, faMoon, faSun, faTimes} from "@fortawesome/free-solid-svg-icons";
import styled from "./styled.module.css";
import {useWindow} from "../../hooks/useWindow";
import {useTheme} from "../../hooks/useTheme";

const WindowTemplate = ({windowName = "Program", children}) => {
    const {windowLog} = useWindow();
    const {theme, setTheme} = useTheme();

    const changeTheme = () => {
        if (theme == "light") {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    }


    return (
        <main className={styled.main}>
            <header className={styled.frame}>
                <div className={styled.frame_left}>
                    <h2>{windowName}</h2>
                </div>
                <div className={styled.frame_right}>
                    <button onClick={() => {
                        changeTheme()
                    }} className={styled.minimize}><FontAwesomeIcon icon={theme == "light" ? faSun : faMoon}/></button>
                    <button onClick={() => {
                        window.electron.ipcRenderer.sendMessage('minimize')
                    }} className={styled.minimize}><FontAwesomeIcon icon={faDownLeftAndUpRightToCenter}/></button>
                    <button onClick={() => {
                        window.electron.ipcRenderer.sendMessage('close')
                    }} className={styled.close}><FontAwesomeIcon icon={faTimes}/></button>
                </div>
            </header>
            <section className={styled.section}>
                {children}
            </section>
            <footer className={styled.footer}>
                <p>{windowLog}</p>
            </footer>
        </main>
    )
}

export default WindowTemplate;