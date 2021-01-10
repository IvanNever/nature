const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());

const toursData = `${__dirname}/dev-data/data/tours-simple.json`;

const tours = JSON.parse(fs.readFileSync(toursData));

//GET all tours
app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours,
        },
    });
});

//GET the tour
app.get('/api/v1/tours/:id', (req, res) => {
    const id = +req.params.id;
    const tour = tours.find((el) => el.id === id);

    if (!tour) {
        return res
            .status(404)
            .json({ status: 'fail', message: 'invalid ID' });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    });
});

//CREATE the new tour
app.post('/api/v1/tours', (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);
    fs.writeFile(toursData, JSON.stringify(tours), (err) => {
        res.status(201).json({
            status: 'success',
            data: { tour: newTour },
        });
    });
});

//UPDATE the tour
app.patch('/api/v1/tours/:id', (req, res) => {
    if (+req.params.id > tours.length) {
        return res
            .status(404)
            .json({ status: 'fail', message: 'invalid ID' });
    }

    res.status(200).json({
        status: 'success',
        data: { tour: '<Updated tour here>' },
    });
});

//DELETE the tour
app.delete('/api/v1/tours/:id', (req, res) => {
    if (+req.params.id > tours.length) {
        return res
            .status(404)
            .json({ status: 'fail', message: 'invalid ID' });
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
