//nomongodb+srv://amandaadjei128:<password>@cluster0.159unzv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
import express from "express";
import cors from "cors";
//import records from "./routes/record.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
//app.use("/record", records);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});