import {useEffect, useState} from "react";
import {Alert, Button, Form, Modal} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faFile, faPlus, faRefresh, faTimes, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {useWindow} from "../../hooks/useWindow";
const PhpModel = {
    "id": 0,
    "name": "",
    "version": "",
    "path": "",
    "exe": ""
}

const PhpPage = () => {
    const [phpList, setPhpList] = useState([]);
    const [newPhp, setNewPhp] = useState(PhpModel);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(false);
    const [deletePhp, setDeletePhp] = useState(false);
    const { setWindowLog } = useWindow();

    const updateList = () => {
        window.electron.ipcRenderer.findPhp().then((data) => {
            let database = [];

            data.forEach((data) => {
                database.push(data.dataValues)
            });

            setPhpList(database);
        })
    }

    const handleAddPhp = () => {
        window.electron.ipcRenderer.createPhp(newPhp).then((data) => {
            if (data) {
                setWindowLog(`PHP: ${newPhp.name} criado com sucesso!`)
                updateList();
            }
        });

        setShowModal(false);
        setNewPhp(PhpModel);
        setError(false);
    }

    const handleDeletePhp = () => {
        window.electron.ipcRenderer.deletePhp(deletePhp.id).then((data) => {
            if (data) {
                setWindowLog(`PHP: ${deletePhp.name} deletado com sucesso!`)
                updateList();
            }
        })

        setShowModal(false);
        setError(false);
    }

    const handleFileChange = async (event) => {
        window.electron.tools.dialog().then((data) => {
            setNewPhp({...newPhp, exe: data.filePaths[0]});
        });
    };

    useEffect(() => {
        setWindowLog(`Listagem de PHP atualizada!`)
        updateList();
    }, []);


    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Listagem de Phps</h2>
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
                <table className="table table-bordered rounded">
                    <thead>
                    <tr>
                        <th style={{width: "50px"}}>Ativo</th>
                        <th>Nome</th>
                        <th>Versão</th>
                        <th>Caminho</th>
                        <th style={{width: "50px"}}>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {phpList.map((data) => (
                        <tr key={data.id}>
                            <td style={{textAlign: "center"}}><FontAwesomeIcon icon={data.active ? faCheck : faTimes} size={"2x"} style={{color: data.active ? "green" : "red"}}/></td>
                            <td>{data.name}</td>
                            <td>{data.version}</td>
                            <td>{data.path}</td>
                            <td style={{width: "50px"}}>
                                <Button variant="danger" onClick={() => {setDeletePhp(data); setShowModal('delete')}}>
                                    <FontAwesomeIcon icon={faTrashCan}/>
                                </Button>
                            </td>

                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <Modal show={showModal === 'create'} onHide={() => {
                setShowModal(false)
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar Novo Php</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form.Group controlId="formPhp" className={"mb-2"}>
                            <Form.Label>Php</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Digite o nome"
                                value={newPhp.name}
                                onChange={(e) => setNewPhp({...newPhp, name: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group controlId="formIp">
                            <Form.Label>Exe</Form.Label>
                            <div className={"d-flex flex-row"} style={{gap: "15px"}}>
                                <Form.Control
                                    type="text"
                                    readOnly={true}
                                    value={newPhp.exe}
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
                    <Button variant="primary" onClick={handleAddPhp}>
                        Adicionar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showModal === 'delete'} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Tem certeza que deseja excluir a versão php: <strong>{deletePhp.name}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDeletePhp}>
                        Excluir
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default PhpPage;