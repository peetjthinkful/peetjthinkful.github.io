---
layout: post
title: "google-store-locator"
date: 2014-03-14 01:51:58 +1100
comments: true
categories:
customcss:
 - item: /stylesheets/map.css
customcdnjs:
 - item: http://code.jquery.com/jquery-1.10.1.min.js
 - item: http://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.3.0/handlebars.min.js
 - item: http://maps.google.com/maps/api/js?sensor=false
customjs:
 - item: /javascripts/libs/jquery.storelocator.js
 - item: /javascripts/main.js
---

<div id="store-locator-container">
  <div id="page-header">
    <h1>Speed Cameras in and around NSW</h1>

    <p style="width:600px;font-size:1.3em;">
    One of my students at <a href="http://www.thinkful.com">Thinkful</a> wanted to knock up a site utilising the Google Store API. We decided that the easiest way was to use a great jQuery plugin by Bjorn Holine called (not surprisingly) the <a href="http://www.bjornblog.com/web/jquery-store-locator-plugin">jquery-store-locator-plugin</a>.

    So I came up with a speed camera locator for NSW. I had to do a bit of tweaking to the plugin code plus some resource injection for this Octopress post. It took a fair few hours but hopefully the result was worth it. The source data was obtained from the <a href="http://data.gov.au">Australian Government</a>.
    </p>

    <p style="font-size:1.4em;font-weight:bold">Type in a street name in NSW:</p>
  </div>

  <div id="form-container">
    <form id="user-location" method="post" action="#">
        <div id="form-input">
          <label for="address">Enter Address:</label>
          <input type="text" id="address" name="address" />
          <select id="category">
            <option val="40">Up to 40 km/h</option>
            <option val="50">Up to 50 km/h</option>
            <option val="60">Up to 60 km/h</option>
            <option val="70">Up to 70 km/h</option>
            <option val="80">Up to 80 km/h</option>
            <option val="90">Up to 90 km/h</option>
            <option val="100">Up to 100 km/h</option>
            <option val="110">Up to 110 km/h</option>
          </select>
         </div>
        <button id="submit" type="submit">Submit</button>
    </form>
  </div>

  <div id="map-container">
    <div id="loc-list">
        <ul id="list"></ul>
    </div>
    <div id="map"></div>
  </div>
</div>
