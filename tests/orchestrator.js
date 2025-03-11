import retry from "async-retry";

async function waitForAllServices() {
    await waitForWebServer();

    async function waitForWebServer() {
        return retry(fetchStatusPage, {
            retries: 100,
            maxTimeout: 2000,
        });

        async function fetchStatusPage() {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/v1/statusss"
                );
                if (!response.ok) {
                    throw Error(`HTTP error ${response.status}`);
                }
            } catch (error) {
                throw Error(error);
            }
        }
    }
}

export default {
    waitForAllServices,
};
