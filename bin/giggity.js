#!/usr/bin/env node

// # node-giggity

var path        = require('path')
  , giggity     = path.join(__dirname, 'giggity.wav')
  , pictureTube = require('picture-tube')
  , _           = require('underscore')
  , request     = require('request')
  , googl       = require('goo.gl')
  , colors      = require('colors')
  , play        = require('play')

// auto-detect width of terminal
var cols = (process.stdout.getWindowSize()[0] / 2)

var tube = pictureTube({ cols: cols })
tube.pipe(process.stdout)

// make quagmire go giggity with audio
tube.on('end', function() {
  play.sound(giggity)
  googl.shorten(q.img, showLink)
})

function center(text, len) {
  len = len || text.length
  var space = (cols - len) / 2
  for(var i=0;i<space;i+=1) {
    text = ' ' + text
  }
  return text
}

// show the googl url shortened img link
function showLink(url) {
  console.info()
  if (typeof url === 'object' && url.id) {
    var text    = 'image: ' + url.id
      , newText = text.split(' ')
    newText[0] = newText[0].red
    newText[1] = newText[1].underline.cyan
    newText = newText.join(' ')
    console.info(center(newText, text.length))
  } else {
    console.info(center('image:'.grey + ' ' + q.img.underline))
  }
}

// prevent play.js from emitting output
console.log = function() {}

// generate a random page # between 1-10
function randomPage() {
  return Math.floor(Math.random() * 10) + parseFloat(1)
}

// prepare the query
var q = {
    url  : 'https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=pictures+of+quagmire+filetype:png&imgtype:photo&filter=1&imgsz=medium&start=1'
  , json : true
  , img  : ''
}

// giggity goo!
getQuagmire()

// get quagmire
function getQuagmire() {
  q.url = q.url.substring(0, q.url.length - 1)
  q.url += randomPage()
  request(q, p)
}

// TODO: we should check to make sure the image doesn't 404
//  which might require us having to patch picture-tube
//  then we'd simply run getQuagmire() if an err occured

// pipe the image to tube
function p(error, response, body) {
  if (error) throw new Error('giggity image lookup failed, oops!')
  var results = body.responseData.results
  q.img = _.shuffle(results)[0].unescapedUrl
  request(q.img).pipe(tube)
}

