const fs = require('fs');
const db = require('../db.js');

fs.readFile(process.argv[2], 'utf8', async (err, data) => {
    let dataSplit = data.split('\n');
    for(let i=1; i<dataSplit.length; i++) {
        let data = formatString(dataSplit[i]);
        let artId = data.match(/(".*?"|[^";]+)(?=\s*;|\s*$)/g)[0];
        let artArtist = data.match(/(".*?"|[^";]+)(?=\s*;|\s*$)/g)[2];
        let artTitle = data.match(/(".*?"|[^";]+)(?=\s*;|\s*$)/g)[5];
        let artYear = data.match(/(".*?"|[^";]+)(?=\s*;|\s*$)/g)[9];
        //If no year set to 0
        artYear = artYear == ' ' ? 0 : artYear;
        try {
            let insertMessage = await db.query(`INSERT INTO art (artId, title, artist, year) VALUES (?, ?, ?, ?)`,[artId, artTitle, artArtist, artYear]);
        } catch(err) {
            console.log(err);
            process.exit();
        }

    }
    console.log("All data loaded successfully");
    process.exit();
});

const formatString = (inputString) => {
    let returnString = "";
    for(let i=0; i<inputString.length; i++) {
        if(inputString[i] == ';') {
            returnString += ';';
            if((i + 1) < inputString.length) {
                if(inputString[i + 1] == ';') {
                    returnString += " ";
                }
            }
        } else {
            returnString += inputString[i];
        }
    }
    return returnString;
}