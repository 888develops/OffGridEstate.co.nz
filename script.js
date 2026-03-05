// script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('Off-Grid Estate NZ website loaded!');

    const listingsContainer = document.querySelector('.listings');
    const mapElement = document.getElementById('map');

    // Initialize the map
    let map = L.map(mapElement).setView([-40.9006, 174.8860], 5); // Center of New Zealand

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    let markers = L.featureGroup().addTo(map);

    async function fetchProperties(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`http://localhost:3000/api/properties?${queryString}`);
        const properties = await response.json();
        displayProperties(properties);
    }

    function displayProperties(properties) {
        listingsContainer.innerHTML = '<h2>Property Listings</h2>';
        markers.clearLayers(); // Clear existing markers

        if (properties.length === 0) {
            listingsContainer.innerHTML += '<p>No properties found matching your criteria.</p>';
            return;
        }

        properties.forEach(property => {
            const propertyCard = `
                <div class="property-card">
                    <h3>${property.title}</h3>
                    <p>Location: ${property.location}</p>
                    <p>Price: $${property.price.toLocaleString()}</p>
                    <p>Land Size: ${property.landSize} acres</p>
                    <p>Features: ${property.features.join(', ')}.</p>
                    <button data-id="${property.id}">View Details</button>
                </div>
            `;
            listingsContainer.innerHTML += propertyCard;

            // Add marker to map
            if (property.latitude && property.longitude) {
                const marker = L.marker([property.latitude, property.longitude]).addTo(markers);
                marker.bindPopup(`<b>${property.title}</b><br>${property.location}<br>$${property.price.toLocaleString()}`);
            }
        });

        // Adjust map view to fit all markers
        if (properties.length > 0) {
            map.fitBounds(markers.getBounds());
        }
    }

    // Handle "View Details" button clicks
    listingsContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' && e.target.dataset.id) {
            const propertyId = e.target.dataset.id;
            window.location.href = `details.html?id=${propertyId}`;
        }
    });

    // Initial fetch of properties
    fetchProperties();

    // Featured Properties Carousel
    let currentSlide = 0;
    let carouselTrack, carouselWrapper, carouselPrev, carouselNext;
    const cardWidth = 340; // 320px card + 20px gap
    let visibleCards = 3; // Number of cards visible at once

    // Initialize carousel elements
    function initializeCarouselElements() {
        carouselTrack = document.getElementById('carousel-track');
        carouselWrapper = document.getElementById('carousel-wrapper');
        carouselPrev = document.getElementById('carousel-prev');
        carouselNext = document.getElementById('carousel-next');

        console.log('Carousel elements found:');
        console.log('carouselTrack:', carouselTrack);
        console.log('carouselWrapper:', carouselWrapper);
        console.log('carouselPrev:', carouselPrev);
        console.log('carouselNext:', carouselNext);
        
        // Check if carousel elements exist
        if (!carouselTrack) {
            console.error('carousel-track element not found!');
        }
        if (!carouselWrapper) {
            console.error('carousel-wrapper element not found!');
        }
    }

    // Update visible cards based on screen size
    function updateVisibleCards() {
        const screenWidth = window.innerWidth;
        if (screenWidth < 768) {
            visibleCards = 1;
        } else if (screenWidth < 1024) {
            visibleCards = 2;
        } else {
            visibleCards = 3;
        }
    }

    // Load featured properties for carousel
    async function loadFeaturedProperties() {
        console.log('Loading featured properties...');
        try {
            // Try to fetch from server first, fallback to local data
            let properties;
            try {
                const response = await fetch('/api/properties');
                properties = await response.json();
                console.log('Fetched properties from server:', properties);
            } catch (serverError) {
                console.log('Server not available, using local data');
                // Fallback to local mock data
                properties = [
                    {
                        id: "001",
                        title: "Scenic Off-Grid Retreat",
                        location: "Northland",
                        price: 450000,
                        landSize: 10,
                        features: ["solar power", "rainwater harvesting", "established orchard"],
                        bedrooms: 3,
                        bathrooms: 2,
                        images: ["https://via.placeholder.com/380x280/2d5016/ffffff?text=Luxury+Eco+Property+1"]
                    },
                    {
                        id: "002",
                        title: "Sustainable Farmlet Opportunity",
                        location: "Waikato",
                        price: 620000,
                        landSize: 25,
                        features: ["permaculture gardens", "composting systems", "natural spring water"],
                        bedrooms: 4,
                        bathrooms: 3,
                        images: ["https://via.placeholder.com/380x280/4a7c59/ffffff?text=Luxury+Eco+Property+2"]
                    },
                    {
                        id: "003",
                        title: "Coastal Eco-Section",
                        location: "Coromandel",
                        price: 300000,
                        landSize: 5,
                        features: ["ocean views", "native bush", "potential for tiny home"],
                        bedrooms: 2,
                        bathrooms: 1,
                        images: ["https://via.placeholder.com/380x280/6b8e23/ffffff?text=Luxury+Eco+Property+3"]
                    },
                    {
                        id: "004",
                        title: "Mountain View Homestead",
                        location: "Otago",
                        price: 800000,
                        landSize: 50,
                        features: ["hydro power", "large gardens", "barn"],
                        bedrooms: 5,
                        bathrooms: 4,
                        images: ["https://via.placeholder.com/380x280/8b4513/ffffff?text=Luxury+Eco+Property+4"]
                    },
                    {
                        id: "005",
                        title: "Forest Sanctuary",
                        location: "Bay of Plenty",
                        price: 550000,
                        landSize: 15,
                        features: ["solar panels", "rainwater collection", "organic gardens"],
                        bedrooms: 3,
                        bathrooms: 2,
                        images: ["https://via.placeholder.com/380x280/a8c09a/ffffff?text=Luxury+Eco+Property+5"]
                    },
                    {
                        id: "006",
                        title: "Riverside Eco-Lodge",
                        location: "Auckland",
                        price: 750000,
                        landSize: 20,
                        features: ["river access", "sustainable materials", "energy efficient"],
                        bedrooms: 4,
                        bathrooms: 3,
                        images: ["https://via.placeholder.com/380x280/d4af37/ffffff?text=Luxury+Eco+Property+6"]
                    }
                ];
            }
            console.log('Properties to display:', properties.slice(0, 6));
            displayFeaturedProperties(properties.slice(0, 6)); // Show first 6 as featured
        } catch (error) {
            console.error('Error loading featured properties:', error);
        }
    }

    function createFeaturedPropertyCard(property) {
        // Generate off-grid rating (1-5 stars)
        const offGridRating = Math.floor(Math.random() * 3) + 3; // 3-5 stars
        const stars = '★'.repeat(offGridRating) + '☆'.repeat(5 - offGridRating);
        
        return `
            <div class="featured-property-card" data-id="${property.id}">
                <img src="${property.images?.[0] || 'https://via.placeholder.com/380x280/2d5016/ffffff?text=Luxury+Eco+Property'}" 
                     alt="${property.title}" 
                     class="featured-property-image">
                <div class="featured-property-content">
                    <h3 class="featured-property-title">${property.title}</h3>
                    <div class="featured-property-location">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        ${property.location}
                    </div>
                    <div class="off-grid-rating">
                        <div class="rating-stars">${stars}</div>
                        <span class="rating-text">Off-Grid ${offGridRating}/5</span>
                    </div>
                    <div class="featured-property-price">$${property.price.toLocaleString()}</div>
                    <div class="featured-property-details">
                        <div class="featured-property-detail">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            </svg>
                            ${property.bedrooms || 0} bed
                        </div>
                        <div class="featured-property-detail">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2-2z"></path>
                            </svg>
                            ${property.bathrooms || 0} bath
                        </div>
                        <div class="featured-property-detail">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            </svg>
                            ${property.landSize} acres
                        </div>
                        <div class="featured-property-detail">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                            </svg>
                            Eco-Luxury
                        </div>
                    </div>
                    <div class="featured-property-features">
                        ${property.features.slice(0, 3).map(feature => 
                            `<span class="featured-property-feature">${feature}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    function displayFeaturedProperties(properties) {
        console.log('Displaying featured properties:', properties);
        console.log('Carousel track element:', carouselTrack);
        
        if (!carouselTrack) {
            console.error('Carousel track element not found! Trying to find it again...');
            const retryCarouselTrack = document.getElementById('carousel-track');
            if (!retryCarouselTrack) {
                console.error('Still cannot find carousel track element!');
                return;
            }
            // Use the retry element
            retryCarouselTrack.innerHTML = '';
            properties.forEach(property => {
                const propertyCard = createFeaturedPropertyCard(property);
                retryCarouselTrack.innerHTML += propertyCard;
            });
            // Add click handlers to property cards
            retryCarouselTrack.addEventListener('click', (e) => {
                const propertyCard = e.target.closest('.featured-property-card');
                if (propertyCard) {
                    const propertyId = propertyCard.dataset.id;
                    window.location.href = `details.html?id=${propertyId}`;
                }
            });
            return;
        }
        
        carouselTrack.innerHTML = '';
        
        properties.forEach(property => {
            const propertyCard = createFeaturedPropertyCard(property);
            carouselTrack.innerHTML += propertyCard;
        });

        // Add click handlers to property cards
        carouselTrack.addEventListener('click', (e) => {
            const propertyCard = e.target.closest('.featured-property-card');
            if (propertyCard) {
                const propertyId = propertyCard.dataset.id;
                window.location.href = `details.html?id=${propertyId}`;
            }
        });
        
        console.log('Featured properties displayed. Number of cards:', carouselTrack.children.length);
    }

    function updateCarousel() {
        if (!carouselTrack) return;
        const maxSlide = Math.max(0, carouselTrack.children.length - visibleCards);
        currentSlide = Math.min(currentSlide, maxSlide);
        currentSlide = Math.max(0, currentSlide);
        
        const translateX = -currentSlide * cardWidth;
        carouselTrack.style.transform = `translateX(${translateX}px)`;
        
        // Update arrow states
        if (carouselPrev) carouselPrev.style.opacity = currentSlide === 0 ? '0.5' : '1';
        if (carouselNext) carouselNext.style.opacity = currentSlide >= maxSlide ? '0.5' : '1';
    }

    // Carousel navigation
    function setupCarouselNavigation() {
        if (carouselPrev) {
            carouselPrev.addEventListener('click', () => {
                if (currentSlide > 0) {
                    currentSlide--;
                    updateCarousel();
                }
            });
        }

        if (carouselNext) {
            carouselNext.addEventListener('click', () => {
                const maxSlide = Math.max(0, carouselTrack.children.length - visibleCards);
                if (currentSlide < maxSlide) {
                    currentSlide++;
                    updateCarousel();
                }
            });
        }
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        updateVisibleCards();
        updateCarousel();
    });

    // Initialize carousel
    console.log('Initializing carousel...');
    console.log('Carousel track element:', carouselTrack);
    console.log('Carousel wrapper element:', carouselWrapper);
    
    // Wait a bit for DOM to be fully ready
    setTimeout(() => {
        console.log('Initializing carousel after timeout...');
        initializeCarouselElements();
        setupCarouselNavigation();
        updateVisibleCards();
        loadFeaturedProperties();
        updateCarousel(); // Initialize carousel position
    }, 100);
    
    // Also try to initialize immediately if elements are already available
    initializeCarouselElements();
    if (carouselTrack && carouselWrapper) {
        console.log('Carousel elements available immediately, initializing...');
        setupCarouselNavigation();
        updateVisibleCards();
        loadFeaturedProperties();
        updateCarousel();
    }

    // Load property listings
    loadPropertyListings();

    // Interactive Map Search
    const interactiveMapElement = document.getElementById('interactive-map');
    const filterChips = document.querySelectorAll('.filter-chip');
    
    if (interactiveMapElement) {
        // Initialize the interactive map
        const interactiveMap = L.map(interactiveMapElement).setView([-40.9006, 174.8860], 6);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(interactiveMap);
        
        // Add custom markers for different regions
        const regionMarkers = {
            'northland': { lat: -35.4, lng: 173.8, count: 45 },
            'coromandel': { lat: -36.8, lng: 175.5, count: 32 },
            'bay-of-plenty': { lat: -37.7, lng: 176.3, count: 38 },
            'waikato': { lat: -37.8, lng: 175.3, count: 52 },
            'otago': { lat: -45.9, lng: 170.5, count: 67 }
        };
        
        // Create custom marker icons
        const createCustomIcon = (color, count) => {
            return L.divIcon({
                className: 'custom-marker',
                html: `
                    <div style="
                        background: ${color};
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        border: 3px solid white;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-weight: bold;
                        font-size: 14px;
                    ">${count}</div>
                `,
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            });
        };
        
        // Add markers for each region
        Object.entries(regionMarkers).forEach(([region, data]) => {
            const marker = L.marker([data.lat, data.lng], {
                icon: createCustomIcon('var(--accent-green)', data.count)
            }).addTo(interactiveMap);
            
            marker.bindPopup(`
                <div style="text-align: center; padding: 10px;">
                    <h3 style="margin: 0 0 8px 0; color: var(--primary-green);">${region.charAt(0).toUpperCase() + region.slice(1).replace('-', ' ')}</h3>
                    <p style="margin: 0; color: var(--text-medium);">${data.count} Eco Properties Available</p>
                    <button onclick="filterByRegion('${region}')" style="
                        background: var(--gold);
                        color: var(--primary-green);
                        border: none;
                        padding: 8px 16px;
                        border-radius: 20px;
                        font-weight: 600;
                        cursor: pointer;
                        margin-top: 8px;
                    ">Explore Properties</button>
                </div>
            `);
        });
        
        // Filter chip functionality
        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                // Remove active class from all chips
                filterChips.forEach(c => c.classList.remove('active'));
                // Add active class to clicked chip
                chip.classList.add('active');
                
                const filter = chip.dataset.filter;
                // Here you would filter the map markers based on the selected region
                console.log(`Filtering by: ${filter}`);
            });
        });
    }

    // Modal elements
    const filterModal = document.getElementById('filter-modal');
    const heroFiltersButton = document.getElementById('hero-filter-button');
    const closeModalButton = document.querySelector('.modal .close-button');
    const modalApplyFiltersButton = document.querySelector('.modal-apply-filters');

    // Open the modal
    if (heroFiltersButton) {
        heroFiltersButton.addEventListener('click', () => {
            filterModal.style.display = 'block';
        });
    }

    // Close the modal
    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            filterModal.style.display = 'none';
        });
    }

    // Close the modal if clicked outside of the modal-content
    window.addEventListener('click', (event) => {
        if (event.target === filterModal) {
            filterModal.style.display = 'none';
        }
    });

    // Handle Clear buttons in the modal
    document.querySelectorAll('.modal .clear-input').forEach(button => {
        button.addEventListener('click', (e) => {
            const targetId = e.target.dataset.target;
            document.getElementById(targetId).value = '';
        });
    });

    document.querySelectorAll('.modal .clear-select').forEach(button => {
        button.addEventListener('click', (e) => {
            const targetId = e.target.dataset.target;
            document.getElementById(targetId).value = '';
        });
    });

    document.querySelectorAll('.modal .clear-range').forEach(button => {
        button.addEventListener('click', (e) => {
            const minTargetId = e.target.dataset.min;
            const maxTargetId = e.target.dataset.max;
            document.getElementById(minTargetId).value = '';
            document.getElementById(maxTargetId).value = '';
        });
    });

    document.querySelectorAll('.modal .clear-checkbox-group').forEach(button => {
        button.addEventListener('click', (e) => {
            const checkboxGroup = e.target.closest('.checkbox-group');
            if (checkboxGroup) {
                checkboxGroup.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                    checkbox.checked = false;
                });
            }
        });
    });

    // Apply filters from the modal
    if (modalApplyFiltersButton) {
        modalApplyFiltersButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submission

            const params = {};

            // Collect values from modal filters
            const modalLocation = document.getElementById('modal-location').value;
            if (modalLocation) params.location = modalLocation;

            const modalPropertyType = document.getElementById('modal-property-type').value;
            if (modalPropertyType) params.propertyType = modalPropertyType;

            const modalMinPrice = document.getElementById('modal-min-price').value;
            if (modalMinPrice) params.minPrice = parseInt(modalMinPrice);
            const modalMaxPrice = document.getElementById('modal-max-price').value;
            if (modalMaxPrice) params.maxPrice = parseInt(modalMaxPrice);

            const modalMinBedrooms = document.getElementById('modal-min-bedrooms').value;
            if (modalMinBedrooms) params.minBedrooms = parseInt(modalMinBedrooms);
            const modalMaxBedrooms = document.getElementById('modal-max-bedrooms').value;
            if (modalMaxBedrooms) params.maxBedrooms = parseInt(modalMaxBedrooms);

            const modalMinBathrooms = document.getElementById('modal-min-bathrooms').value;
            if (modalMinBathrooms) params.minBathrooms = parseInt(modalMinBathrooms);
            const modalMaxBathrooms = document.getElementById('modal-max-bathrooms').value;
            if (modalMaxBathrooms) params.maxBathrooms = parseInt(modalMaxBathrooms);

            const modalMinGarages = document.getElementById('modal-min-garages').value;
            if (modalMinGarages) params.minGarages = parseInt(modalMinGarages);
            const modalMaxGarages = document.getElementById('modal-max-garages').value;
            if (modalMaxGarages) params.maxGarages = parseInt(modalMaxGarages);

            const modalMinLandArea = document.getElementById('modal-min-land-area').value;
            if (modalMinLandArea) params.minLandSize = parseInt(modalMinLandArea);
            const modalMaxLandArea = document.getElementById('modal-max-land-area').value;
            if (modalMaxLandArea) params.maxLandSize = parseInt(modalMaxLandArea);

            const modalMinFloorArea = document.getElementById('modal-min-floor-area').value;
            if (modalMinFloorArea) params.minFloorArea = parseInt(modalMinFloorArea);
            const modalMaxFloorArea = document.getElementById('modal-max-floor-area').value;
            if (modalMaxFloorArea) params.maxFloorArea = parseInt(modalMaxFloorArea);

            const modalWaterSource = document.getElementById('modal-water-source').value;
            if (modalWaterSource) params.waterSource = modalWaterSource;

            const modalPowerSource = document.getElementById('modal-power-source').value;
            if (modalPowerSource) params.powerSource = modalPowerSource;

            const modalWasteManagement = document.getElementById('modal-waste-management').value;
            if (modalWasteManagement) params.wasteManagement = modalWasteManagement;

            const modalSustainableMaterials = document.getElementById('modal-sustainable-materials').value;
            if (modalSustainableMaterials) params.sustainableMaterials = modalSustainableMaterials;

            const modalCertification = document.getElementById('modal-certification').value;
            if (modalCertification) params.certification = modalCertification;

            // Collect checkbox features
            const selectedFeatures = [];
            document.querySelectorAll('.modal .checkbox-group input[type="checkbox"]:checked').forEach(checkbox => {
                selectedFeatures.push(checkbox.id.replace('feature-', ''));
            });
            if (selectedFeatures.length > 0) params.features = selectedFeatures.join(',');

            const modalKeywordSearch = document.getElementById('modal-keyword-search').value;
            if (modalKeywordSearch) params.searchTerm = modalKeywordSearch;

            const modalListingStatus = document.getElementById('modal-listing-status').value;
            if (modalListingStatus) params.listingStatus = modalListingStatus;

            fetchProperties(params);
            filterModal.style.display = 'none'; // Close modal after applying filters
        });
    }

    // Handle hero search bar
    const heroSearchButton = document.getElementById('hero-search-button');
    const heroSearchInput = document.getElementById('hero-search-input');

    if (heroSearchButton && heroSearchInput) {
        heroSearchButton.addEventListener('click', () => {
            const searchTerm = heroSearchInput.value;
            fetchProperties({ searchTerm });
        });
    }

    // The secondary search bar is now integrated into the hero section or removed.
    // No longer need to handle a separate secondary search bar within .listings.

    // Remove old apply filters button listener as it's now in the modal
    // const applyFiltersButton = document.querySelector('aside.filters button');
    // if (applyFiltersButton) {
    //     applyFiltersButton.addEventListener('click', (e) => {
    //         e.preventDefault(); // Prevent form submission for now

    //         const location = document.getElementById('location').value;
    //         const priceRange = document.getElementById('price-range').value;
    //         const landSizeRange = document.getElementById('land-size').value;
    //         const offGridFeature = document.getElementById('off-grid-features').value;
    //         const propertyType = document.getElementById('property-type').value;

    //         const params = {};
    //         if (location) params.location = location;

    //         if (priceRange) {
    //             const [minPrice, maxPrice] = priceRange.split('-').map(s => parseInt(s.trim()));
    //             if (!isNaN(minPrice)) params.minPrice = minPrice;
    //             if (!isNaN(maxPrice)) params.maxPrice = maxPrice;
    //         }

    //         if (landSizeRange) {
    //             const [minLandSize, maxLandSize] = landSizeRange.split('-').map(s => parseInt(s.trim()));
    //             if (!isNaN(minLandSize)) params.minLandSize = minLandSize;
    //             if (!isNaN(maxLandSize)) params.maxLandSize = maxLandSize;
    //         }

    //         if (offGridFeature) params.offGridFeature = offGridFeature;
    //         if (propertyType) params.propertyType = propertyType;

    //         fetchProperties(params);
    //     });
    // }
});

