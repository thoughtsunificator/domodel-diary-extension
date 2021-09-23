import LocalStorage from "./local-storage.js"

export default properties => {

	const { diary } = properties

	LocalStorage({ diary })

}
