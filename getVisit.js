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
getVisitFunction = async(req,res,next)=>{


    
    //try-catch blokları hata durumunda programın nasıl davranacağını belirler.
    //try içine yazılması istenen kodlar yerleştirili;catch içine ise hata olması durumunda yapılacak 
    //olan işlem yazılır.
    //hata oluşursa otomatik olarak catch blokunun içine düşer. Bu şekilde yazılmazasa hata halinde orada çakılır.
    try 
    {
        await sql.connect(mssqlconfig);//function async olduğu için await diyebildik
        const result = await sql.query( ` SELECT V.VisitID , V.VisitDate,V.Notes, C.CustomerName + ' ' + C.CustomerSurname AS CustomerFullName , P.ProjectName ,V.CreationDate FROM Visit AS V
        LEFT JOIN Customer AS C ON C.CustomerID = V.CustomerID
        LEFT JOIN Project AS P ON V.ProjectID = P.ProjectID
        ORDER BY V.CreationDate`);
        return res.status(200).json([{VisitTable:result.recordsets[0]}]);

    }
    catch(error)
    {
        return res.status(400).json({"message":error});


    }
}
router.get('/getVisit', getVisitFunction);
app.use('/', router); //router'ı aktive edelim
app.listen(port);