import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import WindowTemplate from "./layout/window";
import Sidebar from "./layout/sidebar";
import {
    BrowserRouter,
    Route, Router,
    Routes
} from "react-router-dom";
import Hook from "./hooks/hook";
import PhpPage from "./pages/php";
import SettingsPage from "./pages/settings";
import HostPage from "./pages/hosts";
import ProjectPage from "./pages/project";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <Hook>
            <WindowTemplate windowName={"Base Program"}>
                <BrowserRouter>
                    <Sidebar>
                        <Routes>
                            <Route path="/" element={<ProjectPage/>}/>
                            <Route path="/php" element={<PhpPage/>}/>
                            <Route path="/hosts" element={<HostPage/>}/>
                            <Route path="/settings" element={<SettingsPage/>}/>
                        </Routes>
                    </Sidebar>
                </BrowserRouter>
            </WindowTemplate>
        </Hook>
    </React.StrictMode>
);
