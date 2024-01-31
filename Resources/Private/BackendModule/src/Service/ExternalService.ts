import AiAssistantError from "./AiAssistantError";
export const createExternalService = (frontendConfiguration): ExternalService => {
    const configuration = frontendConfiguration['NEOSidekick.AiAssistant'];
    return new ExternalService(configuration['apiDomain'], configuration['apiKey'])
}

export class ExternalService {
    private static instance: ExternalService | null = null;
    private apiDomain: string = ''
    private apiKey: string = ''

    constructor() {
    }

    public static getInstance(): ExternalService
    {
        if (!ExternalService.instance) {
            ExternalService.instance = new ExternalService();
        }
        return ExternalService.instance
    }

    public configure = (apiDomain: string, apiKey: string) => {
        this.apiDomain = apiDomain
        this.apiKey = apiKey
    }

    hasApiKey = () => {
        return this.apiKey !== null && this.apiKey !== ''
    }

    generate = async (module: string, language: string, user_input: object = {}) => {
        if (!this.apiKey) {
            throw new AiAssistantError('This feature is not available in the free version.', '1688157373215')
        }

        const response = await fetch(`${this.apiDomain}/api/v1/chat?language=${language}`, {
            method: "POST", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.apiKey}`,
                "Accept": "application/json"
            },
            body: JSON.stringify({
                module,
                platform: "neos",
                user_input
            })
        });

        const jsonData = await response.json()

        if (response.status === 401) {
            throw new AiAssistantError('The NEOSidekick api key provided is not valid.', '1688158193038')
        } else if (response.status < 200 || response.status >= 400) {
            throw new AiAssistantError('An error occurred while asking NEOSidekick.', '1688158257149', jsonData?.message)
        }

        let message = jsonData?.data?.message?.message
        // Truncate obsolete quotation marks
        if(message.startsWith('"') && message.endsWith('"')) {
            message = message.substr(1, message.length-2);
        }
        return message
    }
}
