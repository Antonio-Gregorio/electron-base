import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBook, faCog, faGlobe} from "@fortawesome/free-solid-svg-icons";
import styled from "./styles.module.css";
import {Tooltip} from "react-tooltip";
import { Link } from "react-router-dom";
import {useTheme} from "../../hooks/useTheme";
import {faPhp} from "@fortawesome/free-brands-svg-icons";

const Sidebar = ({children}) => {
    const {theme} = useTheme();

    const inverseTheme = () => {
        return theme == "light" ? "dark" : "light";
    }


    return (
        <section className={styled.main}>
            <Tooltip id="my-tooltip" />
            <div className={styled.navbar}>
                <Link to={"/"} className={styled.button} data-tooltip-id="menu_tooltip_project" data-tooltip-content="Projetos" data-tooltip-variant={inverseTheme()} data-tooltip-place={"right"}><FontAwesomeIcon icon={faBook}/><Tooltip id="menu_tooltip_project" /></Link>
                <Link to={"/php"} className={styled.button} data-tooltip-id="menu_tooltip_project" data-tooltip-content="Versões do PHP" data-tooltip-variant={inverseTheme()} data-tooltip-place={"right"}><FontAwesomeIcon icon={faPhp}/><Tooltip id="menu_tooltip_project" /></Link>
                <Link to={"/hosts"} className={styled.button} data-tooltip-id="menu_tooltip_project" data-tooltip-content="Hosts" data-tooltip-variant={inverseTheme()} data-tooltip-place={"right"}><FontAwesomeIcon icon={faGlobe}/><Tooltip id="menu_tooltip_project" /></Link>
                <Link to={"/settings"} className={styled.button} data-tooltip-id="menu_tooltip_project" data-tooltip-content="Configurações Gerais" data-tooltip-variant={inverseTheme()} data-tooltip-place={"right"}><FontAwesomeIcon icon={faCog}/><Tooltip id="menu_tooltip_project" /></Link>
            </div>
            <div className={styled.section} style={{overflowY: "auto"}}>
                {children}
            </div>
        </section>
    )
}

export default Sidebar;