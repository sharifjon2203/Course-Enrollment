import { app } from "./app.js"
import { ConnectDb } from "./config/db.js"

const PORT = 4000

ConnectDb()

app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`))