// Property Listings functionality
async function loadPropertyListings() {
    const propertyGrid = document.getElementById('property-grid');
    if (!propertyGrid) return;

    try {
        // Try to fetch from server first, fallback to local data
        let properties;
        try {
            const response = await fetch('/api/properties');
            properties = await response.json();
        } catch (serverError) {
            console.log('Server not available, using local data for listings');
            // Fallback to local mock data
            properties = [
                {
                    id: "001",
                    title: "Scenic Off-Grid Retreat",
                    location: "Northland",
                    price: 450000,
                    landSize: 10,
                    features: ["solar power", "rainwater harvesting", "established orchard"],
                    bedrooms: 3,
                    bathrooms: 2,
                    images: ["https://via.placeholder.com/400x240/2d5016/ffffff?text=Luxury+Eco+Property+1"]
                },
                {
                    id: "002",
                    title: "Sustainable Farmlet Opportunity",
                    location: "Waikato",
                    price: 620000,
                    landSize: 25,
                    features: ["permaculture gardens", "composting systems", "natural spring water"],
                    bedrooms: 4,
                    bathrooms: 3,
                    images: ["https://via.placeholder.com/400x240/4a7c59/ffffff?text=Luxury+Eco+Property+2"]
                },
                {
                    id: "003",
                    title: "Coastal Eco-Section",
                    location: "Coromandel",
                    price: 300000,
                    landSize: 5,
                    features: ["ocean views", "native bush", "potential for tiny home"],
                    bedrooms: 2,
                    bathrooms: 1,
                    images: ["https://via.placeholder.com/400x240/6b8e23/ffffff?text=Luxury+Eco+Property+3"]
                },
                {
                    id: "004",
                    title: "Mountain View Homestead",
                    location: "Otago",
                    price: 800000,
                    landSize: 50,
                    features: ["hydro power", "large gardens", "barn"],
                    bedrooms: 5,
                    bathrooms: 4,
                    images: ["https://via.placeholder.com/400x240/8b4513/ffffff?text=Luxury+Eco+Property+4"]
                },
                {
                    id: "005",
                    title: "Forest Sanctuary",
                    location: "Bay of Plenty",
                    price: 550000,
                    landSize: 15,
                    features: ["solar panels", "rainwater collection", "organic gardens"],
                    bedrooms: 3,
                    bathrooms: 2,
                    images: ["https://via.placeholder.com/400x240/a8c09a/ffffff?text=Luxury+Eco+Property+5"]
                },
                {
                    id: "006",
                    title: "Riverside Eco-Lodge",
                    location: "Auckland",
                    price: 750000,
                    landSize: 20,
                    features: ["river access", "sustainable materials", "energy efficient"],
                    bedrooms: 4,
                    bathrooms: 3,
                    images: ["https://via.placeholder.com/400x240/d4af37/ffffff?text=Luxury+Eco+Property+6"]
                }
            ];
        }
        
        if (properties && properties.length > 0) {
            displayPropertyListings(properties);
        } else {
            propertyGrid.innerHTML = '<p class="no-properties">No properties found. Please try again later.</p>';
        }
    } catch (error) {
        console.error('Error loading properties:', error);
        propertyGrid.innerHTML = '<p class="no-properties">Error loading properties. Please try again later.</p>';
    }
}

