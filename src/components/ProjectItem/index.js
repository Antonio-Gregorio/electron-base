import styled from "./styled.module.css";

const ProjectItem = ({id, name, image, path, phpVersion}) => {

    return (
        <div key={id} className={styled.item}>
            <div className={styled.item_image}>
                <img src={'data:image/jpeg;base64,' + image} alt={name}/>
            </div>
            <div className={styled.item_data}>
                <h2>{name}</h2>
                <p>Caminho: {path}</p>
                <p>Versão do PHP: {phpVersion}</p>
            </div>
        </div>
    )
}

export default ProjectItem;