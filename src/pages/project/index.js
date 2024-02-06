import {useEffect, useState} from "react";
import {Alert, Button, Form, Modal} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faFile, faPlus, faRefresh, faTimes, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {useWindow} from "../../hooks/useWindow";
import ProjectItem from "../../components/ProjectItem";

const ProjectModel = {
    "id": 0,
    "php_id": 0,
    "name": "",
    "image": "",
    "path": ""
}

const ProjectPage = () => {
    const [projectList, setProjectList] = useState([]);
    const [newProject, setNewProject] = useState(ProjectModel);
    const [editProject, setEditProject] = useState(ProjectModel);
    const [deleteProject, setDeleteProject] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(false);
    const {setWindowLog} = useWindow();

    const updateList = () => {
        window.electron.ipcRenderer.findProject().then((data) => {
            setProjectList(data);
        })
    }

    const handleAddProject = () => {
        window.electron.ipcRenderer.createProject(newProject).then((data) => {
            if (data) {
                setWindowLog(`Projeto: ${newProject.name} criado com sucesso!`)
                updateList();
            }
        });

        setShowModal(false);
        setNewProject(ProjectModel);
        setError(false);
    }

    const handleEditProject = () => {
        window.electron.ipcRenderer.createProject(newProject).then((data) => {
            if (data) {
                setWindowLog(`Projeto: ${newProject.name} editado com sucesso!`)
                updateList();
            }
        });

        setShowModal(false);
        setEditProject(ProjectModel);
        setError(false);
    }

    const handleDeleteProject = () => {
        window.electron.ipcRenderer.deleteProject(deleteProject.id).then((data) => {
            if (data) {
                setWindowLog(`Projeto: ${deleteProject.name} deletado com sucesso!`)
                updateList();
            }
        })

        setShowModal(false);
        setError(false);
    }

    const handleFileChange = async (event) => {
        window.electron.tools.dialog().then((data) => {
            setNewProject({...newProject, exe: data.filePaths[0]});
        });
    };

    useEffect(() => {
        setWindowLog(`Listagem de Projetos atualizada!`)
        updateList();
    }, []);


    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Listagem de Projetos</h2>
            <div className={"d-flex justify-content-end mb-3"}>
                <Button variant="primary" onClick={() => {
                    setShowModal('create')
                }} className="mb-3 me-3">
                    <FontAwesomeIcon icon={faPlus}/> Adicionar
                </Button>
                <Button variant="secondary" onClick={() => {
                    updateList()
                }} className="mb-3">
                    <FontAwesomeIcon icon={faRefresh}/> Atualizar
                </Button>
            </div>
            <div style={{height: "500px", overflowY: "auto"}}>
                {projectList.map((data) => (
                    <ProjectItem id={data.id} name={data.name} path={data.path} image={data.image} phpVersion={data.php.version}/>
                ))}
            </div>
            <Modal show={showModal === 'create'} onHide={() => {
                setShowModal(false)
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar Novo Projeto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form.Group controlId="formProject" className={"mb-2"}>
                            <Form.Label>Project</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Digite o nome"
                                value={newProject.name}
                                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group controlId="formIp">
                            <Form.Label>Exe</Form.Label>
                            <div className={"d-flex flex-row"} style={{gap: "15px"}}>
                                <Form.Control
                                    type="text"
                                    readOnly={true}
                                    value={newProject.exe}
                                />
                                <Button variant={"secondary"} onClick={() => {
                                    handleFileChange()
                                }}>
                                    <FontAwesomeIcon icon={faFile}/>
                                </Button>
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowModal(false)
                    }}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={handleAddProject}>
                        Adicionar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showModal === 'delete'} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Tem certeza que deseja excluir a versão php: <strong>{deleteProject.name}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDeleteProject}>
                        Excluir
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ProjectPage;