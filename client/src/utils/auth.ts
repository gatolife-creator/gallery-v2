export async function isAuthorized() {
    try {
        const response = await fetch("/isAuthorized");
        const result = await response.json();

        if (response.ok) {
            console.log(result.message);
            return result.isAuthorized;
        } else {
            console.error(result.message);
            return false;
        }
    } catch (error) {
        console.error("認証確認中にエラーが発生しました。", error);
        return false;
    }
}

export async function authenticate(credentials: { id: string, password: string }) {
    try {
        const response = await fetch("/auth", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials),
        });

        const result = await response.json();

        if (response.ok) {
            console.log(result.message);
            return result.token;
        } else {
            console.error(result.message);
            return null;
        }
    } catch (error) {
        console.error("認証中にエラーが発生しました。", error);
        return null;
    }
}