function displayPropertyListings(properties) {
    const propertyGrid = document.getElementById('property-grid');
    if (!propertyGrid) return;
    
    propertyGrid.innerHTML = '';
    
    properties.forEach(property => {
        const propertyCard = createPropertyCard(property);
        propertyGrid.appendChild(propertyCard);
    });
}

function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'property-card';
    card.setAttribute('data-id', property.id);
    
    // Generate off-grid rating (3-5 stars)
    const offGridRating = Math.floor(Math.random() * 3) + 3;
    const stars = '★'.repeat(offGridRating) + '☆'.repeat(5 - offGridRating);
    
    // Create feature tags from property features
    const featureTags = property.features ? property.features.slice(0, 3).map(feature => 
        `<span class="property-card-feature">${feature}</span>`
    ).join('') : '';
    
    card.innerHTML = `
        <img src="${property.images?.[0] || 'https://via.placeholder.com/400x240/2d5016/ffffff?text=Luxury+Eco+Property'}" 
             alt="${property.title}" 
             class="property-card-image">
        <div class="property-card-content">
            <h3 class="property-card-title">${property.title}</h3>
            <div class="property-card-location">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                ${property.location}
            </div>
            <div class="property-card-price">$${property.price.toLocaleString()}</div>
            <div class="property-card-details">
                <div class="property-card-detail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    </svg>
                    ${property.bedrooms || 0} Bed
                </div>
                <div class="property-card-detail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2-2z"></path>
                        <path d="M8 21v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4"></path>
                    </svg>
                    ${property.bathrooms || 0} Bath
                </div>
                <div class="property-card-detail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21,15 16,10 5,21"></polyline>
                    </svg>
                    ${property.landSize || 0} Acres
                </div>
                <div class="property-card-detail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    Off-Grid ${offGridRating}/5
                </div>
            </div>
            <div class="property-card-features">
                ${featureTags}
            </div>
            <div class="property-card-actions">
                <button class="view-details-btn" onclick="viewPropertyDetails('${property.id}')">
                    View Details
                </button>
                <button class="save-btn" onclick="saveProperty('${property.id}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    // Add click handler for the entire card
    card.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
            viewPropertyDetails(property.id);
        }
    });
    
    return card;
}

function viewPropertyDetails(propertyId) {
    window.location.href = `details.html?id=${propertyId}`;
}

function saveProperty(propertyId) {
    // Add to saved properties (localStorage for demo)
    const savedProperties = JSON.parse(localStorage.getItem('savedProperties') || '[]');
    if (!savedProperties.includes(propertyId)) {
        savedProperties.push(propertyId);
        localStorage.setItem('savedProperties', JSON.stringify(savedProperties));
        
        // Show feedback
        const button = event.target.closest('.save-btn');
        const originalContent = button.innerHTML;
        button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z"></path></svg>';
        button.style.background = 'var(--accent-green)';
        button.style.color = 'var(--cream)';
        
        setTimeout(() => {
            button.innerHTML = originalContent;
            button.style.background = '';
            button.style.color = '';
        }, 2000);
    }
}
