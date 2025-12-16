(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
import "dotenv/config";


import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Погнали на http://localhost:${PORT}`);
});
