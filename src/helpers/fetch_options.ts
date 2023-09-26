export type HTTPVerb = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type FormOptions = {
    method: HTTPVerb;
    credentials: RequestCredentials;
    body?: URLSearchParams;
};

// const API_DOMAIN = 'https://mao-blog-api.adaptable.app';
const API_DOMAIN = 'http://localhost:5000';

export async function fetchData(
    endpoint: string,
    method: HTTPVerb,
    formData?: FormData
): Promise<Response | Error> {
    try {
        return await fetch(`${API_DOMAIN}${endpoint}`, getFetchOptions(method, formData));
    } catch (error) {
        return error as Error;
    }
}

function getFetchOptions(method: HTTPVerb, formData?: FormData): FormOptions {
    const formOptions: FormOptions = {
        method: method,
        credentials: 'include',
    };

    if (formData) {
        // Unable to resolve "missing size/sort fields from type"
        // eslint-disable-next-line
        formOptions.body = new URLSearchParams(formData as any);
    }

    return formOptions;
}