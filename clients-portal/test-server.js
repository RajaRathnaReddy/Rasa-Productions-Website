const https = require("https");

const getAdmin = () => {
  https.get("https://clients-portal-5cmg4mjhz-rajarathnareddys-projects.vercel.app/admin", (res) => {
    let data = "";
    res.on("data", chunk => data += chunk);
    res.on("end", () => console.log(res.statusCode, data));
  });
};
getAdmin();
