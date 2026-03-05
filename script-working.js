// Working search script for Off-Grid Estate NZ
console.log('Working search script loaded!');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing working search...');
    
    // Core mock listings for the demo experience
    const testProperties = [
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
    
    let allProperties = [...testProperties];
    let filteredProperties = [...testProperties];
    let visibleCount = 3;
    
    // Search function
    function searchProperties(searchTerm) {
        console.log('🔍 Searching for:', searchTerm);
        
        if (!searchTerm || searchTerm.trim() === '') {
            filteredProperties = [...allProperties];
            console.log('📋 Empty search, showing all properties');
        } else {
            const term = searchTerm.toLowerCase();
            filteredProperties = allProperties.filter(property => 
                property.title.toLowerCase().includes(term) ||
                property.location.toLowerCase().includes(term) ||
                property.features.some(feature => feature.toLowerCase().includes(term)) ||
                property.id.includes(term)
            );
            console.log('🎯 Filtered properties:', filteredProperties.length);
        }
        
        visibleCount = 3;
        displayPropertyListings(filteredProperties);
    }
    
    // Display property listings
    function displayPropertyListings(properties) {
        const propertyGrid = document.getElementById('property-grid');
        if (!propertyGrid) {
            console.error('❌ Property grid not found!');
            return;
        }
        
        console.log('📝 Displaying', properties.length, 'properties');
        propertyGrid.innerHTML = '';
        
        if (properties.length === 0) {
            propertyGrid.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;">No properties found matching your search criteria.</p>';
            return;
        }
        
        const toShow = properties.slice(0, visibleCount);
        toShow.forEach(property => {
            const propertyCard = createPropertyCard(property);
            propertyGrid.appendChild(propertyCard);
        });
    }
    
    // Create property card
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
    
    // Global functions for property actions
    window.viewPropertyDetails = function(propertyId) {
        console.log('🔗 Viewing property details for:', propertyId);
        window.location.href = `details.html?id=${propertyId}`;
    };
    
    window.saveProperty = function(propertyId) {
        console.log('💾 Saving property:', propertyId);
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
    };
    
    // Set up search functionality
    function setupSearch() {
        console.log('🔧 Setting up search functionality...');
        
        const heroSearchInput = document.getElementById('hero-search-input');
        const heroSearchButton = document.getElementById('hero-search-button');
        
        console.log('🔍 Search elements found:');
        console.log('  - Input:', !!heroSearchInput);
        console.log('  - Button:', !!heroSearchButton);
        
        if (heroSearchButton && heroSearchInput) {
            console.log('✅ Adding event listeners...');
            
            heroSearchButton.addEventListener('click', () => {
                const searchTerm = heroSearchInput.value;
                console.log('🔍 Search button clicked! Term:', searchTerm);
                searchProperties(searchTerm);
                const listingsSection = document.getElementById('property-listings-section');
                if (listingsSection) {
                    listingsSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
            
            heroSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const searchTerm = heroSearchInput.value;
                    console.log('⌨️ Enter pressed! Term:', searchTerm);
                    searchProperties(searchTerm);
                    const listingsSection = document.getElementById('property-listings-section');
                    if (listingsSection) {
                        listingsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
            
            console.log('✅ Search event listeners added successfully!');
        } else {
            console.error('❌ Search elements not found!');
        }

        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const listingsSection = document.getElementById('property-listings-section');
                if (listingsSection) {
                    listingsSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        const locationLinks = document.querySelectorAll('.location-link');
        locationLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const region = link.dataset.region || '';
                if (region) {
                    console.log('📍 Filtering by region from location-link:', region);
                    searchProperties(region.replace(/-/g, ' '));
                    const listingsSection = document.getElementById('property-listings-section');
                    if (listingsSection) {
                        listingsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });

        const urlParams = new URLSearchParams(window.location.search);
        const urlRegion = urlParams.get('region');
        const urlQuery = urlParams.get('q');
        if (urlRegion || urlQuery) {
            const combinedTerm = [urlRegion, urlQuery].filter(Boolean).join(' ');
            searchProperties(combinedTerm);
        }

        const loadMoreBtn = document.querySelector('.load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                if (visibleCount < filteredProperties.length) {
                    visibleCount += 3;
                    displayPropertyListings(filteredProperties);
                    if (visibleCount >= filteredProperties.length) {
                        loadMoreBtn.innerHTML = '<span>End of mock listings</span>';
                    }
                } else {
                    loadMoreBtn.innerHTML = '<span>End of mock listings</span>';
                }
            });
        }
    }
    
    // Initialize everything
    console.log('🚀 Initializing everything...');
    
    // Load initial properties
    displayPropertyListings(filteredProperties);
    
    // Set up search
    setupSearch();
    
    console.log('✅ Initialization complete!');
});





