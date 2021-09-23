import CryptoES from "crypto-es";

const ITEM_NAME = "notes"

function save(diary) {
	const ciphertext = CryptoES.AES.encrypt(diary.toString(), diary.password).toString()
	localStorage.setItem(ITEM_NAME, ciphertext)
}

export default properties => {

	const { diary } = properties

	diary.firstRun = localStorage.getItem(ITEM_NAME) === null

	diary.listen("login", password => {
		if(localStorage.getItem(ITEM_NAME) === null) {
			diary.password = password
			const ciphertext = CryptoES.AES.encrypt(diary.toString(), password).toString()
			localStorage.setItem(ITEM_NAME, ciphertext)
			diary.emit("auth success")
		} else {
			try {
				const bytes  = CryptoES.AES.decrypt(localStorage.getItem(ITEM_NAME), password);
				const decryptedData = JSON.parse(bytes.toString(CryptoES.enc.Utf8));
				diary.password = password
				decryptedData.forEach(note => diary.addNote(note.content, new Date(note.date)))
				diary.emit("auth success")
			} catch(ex)  {
				diary.emit("auth fail")
				console.error(ex)
			}
		}
	})

	diary.listen("notes added", () => save(diary))

	diary.listen("notes updated", () => save(diary))

	diary.listen("notes removed", () => save(diary))

	diary.listen("reset", () => localStorage.removeItem(ITEM_NAME))

}
