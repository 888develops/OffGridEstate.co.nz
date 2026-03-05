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

    const mockProperties = [
        {
            id: "L001",
            title: "Aoraki Alpine Station &mdash; 2,500 acre high-country holding",
            location: "Aoraki / Mount Cook, Canterbury",
            price: 2250000,
            landSize: 2500,
            type: "land",
            features: ["glacier-fed rivers", "high-country grazing", "heli-access ridgelines"],
            bedrooms: 0,
            bathrooms: 0,
            images: ["./assets/land-alpine-valley.png"]
        },
        {
            id: "L002",
            title: "Te Manawa Tussock Run &mdash; 1,800 acre backcountry station",
            location: "Maniototo, Central Otago",
            price: 1800000,
            landSize: 1800,
            type: "land",
            features: ["big sky vistas", "tussock plains", "off-grid potential"],
            bedrooms: 0,
            bathrooms: 0,
            images: ["./assets/land-tussock-run.png"]
        },
        {
            id: "H001",
            title: "Lupin Ridge Stone Cottage &mdash; lakeside off-grid retreat",
            location: "Lake Tekapo, Canterbury",
            price: 1150000,
            landSize: 15,
            type: "house",
            features: ["solar and battery bank", "wood-fired range", "lupin meadow outlook"],
            bedrooms: 3,
            bathrooms: 2,
            images: ["./assets/cottage-lupin-ridge.png"]
        },
        {
            id: "H002",
            title: "Queenstown Homestead Outlook &mdash; alpine-edge family base",
            location: "Queenstown, Otago",
            price: 1650000,
            landSize: 5,
            type: "house",
            features: ["established gardens", "mountain backdrop", "grid-tied with solar assist"],
            bedrooms: 4,
            bathrooms: 2,
            images: ["./assets/homestead-queenstown-outlook.png"]
        }
    ];

    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id');

    if (!propertyId) {
        propertyTitle.textContent = 'Error: Property ID not found.';
        return;
    }

    function findMockProperty(id) {
        return mockProperties.find(p => p.id === id);
    }

    function updatePage(property) {
        if (!property) {
            propertyTitle.textContent = 'Property not found.';
            return;
        }

        propertyTitle.textContent = property.title;
        const subtitleEl = document.getElementById('property-subtitle');
        if (subtitleEl) {
            subtitleEl.textContent = property.description
                ? property.description.substring(0, 110) + '...'
                : 'Beautiful off-grid property in ' + (property.location || 'New Zealand');
        }
        propertyLocation.textContent = property.location || '';
        if (typeof property.price === 'number') {
            propertyPrice.textContent = `$${property.price.toLocaleString()}`;
        } else {
            propertyPrice.textContent = '';
        }

        let keyFactsHtml = '';
        if (property.bedrooms) keyFactsHtml += `<div class="property-fact"><span class="property-fact-value">${property.bedrooms}</span><span class="property-fact-label">Bedrooms</span></div>`;
        if (property.bathrooms) keyFactsHtml += `<div class="property-fact"><span class="property-fact-value">${property.bathrooms}</span><span class="property-fact-label">Bathrooms</span></div>`;
        if (property.garages) keyFactsHtml += `<div class="property-fact"><span class="property-fact-value">${property.garages}</span><span class="property-fact-label">Garages</span></div>`;
        if (property.landSize) keyFactsHtml += `<div class="property-fact"><span class="property-fact-value">${property.landSize}</span><span class="property-fact-label">acres</span></div>`;
        if (property.type) keyFactsHtml += `<div class="property-fact"><span class="property-fact-value">${property.type}</span><span class="property-fact-label">Type</span></div>`;
        keyFactsContainer.innerHTML = keyFactsHtml;

        propertyDescription.textContent = property.description || 'This is a mock description for an off-grid property showcased in the demo experience.';
        if (Array.isArray(property.features) && property.features.length > 0) {
            propertyFeaturesList.innerHTML = property.features.map(feature => `<div class="feature-item">${feature}</div>`).join('');
        } else {
            propertyFeaturesList.innerHTML = '<div class="feature-item">Solar-ready or renewable power potential</div><div class="feature-item">Abundant rainwater collection opportunities</div>';
        }

        if (property.images && property.images.length > 0) {
            const mainImage = document.getElementById('main-image');
            mainImage.src = property.images[0];
            mainImage.alt = property.title;

            if (thumbnailGallery) {
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
            }
        } else {
            const mainImage = document.getElementById('main-image');
            mainImage.src = 'https://via.placeholder.com/1200x600/ccc/white?text=No+Images+Available';
        }

        if (property.latitude && property.longitude && typeof L !== 'undefined') {
            const detailMap = L.map(detailMapElement).setView([property.latitude, property.longitude], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(detailMap);

            L.marker([property.latitude, property.longitude]).addTo(detailMap)
                .bindPopup(`<b>${property.title}</b><br>${property.location}`).openPopup();
        }

        setupDetailActions(property);
    }

    function setupDetailActions(property) {
        const saveBtn = document.querySelector('.property-actions .save-btn');
        const shareBtn = document.querySelector('.property-actions .share-btn');
        const emailBtn = document.querySelector('.property-actions .email-btn');
        const requestBuyBtn = document.querySelector('.property-actions .request-buy-btn');
        const agentCard = document.querySelector('.agent-card');
        const contactForm = document.querySelector('.contact-form');

        if (saveBtn) {
            saveBtn.addEventListener('click', function () {
                const savedRaw = localStorage.getItem('savedProperties');
                const saved = savedRaw ? JSON.parse(savedRaw) : [];
                if (!saved.includes(property.id)) {
                    saved.push(property.id);
                    localStorage.setItem('savedProperties', JSON.stringify(saved));
                }

                const originalText = saveBtn.textContent;
                saveBtn.textContent = 'Saved';
                saveBtn.style.background = 'var(--accent-green)';
                saveBtn.style.color = 'var(--cream)';
                setTimeout(() => {
                    saveBtn.textContent = originalText;
                    saveBtn.style.background = '';
                    saveBtn.style.color = '';
                }, 2000);
            });
        }

        if (shareBtn) {
            shareBtn.addEventListener('click', async function () {
                const shareData = {
                    title: property.title || 'Off-Grid Estate NZ property',
                    text: property.location ? `${property.title} — ${property.location}` : property.title,
                    url: window.location.href
                };
                try {
                    if (navigator.share) {
                        await navigator.share(shareData);
                    } else if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard.');
                    } else {
                        window.prompt('Copy this link to share:', window.location.href);
                    }
                } catch (e) {
                    console.error('Error sharing listing', e);
                }
            });
        }

        if (emailBtn) {
            emailBtn.addEventListener('click', function () {
                const subject = `Enquiry about ${property.title || 'off-grid property'} (Ref ${property.id})`;
                const body = `Hi,\n\nI would like to enquire about ${property.title || 'this property'} in ${property.location || 'New Zealand'} (Reference: ${property.id}).\n\nSent via Off-Grid Estate NZ demo.`;
                window.location.href = `mailto:hello@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            });
        }

        if (agentCard) {
            const callBtn = agentCard.querySelector('.btn-primary');
            const agentEmailBtn = agentCard.querySelector('.btn-secondary');
            if (callBtn) {
                callBtn.addEventListener('click', function () {
                    window.location.href = 'tel:+6400000000';
                });
            }
            if (agentEmailBtn) {
                agentEmailBtn.addEventListener('click', function () {
                    const subject = `Enquiry about ${property.title || 'off-grid property'} (Ref ${property.id})`;
                    window.location.href = `mailto:hello@example.com?subject=${encodeURIComponent(subject)}`;
                });
            }
        }

        const contactMessage = document.getElementById('contact-message');
        if (requestBuyBtn && contactMessage) {
            requestBuyBtn.addEventListener('click', function () {
                contactMessage.value = `I would like to submit a request to buy ${property.title || 'this property'} (Ref ${property.id}). Please contact me with next steps.`;
                contactMessage.scrollIntoView({ behavior: 'smooth' });
            });
        }

        if (contactForm) {
            const feedbackId = 'detail-contact-feedback';
            let feedback = document.getElementById(feedbackId);
            if (!feedback) {
                feedback = document.createElement('p');
                feedback.id = feedbackId;
                feedback.style.marginTop = '8px';
                feedback.style.color = '#4b5563';
                feedback.style.fontSize = '0.9em';
                contactForm.appendChild(feedback);
            }

            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const name = document.getElementById('contact-name')?.value || '';
                const email = document.getElementById('contact-email')?.value || '';
                const phone = document.getElementById('contact-phone')?.value || '';
                const message = document.getElementById('contact-message')?.value || '';

                const existingRaw = localStorage.getItem('ogPurchaseRequests');
                const existing = existingRaw ? JSON.parse(existingRaw) : [];
                existing.push({
                    propertyId: property.id,
                    propertyTitle: property.title,
                    name,
                    email,
                    phone,
                    message,
                    createdAt: new Date().toISOString()
                });
                localStorage.setItem('ogPurchaseRequests', JSON.stringify(existing));

                feedback.textContent = 'Thank you — your message has been recorded in this demo. In a real launch this would be sent to the listing agent.';
                contactForm.reset();
            });
        }
    }

    try {
        let property = null;
        try {
            const response = await fetch(`http://localhost:3000/api/properties/${propertyId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            property = await response.json();
        } catch (serverError) {
            property = findMockProperty(propertyId);
        }
        updatePage(property);
    } catch (error) {
        console.error('Error loading property details:', error);
        propertyTitle.textContent = 'Error loading property details.';
    }
});

