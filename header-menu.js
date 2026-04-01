document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const headerLeft = document.querySelector('.header-left');
    const mainNav = document.querySelector('.main-nav');
    const secondaryNav = document.querySelector('.secondary-nav');

    if (!header || !headerLeft || !mainNav || !secondaryNav) {
        return;
    }

    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'mobile-menu-toggle';
    toggleBtn.setAttribute('aria-label', 'Toggle menu');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.innerHTML = '<span></span><span></span><span></span>';

    headerLeft.appendChild(toggleBtn);

    const closeMenu = () => {
        document.body.classList.remove('menu-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
    };

    toggleBtn.addEventListener('click', () => {
        const isOpen = document.body.classList.toggle('menu-open');
        toggleBtn.setAttribute('aria-expanded', String(isOpen));
    });

    [...mainNav.querySelectorAll('a'), ...secondaryNav.querySelectorAll('a')].forEach((link) => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
            closeMenu();
        }
    });
});

