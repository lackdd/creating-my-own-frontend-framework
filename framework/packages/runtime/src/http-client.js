
function componentError(component) {
	if (!component) {
		throw new Error(`Component not found`)
	}

	if (typeof component.updateState !== 'function') {
		throw new Error(`updateState function not found`)
	}
}

function responseNotOk(response, method, url) {
	if (!response.ok) {
		throw new Error(`${method} ${url} failed with status ${response.status}`);
	}
}

function updateComponentStateLoading(component, isLoading) {
	component.updateState({error: null, isLoading})
}

function updateComponentStateError(component, error) {
	component.updateState({error: error.message, isLoading: false})
}

function updateComponentStateData(component, data) {
	component.updateState({data, isLoading: false})
}

async function request(method, url, component, data, options, handleState) {
	try {
		componentError(component);

		if (handleState) {updateComponentStateLoading(component, true);}

		const { headers, ...rest } = options || {};
		const response = await fetch(`${url}`, {
			method,
			headers: {
				...(data ? { "Content-Type": "application/json" } : {}),
				...(headers || {})
			},
			...(data ? { body: JSON.stringify(data) } : {}),
			...rest,
		});

		responseNotOk(response,method, url);

		const responseData = await response.json();

		if (handleState) updateComponentStateData(component, responseData);

		return responseData;
	} catch (error) {
		if (handleState) updateComponentStateError(component, error);
		throw error;
	}
}

export const dotjs = {

	get: (url, component, options = {}, handleState = true) =>
		request("GET", url, component, null, options, handleState),

	post: (url, component, data, options = {}, handleState = true) =>
		request("POST", url, component, data, options, handleState),

	put: (url, component, data, options = {}, handleState = true) =>
		request("PUT", url, component, data, options, handleState),

	patch: (url, component, data, options = {}, handleState = true) =>
		request("PATCH", url, component, data, options, handleState),

	delete: (url, component, options = {}, handleState = true) =>
		request("DELETE", url, component, null, options, handleState),
}
