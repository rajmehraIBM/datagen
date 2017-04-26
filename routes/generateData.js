'use strict';
var Chance = require('chance');

var chance = new Chance();

var defaultSpec= require('../config/spec');

var seqArray =[];

var generateData = function(spec){
    if (!spec) {
        spec = defaultSpec;
    }

    var rowCount = spec.dataFile.count;
    var delimiter = spec.dataFile.delimiter;
    var colCount = spec.dataFile.columns.length;
    var genSql = false;
    var schema = "BLUADMIN";
    var table = "default";
    var colArray = [];
    var hdrArray = [];
    var rowArray = [];
    var i = 0; 
    var j = 0;
    if (spec.dataFile.target && spec.dataFile.target== 'sql') {
        genSql = true;
    }
    if (spec.dataFile.schema) {
        schema = spec.dataFile.schema;
    }
    if (spec.dataFile.filename) {
        table = spec.dataFile.filename;
    }


    for (i=0; i < colCount; i++){
        colArray[i]=spec.dataFile.columns[i].name;
        hdrArray[i]=spec.dataFile.columns[i].name;
        seqArray[i]=1;
        if((spec.dataFile.columns[i].type == 'seq' || spec.dataFile.columns[i].type == 'prefixseq' ) && spec.dataFile.columns[i].start ) {
            seqArray[i] = spec.dataFile.columns[i].start;
        }
    } 

    if (genSql) {

       rowArray[0] = '-- Generated SQL to create data';
    }
    else {
        rowArray[0] = colArray.join(delimiter);
    }


    for (j=0; j < rowCount; j++) {
        colArray = [];
        for (i=0; i < colCount; i++){
            colArray[i] = generateColumn(spec.dataFile.columns[i], i);
        }
        if (genSql) {
 //           rowArray[j+1] = `INSERT INTO ${schema}.${table} ( ${hdrArray.join(', ')}) `
 //                           + `VALUES ('${colArray.join('\', \'')}');`;
            rowArray[j+1] = `INSERT INTO ${schema}.${table} ( ${hdrArray.join(', ')}) `
                            + `VALUES (${processKeywords(colArray)});`;

        }
        else {
            rowArray[j+1] = colArray.join(delimiter);
        } 


    }

 //   console.log(rowArray.join('\n'));
    return (rowArray.join('\n'));

}

function processKeywords(strArray){
    var retString = '';
    var quote = '\'';

        for (let i =0; i < strArray.length ; i++) { 
            var fld = strArray[i];
            if (fld != 'NULL'){
                fld = quote + fld + quote;
            }
            if (i+1 == strArray.length) {
                retString = retString + fld;
            }
            else {
                retString = retString + fld + ', ';
            }
        }
    return retString;
}

function generateColumn(columnSpec, index){
    var colValue ;

    var colType = columnSpec.type;

    switch(colType) {
        case 'constant' : 
            colValue = columnSpec.value;
            break;
        case 'seq' : 
            colValue = seqArray[index]++;
            if (columnSpec.end && seqArray[index] > columnSpec.end) {
                seqArray[index] = 1;
                if (columnSpec.start){
                    seqArray[index] = columnSpec.start;
                }
            }
            break;         
        case 'address' : 
            colValue = chance.address();
            break;   
        case 'pickone' : 
            colValue = chance.pickone(columnSpec.pickValues);
            break;
        case 'name' : 
            colValue = chance.name();
            break;
        case 'email' : 
            colValue = chance.email();
            break;
        case 'phone' : 
            colValue = chance.phone();
            break;
        case 'natural' : 
            let minNatural = 0;
            let maxNatural = 9007199254740992;
            if (columnSpec.min) {
                minNatural = columnSpec.min;
            } ;
             if (columnSpec.max) {
                maxNatural = columnSpec.max;
            } ; 
            let  naturalRange = {
                "min": minNatural,
                "max": maxNatural
            }         
            colValue = chance.natural(naturalRange);
            break;
        case 'paragraph' : 
            colValue = chance.paragraph();
            break;
        case 'sentence' : 
            colValue = chance.sentence();
            break;
        case 'last' : 
            colValue = chance.last();
            break;
        case 'first' : 
            colValue = chance.first();
            break;  
        case 'prefixseq' : 
            let prefix = 'sample';
            if (columnSpec.prefix) {
                prefix = columnSpec.prefix;
            }
            colValue = prefix + seqArray[index]++;
            if (columnSpec.end && seqArray[index] > columnSpec.end) {
                seqArray[index] = 1;
                if (columnSpec.start){
                    seqArray[index] = columnSpec.start;
                }
            }
            break;    
        default :
             colValue = 'undefined';       
    }

    return colValue;
}

module.exports = generateData;