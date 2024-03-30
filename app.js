const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");

//Port listening
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

app.use(express.static(path.join(__dirname, "public")));