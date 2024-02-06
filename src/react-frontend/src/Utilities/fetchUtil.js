function requestToURL(url, requestMethod, jwt, requestBody) {
    const fetchData = {
        headers: {
            "Content-Type": "application/json",
        },
        method: requestMethod,
    };

    if (jwt) {
        fetchData.headers.Authorization = `Bearer ${jwt}`;
    }

    // console.log(
    //     jwt +
    //     "  FROM FETCH\n" +
    //     requestMethod +
    //     "\n" +
    //     fetchData.headers.Authorization +
    //     "\n" +
    //     fetchData.method + "\n" +
    //     url
    // );

    if (requestBody) {
        console.log(requestBody + "  FROM FETCH");
        fetchData.body = JSON.stringify(requestBody);
    }

    return fetch(url, fetchData).then((response) => {
        console.log("fetch donne " + response.status + "\n");
        if (response.status === 200) {
            return response.json();
        } else if (response.status === 401) {
            console.log("Access deny!");
        }
    });
}

export default requestToURL;