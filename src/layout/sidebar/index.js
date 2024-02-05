import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBook} from "@fortawesome/free-solid-svg-icons";
import styled from "./styles.module.css";
import {Tooltip} from "react-tooltip";
import { Link } from "react-router-dom";
import {useTheme} from "../../hooks/useTheme";

const Sidebar = ({children}) => {
    const {theme} = useTheme();

    const inverseTheme = () => {
        return theme == "light" ? "dark" : "light";
    }


    return (
        <section className={styled.main}>
            <Tooltip id="my-tooltip" />
            <div className={styled.navbar}>
                <Link to={"/"} className={styled.button} data-tooltip-id="menu_tooltip_project" data-tooltip-content="Main" data-tooltip-variant={inverseTheme()} data-tooltip-place={"right"}><FontAwesomeIcon icon={faBook}/><Tooltip id="menu_tooltip_project" /></Link>
            </div>
            <div className={styled.section} style={{overflowY: "auto"}}>
                {children}
            </div>
        </section>
    )
}

export default Sidebar;