import * as JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import { saveAs } from 'file-saver';
import { Download } from 'components/icons';

export function downloadPackage(urls, fileName, elementId) {
  var zip = new JSZip();
  var count = 0;
  var zipFilename = `${fileName}.zip`;

  toggleElement(elementId);

  urls.forEach(function (url) {
    var filename = url.split('/')[url.split('/').length - 1];
    // loading a file and add it in a zip file
    JSZipUtils.getBinaryContent(url, function (err, data) {
      if (err) {
        toggleElement(elementId)
        throw err; // or handle the error        
      }
      zip.file(filename, data, { binary: true });
      count++;
      if (count == urls.length) {
        zip.generateAsync({ type: 'blob' }).then(function (content) {
          saveAs(content, zipFilename);
          toggleElement(elementId);
        });
      }
    });
  });

  return null;
}

function toggleElement(elementId) {

  
  if(document.getElementById(elementId).innerHTML == "Download Dataset"){
    document.getElementById(elementId).innerHTML = "Downloading ..."
  } else {
    document.getElementById(elementId).innerHTML = "Download Dataset";
  }

  document.getElementById(elementId).classList.toggle('disableDownload');
}