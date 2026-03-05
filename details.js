// details.js

document.addEventListener('DOMContentLoaded', async () => {
    const propertyTitle = document.getElementById('property-title');
    const propertyLocation = document.getElementById('property-location');
    const propertyPrice = document.getElementById('property-price');
    const keyFactsContainer = document.getElementById('key-facts');
    const propertyDescription = document.getElementById('property-description');
    const propertyFeaturesList = document.getElementById('property-features');
    const propertyGallery = document.getElementById('property-gallery');
    const thumbnailGallery = document.getElementById('thumbnail-gallery');
    const detailMapElement = document.getElementById('detail-map');

    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id');

    if (!propertyId) {
        propertyTitle.textContent = 'Error: Property ID not found.';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/properties/${propertyId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const property = await response.json();

        if (property) {
            // Update property header
            propertyTitle.textContent = property.title;
            document.getElementById('property-subtitle').textContent = property.description ? property.description.substring(0, 100) + '...' : 'Beautiful off-grid property';
            propertyLocation.textContent = property.location;
            propertyPrice.textContent = `$${property.price.toLocaleString()}`;

            // Update key facts with new layout
            let keyFactsHtml = '';
            if (property.bedrooms) keyFactsHtml += `<div class="property-fact"><span class="property-fact-value">${property.bedrooms}</span><span class="property-fact-label">Bedrooms</span></div>`;
            if (property.bathrooms) keyFactsHtml += `<div class="property-fact"><span class="property-fact-value">${property.bathrooms}</span><span class="property-fact-label">Bathrooms</span></div>`;
            if (property.garages) keyFactsHtml += `<div class="property-fact"><span class="property-fact-value">${property.garages}</span><span class="property-fact-label">Garages</span></div>`;
            if (property.landSize) keyFactsHtml += `<div class="property-fact"><span class="property-fact-value">${property.landSize}</span><span class="property-fact-label">acres</span></div>`;
            if (property.type) keyFactsHtml += `<div class="property-fact"><span class="property-fact-value">${property.type}</span><span class="property-fact-label">Type</span></div>`;
            keyFactsContainer.innerHTML = keyFactsHtml;

            // Update description and features
            propertyDescription.textContent = property.description;
            propertyFeaturesList.innerHTML = property.features.map(feature => `<div class="feature-item">${feature}</div>`).join('');

            // Handle image gallery
            if (property.images && property.images.length > 0) {
                const mainImage = document.getElementById('main-image');
                mainImage.src = property.images[0];
                mainImage.alt = property.title;

                thumbnailGallery.innerHTML = property.images.map((img, index) => `
                    <img src="${img}" alt="${property.title} thumbnail ${index + 1}" class="thumbnail ${index === 0 ? 'active' : ''}" data-src="${img}">
                `).join('');

                thumbnailGallery.addEventListener('click', (e) => {
                    if (e.target.tagName === 'IMG' && e.target.classList.contains('thumbnail')) {
                        mainImage.src = e.target.dataset.src;
                        thumbnailGallery.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
                        e.target.classList.add('active');
                    }
                });
            } else {
                const mainImage = document.getElementById('main-image');
                mainImage.src = 'https://via.placeholder.com/1200x600/ccc/white?text=No+Images+Available';
            }

            // Initialize map for this property
            if (property.latitude && property.longitude) {
                const detailMap = L.map(detailMapElement).setView([property.latitude, property.longitude], 13); // Zoom closer

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(detailMap);

                L.marker([property.latitude, property.longitude]).addTo(detailMap)
                    .bindPopup(`<b>${property.title}</b><br>${property.location}`).openPopup();
            }

        } else {
            propertyTitle.textContent = 'Property not found.';
            propertyDetailsContainer.innerHTML = '<p>The requested property could not be found.</p>';
        }
    } catch (error) {
        console.error('Error fetching property details:', error);
        propertyTitle.textContent = 'Error loading property details.';
        propertyDetailsContainer.innerHTML = '<p>There was an error loading property details. Please try again later.</p>';
    }
});
