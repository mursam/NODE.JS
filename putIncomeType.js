// Projede express ve mssql kullanacağız
// Bu kısım node servislerinde genel olarak üst kısımda hep yer alacak olan satırlardır
var express = require("express"); // express kütüphanesini çağıralım
var app = express(); // app isimli değişkenle express kütüphanesinden ihtiyaç duyulan kısımları çağıracağız.

var bodyParser = require("body-parser"); // Body Parser gönderilen verileri okumak için gereklidir.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = "8080";

var router = express.Router(); // path tanımlamaları için Express Router tipinde ve router adında bir değişken oluşturduk.

// Ortak satırların sonu

//SQL bağlantısı

const sql = require("mssql"); //mssql kütüphanesini çağır.
const e = require("express");

const mssqlconfig = {
  user: "sa",
  password: "1234",
  server: "DESKTOP-N72TTVA",
  database: "Insaat",
  options: {
    port: 1433,
    encrypt: false,
  },
  pool: {
    max: 20,
    min: 5,
    idleTimeoutMillis: 150000,
  },
};


putIncomeTypeFunction = async (req, res, next) => {
  const { IncomeTypeID, IncomeTypeName } = req.body;
  var sqlStatement = `UPDATE IncomeType SET IncomeTypeName='${IncomeTypeName}' WHERE IncomeTypeID = ${IncomeTypeID}`;
  console.log(sqlStatement); // SQL ifadesini log'a aktaralım.

  try {
    await sql.connect(mssqlconfig);
    const result = await sql.query(sqlStatement);
    return res.status(200).json({ "message ": " İşlem Başarılı " });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};


router.put("/putIncomeType", putIncomeTypeFunction);


// Servis kod bloku sonu
// En alttaki satırlar da ortak satırlar olup, aktive etme ve start etme işlemlerine yarar.
app.use("/", router); // router'ı aktive edelim.
app.listen(port); // server'ı ilgili port üzerinden dinleyecek şekilde start edelim.
