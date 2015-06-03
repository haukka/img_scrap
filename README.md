img_scrap
=========

The project consist to scrap all the pictures from a single page with a given width and height.
The front part isn't finish yet and can be updated later.
The project will scrap all the picture from the pages in several steps :

1) Make a request call by giving the specific url

2) Cheerio will recup all the elements from the DOM

3) All the elements which contains the tags img will be taken

4) All the pictures which contains extension such as .png, .jpg or .jpeg will be stored into a directory

5) An event will be launched and open the navigator "google chrome"

6) All the pictures from the directory will be sent to the front page thanks to the Socket.io
