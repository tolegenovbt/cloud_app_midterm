'use strict';
const { check, validationResult } = require("express-validator");
const express = require("express");
const { urlencoded } = require('express');
var urlencodedParser = urlencoded({ extended: false })
const CosmosClient = require('@azure/cosmos').CosmosClient;
const config = require("../config");
const { BlobServiceClient } = require('@azure/storage-blob');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const uuid  = require('uuid');
var urlencodedParser = urlencoded({ extended: false })

const router = express.Router();


const client = new CosmosClient({
    endpoint: config.host,
    key: config.authKey});
const database = client.database(config.databaseId);
const container = database.container(config.containerId);

router.post('/get', urlencodedParser,
async function (req, res){
    // query to return all items
    const querySpec = {
        query: "SELECT * from c WHERE c.name=@name",
        parameters: [
            {
                name: "@name",
                value: req.body.name
            }
        ]
    };
    
    const { resources: items } = await container.items
        .query(querySpec)
        .fetchAll();
    
    items[0].frontPhoto = `https://storbekzat.blob.core.windows.net/${config.storContainerName}/${items[0].frontPhoto}?${config.sas_token}`
    items[0].sidePhoto = `https://storbekzat.blob.core.windows.net/${config.storContainerName}/${items[0].sidePhoto}?${config.sas_token}`

    res.render('get-item', {
        title: 'Yachts',
        siteName: 'Yachts',
        item: items[0]
    })
    // res.render('enter-iin.ejs', {title: 'Getqr', action:'getqr'})
});

router.post('/list', urlencodedParser,
async (req, res) => {
    // query to return all items
    var quer = `SELECT c.name, c.frontPhotoThumb, c.sidePhotoThumb from c`
    if(req.body.lengthFullMin && req.body.lengthFullMax){
        quer+=` WHERE (c.lengthFull BETWEEN ${req.body.lengthFullMin} AND ${req.body.lengthFullMax})`
    }
    if(req.body.lengthFromWaterlineMin && req.body.lengthFromWaterlineMax){
        quer+=` AND (c.lengthFromWaterline BETWEEN ${req.body.lengthFromWaterlineMin} AND ${req.body.lengthFromWaterlineMax})`
    }
    if(req.body.widthMin && req.body.widthMax){
        quer+=` AND (c.width BETWEEN ${req.body.widthMin} AND ${req.body.widthMax})`
    }
    if(req.body.precipitationMin && req.body.precipitationMax){
        quer+=` AND (c.precipitation BETWEEN ${req.body.precipitationMin} AND ${req.body.precipitationMax})`
    }
    if(req.body.waterDisplacementMin && req.body.waterDisplacementMax){
        quer+=` AND (c.waterDisplacement BETWEEN ${req.body.waterDisplacementMin} AND ${req.body.waterDisplacementMax})`
    }
    if(req.body.engineMin && req.body.engineMax){
        quer+=` AND (c.engine BETWEEN ${req.body.engineMin} AND ${req.body.engineMax})`
    }
    if(req.body.sleepingPlacesMin && req.body.sleepingPlacesMax){
        quer+=` AND (c.sleepingPlaces BETWEEN ${req.body.sleepingPlacesMin} AND ${req.body.sleepingPlacesMax})`
    }
    if(req.body.waterTankVolumeMin && req.body.waterTankVolumeMax){
        quer+=` AND (c.waterTankVolume BETWEEN ${req.body.waterTankVolumeMin} AND ${req.body.waterTankVolumeMax})`
    }
    if(req.body.totalSailingAreaMin && req.body.totalSailingAreaMax){
        quer+=` AND (c.totalSailingAreaBETWEEN ${req.body.totalSailingAreaMin} AND ${req.body.totalSailingAreaMax})`
    }
    if(req.body.genoaMin && req.body.genoaMax){
        quer+=` AND (c.genoa BETWEEN ${req.body.genoaMin} AND ${req.body.genoaMax})`
    }
    // if(req.body.Min && req.body.Max){
    //     quer+=` AND (c. BETWEEN ${req.body.Min} AND ${req.body.Max})`
    // }

    console.log(quer)
    const querySpec = {
        query: quer
    };
    
    const { resources: items } = await container.items
        .query(querySpec)
        .fetchAll();
    items.forEach(function(item){
        item.frontPhotoThumb = `https://storbekzat.blob.core.windows.net/${config.storThumbContainerName}/${item.frontPhotoThumb}?${config.sas_token_thumb}`
        item.sidePhotoThumb = `https://storbekzat.blob.core.windows.net/${config.storThumbContainerName}/${item.sidePhotoThumb}?${config.sas_token_thumb}`
    })
    res.render('list', {
        title: 'List yachts',
        siteName: 'Yachts',
        items: items
    })
    res.send(items)
    res.render('enter-iin.ejs', {title: 'Getqr', action:'getqr'})
});

router.get('/list',
async function(req, res){
    // query to return all items
    const querySpec = {
        query: "SELECT c.name, c.frontPhotoThumb, c.sidePhotoThumb from c"
    };
    //     <img src="https://storbekzat.blob.core.windows.net/images/blobName.JPG?sp=r&st=2021-10-23T07:00:10Z&se=2021-10-30T15:00:10Z&sv=2020-08-04&sr=c&sig=2mOMJpkMS3V0KvF%2BwC7QZAe7ZygTszsvc2lBtMcBz2w%3D">
    const { resources: items } = await container.items
        .query(querySpec)
        .fetchAll();
    items.forEach(function(item){
        item.frontPhotoThumb = `https://storbekzat.blob.core.windows.net/${config.storThumbContainerName}/${item.frontPhotoThumb}?${config.sas_token_thumb}`
        item.sidePhotoThumb = `https://storbekzat.blob.core.windows.net/${config.storThumbContainerName}/${item.sidePhotoThumb}?${config.sas_token_thumb}`
    })
    console.log(items.length);
    res.render('list', {
        title: 'List yachts',
        siteName: 'Yachts',
        items: items
    })
});
router.get('/create', 
    async function(req, res) {
        res.render('create', {
            title: 'Add yacht',
            siteName: 'Yachts'
        })
    }
);
router.post('/create', urlencodedParser, upload.fields([{name:'frontPhoto', maxCount: 1}, {name:'sidePhoto', maxCount: 1}]),
async function (request, response){
    console.log(request.body)
    console.log(request.files)
    const blobServiceClient = BlobServiceClient.fromConnectionString(config.storage_connection_string);

    const containerName = config.storContainerName;

    const containerClient = blobServiceClient.getContainerClient(containerName);

    const frontPhotoName = request.files.frontPhoto[0].originalname;
    const sidePhotoName = request.files.sidePhoto[0].originalname;

    const blockBlobClient1 = containerClient.getBlockBlobClient(frontPhotoName);
    const blockBlobClient2 = containerClient.getBlockBlobClient(sidePhotoName);

    console.log('\nUploading to Azure storage as blob:\n\t', frontPhotoName, ' and ', sidePhotoName);

    const uploadBlobResponse1 = await blockBlobClient1.uploadFile(request.files.frontPhoto[0].path);
    const uploadBlobResponse2 = await blockBlobClient2.uploadFile(request.files.sidePhoto[0].path);

    request.body.frontPhoto = frontPhotoName;
    request.body.sidePhoto = sidePhotoName;
    request.body.frontPhotoThumb = 'Thumb'+frontPhotoName;
    request.body.sidePhotoThumb = 'Thumb'+sidePhotoName;
    const { resource: createdItem } = await container.items.create(request.body);
    response.send({success: true});
});


module.exports = router;
