import React, {useState, useEffect} from "react";
import {Alert, Button, Form, Modal, Toast} from "react-bootstrap";
import {faGlobe, faPlus, faRefresh, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useWindow} from "../../hooks/useWindow";

const HostPage = () => {
    const { setWindowLog } = useWindow();
    const [hosts, setHosts] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteHost, setDeleteHost] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(false);
    const [newHost, setNewHost] = useState({
        "ip": "127.0.0.1",
        "host": ""
    });

    const handleAddHost = () => {
        if (!newHost.ip || !newHost.host) {
            setError("Preencha os dois campos.")
            return;
        }

        if (Object.entries(hosts).map(([host, ip]) => host === newHost.host).includes(true)) {
            setError("O Host já existe.")
            return;
        }

        window.electron.ipcRenderer.addHosts(newHost.ip, newHost.host).then((data) => {
            if (data && data.success) {
                updateHosts();
            }
        });
        setShowModal(false);
        setNewHost({"ip": "127.0.0.1", "host": ""});
        setError(false);
    };

    const handleRemoveHost = (host) => {
        setDeleteHost(host); // Set the host to be deleted
        setShowDeleteModal(true); // Show the delete confirmation modal
    }

    const confirmDeleteHost = () => {
        window.electron.ipcRenderer.deleteHosts(deleteHost).then((data) => {
            if (data && data.success) {
                updateHosts();
            }
        });
        setShowDeleteModal(false);
    }

    const updateHosts = () => {
        window.electron.ipcRenderer.findHosts().then((data) => {
            if (data && data.content) {
                setHosts(data.content);
            }
        });
    }

    useEffect(() => {
        updateHosts();
        setWindowLog("Listagem de Hosts atualizada!");
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Listagem de Hosts</h2>
            <div className={"d-flex justify-content-end mb-3"}>
                <Button variant="primary" onClick={() => {
                    setShowModal(true)
                }} className="mb-3 me-3">
                    <FontAwesomeIcon icon={faPlus}/> Adicionar
                </Button>
                <Button variant="secondary" onClick={() => {
                    updateHosts()
                }} className="mb-3">
                    <FontAwesomeIcon icon={faRefresh}/> Atualizar
                </Button>
            </div>
            <div style={{height: "500px", overflowY: "auto"}}>
                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th>Host</th>
                        <th>IP</th>
                        <th style={{width: "50px"}}>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.entries(hosts).map(([host, ip]) => (
                        <tr key={host}>
                            <td>{host}</td>
                            <td>{ip}</td>
                            <td style={{width: "50px"}}>
                                <Button variant="danger"  onClick={() => handleRemoveHost(host)}>
                                    <FontAwesomeIcon icon={faTrashCan}/>
                                </Button>
                            </td>

                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <Modal show={showModal} onHide={() => {
                setShowModal(false)
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar Novo Host</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    { error && <Alert variant="danger">{error}</Alert> }
                    <Form>
                        <Form.Group controlId="formHost" className={"mb-2"}>
                            <Form.Label>Host</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Digite o host"
                                value={newHost.host}
                                onChange={(e) => setNewHost({...newHost, host: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group controlId="formIp">
                            <Form.Label>IP</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Digite o IP"
                                value={newHost.ip}
                                onChange={(e) => setNewHost({...newHost, ip: e.target.value})}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowModal(false)
                    }}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={handleAddHost}>
                        Adicionar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Tem certeza que deseja excluir o host: <strong>{deleteHost}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteHost}>
                        Excluir
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default HostPage;