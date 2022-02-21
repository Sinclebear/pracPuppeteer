const mongoose = require("mongoose");
require("dotenv").config();

const connect = () => {
  mongoose.connect(process.env.AWS_MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
};

//ec2 데이터베이스
// const connect = () => {
//     mongoose
//         .connect(process.env.AWS_MONGO_DB, { // .env 내 AWS_MONGO_DB 참조
//             ignoreUndefined: true,
//         })
//         .catch((err) => {
//             console.error(err);
//         });
// };

module.exports = connect;
