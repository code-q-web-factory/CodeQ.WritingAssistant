// @ts-ignore
import manifest from "@neos-project/neos-ui-extensibility";
// @ts-ignore
import { IconButton, Headline } from "@neos-project/react-ui-components";
// @ts-ignore
import {selectors} from '@neos-project/neos-ui-redux-store';
// @ts-ignore
import * as React from 'react';
// @ts-ignore
import { useSelector } from 'react-redux';
import "./style.css";

manifest("NEOSidekick.AiAssistant", {}, (globalRegistry, { store, frontendConfiguration }) => {
	const containerRegistry = globalRegistry.get('containers');
	const App = containerRegistry.get('App');

	const WrappedApp = (props: Record<string, unknown>) => {
		const [isOpen, setOpen] = React.useState(true);

		const activeContentDimensions = useSelector(selectors.CR.ContentDimensions.active);
		const interfaceLanguage = useSelector((state) => state?.user?.preferences?.interfaceLanguage);

        return <div className={`neosidekick_appWrapper ${isOpen ? "neosidekick_appWrapper--sidebar-open" : ""}`}>
			<App {...props} />
            <div className="neosidekick_sideBar">
				<div className="neosidekick_sideBar__title">
					<Headline className={`neosidekick_sideBar__title-headline ${isOpen ? "neosidekick_sideBar__title-headline--open" : ""}`}>AI Sidekick</Headline>
					<IconButton icon={isOpen ? "chevron-circle-right" : "chevron-circle-left"} onClick={() => setOpen(!isOpen)} />
				</div>
                <iframe className={`neosidekick_sideBar__frame ${isOpen ? "neosidekick_sideBar__frame--open" : ""}`} src={"https://api.neosidekick.com/chat/?contentLanguage=" + (activeContentDimensions.language ? activeContentDimensions.language[0] : "") + "&interfaceLanguage=" + interfaceLanguage} />
            </div>
		</div>
	}
	containerRegistry.set('App', WrappedApp);
});
