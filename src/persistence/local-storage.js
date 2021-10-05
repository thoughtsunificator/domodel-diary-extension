import CryptoES from "crypto-es";

const ITEM_NAME = "notes"

function save(diary) {
	const ciphertext = CryptoES.AES.encrypt(diary.notes.toString(), diary.password).toString()
	localStorage.setItem(ITEM_NAME, ciphertext)
}

export default properties => {

	const { diary } = properties

	diary.firstRun = localStorage.getItem(ITEM_NAME) === null

	diary.listen("login", password => {
		if(localStorage.getItem(ITEM_NAME) === null) {
			diary.password = password
			const ciphertext = CryptoES.AES.encrypt(diary.notes.toString(), password).toString()
			localStorage.setItem(ITEM_NAME, ciphertext)
			diary.emit("authSuccess")
		} else {
			try {
				const bytes  = CryptoES.AES.decrypt(localStorage.getItem(ITEM_NAME), password);
				const decryptedData = JSON.parse(bytes.toString(CryptoES.enc.Utf8));
				diary.password = password
				decryptedData.forEach(note => diary.notes.add(note.content, new Date(note.date)))
				diary.emit("authSuccess")
			} catch(ex)  {
				diary.emit("authFail")
				console.error(ex)
			}
		}
	})

	diary.notes.listen("add", () => save(diary))

	diary.notes.listen("update", () => save(diary))

	diary.notes.listen("remove", () => save(diary))

	diary.listen("reset", () => localStorage.removeItem(ITEM_NAME))

}
