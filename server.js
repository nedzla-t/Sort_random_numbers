const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

// POST method for sorting numbers
app.post('/sort-numbers', (req, res) => {
    const { numbers } = req.body;
    if (!Array.isArray(numbers)) {
        return res.status(400).send({ message: 'Invalid input, expected an array of numbers' });
    }
    // Bubble sort algorithm for numbers
    function bubbleSort(arr) {
        let z = arr.length;
        for(let x = 0; x < z - 1; x++) {
            for(let y = 0; y < z - 1 - x; y++) {
                if(arr[y] > arr[y + 1]) {
                    // Swap the elements
                    let temp = arr[y];
                    arr[y] = arr[y + 1];
                    arr[y +1] = temp;
                }
            }
        }
        return arr;
    }

    const sortedNumbers = bubbleSort(numbers);
    res.json(sortedNumbers);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});