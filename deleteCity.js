// Projede Express ve mssql kullanacağız. 
//-- Bu kısım node servislerinde genel olarak üst kısımda hep yer alacak olan ortak satırlardır.
var express = require('express');//express kütüphanesini çağıralım
var app = express(); // app isimli değişkenle express kütüphanesinden ilgili ihtiyaç duyulan kısımları çağıracağzı


var bodyParser = require('body-parser'); // Body Parser  gönderilen verileri okumak için gereklidir.
const res = require('express/lib/response');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = "8080";

var router = express.Router(); //path tanımlamaları için Express Router tipinde ve router adında bir değişken oluşturduk

//------------------------------------------Ortak satırların sonu-------------------------- 


//SQL BAĞLANTISI
const sql = require('mssql'); //mssql kütüphanesini çağır 

const mssqlconfig= {
    user: 'sa',
    password: '1234',
    server : 'DESKTOP-8M7D7GE',
    database : 'Insaat',
    options:{
        port:1433, //default sql portudur. Başka server'a bağlanılacağı zaman değişmesi gerekebilir.
        encrypt:false

    },
    pool:{
        max:20,
        min:5,
        idleTimeoutMillis:150000
    }
}
deleteCityFunction = async(req,res,next) => {

    const{CityID,}=req.body; // CityID,CityName adlı değişkenleri request body'si içine alalım.
    //ifadeyi pis tırnak içine yazalım ve ${} yazımı ile değişken değerini ifadeye yerleştirelim
    var sqlStatement = `DELETE City WHERE CityID = ${CityID}`
    console.log(sqlStatement);
    try 
    {
        await sql.connect(mssqlconfig);//function async olduğu için await diyebildik
        const result = await sql.query(sqlStatement);
        return res.status(200).json({"message":"İşlem Başarılı"});

    }
    catch(error)
    {
        return res.status(400).json({"message":error});
    }
}
router.delete('/deleteCity',deleteCityFunction)
app.use('/', router);
app.listen(port);
