const data = {
    query: "headache, fever"
}

const response = await fetch(`http://192.168.43.122:5000/ocr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

const res = await response.json();
console.log(res);