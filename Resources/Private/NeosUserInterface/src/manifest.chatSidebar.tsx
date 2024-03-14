import React from "react";
import {Headline, IconButton} from "@neos-project/react-ui-components";
import {GlobalRegistry} from "@neos-project/neos-ts-interfaces";
import SidekickIFrame from "./Components/SidekickIFrame";

export default (globalRegistry: GlobalRegistry, configuration: object) => {
    const containerRegistry = globalRegistry.get('containers');
    const App = containerRegistry.get('App');

    if (!configuration.chatSidebarEnabled) {
        containerRegistry.set('App', (props: Record<string, unknown>) => {
            return (
                <div>
                    <App {...props} />
                    <SidekickIFrame className="neosidekick__frame--hidden"/>
                </div>
            )
        });
        return;
    }

    const WrappedApp = (props: Record<string, unknown>) => {
        // @ts-ignore
        const state = localStorage.getItem('NEOSidekick') ? JSON.parse(localStorage.getItem('NEOSidekick')) : { open: true, fullscreen: false };
        const [isOpen, setOpen] = React.useState(state?.open);
        const setOpenAndPersistState = (open) => {
            setOpen(open);
            state.open = open;
            localStorage.setItem('NEOSidekick', JSON.stringify(state));
        }

        const [isFullscreen, setFullscreen] = React.useState(state?.fullscreen);
        const setFullscreenAndPersistState = (fullscreen: boolean) => {
            setFullscreen(fullscreen);
            state.fullscreen = fullscreen;
            localStorage.setItem('NEOSidekick', JSON.stringify(state));
        }

        const fullscreenButton = (isOpen: boolean, isFullscreen: boolean, onClick: Function) => {
            if (isOpen) {
                return <IconButton icon={isFullscreen ? "compress" : "expand"} onClick={onClick} />
            }
            return '';
        }
        const toggleButton = (isOpen: boolean, isFullscreen: boolean, onClick: Function) => {
            if (!isFullscreen) {
                return <IconButton icon={isOpen ? "chevron-circle-right" : "chevron-circle-left"} onClick={onClick} />
            }
            return '';
        }

        return <div className={`neosidekick_appWrapper ${isOpen ? "neosidekick_appWrapper--sidebar-open" : ""}  ${isFullscreen ? "neosidekick_appWrapper--sidebar-fullscreen" : ""}`}>
            <App {...props} />
            <div className="neosidekick_sideBar">
                <div className="neosidekick_sideBar__title">
                    <Headline className={`neosidekick_sideBar__title-headline ${isOpen ? "neosidekick_sideBar__title-headline--open" : ""}`}>AI Sidekick</Headline>
                    <div>
                        {fullscreenButton(isOpen, isFullscreen, () => setFullscreenAndPersistState(!isFullscreen))}
                        {toggleButton(isOpen, isFullscreen, () => setOpenAndPersistState(!isOpen))}
                    </div>
                </div>
                <SidekickIFrame className={`neosidekick_sideBar__frame ${isOpen ? "neosidekick_sideBar__frame--open" : ""}`}/>
            </div>
        </div>
    }
    containerRegistry.set('App', WrappedApp);
}
