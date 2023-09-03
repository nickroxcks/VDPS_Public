export const downloadFromURL = (url: string, fileName: string) => {
  fetch(url, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  })
    .then((resp) => resp.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(() => alert(`Had issues downloading the ${fileName}`));
};
