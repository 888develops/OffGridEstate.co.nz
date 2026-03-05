const express = require('express');
const cors = require('cors');
const path = require('path');
const properties = require('./properties.json');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// API endpoint to get all properties or search/filter them
app.get('/api/properties', (req, res) => {
    let filteredProperties = [...properties];

    const { searchTerm, location, minPrice, maxPrice, minLandSize, maxLandSize, offGridFeature, propertyType } = req.query;

    if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        filteredProperties = filteredProperties.filter(property =>
            property.title.toLowerCase().includes(lowerCaseSearchTerm) ||
            property.location.toLowerCase().includes(lowerCaseSearchTerm) ||
            property.features.some(feature => feature.toLowerCase().includes(lowerCaseSearchTerm)) ||
            property.id.includes(lowerCaseSearchTerm)
        );
    }

    if (location) {
        filteredProperties = filteredProperties.filter(property =>
            property.location.toLowerCase().includes(location.toLowerCase())
        );
    }

    if (minPrice) {
        filteredProperties = filteredProperties.filter(property => property.price >= parseInt(minPrice));
    }

    if (maxPrice) {
        filteredProperties = filteredProperties.filter(property => property.price <= parseInt(maxPrice));
    }

    if (minLandSize) {
        filteredProperties = filteredProperties.filter(property => property.landSize >= parseInt(minLandSize));
    }

    if (maxLandSize) {
        filteredProperties = filteredProperties.filter(property => property.landSize <= parseInt(maxLandSize));
    }

    if (offGridFeature) {
        filteredProperties = filteredProperties.filter(property =>
            property.features.some(feature => feature.toLowerCase().includes(offGridFeature.toLowerCase()))
        );
    }

    if (propertyType) {
        filteredProperties = filteredProperties.filter(property =>
            property.type.toLowerCase() === propertyType.toLowerCase()
        );
    }

    res.json(filteredProperties);
});

// API endpoint to get a single property by ID
app.get('/api/properties/:id', (req, res) => {
    const property = properties.find(p => p.id === req.params.id);
    if (property) {
        res.json(property);
    } else {
        res.status(404).send('Property not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
