import {useEffect, useState} from "react";
import {Alert, Button, Form, Modal} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faEdit, faFile, faPlus, faRefresh, faTimes, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {useWindow} from "../../hooks/useWindow";

const SettingsModel = {
    "id": 0,
    "name": "",
    "value": ""
}

const SettingsPage = () => {
    const [settingsList, setSettingsList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(false);
    const [editSettings, setEditSettings] = useState(SettingsModel);
    const {setWindowLog} = useWindow();

    const updateList = () => {
        window.electron.ipcRenderer.findSettings().then((data) => {
            let database = [];

            data.forEach((data) => {
                database.push(data.dataValues)
            });

            setSettingsList(database);
        })
    }

    const handleEditSettings = () => {
        window.electron.ipcRenderer.editSettings(editSettings).then((data) => {
            if (data) {
                setWindowLog(`Configuração: ${editSettings.name} editada com sucesso!`)
                updateList();
            }
        })

        setShowModal(false);
        setError(false);
    }

    const handleFileChange = async (event) => {
        if (["XAMPP_FOLDER"].includes(editSettings.name)) {
            window.electron.tools.dialogFolder().then((data) => {
                setEditSettings({...editSettings, value: data.filePaths[0]});
            });
        }

        if (["COMPOSER_PHAR"].includes(editSettings.name)) {
            window.electron.tools.dialog().then((data) => {
                setEditSettings({...editSettings, value: data.filePaths[0]});
            });
        }
    };

    useEffect(() => {
        setWindowLog(`Listagem de Configurações atualizada!`)
        updateList();
    }, []);


    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Listagem de Configurações</h2>
            <div className={"d-flex justify-content-end mb-3"}>
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
                        <th>Configuração</th>
                        <th>Valor</th>
                        <th style={{width: "50px"}}>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {settingsList.map((data) => (
                        <tr key={data.id} style={{height: "55px"}}>
                            <td>{data.name}</td>
                            <td>{data.value}</td>
                            <td style={{width: "50px"}}>
                                <Button variant="warning" onClick={() => {
                                    setEditSettings(data);
                                    setShowModal(true)
                                }}>
                                    <FontAwesomeIcon icon={faEdit}/>
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
                    <Modal.Title>Editar {editSettings.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form.Group controlId="formIp">
                            <Form.Label>Pasta</Form.Label>
                            <div className={"d-flex flex-row"} style={{gap: "15px"}}>
                                <Form.Control
                                    type="text"
                                    readOnly={true}
                                    value={editSettings.value}
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
                    <Button variant="primary" onClick={handleEditSettings}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default SettingsPage;