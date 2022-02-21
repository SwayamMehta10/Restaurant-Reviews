import express from "express"
import cors from "cors"
import restaurants from "./api/restaurants.route.js"

const app = express()       

// applying our middleware
app.use(cors())
app.use(express.json())

app.use("/api/v1/restaurants", restaurants)     // main url - localhost:<port number>/api/v1/restaurants
app.use("*", (req, res) => res.status(404).json({ error: "not found" }))

export default app 